'use client'

import { Wrench } from 'lucide-react'

export default function RenovationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Wrench className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Rénovation</h1>
        <p className="text-gray-600">Système complet de gestion de projets de rénovation</p>
      </div>
    </div>
  )
}

