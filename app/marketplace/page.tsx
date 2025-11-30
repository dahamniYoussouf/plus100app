'use client'

import { Store } from 'lucide-react'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Store className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Plateforme marketplace multi-vendeurs</p>
      </div>
    </div>
  )
}

