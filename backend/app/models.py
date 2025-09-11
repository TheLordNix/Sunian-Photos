from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import datetime
from app.db.base import Base
import uuid

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    username = Column(String(80), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="visitor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Album(Base):
    __tablename__ = "albums"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    images = relationship("Image", back_populates="album")

class Image(Base):
    __tablename__ = "images"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    filename = Column(String(512), nullable=False)
    storage_path = Column(String(1024), nullable=False)  # key used by storage backend
    mime_type = Column(String(80))
    width = Column(Integer)
    height = Column(Integer)
    size_bytes = Column(Integer)
    title = Column(String(255))
    caption = Column(Text)
    alt_text = Column(String(512))
    license = Column(String(255))
    privacy = Column(String(50), default="public")
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    exif = Column(JSON)
    generation_meta = Column(JSON, nullable=True)
    album_id = Column(String(36), ForeignKey("albums.id"), nullable=True)
    album = relationship("Album", back_populates="images")
class UserLogin(Base):
    __allow_unmapped__ = True
    __tablename__ = "user_logins"
    id = Column(Integer, primary_key=True, index=True)
    username: str
    password: str