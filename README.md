# TuBarberia SaaS (multi-tenant)

Proyecto base completo para gestión de barberías con reservas de turnos.

## Stack
- **Backend:** FastAPI + SQLAlchemy async + PostgreSQL (Supabase)
- **DB/Auth/Storage:** Supabase
- **Web:** Next.js (App Router)
- **Mobile:** React Native con Expo

## Estructura

- `backend/`: API, lógica de negocio, validaciones y disponibilidad.
- `web/`: landing dinámica por barbería (`/[slug]`) y panel admin (`/admin`).
- `app-mobile/`: app móvil con búsqueda, persistencia de barbería y cambio de contexto.
- `supabase/schema.sql`: SQL listo para correr en Supabase.
- `docker/docker-compose.yml`: ejecución local del backend.

## Multi-tenant
Todas las entidades de dominio incluyen `business_id` (excepto `business`) y el backend filtra por `business_id` en endpoints y consultas.

## Modelo de datos (Supabase)
Aplicar en Supabase SQL editor:

```sql
-- archivo completo en supabase/schema.sql
```

Incluye:
- tablas: `business`, `branch`, `barber`, `service`, `schedule`, `appointment`
- índices por `business_id`
- `RLS` habilitado y policy inicial de lectura pública para `business`

## Variables de entorno
Copiar `.env.example` a `.env`.

Variables requeridas:
- `SUPABASE_DB_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL`

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Endpoints implementados:
- `GET /business/search?q=`
- `GET /business/{slug}`
- `GET /services?business_id=`
- `GET /barbers?business_id=`
- `GET /branches?business_id=`
- `POST /appointments`
- `GET /appointments?business_id=`
- `POST /appointments/{id}/confirm?business_id=`
- `POST /appointments/{id}/cancel?business_id=`

### Lógica de disponibilidad
En `backend/app/services/availability.py`:
- valida jornada de `schedule`
- valida conflictos con turnos `pending/confirmed`
- evita doble reserva (además de constraint único)

## Web (Next.js)

```bash
cd web
npm install
npm run dev
```

- Landing: `http://localhost:3000/[slug]`
- Admin: `http://localhost:3000/admin` (login con Supabase Auth)

## Mobile (Expo)

```bash
cd app-mobile
npm install
npm run start
npx expo start -c
```

Flujos:
- buscar barbería
- seleccionar y persistir barbería (`AsyncStorage`)
- entrar directo si hay barbería guardada
- botón “Cambiar barbería”

## Storage (Supabase)
Crear bucket(s):
- `logos`
- `images`

Subida de archivos: desde frontend web/mobile vía SDK de Supabase con `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Admin panel (siguiente iteración sugerida)
- proteger rutas por sesión
- CRUD completo de servicios/barberos/sucursales/horarios
- bandeja de turnos por estado

