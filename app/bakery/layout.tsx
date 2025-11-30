import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Pâtisserie | Système de Gestion pour Pâtisserie',
  description: 'Système complet de gestion pour pâtisserie avec produits et commandes',
}

export default function BakeryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

