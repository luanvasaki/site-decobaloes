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
  price_rental: number
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
