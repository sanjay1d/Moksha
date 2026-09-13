from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_current_user
from app.models import Cart, CartItem, Product, User
from app.schemas import CartItemCreate, CartOut

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartOut)
async def get_cart(user: User = Depends(get_current_user)):
    cart = await _get_or_create_cart(str(user.id))
    return await _cart_out(cart)


@router.post("", response_model=CartOut)
async def add_to_cart(data: CartItemCreate, user: User = Depends(get_current_user)):
    product = await Product.get(data.product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if data.quantity <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Quantity must be positive")
    if data.quantity > product.stock:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock")

    user_id = str(user.id)
    cart = await _get_or_create_cart(user_id)

    found = False
    for item in cart.items:
        if item.product_id == data.product_id:
            if item.quantity + data.quantity > product.stock:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock")
            item.quantity += data.quantity
            found = True
            break

    if not found:
        cart.items.append(CartItem(product_id=data.product_id, quantity=data.quantity))

    cart.updated_at = datetime.now(timezone.utc)
    await cart.save()
    return await _cart_out(cart)


@router.delete("/{product_id}", response_model=CartOut)
async def remove_from_cart(product_id: str, user: User = Depends(get_current_user)):
    cart = await Cart.find_one({"user_id": str(user.id)})
    if not cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
    cart.items = [item for item in cart.items if item.product_id != product_id]
    cart.updated_at = datetime.now(timezone.utc)
    await cart.save()
    return await _cart_out(cart)


async def _get_or_create_cart(user_id: str) -> Cart:
    cart = await Cart.find_one({"user_id": user_id})
    if not cart:
        cart = Cart(user_id=user_id, items=[])
        await cart.insert()
    return cart


async def _cart_out(cart: Cart) -> CartOut:
    total = 0.0
    for item in cart.items:
        product = await Product.get(item.product_id)
        if product:
            total += product.price * item.quantity
    return CartOut(user_id=cart.user_id, items=cart.items, total=total)
