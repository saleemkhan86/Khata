-- StoreApp (WhatsApp Edition) — Supabase Schema
-- Run this in your Supabase SQL Editor to create all required tables.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Table: products
-- ============================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  urdu_name text default '',
  buy_price numeric(12, 2) not null default 0,
  sell_price numeric(12, 2) not null default 0,
  stock_quantity integer not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

-- ============================================
-- Table: sales_records
-- ============================================
create table if not exists sales_records (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  units_sold integer not null default 1,
  sale_date date not null default current_date,
  revenue numeric(12, 2) not null default 0,
  profit numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================
-- Table: store_settings
-- ============================================
create table if not exists store_settings (
  id text primary key default 'default',
  store_name text not null default 'My Store',
  store_name_urdu text not null default 'میری دکان',
  currency text not null default 'PKR',
  currency_symbol text not null default '₨',
  updated_at timestamptz not null default now()
);

-- Insert default store settings
insert into store_settings (id, store_name, store_name_urdu, currency, currency_symbol)
values ('default', 'My Store', 'میری دکان', 'PKR', '₨')
on conflict (id) do nothing;

-- ============================================
-- Indexes for performance
-- ============================================
create index if not exists idx_sales_records_sale_date on sales_records(sale_date desc);
create index if not exists idx_sales_records_product_id on sales_records(product_id);
create index if not exists idx_products_created_at on products(created_at desc);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
alter table products enable row level security;
alter table sales_records enable row level security;
alter table store_settings enable row level security;

-- Allow all operations for now (add auth later)
create policy "Allow all access to products" on products for all using (true) with check (true);
create policy "Allow all access to sales_records" on sales_records for all using (true) with check (true);
create policy "Allow all access to store_settings" on store_settings for all using (true) with check (true);

-- ============================================
-- Storage bucket for product images
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Allow all uploads to product-images"
  on storage.objects for all
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
