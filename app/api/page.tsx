'use client'

import { Code } from 'lucide-react'

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <Code className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion API</h1>
        <p className="text-gray-600">Plateforme complète de gestion et documentation d'API</p>
      </div>
    </div>
  )
}

