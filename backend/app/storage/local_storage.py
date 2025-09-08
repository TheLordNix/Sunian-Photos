import os
from pathlib import Path
from typing import BinaryIO, Union
from app.storage.storage import StorageBackend
from app.config import settings
import uuid

class LocalStorage(StorageBackend):
    def __init__(self, base_path: str = None):
        self.base_path = Path(base_path or settings.STORAGE_LOCAL_PATH).resolve()
        self.public_url_prefix = "/media"  # mounted static files at /media
        self.base_path.mkdir(parents=True, exist_ok=True)

    def _ensure_parent(self, key: str):
        tgt = self.base_path / key
        tgt.parent.mkdir(parents=True, exist_ok=True)
        return tgt

    def save(self, key: str, stream: Union[BinaryIO, bytes], content_type: str) -> str:
        """
        Accepts bytes or file-like stream. Saves to base_path/key and returns the key string.
        The app will expose it at /media/<key>
        """
        # Normalize key
        key = key.lstrip("/")

        target = self._ensure_parent(key)
        # If stream is bytes
        if isinstance(stream, (bytes, bytearray)):
            data = bytes(stream)
            with open(target, "wb") as f:
                f.write(data)
        else:
            # file-like: ensure pointer at start
            try:
                stream.seek(0)
            except Exception:
                pass
            with open(target, "wb") as f:
                # Use .read() which works for aiofiles BytesIO or sync BytesIO
                data = stream.read()
                if isinstance(data, str):
                    data = data.encode()
                f.write(data)
        # Return the key (we store this in DB). The url() will convert to /media/<key>
        return key

    def url(self, key: str) -> str:
        key = key.lstrip("/")
        return f"{self.public_url_prefix}/{key}"

    def exists(self, key: str) -> bool:
        return (self.base_path / key).exists()
