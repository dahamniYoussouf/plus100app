'use client'

import { Plus, ShoppingCart } from 'lucide-react'
import { Order, Product } from '@/types/bakery'

interface Props {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  products: Product[]
}

export default function OrderManagement({ orders }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Nouvelle Commande
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500">{order.customerPhone}</p>
            <p className="text-lg font-bold text-gray-900 mt-3"> DZD{order.total}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs  DZD{
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
              order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}




