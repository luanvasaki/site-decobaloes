-- ============================================================
-- Categorias de eventos para Decobalões
-- Execute no SQL Editor do Supabase
-- ============================================================

insert into categories (name, slug) values
  ('Casamento', 'casamento'),
  ('Aniversário', 'aniversario'),
  ('Formatura', 'formatura'),
  ('Chá de Bebê', 'cha-de-bebe'),
  ('Chá Revelação', 'cha-revelacao'),
  ('Debutante', 'debutante'),
  ('Festa Infantil', 'festa-infantil'),
  ('Corporativo', 'corporativo')
on conflict (slug) do nothing;
