'use client'

import { MessageSquare, Users, Bell, Home, Search, Settings } from 'lucide-react'
import { useState } from 'react'

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Réseau Social Interne
          </h1>
          <p className="text-sm text-gray-500">Plateforme sociale pour équipes et entreprises</p>
        </div>
      </header>
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Réseau Social Interne</h2>
            <p className="text-gray-600">Publication, messages, groupes, notifications et plus encore</p>
          </div>
        </div>
      </main>
    </div>
  )
}


