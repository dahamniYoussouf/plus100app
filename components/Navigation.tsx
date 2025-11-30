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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#home"
            className="text-2xl font-bold text-gradient"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Portfolio
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isRoute = item.href.startsWith('/')
              
              if (isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition-colors relative font-medium"
                  >
                    {item.name}
                  </Link>
                )
              }
              
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors relative font-medium"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            {navItems.map((item) => {
              const isRoute = item.href.startsWith('/')
              
              if (isRoute) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              }
              
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}


