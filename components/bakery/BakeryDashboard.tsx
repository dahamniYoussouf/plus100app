'use client'

import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { Product, Order } from '@/types/bakery'

interface Props {
  products: Product[]
  orders: Order[]
}

export default function BakeryDashboard({ products, orders }: Props) {
  const stats = {
    totalProducts: products.length,
    availableProducts: products.filter((p) => p.available).length,
    totalOrders: orders.length,
    totalRevenue: orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.availableProducts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900 mt-2"> DZD{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}



