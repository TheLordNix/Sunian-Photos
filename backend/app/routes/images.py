from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app import crud
from app.storage.local_storage import LocalStorage
from app.config import settings
from app.images.processor import generate_responsive_images
from uuid import uuid4
from io import BytesIO
from typing import List
import os

router = APIRouter(prefix="/api/images", tags=["images"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_storage():
    # For now only local backend is registered. The STORAGE_BACKEND var is kept for future.
    return LocalStorage(settings.STORAGE_LOCAL_PATH)

@router.post("/", status_code=201)
async def upload_images(files: List[UploadFile] = File(...), title: str = Query(None), album_id: str = Query(None), db: Session = Depends(get_db)):
    storage = get_storage()
    created = []
    for f in files:
        data = await f.read()  # bytes
        # generate responsive sizes & exif
        outputs, exif, size = generate_responsive_images(data)
        upload_folder = f"{str(uuid4())}"
        # Save original (as jpg conversion for consistency)
        original_key = f"{upload_folder}/{f.filename}"
        # Save original bytes
        storage.save(original_key, data, f.content_type or "image/jpeg")
        # Save generated sizes
        for name, b in outputs.items():
            key = f"{upload_folder}/{name}"
            storage.save(key, b, "image/jpeg")
        # Create DB record pointing to original key (you could store all keys as JSON if needed)
        db_img = crud.create_image(db,
            filename=f.filename,
            storage_path=original_key,
            mime_type=f.content_type,
            width=size[0],
            height=size[1],
            size_bytes=len(data),
            title=title or None,
            uploaded_by=None,
            exif=exif,
            album_id=album_id
        )
        created.append({
            "id": db_img.id,
            "filename": db_img.filename,
            "url": storage.url(db_img.storage_path)
        })
    return {"uploaded": created}

@router.get("/", status_code=200)
def list_images(q: str = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    items = crud.list_images(db, skip=skip, limit=limit, q=q)
    # map storage urls for each item
    storage = get_storage()
    out = []
    for it in items:
        out.append({
            "id": it.id,
            "filename": it.filename,
            "title": it.title,
            "caption": it.caption,
            "uploaded_at": it.uploaded_at,
            "width": it.width,
            "height": it.height,
            "exif": it.exif,
            "url": storage.url(it.storage_path)
        })
    return out

@router.get("/{image_id}")
def get_image(image_id: str, db: Session = Depends(get_db)):
    img = crud.get_image(db, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    storage = get_storage()
    return {
        "id": img.id,
        "filename": img.filename,
        "title": img.title,
        "caption": img.caption,
        "uploaded_at": img.uploaded_at,
        "width": img.width,
        "height": img.height,
        "exif": img.exif,
        "url": storage.url(img.storage_path)
    }
