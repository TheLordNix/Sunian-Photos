from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import images, albums, users, comments, search

app = FastAPI(title=settings.APP_NAME)

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(users.router, prefix="/api/users")
app.include_router(images.router, prefix="/api/images")
app.include_router(albums.router, prefix="/api/albums")
app.include_router(comments.router, prefix="/api/comments")
app.include_router(search.router, prefix="/api/search")

@app.get("/health")
def health():
    return {"status": "ok"}
