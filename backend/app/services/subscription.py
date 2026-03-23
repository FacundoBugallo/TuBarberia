from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import Business

BusinessStatus = Literal["trial", "active", "expired"]

EXPIRED_BUSINESS_MESSAGE = "Tu período ha vencido. Contactanos para continuar usando el sistema."


def get_business_status(business: Business, *, now: datetime | None = None) -> BusinessStatus:
    """Deriva el estado efectivo de suscripción de una barbería."""
    reference = now or datetime.now(timezone.utc)

    if not business.is_active:
        return "expired"

    if business.subscription_ends_at and business.subscription_ends_at >= reference:
        return "active"

    if business.trial_ends_at and business.trial_ends_at >= reference:
        return "trial"

    return "expired"


async def ensure_business_can_operate(db: AsyncSession, business_id: UUID, *, action: str) -> Business:
    result = await db.execute(select(Business).where(Business.id == business_id))
    business = result.scalar_one_or_none()

    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barbería no encontrada")

    if get_business_status(business) == "expired":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": EXPIRED_BUSINESS_MESSAGE, "action": action, "status": "expired"},
        )

    return business
