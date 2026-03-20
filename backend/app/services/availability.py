from datetime import date, datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import Appointment, AppointmentStatus, Schedule, Service


def _overlaps(start_a: datetime, end_a: datetime, start_b: datetime, end_b: datetime) -> bool:
    return start_a < end_b and start_b < end_a


async def ensure_slot_available(
    db: AsyncSession,
    *,
    business_id,
    barber_id,
    service_id,
    appointment_datetime: datetime,
) -> None:
    service = (
        await db.execute(
            select(Service).where(and_(Service.id == service_id, Service.business_id == business_id))
        )
    ).scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado")

    day_of_week = appointment_datetime.weekday()
    schedule = (
        await db.execute(
            select(Schedule).where(
                and_(
                    Schedule.business_id == business_id,
                    Schedule.barber_id == barber_id,
                    Schedule.day_of_week == day_of_week,
                )
            )
        )
    ).scalar_one_or_none()

    if not schedule:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Barbero sin horario para ese día")

    start = appointment_datetime
    end = start + timedelta(minutes=service.duration_minutes)
    current_day: date = appointment_datetime.date()
    schedule_start = datetime.combine(current_day, schedule.start_time, tzinfo=appointment_datetime.tzinfo)
    schedule_end = datetime.combine(current_day, schedule.end_time, tzinfo=appointment_datetime.tzinfo)

    if start < schedule_start or end > schedule_end:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Horario fuera de jornada")

    existing = (
        await db.execute(
            select(Appointment).where(
                and_(
                    Appointment.business_id == business_id,
                    Appointment.barber_id == barber_id,
                    Appointment.status.in_([AppointmentStatus.pending, AppointmentStatus.confirmed]),
                )
            )
        )
    ).scalars()

    for app in existing:
        other_service = (
            await db.execute(
                select(Service).where(
                    and_(Service.id == app.service_id, Service.business_id == business_id)
                )
            )
        ).scalar_one_or_none()
        if not other_service:
            continue
        other_start = app.datetime
        other_end = other_start + timedelta(minutes=other_service.duration_minutes)
        if _overlaps(start, end, other_start, other_end):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Turno no disponible")
