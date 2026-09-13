from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config import settings
from app.models import Order, Product, User


async def ask_agent(message: str, user: User) -> str:
    if not settings.openai_api_key:
        return "OpenAI API key is not configured."

    products = await Product.find({}).to_list()
    product_lines = [
        f"- {p.name}: ${p.price} (stock: {p.stock})"
        for p in products
    ] or ["No products are currently available."]

    orders = await Order.find({"user_id": str(user.id)}).to_list()
    order_lines = [
        f"Order {o.id} - status: {o.status}, total: ${o.total}"
        for o in orders
    ] or ["The user has no orders on record."]

    params = {
        "model": settings.openai_model,
        "api_key": settings.openai_api_key,
        "temperature": 0,
    }
    if settings.openai_base_url:
        params["base_url"] = settings.openai_base_url

    model = ChatOpenAI(**params)

    system_content = (
        "You are a helpful support agent for Moksha e-commerce. "
        "Use the live data below to answer product and order questions. "
        "Do not make up information. Keep answers concise.\n\n"
        "Products:\n" + "\n".join(product_lines) + "\n\n"
        "User's orders:\n" + "\n".join(order_lines)
    )

    messages = [
        SystemMessage(content=system_content),
        HumanMessage(content=message),
    ]

    try:
        response = await model.ainvoke(messages)
        return str(response.content)
    except Exception as e:
        return f"Sorry, I could not answer that right now. Error: {e}"
