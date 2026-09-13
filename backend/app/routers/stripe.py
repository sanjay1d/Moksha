import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.config import settings
from app.dependencies import get_current_user
from app.models import Order, User
from app.schemas import CheckoutCreate, CheckoutResponse

router = APIRouter(prefix="/payments", tags=["payments"])

stripe.api_key = settings.stripe_secret_key


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(data: CheckoutCreate, user: User = Depends(get_current_user)):
    order = await Order.get(data.order_id)
    if not order or order.user_id != str(user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order not payable")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": item.name},
                        "unit_amount": int(item.price_at_purchase * 100),
                    },
                    "quantity": item.quantity,
                }
                for item in order.items
            ],
            mode="payment",
            success_url=f"{settings.frontend_url}/orders?success=1&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.frontend_url}/cart?canceled=1",
            metadata={"order_id": str(order.id)},
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Stripe error")

    order.stripe_session_id = session.id
    await order.save()

    return CheckoutResponse(url=session.url, session_id=session.id)


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.to_dict().get("metadata", {}).get("order_id")
        order = await Order.get(order_id)
        if order:
            order.status = "paid"
            order.stripe_session_id = session["id"]
            await order.save()

    return {"status": "ok"}


@router.get("/verify")
async def verify_payment(session_id: str, user: User = Depends(get_current_user)):
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid session")

    metadata = session.to_dict().get("metadata", {})
    order_id = metadata.get("order_id")
    if not order_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order = await Order.get(order_id)
    if not order or order.user_id != str(user.id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if session.payment_status == "paid":
        order.status = "paid"
        order.stripe_session_id = session_id
        await order.save()

    return {"status": order.status}
