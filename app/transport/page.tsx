'use client'

import { Truck } from 'lucide-react'

export default function TransportPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Truck className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Transport</h1>
        <p className="text-gray-600">Système de gestion de transport complet</p>
      </div>
    </div>
  )
}

