from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class BusinessOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
    logo_url: str | None = None
    primary_color: str | None = None
    trial_ends_at: datetime | None = None
    subscription_ends_at: datetime | None = None
    is_active: bool
    plan: Literal["trial", "active", "expired"]
    status: Literal["trial", "active", "expired"]
    created_at: datetime

    class Config:
        from_attributes = True
