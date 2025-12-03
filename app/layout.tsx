import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APP | Portfolio - Applications Web',
  description: 'Portfolio professionnel de APP - Développeur Full Stack spécialisé en Agentforce, Salesforce, WordPress et développement web. Collection complète d\'applications web interactives et fonctionnelles.',
  openGraph: {
    title: 'APP | Portfolio - Applications Web',
    description: 'Portfolio professionnel de APP - Développeur Full Stack spécialisé en Agentforce, Salesforce, WordPress et développement web',
    url: 'https://your-domain.com',
    siteName: 'APP Portfolio',
    images: [
      {
        url: '/images/logo .png',
        width: 1200,
        height: 630,
        alt: 'APP Portfolio - Applications Web',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'APP | Portfolio - Applications Web',
    description: 'Portfolio professionnel de APP - Développeur Full Stack spécialisé en Agentforce, Salesforce, WordPress et développement web',
    images: ['/images/logo .png'],
  },
  metadataBase: new URL('https://your-domain.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}


