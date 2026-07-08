export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  product_type: 'decoracao' | 'material'
  price_rental: number | null
  // decoração-specific
  color_palette: string | null
  event_size: 'pequeno' | 'medio' | 'grande' | null
  includes_setup: boolean
  // material-specific
  height: number | null
  width: number | null
  depth: number | null
  quantity_total: number
  quantity_available: number
  images_urls: string[]
  is_available: boolean
  created_at: string
  categories?: Category | null
}

export interface EventItem {
  id: string
  event_id: string
  product_id: string | null
  custom_name: string | null
  quantity: number
  unit_price: number
  notes: string | null
  products?: Product | null
}

export interface Event {
  id: string
  client_name: string
  client_phone: string
  client_email: string | null
  event_date: string
  event_time: string | null
  setup_time: string | null
  teardown_time: string | null
  category_id: string | null
  event_theme: string | null
  guest_count: number | null
  location_name: string | null
  location_address: string | null
  decoration_colors: string | null
  balloon_colors: string | null
  balloon_types: string | null
  fabric_colors: string | null
  decoration_pieces: string | null
  inspiration_refs: string | null
  special_requests: string | null
  total_value: number
  deposit_value: number
  deposit_paid_at: string | null
  payment_method: 'pix' | 'cartao' | 'dinheiro' | 'transferencia' | null
  payment_status: 'pendente' | 'parcial' | 'pago'
  status: 'orcamento' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado'
  internal_notes: string | null
  created_at: string
  updated_at: string
  categories?: Category | null
  event_items?: EventItem[]
}

export interface Rental {
  id: string
  product_id: string
  event_date: string
  quantity: number
  customer_name: string
  customer_phone: string
  created_at: string
  products?: Product
}

export interface AdminStats {
  totalProducts: number
  totalCategories: number
  availableProducts: number
  unavailableProducts: number
}
