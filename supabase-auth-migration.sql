-- ============================================================
-- StoreApp: Auth + Per-User Data Migration
-- Run this ONCE in the Supabase SQL Editor.
-- It adds a profiles table, scopes all data per user, and
-- replaces the open RLS policies with per-user ones.
-- ============================================================

-- ============================================
-- 1. Profiles table (mirrors auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

-- Auto-create a profile whenever a user signs up (Google, email, etc.)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users who already signed up
insert into public.profiles (id, email, full_name, avatar_url)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- ============================================
-- 2. Add user_id to app tables
-- ============================================
alter table public.products
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.sales_records
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table public.store_settings
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- One settings row per user
create unique index if not exists store_settings_user_id_key
  on public.store_settings(user_id);

-- New settings rows get a generated id (old default was the literal 'default')
alter table public.store_settings
  alter column id set default (gen_random_uuid()::text);

create index if not exists idx_products_user_id on public.products(user_id);
create index if not exists idx_sales_records_user_id on public.sales_records(user_id);

-- Remove pre-auth demo rows that have no owner
delete from public.sales_records where user_id is null;
delete from public.products where user_id is null;
delete from public.store_settings where user_id is null;

-- ============================================
-- 3. Replace open RLS policies with per-user ones
-- ============================================
drop policy if exists "Allow all access to products" on public.products;
drop policy if exists "Allow all access to sales_records" on public.sales_records;
drop policy if exists "Allow all access to store_settings" on public.store_settings;

drop policy if exists "Users manage own products" on public.products;
create policy "Users manage own products"
  on public.products for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own sales" on public.sales_records;
create policy "Users manage own sales"
  on public.sales_records for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own settings" on public.store_settings;
create policy "Users manage own settings"
  on public.store_settings for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
