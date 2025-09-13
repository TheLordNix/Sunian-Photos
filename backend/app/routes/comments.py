from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from app.config import settings
import firebase_admin
from firebase_admin import credentials, firestore
from app.schemas import CommentCreate

router = APIRouter(prefix="/comments")

if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
db = firestore.client()

@router.post("/{public_id}")
def add_comment(public_id: str, payload: CommentCreate, user: dict = Depends(lambda: None)):
    # allow anonymous comments or require auth depending on project policy - here we accept anonymous
    img = db.collection("images").document(public_id).get()
    if not img.exists:
        raise HTTPException(status_code=404, detail="Image not found")
    col = db.collection("images").document(public_id).collection("comments")
    doc_ref = col.document()
    data = {
        "id": doc_ref.id,
        "image_id": public_id,
        "author_uid": user.get("uid") if user else None,
        "user_email": user.get("email") if user else None,
        "content": payload.content,
        "created_at": datetime.utcnow()
    }
    doc_ref.set(data)
    return data

@router.get("/{public_id}")
def list_comments(public_id: str):
    img = db.collection("images").document(public_id).get()
    if not img.exists:
        raise HTTPException(status_code=404, detail="Image not found")
    col = db.collection("images").document(public_id).collection("comments")
    snapshot = col.order_by("created_at", direction=firestore.Query.DESCENDING).stream()
    out = [d.to_dict() for d in snapshot]
    return {"comments": out}

@router.delete("/{public_id}/{comment_id}")
def delete_comment(public_id: str, comment_id: str, user: dict = Depends(lambda: None)):
    comment_ref = db.collection("images").document(public_id).collection("comments").document(comment_id)
    doc = comment_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Comment not found")
    rec = doc.to_dict()
    if user and (user.get("uid") == rec.get("author_uid") or (user.get("role") in ("editor","admin"))):
        comment_ref.delete()
        return {"ok": True}
    raise HTTPException(status_code=403, detail="Permission denied")
