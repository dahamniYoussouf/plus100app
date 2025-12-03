import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion de Voyage | Application Interactive pour Agence',
  description: 'Application complète de gestion de circuits et réservations pour agence de voyage',
}

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}




