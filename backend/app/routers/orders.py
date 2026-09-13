from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user, require_role
from app.models import Cart, Order, OrderItem, Product, User
from app.schemas import OrderOut, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(user: User = Depends(get_current_user)):
    cart = await Cart.find_one({"user_id": str(user.id)})
    if not cart or not cart.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")

    order_items: List[OrderItem] = []
    total = 0.0
    for cart_item in cart.items:
        product = await Product.get(cart_item.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {cart_item.product_id} not found")
        if cart_item.quantity > product.stock:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Not enough stock for {product.name}")

        product.stock -= cart_item.quantity
        await product.save()
        order_items.append(
            OrderItem(
                product_id=str(product.id),
                name=product.name,
                quantity=cart_item.quantity,
                price_at_purchase=product.price,
            )
        )
        total += product.price * cart_item.quantity

    order = Order(
        user_id=str(user.id),
        items=order_items,
        total=total,
        status="pending",
    )
    await order.insert()

    cart.items = []
    cart.updated_at = datetime.now(timezone.utc)
    await cart.save()

    return order


@router.get("", response_model=List[OrderOut])
async def list_orders(user: User = Depends(get_current_user)):
    if user.role == "admin":
        return await Order.find({}).to_list()
    return await Order.find({"user_id": str(user.id)}).to_list()


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: str, user: User = Depends(get_current_user)):
    order = await Order.get(order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if user.role != "admin" and order.user_id != str(user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return order


@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    user: User = Depends(require_role("admin")),
):
    order = await Order.get(order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = data.status
    await order.save()
    return order
