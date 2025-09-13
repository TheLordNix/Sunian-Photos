# optional router file kept for compatibility if you mount it in main
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.config import settings
import firebase_admin
from firebase_admin import credentials, firestore, auth
import cloudinary
import cloudinary.uploader
from datetime import datetime
from io import BytesIO
from PIL import Image, ExifTags

router = APIRouter(prefix="/images")

# init firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
db = firestore.client()

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def extract_exif_bytes(b: bytes):
    try:
        img = Image.open(BytesIO(b))
        raw = getattr(img, "_getexif", lambda: {})() or {}
        exif = {}
        for k, v in raw.items():
            name = ExifTags.TAGS.get(k, k)
            exif[name] = v
        return exif
    except Exception:
        return {}

@router.post("/photos")
async def upload(file: UploadFile = File(...)):
    # lightweight compatibility route for direct uploads (not used by frontend)
    contents = await file.read()
    exif = extract_exif_bytes(contents)
    result = cloudinary.uploader.upload(BytesIO(contents), resource_type="image", use_filename=True, unique_filename=True)
    public_id = result.get("public_id")
    url = result.get("secure_url")
    data = {
        "public_id": public_id,
        "url": url,
        "filename": file.filename,
        "mime_type": file.content_type,
        "uploaded_at": datetime.utcnow(),
        "exif": exif
    }
    db.collection("images").document(public_id).set(data)
    return {"public_id": public_id, "url": url}
