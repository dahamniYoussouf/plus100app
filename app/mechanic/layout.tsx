import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Mécanique Auto | Système de Gestion',
  description: 'Gestion complète d\'atelier mécanique',
}

export default function MechanicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


