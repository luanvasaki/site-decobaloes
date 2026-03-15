-- Tabela de fotos da galeria
create table if not exists gallery_photos (
  id         uuid primary key default gen_random_uuid(),
  category   text not null, -- 'casamentos' | 'aniversarios' | 'infantil' | 'cha'
  image_url  text not null,
  created_at timestamptz default now()
);

-- RLS
alter table gallery_photos enable row level security;

create policy "Public can read gallery"
  on gallery_photos for select using (true);

create policy "Admins can manage gallery"
  on gallery_photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed com as fotos que já temos no servidor
-- (substitua pelas URLs reais do Supabase Storage depois)
