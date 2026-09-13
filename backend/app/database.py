from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from beanie import init_beanie

from app.config import settings
from app.models import Cart, Order, Product, User

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def init_db():
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db]
    await init_beanie(database=db, document_models=[User, Product, Cart, Order])


async def close_db():
    if client:
        client.close()
