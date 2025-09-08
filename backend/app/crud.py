from sqlalchemy.orm import Session
from app import models
from passlib.context import CryptContext

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(db: Session, username: str, email: str, password: str, role="visitor"):
    u = models.User(username=username, email=email, hashed_password=pwd_ctx.hash(password), role=role)
    db.add(u); db.commit(); db.refresh(u)
    return u

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_image(db: Session, **kwargs):
    img = models.Image(**kwargs)
    db.add(img); db.commit(); db.refresh(img)
    return img

def list_images(db: Session, skip=0, limit=50, q: str = None):
    qset = db.query(models.Image)
    if q:
        pattern = f"%{q}%"
        qset = qset.filter((models.Image.title.ilike(pattern)) | (models.Image.caption.ilike(pattern)))
    return qset.order_by(models.Image.uploaded_at.desc()).offset(skip).limit(limit).all()

def get_image(db: Session, image_id: str):
    return db.query(models.Image).get(image_id)
