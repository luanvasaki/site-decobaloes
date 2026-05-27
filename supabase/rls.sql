-- ============================================================
-- Decobalões — Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- Enable RLS on all tables
alter table categories enable row level security;
alter table products enable row level security;
alter table rentals enable row level security;

-- ============================================================
-- CATEGORIES
-- ============================================================

-- Public read
create policy "Public can read categories"
  on categories for select
  using (true);

-- Admin full access
create policy "Admins can manage categories"
  on categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- PRODUCTS
-- ============================================================

-- Public read
create policy "Public can read products"
  on products for select
  using (true);

-- Admin full access
create policy "Admins can manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- RENTALS
-- ============================================================

-- Admin full access
create policy "Admins can manage rentals"
  on rentals for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE — product-images bucket
-- ============================================================
-- Create bucket in Supabase dashboard: Storage > New Bucket
-- Name: product-images | Public: true

-- Allow authenticated users to upload
-- (Run in Supabase dashboard > Storage > Policies)
--
-- insert: authenticated
-- update: authenticated
-- delete: authenticated
-- select: public (anon)
