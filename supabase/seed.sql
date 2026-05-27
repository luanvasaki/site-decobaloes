-- ============================================================
-- Decobalões — Seed Data (optional)
-- ============================================================

-- Categories
insert into categories (name, slug) values
  ('Balões', 'baloes'),
  ('Arcos de Balões', 'arco-de-baloes'),
  ('Cenários', 'cenarios'),
  ('Mesas Decoradas', 'mesas'),
  ('Painel de Fotos', 'painel-de-fotos'),
  ('Flores Artificiais', 'flores')
on conflict (slug) do nothing;

-- Sample products (replace images_urls with real Supabase Storage URLs)
insert into products (name, slug, description, category_id, price_rental, height, width, quantity_total, quantity_available, is_available)
select
  'Arco Orgânico Rosa e Dourado',
  'arco-organico-rosa-dourado',
  'Arco de balões orgânico nas cores rosa e dourado. Perfeito para entradas de festas, aniversários e ensaios fotográficos.',
  (select id from categories where slug = 'arco-de-baloes'),
  299.00,
  200,
  150,
  2,
  2,
  true
where not exists (select 1 from products where slug = 'arco-organico-rosa-dourado');

insert into products (name, slug, description, category_id, price_rental, height, width, quantity_total, quantity_available, is_available)
select
  'Backdrop Floral Branco',
  'backdrop-floral-branco',
  'Painel backdrop coberto de flores artificiais brancas. Ideal para mesas do bolo, painéis de fotos e cerimônias.',
  (select id from categories where slug = 'cenarios'),
  249.00,
  220,
  200,
  1,
  1,
  true
where not exists (select 1 from products where slug = 'backdrop-floral-branco');
