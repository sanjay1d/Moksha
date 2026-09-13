from contextlib import asynccontextmanager

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import close_db, init_db
from app.routers import ai, auth, cart, orders, products, stripe, uploads
from app.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_database()
    yield
    await close_db()


app = FastAPI(title="Moksha E-Commerce API", lifespan=lifespan)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(stripe.router)
app.include_router(ai.router)
app.include_router(uploads.router)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}
