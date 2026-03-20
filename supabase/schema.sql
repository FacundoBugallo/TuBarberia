-- Enable extensions
create extension if not exists "pgcrypto";

create table if not exists public.business (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  primary_color text,
  created_at timestamptz not null default now()
);

create table if not exists public.branch (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  name text not null,
  address text not null
);

create table if not exists public.barber (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  branch_id uuid not null references public.branch(id) on delete cascade,
  name text not null,
  active boolean not null default true
);

create table if not exists public.service (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10,2) not null check (price >= 0)
);

create table if not exists public.schedule (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  barber_id uuid not null references public.barber(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (start_time < end_time)
);

create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled');

create table if not exists public.appointment (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  branch_id uuid not null references public.branch(id) on delete cascade,
  barber_id uuid not null references public.barber(id) on delete cascade,
  service_id uuid not null references public.service(id) on delete cascade,
  client_name text not null,
  client_phone text not null,
  client_email text,
  datetime timestamptz not null,
  status public.appointment_status not null default 'pending'
);

create unique index if not exists appointment_unique_slot
  on public.appointment (business_id, barber_id, datetime);

create index if not exists idx_branch_business_id on public.branch (business_id);
create index if not exists idx_barber_business_id on public.barber (business_id);
create index if not exists idx_service_business_id on public.service (business_id);
create index if not exists idx_schedule_business_id on public.schedule (business_id);
create index if not exists idx_appointment_business_id on public.appointment (business_id);

-- Prepare tables for RLS
alter table public.business enable row level security;
alter table public.branch enable row level security;
alter table public.barber enable row level security;
alter table public.service enable row level security;
alter table public.schedule enable row level security;
alter table public.appointment enable row level security;

-- Example policy stubs (customize auth mapping before production)
create policy "public read business" on public.business
for select using (true);
