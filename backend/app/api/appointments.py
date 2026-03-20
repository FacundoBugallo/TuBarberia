from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentOut
from app.services.availability import ensure_slot_available

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.post("", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    await ensure_slot_available(
        db,
        business_id=payload.business_id,
        barber_id=payload.barber_id,
        service_id=payload.service_id,
        appointment_datetime=payload.datetime,
    )
    appointment = Appointment(**payload.model_dump(), status=AppointmentStatus.pending)
    db.add(appointment)
    await db.commit()
    await db.refresh(appointment)
    return appointment


@router.get("", response_model=list[AppointmentOut])
async def list_appointments(business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Appointment).where(Appointment.business_id == business_id))
    return result.scalars().all()


@router.post("/{appointment_id}/confirm", response_model=AppointmentOut)
async def confirm_appointment(appointment_id: UUID, business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Appointment).where(
            and_(Appointment.id == appointment_id, Appointment.business_id == business_id)
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")
    if appointment.status == AppointmentStatus.cancelled:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se puede confirmar un turno cancelado")
    appointment.status = AppointmentStatus.confirmed
    await db.commit()
    await db.refresh(appointment)
    return appointment


@router.post("/{appointment_id}/cancel", response_model=AppointmentOut)
async def cancel_appointment(appointment_id: UUID, business_id: UUID = Query(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Appointment).where(
            and_(Appointment.id == appointment_id, Appointment.business_id == business_id)
        )
    )
    appointment = result.scalar_one_or_none()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turno no encontrado")
    appointment.status = AppointmentStatus.cancelled
    await db.commit()
    await db.refresh(appointment)
    return appointment
