from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.entities import Business
from app.schemas.business import BusinessOut
from app.services.subscription import get_business_status

router = APIRouter(prefix="/business", tags=["business"])


def to_business_out(business: Business) -> BusinessOut:
    payload = BusinessOut.model_validate(business)
    payload.status = get_business_status(business)
    return payload


@router.get("/search", response_model=list[BusinessOut])
async def search_business(q: str = Query(min_length=1), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Business).where(Business.name.ilike(f"%{q}%")).limit(20))
    businesses = result.scalars().all()
    return [to_business_out(item) for item in businesses]


@router.get("/{slug}", response_model=BusinessOut)
async def get_business(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Business).where(Business.slug == slug))
    business = result.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barbería no encontrada")
    return to_business_out(business)
