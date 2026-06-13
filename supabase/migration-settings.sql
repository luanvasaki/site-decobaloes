-- ============================================================
-- Decobalões — Settings table (hero image e outras configs)
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Criar tabela
create table if not exists settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- 2. Valor padrão para o hero
insert into settings (key, value)
values ('hero_image_url', '/festa-9.jpg')
on conflict (key) do nothing;

-- ============================================================
-- RLS — seguindo o padrão de rls.sql
-- ============================================================

alter table settings enable row level security;

-- Leitura pública (hero image precisa ser lida pelo site sem autenticação)
create policy "Public can read settings"
  on settings for select
  using (true);

-- Apenas admin pode alterar
create policy "Admins can manage settings"
  on settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
