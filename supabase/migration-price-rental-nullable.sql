-- Permite que price_rental seja NULL (produto sem preço definido / "a combinar")
ALTER TABLE products ALTER COLUMN price_rental DROP NOT NULL;
