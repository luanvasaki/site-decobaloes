-- ============================================================
-- Decobalões — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Categories
create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  created_at   timestamptz default now()
);

-- Products
create table if not exists products (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text unique not null,
  description          text,
  category_id          uuid references categories(id) on delete set null,
  price_rental         numeric(10,2) not null,
  height               numeric,
  width                numeric,
  depth                numeric,
  quantity_total       integer default 1,
  quantity_available   integer default 1,
  images_urls          text[] default '{}',
  is_available         boolean default true,
  created_at           timestamptz default now()
);

-- Rentals (future-ready)
create table if not exists rentals (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid references products(id) on delete set null,
  event_date      date,
  quantity        integer,
  customer_name   text,
  customer_phone  text,
  created_at      timestamptz default now()
);

-- Indexes
create index if not exists products_slug_idx on products(slug);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_available_idx on products(is_available);
create index if not exists categories_slug_idx on categories(slug);
