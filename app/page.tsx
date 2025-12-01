'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import ApplicationsShowcase from '@/components/ApplicationsShowcase'
import EmailPopup from '@/components/EmailPopup'
import { Mail } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [showEmailPopup, setShowEmailPopup] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <ApplicationsShowcase />
      
      {/* Floating Email Button */}
      <button
        onClick={() => setShowEmailPopup(true)}
        className="fixed bottom-8 right-8 z-[9998] bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg font-bold"
        aria-label="Ouvrir le formulaire de contact"
      >
        <Mail className="w-6 h-6" />
        <span>Contactez-nous</span>
      </button>

      <EmailPopup isOpen={showEmailPopup} onClose={() => setShowEmailPopup(false)} />
    </main>
  )
}
