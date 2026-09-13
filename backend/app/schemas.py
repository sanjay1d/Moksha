from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, model_validator

from app.models import CartItem, OrderItem


class HealthResponse(BaseModel):
    status: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class GoogleLogin(BaseModel):
    credential: str


class EmailLogin(BaseModel):
    email: str
    password: str


class EmailRegister(BaseModel):
    email: str
    name: str
    password: str


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None


class ProductOut(ProductCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str

    @model_validator(mode="before")
    @classmethod
    def _convert_id(cls, data):
        if hasattr(data, "id"):
            data.id = str(data.id)
        return data


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int


class CartOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    items: List[CartItem]
    total: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    items: List[OrderItem]
    total: float
    status: str
    created_at: datetime

    @model_validator(mode="before")
    @classmethod
    def _convert_id(cls, data):
        if hasattr(data, "id"):
            data.id = str(data.id)
        return data


class OrderStatusUpdate(BaseModel):
    status: str


class CheckoutCreate(BaseModel):
    order_id: str


class CheckoutResponse(BaseModel):
    url: str
    session_id: str


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
