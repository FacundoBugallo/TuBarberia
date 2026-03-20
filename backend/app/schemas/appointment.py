from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.entities import AppointmentStatus


class AppointmentCreate(BaseModel):
    business_id: UUID
    branch_id: UUID
    barber_id: UUID
    service_id: UUID
    client_name: str = Field(min_length=2, max_length=120)
    client_phone: str = Field(min_length=6, max_length=40)
    client_email: EmailStr | None = None
    datetime: datetime


class AppointmentOut(BaseModel):
    id: UUID
    business_id: UUID
    branch_id: UUID
    barber_id: UUID
    service_id: UUID
    client_name: str
    client_phone: str
    client_email: str | None = None
    datetime: datetime
    status: AppointmentStatus

    class Config:
        from_attributes = True
