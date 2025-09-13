from fastapi import APIRouter, Depends, HTTPException
from app.config import settings
import firebase_admin
from firebase_admin import credentials, firestore
from app.schemas import UserOut

router = APIRouter(prefix="/users")

if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
    firebase_admin.initialize_app(cred)
db = firestore.client()

@router.get("/me", response_model=UserOut)
def me(token_data: dict = Depends(lambda: None)):
    # This simple route needs authentication integration.
    # In real usage, wire a proper dependency to validate token and provide user info.
    # Here return placeholder if token_data provided
    if not token_data:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return UserOut(
        id=token_data.get("uid"),
        username="unknown",
        email=token_data.get("email"),
        role=token_data.get("role", "visitor"),
    )

@router.post("/{target_uid}/role")
def set_role(target_uid: str, role: str, user: dict = Depends(lambda: None)):
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    if role not in ["admin", "editor", "visitor"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    doc_ref = db.collection("users").document(target_uid)
    doc_ref.set({"role": role}, merge=True)
    return {"uid": target_uid, "role": role}
