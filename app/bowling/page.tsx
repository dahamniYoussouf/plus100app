'use client'

import { Gamepad2 } from 'lucide-react'

export default function BowlingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Gamepad2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Bowling</h1>
        <p className="text-gray-600">Système complet de gestion de bowling</p>
      </div>
    </div>
  )
}

