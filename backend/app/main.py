from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routes import images as images_router
import os

app = FastAPI(title=settings.APP_NAME)

# Create DB tables on startup (dev convenience). For production consider Alembic migrations.
Base.metadata.create_all(bind=engine)

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media static path
media_path = os.path.abspath(settings.STORAGE_LOCAL_PATH)
os.makedirs(media_path, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_path), name="media")

# Register routers
app.include_router(images_router.router)

# Simple health endpoint
@app.get("/health")
def health():
    return {"status": "ok"}
