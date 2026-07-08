-- ============================================================
-- Cria as tabelas gallery_photos e settings (nunca foram criadas
-- em produção) + já aplica a coluna de ordenação sort_order.
-- Execute tudo de uma vez no SQL Editor do Supabase.
-- ============================================================

-- gallery_photos
create table if not exists gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  category   text not null,
  image_url  text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

alter table gallery_photos enable row level security;

drop policy if exists "Public can read gallery" on gallery_photos;
create policy "Public can read gallery"
  on gallery_photos for select using (true);

drop policy if exists "Admins can manage gallery" on gallery_photos;
create policy "Admins can manage gallery"
  on gallery_photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- settings
create table if not exists settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

insert into settings (key, value)
values ('hero_image_url', '/festa-9.jpg')
on conflict (key) do nothing;

alter table settings enable row level security;

drop policy if exists "Public can read settings" on settings;
create policy "Public can read settings"
  on settings for select using (true);

drop policy if exists "Admins can manage settings" on settings;
create policy "Admins can manage settings"
  on settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
