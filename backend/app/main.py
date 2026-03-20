from fastapi import FastAPI

from app.api.appointments import router as appointments_router
from app.api.business import router as business_router
from app.api.catalog import router as catalog_router

app = FastAPI(title="TuBarberia API")

app.include_router(business_router)
app.include_router(catalog_router)
app.include_router(appointments_router)


@app.get("/health")
def health():
    return {"ok": True}
