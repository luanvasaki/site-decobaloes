-- Snapshot do nome do produto no momento da venda, para o histórico do evento
-- não se perder se o produto for excluído do catálogo depois (product_id usa
-- "on delete set null" em event_items).
ALTER TABLE event_items ADD COLUMN IF NOT EXISTS product_name text;
