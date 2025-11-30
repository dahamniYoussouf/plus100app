import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Hôtel | Système de Gestion Hôtelière',
  description: 'Système complet de gestion hôtelière avec chambres et réservations',
}

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

