import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Enfants | Système de Gestion',
  description: 'Gestion complète des enfants avec activités',
}

export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


