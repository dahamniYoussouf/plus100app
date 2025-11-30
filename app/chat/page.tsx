'use client'

import { MessageCircle } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Plateforme Chat</h1>
        <p className="text-gray-600">Application complète de messagerie instantanée</p>
      </div>
    </div>
  )
}

