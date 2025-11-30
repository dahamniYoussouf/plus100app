'use client'

import { FileText } from 'lucide-react'

export default function DocumentPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <FileText className="w-16 h-16 text-sky-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion Documents</h1>
        <p className="text-gray-600">Système de gestion documentaire complet</p>
      </div>
    </div>
  )
}

