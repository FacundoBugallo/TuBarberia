from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import Barber, Branch, Service
from app.schemas.catalog import BarberOut, BranchOut, ServiceOut, ServiceUpdate

router = APIRouter(tags=["catalog"])


@router.get("/services", response_model=list[ServiceOut])
async def list_services(business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Service).where(Service.business_id == business_id))
    return result.scalars().all()


@router.put("/services/{service_id}", response_model=ServiceOut)
async def update_service(
    service_id: UUID,
    payload: ServiceUpdate,
    business_id: UUID = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Service).where(and_(Service.id == service_id, Service.business_id == business_id))
    )
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")

    service.name = payload.name
    service.duration_minutes = payload.duration_minutes
    service.price = payload.price
    await db.commit()
    await db.refresh(service)
    return service


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
