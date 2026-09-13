from app.config import settings
from app.models import Product, User


async def seed_database():
    if await Product.find_one({}) is None:
        products = [
            Product(
                name="Product A",
                description="A great product",
                price=19.99,
                stock=100,
                image_url="https://placehold.co/600x400?text=Product%20A",
            ),
            Product(
                name="Product B",
                description="Another great product",
                price=29.99,
                stock=50,
                image_url="https://placehold.co/600x400?text=Product%20B",
            ),
            Product(
                name="Product C",
                description="Premium product",
                price=49.99,
                stock=20,
                image_url="https://placehold.co/600x400?text=Product%20C",
            ),
        ]
        await Product.insert_many(products)

    if settings.admin_email and await User.find_one({"email": settings.admin_email}) is None:
        await User(
            email=settings.admin_email,
            name="Admin",
            google_id="seed",
            role="admin",
        ).insert()
