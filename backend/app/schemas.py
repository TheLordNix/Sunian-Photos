from pydantic import BaseModel, Field
from typing import Optional, Any
from uuid import UUID
import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    id: UUID
    username: str
    email: str
    role: str
    class Config:
        orm_mode = True

class ImageCreateResp(BaseModel):
    id: UUID
    filename: str
    storage_path: str
    mime_type: Optional[str]
    width: Optional[int]
    height: Optional[int]
    size_bytes: Optional[int]
    title: Optional[str]
    caption: Optional[str]
    alt_text: Optional[str]
    uploaded_at: datetime.datetime
    class Config:
        orm_mode = True
