from PIL import Image, ExifTags
from io import BytesIO
from typing import Tuple, Dict
import os

RESPONSIVE_SIZES = [1600, 1200, 800, 400]

def extract_exif(pil_img: Image.Image) -> Dict:
    try:
        raw = pil_img._getexif() or {}
        exif = {}
        for k, v in raw.items():
            name = ExifTags.TAGS.get(k, k)
            exif[name] = v
        return exif
    except Exception:
        return {}

def resize_image_to_bytes(pil_img: Image.Image, width: int) -> bytes:
    orig_w, orig_h = pil_img.size
    if orig_w <= width:
        buf = BytesIO()
        pil_img.save(buf, format="JPEG", quality=85)
        return buf.getvalue()
    ratio = width / float(orig_w)
    new_h = int(orig_h * ratio)
    resized = pil_img.resize((width, new_h), Image.LANCZOS)
    buf = BytesIO()
    resized.save(buf, format="JPEG", quality=85)
    return buf.getvalue()

def generate_responsive_images(file_bytes: bytes):
    buf = BytesIO(file_bytes)
    img = Image.open(buf)
    img = img.convert("RGB")
    exif = extract_exif(img)
    outputs = {}
    for w in RESPONSIVE_SIZES:
        b = resize_image_to_bytes(img, w)
        outputs[f"{w}.jpg"] = b
    # thumbnail
    thumb = resize_image_to_bytes(img, 200)
    outputs["thumb.jpg"] = thumb
    return outputs, exif, img.size
