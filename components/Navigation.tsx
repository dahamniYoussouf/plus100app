'use client'

/**
 * NAVIGATION - Barre de navigation fixe
 * 
 * CONCEPT : Navigation toujours visible pour faciliter l'accès aux sections
 * - Fixe en haut de page (position: fixed)
 * - Change d'apparence au scroll (transparent → opaque avec blur)
 * - Menu mobile responsive avec animation
 * - Smooth scroll vers les sections
 * - Underline animé au survol des liens
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSwitcher from './LanguageSwitcher'

// Items de navigation - Facilement modifiable
const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'Games', href: '#games-slider' },
  { name: 'Game', href: '#game' },
  { name: 'Marketing', href: '#marketing' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Solutions', href: '#solutions' },
  { name: 'Skills', href: '#skills' },
  { name: 'Estimation', href: '#estimation' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
  { name: 'Créer Agent', href: '/create-agent' },
]

export default function Navigation() {
  // État pour détecter si on a scrollé (change le style de la nav)
  const [isScrolled, setIsScrolled] = useState(false)
  // État pour le menu mobile (ouvert/fermé)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Écoute le scroll pour changer l'apparence de la nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)  // Si scroll > 50px, nav devient opaque
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300  DZD{
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo .png"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}


