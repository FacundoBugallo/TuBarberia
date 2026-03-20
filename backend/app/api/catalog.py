from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import Barber, Branch, Service
from app.schemas.catalog import BarberOut, BranchOut, ServiceOut

router = APIRouter(tags=["catalog"])


@router.get("/services", response_model=list[ServiceOut])
async def list_services(business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service).where(Service.business_id == business_id))
    return result.scalars().all()


@router.get("/barbers", response_model=list[BarberOut])
async def list_barbers(business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Barber).where(and_(Barber.business_id == business_id, Barber.active.is_(True)))
    )
    return result.scalars().all()


@router.get("/branches", response_model=list[BranchOut])
async def list_branches(business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Branch).where(Branch.business_id == business_id))
    return result.scalars().all()
