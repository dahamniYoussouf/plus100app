import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Mamans | Système de Gestion',
  description: 'Support complet pour mamans',
}

export default function MomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}




