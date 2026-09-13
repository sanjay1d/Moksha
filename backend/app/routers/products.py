from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import require_role
from app.models import Product, User
from app.schemas import ProductCreate, ProductOut, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductOut])
async def list_products():
    return await Product.find({}).to_list()


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(data: ProductCreate, user: User = Depends(require_role("admin"))):
    product = Product(**data.model_dump())
    await product.insert()
    return product


@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    user: User = Depends(require_role("admin")),
):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    await product.save()
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: str, user: User = Depends(require_role("admin"))):
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    await product.delete()
    return None
