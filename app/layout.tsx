import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dahamni Youssouf | Portfolio - Full Stack Developer',
  description: 'Portfolio professionnel de Dahamni Youssouf - Développeur Full Stack spécialisé en Agentforce, Salesforce, WordPress et développement web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}


