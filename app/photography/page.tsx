'use client'

import { Camera } from 'lucide-react'

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Photographie</h1>
        <p className="text-gray-600">Système de gestion photographique complet</p>
      </div>
    </div>
  )
}

