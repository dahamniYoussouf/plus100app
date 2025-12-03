import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion Quincaillerie | Système de Gestion',
  description: 'Gestion complète de quincaillerie avec inventaire et ventes',
}

export default function HardwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}




