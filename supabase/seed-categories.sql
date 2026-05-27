-- ============================================================
-- Decobalões — Seed de categorias completo
-- Execute no Supabase SQL Editor (uma vez)
-- ============================================================

insert into categories (name, slug) values
  -- Tipos de evento
  ('Casamento',      'casamento'),
  ('Aniversário',    'aniversario'),
  ('Formatura',      'formatura'),
  ('Chá de Bebê',    'cha-de-bebe'),
  ('Chá Revelação',  'cha-revelacao'),
  ('Debutante',      'debutante'),
  ('Festa Infantil', 'festa-infantil'),
  ('Corporativo',    'corporativo'),
  -- Tipos de item
  ('Balões',           'baloes'),
  ('Arcos de Balões',  'arco-de-baloes'),
  ('Cenários',         'cenarios'),
  ('Mesas Decoradas',  'mesas'),
  ('Painel de Fotos',  'painel-de-fotos'),
  ('Flores Artificiais', 'flores')
on conflict (slug) do nothing;
