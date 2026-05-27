-- ============================================================
-- Migration: add product_type fields to products table
-- Run this in Supabase SQL Editor (once)
-- ============================================================

alter table products
  add column if not exists product_type    text not null default 'decoracao'
    check (product_type in ('decoracao', 'material')),
  add column if not exists color_palette   text,
  add column if not exists event_size      text
    check (event_size in ('pequeno', 'medio', 'grande')),
  add column if not exists includes_setup  boolean not null default false;
