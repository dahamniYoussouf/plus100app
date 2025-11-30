'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import ApplicationsShowcase from '@/components/ApplicationsShowcase'

export default function Home() {
  const [mounted, setMounted] = useState(false)

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
    </main>
  )
}
