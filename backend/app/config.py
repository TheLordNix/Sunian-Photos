import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Sunian Photos API"
    DEBUG: bool = True

    # Firebase: path to service account JSON
    FIREBASE_CREDENTIALS: str = os.getenv("FIREBASE_CREDENTIALS", "C:\Users\Anush\OneDrive\Documents\CloneFest PHP\Sunian-Photos\sunianphotos-firebase-adminsdk-fbsvc-7478118d4a.json")

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="dqlogchst"
    CLOUDINARY_API_KEY="325183714764981"
    CLOUDINARY_API_SECRET="arOep1WhjTDAxkzJmbaJVpJYLZE"

    # CORS - comma separated origins
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://your-app.vercel.app")

settings = Settings()
