export interface Product {
  id: string
  name: string
  description: string
  category: 'cake' | 'pastry' | 'bread' | 'cookie' | 'drink'
  price: number
  image?: string
  ingredients: string[]
  available: boolean
  stock?: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  orderType: 'pickup' | 'delivery'
  deliveryAddress?: string
  createdAt: Date
  deliveryDate?: Date
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  notes?: string
}


