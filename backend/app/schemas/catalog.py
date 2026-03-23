from uuid import UUID

from pydantic import BaseModel, Field


class ServiceOut(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    duration_minutes: int
    price: float

    class Config:
        from_attributes = True


class ServiceUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    duration_minutes: int = Field(..., gt=0)
    price: float = Field(..., ge=0)


class BarberOut(BaseModel):
    id: UUID
    business_id: UUID
    branch_id: UUID
    name: str
    active: bool

    class Config:
        from_attributes = True


class BranchOut(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    address: str

    class Config:
        from_attributes = True
