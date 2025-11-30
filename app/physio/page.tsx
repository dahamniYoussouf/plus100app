'use client'

import { Activity } from 'lucide-react'

export default function PhysioPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Activity className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Physiothérapeute</h1>
        <p className="text-gray-600">Système complet de gestion de cabinet de physiothérapie</p>
      </div>
    </div>
  )
}

