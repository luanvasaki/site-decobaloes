-- ============================================================
-- Storage policies para o bucket product-images
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Leitura pública (qualquer um pode ver as imagens)
create policy "Public can view product images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Admin pode fazer upload
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Admin pode atualizar
create policy "Admins can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Admin pode deletar
create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
