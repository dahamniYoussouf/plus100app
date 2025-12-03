'use client'

import { Plus, Cake } from 'lucide-react'
import { Product } from '@/types/bakery'

interface Props {
  products: Product[]
  setProducts: (products: Product[]) => void
}

export default function ProductManagement({ products }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Produits</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Ajouter Produit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <Cake className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900"> DZD{product.price}</span>
              {product.available ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
              ) : (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Épuisé</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




