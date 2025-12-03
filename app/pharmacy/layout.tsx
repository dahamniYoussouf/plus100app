import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Pharmacie | Système de Gestion',
  description: 'Gestion complète de pharmacie avec médicaments et ordonnances',
}

export default function PharmacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}



