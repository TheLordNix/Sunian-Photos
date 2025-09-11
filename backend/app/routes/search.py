from fastapi import APIRouter, Query
from app.utils.firebase_auth import db

router = APIRouter()

@router.get("/")
def search(q: str = Query(...), limit: int = 50):
    images_ref = db.collection("images")
    # naive approach: fetch a reasonable chunk then filter
    result = []
    snapshot = images_ref.limit(500).stream()
    qlower = q.lower()
    for doc in snapshot:
        rec = doc.to_dict()
        for f in ["title", "caption", "filename"]:
            v = (rec.get(f) or "").lower()
            if qlower in v:
                result.append(rec); break
        if len(result) >= limit:
            break
    return {"count": len(result), "images": result}
