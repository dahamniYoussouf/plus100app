import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion École & Parents | Système de Gestion Scolaire',
  description: 'Système complet de gestion scolaire avec étudiants, parents et classes',
}

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}




