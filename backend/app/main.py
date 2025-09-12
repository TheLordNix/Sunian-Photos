import os
import uuid
import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
from cloudinary.uploader import upload as cloudinary_upload
from app.config import settings
from app.schemas import ImageCreateResp
import firebase_admin
from firebase_admin import credentials, firestore

# -------------------------
# Configure Cloudinary
# -------------------------
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

# -------------------------
# Firebase setup
# -------------------------
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
db = firestore.client()

# -------------------------
# Initialize FastAPI
# -------------------------
app = FastAPI(title=settings.APP_NAME)

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Health Check
# -------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# -------------------------
# Upload Image
# -------------------------
@app.post("/api/upload", response_model=ImageCreateResp)
async def upload_image(
    file: UploadFile = File(...),
    album: str = Form(None)
):
    try:
        # Upload to Cloudinary
        result = cloudinary_upload(
            file.file,
            folder=album or "default",
            resource_type="image",
            overwrite=True,
        )

        if not result:
            raise HTTPException(status_code=500, detail="Upload failed")

        # Prepare image data
        image_data = {
            "id": str(uuid.uuid4()),
            "filename": file.filename,
            "url": result.get("secure_url"),
            "mime_type": result.get("resource_type"),
            "width": result.get("width"),
            "height": result.get("height"),
            "size_bytes": result.get("bytes"),
            "title": None,
            "caption": None,
            "alt_text": None,
            "uploaded_at": datetime.datetime.utcnow().isoformat(),
        }

        # Save to Firestore
        db.collection("images").document(image_data["id"]).set(image_data)

        return ImageCreateResp(
            id=image_data["id"],
            filename=image_data["filename"],
            storage_path=image_data["url"],
            mime_type=image_data["mime_type"],
            width=image_data["width"],
            height=image_data["height"],
            size_bytes=image_data["size_bytes"],
            title=image_data["title"],
            caption=image_data["caption"],
            alt_text=image_data["alt_text"],
            uploaded_at=datetime.datetime.fromisoformat(image_data["uploaded_at"]),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# -------------------------
# Get All Images
# -------------------------
@app.get("/api/images")
def list_images():
    try:
        docs = db.collection("images").stream()
        images = [doc.to_dict() for doc in docs]
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {str(e)}")


# -------------------------
# Legacy Compatibility Route
# -------------------------
@app.post("/api/images/photos", response_model=ImageCreateResp)
async def upload_image_compat(
    file: UploadFile = File(...),
    album: str = Form(None)
):
    return await upload_image(file=file, album=album)
