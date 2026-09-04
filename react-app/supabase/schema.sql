-- =========================================================
-- JP TERRACE LOUNGE — Booking system schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- =========================================================

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  event_type text not null,
  booking_date date not null,
  time_slot text not null check (time_slot in ('regular', 'overnight')),
  guest_count int not null check (guest_count between 1 and 50),
  special_requests text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  created_at timestamptz not null default now()
);

-- Only one CONFIRMED booking is allowed per date. Pending requests never
-- collide with each other here -- this is what makes "block the date only
-- after the admin confirms it" work: the constraint only fires on confirm.
create unique index if not exists bookings_confirmed_date_unique
  on public.bookings (booking_date)
  where status = 'confirmed';

alter table public.bookings enable row level security;

-- Anyone (including logged-out guests) can submit a new booking request,
-- but only ever as 'pending' -- they can't insert a pre-confirmed row.
drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
  on public.bookings for insert
  to anon
  with check (status = 'pending');

-- No select/update/delete policy for anon => guests cannot read other
-- guests' names/phone numbers/emails, and cannot edit or cancel bookings.

-- Authenticated users (i.e. you, once you create an admin login below) can
-- see and manage every booking.
drop policy if exists "Admins can view all bookings" on public.bookings;
create policy "Admins can view all bookings"
  on public.bookings for select
  to authenticated
  using (true);

drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

-- Public view exposing ONLY the dates of confirmed bookings (no names,
-- phone numbers, or any other guest detail) so the booking form can show
-- guests which dates are already taken without exposing anyone's PII.
create or replace view public.confirmed_dates as
  select booking_date from public.bookings where status = 'confirmed';

grant select on public.confirmed_dates to anon;

-- =========================================================
-- One-time manual step: create your admin login
-- =========================================================
-- Dashboard -> Authentication -> Users -> Add user -> set your email +
-- a password. There is no public sign-up form in the app, so this is the
-- only way an admin account gets created. Use that email/password to log
-- in at /admin/login.
