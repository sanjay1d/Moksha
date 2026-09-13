export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url?: string
}

export interface CartItem {
  product_id: string
  quantity: number
}

export interface Cart {
  user_id: string
  items: CartItem[]
  total: number
}

export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price_at_purchase: number
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}
