from datetime import datetime, timezone
from typing import List, Optional

from beanie import Document
from pydantic import BaseModel, Field


class User(Document):
    email: str
    name: str
    google_id: Optional[str] = None
    password_hash: Optional[str] = None
    picture: Optional[str] = None
    role: str = "customer"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"


class Product(Document):
    name: str
    description: str
    price: float
    stock: int
    image_url: Optional[str] = None

    class Settings:
        name = "products"


class CartItem(BaseModel):
    product_id: str
    quantity: int


class Cart(Document):
    user_id: str
    items: List[CartItem] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "carts"


class OrderItem(BaseModel):
    product_id: str
    name: str
    quantity: int
    price_at_purchase: float


class Order(Document):
    user_id: str
    items: List[OrderItem]
    total: float
    status: str = "pending"
    stripe_session_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "orders"
