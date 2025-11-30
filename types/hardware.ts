export interface Product {
  id: string
  name: string
  description: string
  category: 'tools' | 'paint' | 'electrical' | 'plumbing' | 'hardware' | 'outdoor' | 'safety'
  price: number
  cost: number
  stock: number
  minStock: number
  supplier: string
  barcode?: string
  image?: string
  available: boolean
}

export interface Sale {
  id: string
  items: SaleItem[]
  total: number
  paymentMethod: 'cash' | 'card' | 'check'
  customerName?: string
  date: Date
  status: 'completed' | 'refunded'
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
}

