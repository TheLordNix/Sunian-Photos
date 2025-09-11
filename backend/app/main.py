from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.db.base import Base
from app.db.session import engine
from app.routes import images as images_router
import os
from firebase_admin import credentials, firestore, initialize_app, auth
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
from .config import settings
from cloudinary.uploader import upload
import json
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db, create_db_and_tables # Assuming you have these
from app.models import UserLogin, User # Pydantic and SQLAlchemy models
from app.auth import verify_password, create_access_token
from typing import Optional # Import Optional

load_dotenv()

# Initialize Firebase
cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
if not cred_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")

cred_path = Path(cred_path).expanduser().resolve()
if not cred_path.is_file():
    raise FileNotFoundError(f"Firebase credential file not found: {cred_path}")

cred = credentials.Certificate(str(cred_path))
initialize_app(cred)
db = firestore.client()

app = FastAPI(title=settings.APP_NAME)

# Create DB tables on startup (dev convenience). For production consider Alembic migrations.
Base.metadata.create_all(bind=engine)

# CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Your frontend's address
    "http://localhost:5173",  # Common Vite development port
]

# Add the middleware to your app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

# Mount media static path
media_path = os.path.abspath(settings.STORAGE_LOCAL_PATH)
os.makedirs(media_path, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_path), name="media")

# Register routers
app.include_router(images_router.router)

bearer_scheme = HTTPBearer()

async def verify_token(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {e}"
        )

# Simple health endpoint
@app.get("/health")
def health():
    return {"status": "ok"}
# main.py (continued)

def check_role(required_role: str):
    def check_user_role(token: dict = Depends(verify_token)):
        user_id = token['uid']
        user_doc_ref = db.collection('users').document(user_id)
        user_doc = user_doc_ref.get()

        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User not found in Firestore or has no role."
            )

        user_role = user_doc.to_dict().get('role')

        if user_role != required_role and user_role != 'admin':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User does not have the required role ({required_role})."
            )

        return user_doc.to_dict() # Return user data for use in endpoint

    return check_user_role

# New dependency to check if a user is an Editor or Admin
def is_editor_or_admin(token: dict = Depends(verify_token)):
    user_id = token['uid']
    user_doc_ref = db.collection('users').document(user_id)
    user_doc = user_doc_ref.get()
    
    if not user_doc.exists:
        raise HTTPException(status_code=403, detail="User not found")
        
    user_role = user_doc.to_dict().get('role')
    
    if user_role not in ['editor', 'admin']:
        raise HTTPException(status_code=403, detail="Forbidden")
        
    return user_doc.to_dict()
# main.py (continued)
from pydantic import BaseModel
from typing import Optional

# Pydantic model for a photo
class Photo(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    
# Create a photo (Admin/Editor only)
@app.post("/photos", status_code=status.HTTP_201_CREATED)
async def upload_photo(
    photo: Photo,
    user_data: dict = Depends(is_editor_or_admin)
):
    try:
        # Store the photo data in Firestore
        photo_ref = db.collection("photos").document()
        await photo_ref.set(photo.dict())
        return {"message": "Photo uploaded successfully", "id": photo_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update a photo (Admin only)
@app.put("/photos/{photo_id}")
async def edit_photo(
    photo_id: str,
    photo: Photo,
    user_data: dict = Depends(check_role("admin"))
):
    try:
        photo_ref = db.collection("photos").document(photo_id)
        if not await photo_ref.get():
            raise HTTPException(status_code=404, detail="Photo not found")
        await photo_ref.set(photo.dict())
        return {"message": "Photo updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete a photo (Admin only)
@app.delete("/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(
    photo_id: str,
    user_data: dict = Depends(check_role("admin"))
):
    try:
        photo_ref = db.collection("photos").document(photo_id)
        await photo_ref.delete()
        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all photos (All users)
@app.get("/photos")
async def get_all_photos():
    photos_ref = db.collection("photos")
    photos = []
    for doc in photos_ref.stream():
        photo_data = doc.to_dict()
        photo_data["id"] = doc.id
        photos.append(photo_data)
    return photos

class UserLogin(BaseModel):
    username: str
    password: str
# Example endpoint for a visitor (no authentication required)
@app.get("/public")
async def public_route():
    return {"message": "This is a public route accessible to anyone."}
@app.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # 1. Look up the user by username in the database
    user = db.query(User).filter(User.username == credentials.username).first()

    # 2. If the user doesn't exist or the password is incorrect, raise an error
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Create a JWT access token for the authenticated user
    access_token = create_access_token(
        data={"sub": user.username}
    )

    # 4. Return the token to the client
    return {"access_token": access_token, "token_type": "bearer"}