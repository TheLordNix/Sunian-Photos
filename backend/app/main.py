import os
import uuid
import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Path, Body, Depends, status
from fastapi.middleware.cors import CORSMiddleware
import cloudinary
from cloudinary.uploader import upload as cloudinary_upload
from app.config import settings
from app.schemas import ImageCreateResp, ImageEdit, SearchQuery
import firebase_admin
from firebase_admin import credentials, firestore, auth
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Response
from fastapi import APIRouter
from pydantic import BaseModel

# initialize Cloudinary from env
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

# Firebase init (shared)
if not firebase_admin._apps:
    if not settings.FIREBASE_CREDENTIALS:
        raise RuntimeError("FIREBASE_CREDENTIALS not set in env")
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
db = firestore.client()

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

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_user_role(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    # If no token provided, treat as visitor
    if not token:
        return "visitor"
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token.get('uid')
        if not uid:
            return "visitor"
        user_doc_ref = db.collection('users').document(uid)
        user_doc = user_doc_ref.get()
        if not user_doc.exists:
            return "visitor"
        user_role = user_doc.to_dict().get('role', 'visitor')
        return user_role
    except Exception:
        return "visitor"

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    # return basic info or None
    if not token:
        return None
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        role = db.collection('users').document(uid).get().to_dict().get('role', 'visitor') if uid else 'visitor'
        return {"uid": uid, "email": email, "role": role}
    except Exception:
        return None

@app.get("/health")
def health():
    return {"status": "ok"}

# Helper to build responsive Cloudinary URLs (several widths)
def make_responsive_urls(public_id: str, format_: str, widths=(200, 400, 800, 1200)):
    base = f"https://res.cloudinary.com/{settings.CLOUDINARY_CLOUD_NAME}/image/upload"
    urls = []
    for w in widths:
        urls.append(f"{base}/c_limit,w_{w}/{public_id}.{format_}")
    return urls

@app.post("/api/upload", response_model=ImageCreateResp)
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(None),
    caption: str = Form(None),
    alt_text: str = Form(None),
    album: str = Form(None),
    privacy: str = Form("public"),
    user: dict = Depends(get_current_user)
):
    # only editor/admin or logged-in users can upload (change per your policy)
    if user is None or user.get("role") not in ("admin", "editor", "visitor"):
        # Allow signed up users; in your case you may want to block visitors -> change here
        pass

    try:
        contents = await file.read()
        # attempt to extract EXIF/IPTC using PIL
        from PIL import Image, ExifTags
        from io import BytesIO

        exif = {}
        iptc = {}
        try:
            img = Image.open(BytesIO(contents))
            raw = getattr(img, "_getexif", lambda: {})() or {}
            for k, v in raw.items():
                name = ExifTags.TAGS.get(k, k)
                exif[name] = v
            # IPTC is not standardized across formats; try to retrieve common keys
            iptc_info = img.info.get("iptc")
            if iptc_info:
                iptc = iptc_info
        except Exception:
            exif = {}
            iptc = {}

        folder = f"sunian-photos/{user.get('uid') if user else 'anonymous'}"
        result = cloudinary_upload(
            contents,
            folder=folder,
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            overwrite=False,
        )

        public_id = result.get("public_id")
        secure_url = result.get("secure_url")
        width = result.get("width")
        height = result.get("height")
        fmt = result.get("format") or (file.filename.split(".")[-1] if "." in file.filename else "jpg")
        bytes_len = result.get("bytes")

        responsive = make_responsive_urls(public_id, fmt)

        image_id = public_id  # use cloudinary public_id as primary id

        image_data = {
            "id": image_id,
            "public_id": public_id,
            "filename": file.filename,
            "url": secure_url,
            "mime_type": file.content_type,
            "width": width,
            "height": height,
            "size_bytes": bytes_len,
            "title": title or file.filename,
            "caption": caption or "",
            "alt_text": alt_text or file.filename,
            "uploaded_at": datetime.datetime.utcnow(),
            "uploaded_by": user.get("uid") if user else None,
            "privacy": privacy,
            "album_id": album or None,
            "exif": exif,
            "iptc": iptc,
            "tags": [],
            "responsive_urls": responsive
        }

        db.collection("images").document(image_id).set(image_data)

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
            uploaded_at=image_data["uploaded_at"],
            public_id=image_data["public_id"],
            responsive=image_data["responsive_urls"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/images")
def list_images(limit: int = 200, q: Optional[str] = None):
    try:
        docs = db.collection("images").limit(limit).stream()
        images = [doc.to_dict() for doc in docs]
        # convert timestamps to ISO for frontend
        for im in images:
            ua = im.get("uploaded_at")
            if hasattr(ua, "isoformat"):
                im["uploaded_at"] = ua.isoformat()
        # If q provided, do simple client-side filter
        if q:
            ql = q.lower()
            images = [i for i in images if ql in (i.get("title","") + i.get("caption","") + i.get("filename","")).lower() or any(ql in str(t).lower() for t in i.get("tags", []))]
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search")
def search_endpoint(payload: SearchQuery):
    # simple search implementation re-using the search logic
    images_ref = db.collection("images")
    snapshot = images_ref.limit(500).stream()
    results = []
    import datetime as _dt

    for doc in snapshot:
        rec = doc.to_dict()

        if payload.q:
            qlower = payload.q.lower()
            matched = False
            for f in ["title", "caption", "filename"]:
                v = (rec.get(f) or "").lower()
                if qlower in v:
                    matched = True; break
            if not matched:
                tags = rec.get("tags", [])
                if any(qlower in str(t).lower() for t in tags):
                    matched = True
            if not matched:
                continue

        if payload.album_id and rec.get("album_id") != payload.album_id:
            continue

        if payload.license and rec.get("license") != payload.license:
            continue

        if payload.from_date or payload.to_date:
            uploaded_at = rec.get("uploaded_at")
            if isinstance(uploaded_at, str):
                uploaded_at = _dt.datetime.fromisoformat(uploaded_at)
            if payload.from_date and uploaded_at.date() < payload.from_date:
                continue
            if payload.to_date and uploaded_at.date() > payload.to_date:
                continue

        if payload.camera:
            exif = rec.get("exif", {})
            camera_model = (exif.get("Model") or "").lower()
            if payload.camera.lower() not in camera_model:
                continue

        results.append(rec)
        if len(results) >= (payload.limit or 50):
            break

    return {"count": len(results), "images": results}

@app.post("/api/images/{image_id}/edit")
def edit_image(image_id: str, payload: ImageEdit, user: dict = Depends(get_current_user)):
    doc_ref = db.collection("images").document(image_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Not found")
    rec = doc.to_dict()
    # permission: uploader or editor/admin
    if user and (user.get("uid") == rec.get("uploaded_by") or user.get("role") in ("editor", "admin")):
        updates = payload.model_dump(exclude_unset=True)
        allowed = {"title", "caption", "alt_text", "license", "privacy", "album_id", "tags"}
        to_update = {k: v for k, v in updates.items() if k in allowed}
        if to_update:
            doc_ref.set(to_update, merge=True)
        return {"ok": True, "updated": to_update}
    else:
        raise HTTPException(status_code=403, detail="Permission denied")

@app.delete("/api/images/{image_id}")
def delete_image(image_id: str, user: dict = Depends(get_current_user)):
    doc_ref = db.collection("images").document(image_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Not found")
    rec = doc.to_dict()
    # permission: uploader or editor/admin
    if not user:
        raise HTTPException(status_code=403, detail="Permission denied")
    if user.get("uid") != rec.get("uploaded_by") and user.get("role") not in ("editor", "admin"):
        raise HTTPException(status_code=403, detail="Permission denied")
    try:
        cloudinary.uploader.destroy(rec.get("public_id"), invalidate=True, resource_type="image")
    except Exception:
        pass
    doc_ref.delete()
    return {"ok": True, "deleted": image_id}
