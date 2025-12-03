import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Restaurant POS System | Point of Sale Management',
  description: 'Complete POS system for restaurant management - Menu, Orders, Tables, and Checkout',
}

export default function POSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}



