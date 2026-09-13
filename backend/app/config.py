from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "moksha_db"
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    admin_email: str = ""
    google_client_id: str = ""
    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""
    openai_api_key: str = ""
    openai_base_url: Optional[str] = None
    openai_model: str = "gpt-4o-mini"
    frontend_url: str = "http://localhost:5173"


settings = Settings()
