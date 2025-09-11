import os
from pydantic_settings import BaseSettings

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
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")  # local or s3
    STORAGE_LOCAL_PATH: str = os.getenv("STORAGE_LOCAL_PATH", "./media")
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET")

    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")  # comma-separated
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
settings = Settings()