-- ============================================================
-- Migration: sistema de eventos / agenda da decoradora
-- Execute no Supabase SQL Editor
-- ============================================================

-- Tabela principal de eventos
create table if not exists events (
  id                uuid primary key default gen_random_uuid(),

  -- Cliente
  client_name       text not null,
  client_phone      text not null,
  client_email      text,

  -- Evento
  event_date        date not null,
  event_time        time,
  setup_time        time,
  teardown_time     time,
  category_id       uuid references categories(id) on delete set null,
  event_theme       text,
  guest_count       integer,

  -- Local
  location_name     text,
  location_address  text,

  -- Decoração
  decoration_colors text,
  balloon_colors    text,
  balloon_types     text,
  fabric_colors     text,
  decoration_pieces text,
  inspiration_refs  text,
  special_requests  text,

  -- Financeiro
  total_value       numeric(10,2) not null default 0,
  deposit_value     numeric(10,2) not null default 0,
  deposit_paid_at   date,
  payment_method    text check (payment_method in ('pix','cartao','dinheiro','transferencia')),
  payment_status    text not null default 'pendente'
                    check (payment_status in ('pendente','parcial','pago')),

  -- Status
  status            text not null default 'orcamento'
                    check (status in ('orcamento','confirmado','em_andamento','concluido','cancelado')),

  -- Notas internas
  internal_notes    text,

  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Itens associados ao evento (do catálogo ou avulsos)
create table if not exists event_items (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references events(id) on delete cascade,
  product_id   uuid references products(id) on delete set null,
  custom_name  text,
  quantity     integer not null default 1,
  unit_price   numeric(10,2) not null default 0,
  notes        text
);

-- Indexes
create index if not exists events_date_idx     on events(event_date);
create index if not exists events_status_idx   on events(status);
create index if not exists events_category_idx on events(category_id);
create index if not exists event_items_evt_idx on event_items(event_id);

-- RLS
alter table events      enable row level security;
alter table event_items enable row level security;

create policy "Admins can manage events"
  on events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admins can manage event_items"
  on event_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
