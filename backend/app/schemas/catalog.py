from uuid import UUID

from pydantic import BaseModel


class ServiceOut(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    duration_minutes: int
    price: float

    class Config:
        from_attributes = True


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
