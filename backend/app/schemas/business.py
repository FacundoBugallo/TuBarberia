from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class BusinessOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
    logo_url: str | None = None
    primary_color: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
