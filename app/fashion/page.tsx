'use client'

import { ShoppingBag } from 'lucide-react'

export default function FashionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <ShoppingBag className="w-16 h-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique Mode</h1>
        <p className="text-gray-600">Système complet de gestion de boutique de mode</p>
      </div>
    </div>
  )
}

