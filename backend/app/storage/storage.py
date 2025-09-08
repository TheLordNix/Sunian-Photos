from abc import ABC, abstractmethod
from typing import BinaryIO

class StorageBackend(ABC):
    @abstractmethod
    def save(self, key: str, stream: BinaryIO, content_type: str) -> str:
        """Save stream/content to storage. Return storage path or URL key (string)."""

    @abstractmethod
    def url(self, key: str) -> str:
        """Return accessible URL for the key (public or presigned)."""

    @abstractmethod
    def exists(self, key: str) -> bool:
        """Return True if key exists."""
