import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Media Platform API"
    DEBUG: bool = True

    # Use SQLite by default for no-db local dev -> easy to deploy
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./media.db")

    # Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-me")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # Storage
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")  # local or s3 (if you add later)
    STORAGE_LOCAL_PATH: str = os.getenv("STORAGE_LOCAL_PATH", "./media")
    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")  # comma-separated


settings = Settings()
