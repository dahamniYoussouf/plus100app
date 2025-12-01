'use client'

/**
 * BOUTON TÉLÉCHARGEMENT CV
 * 
 * CONCEPT : Bouton pour télécharger le CV
 * - Visible sur mobile et desktop
 * - Animation attractive
 * - Génère un PDF du CV depuis les données
 */

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { useState } from 'react'

export default function DownloadCV() {
  const [isDownloading, setIsDownloading] = useState(false)

  const generateCV = () => {
    setIsDownloading(true)
    
    // Simuler la génération du CV
    // En production, vous pouvez utiliser une bibliothèque comme jsPDF ou html2pdf
    setTimeout(() => {
      // Créer un CV simple en format texte/HTML
      const cvContent = `
CV - APP
Développeur Full Stack

EXPÉRIENCE PROFESSIONNELLE

Agentforce Developer - Levio (2022 - Présent)
• Développement d'applications Agentforce personnalisées
• Automatisation de workflows avancés
• Intégration d'APIs et architecture microservices
• Collaboration avec équipes cross-fonctionnelles

Salesforce Developer (2021 - 2023)
• Personnalisation Salesforce avec Apex et LWC
• Automatisation de processus métier
• Intégrations tierces avec REST/SOAP APIs
• Migration de données et processus ETL

WordPress Developer - Gama Outillage (2020 - 2022)
• Développement plateforme e-commerce WordPress/WooCommerce
• Gestion catalogue multi-marques (Bosch, Makita, Toptul, etc.)
• Optimisation performance et SEO
• Livraison dans 58 wilayas (Algérie)

  - Tawssil Food Delivery (2019 - 2021)
• Application de livraison de nourriture complète
• APIs RESTful et GraphQL
• Suivi en temps réel des commandes
• Dashboard admin pour gestion restaurants

COMPÉTENCES TECHNIQUES
• Platforms: Agentforce, Salesforce, WordPress
• Frontend: React, Next.js, TypeScript, JavaScript
• Backend: Node.js, PHP, Python
• Databases: MySQL, PostgreSQL
• Cloud: AWS, Azure
• Tools: Git, Docker, CI/CD

PROJETS PRINCIPAUX
• Gama Outillage (gamaoutillage.net) - E-commerce WordPress
• Tawssil Food Delivery - Application Full Stack
• Solutions Agentforce - Automatisation workflows

CONTACT
Email: dahamni.youssouf@example.com
LinkedIn: linkedin.com/in/dahamni-youssouf
GitHub: github.com/dahamni-youssouf
      `.trim()

      // Créer un blob et télécharger
      const blob = new Blob([cvContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'CV-Full-Stack-Developer.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsDownloading(false)
    }, 1500)
  }

  return (
    <motion.button
      onClick={generateCV}
      disabled={isDownloading}
      className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 font-semibold border-2 border-white"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
    >
      {isDownloading ? (
        <>
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="hidden sm:inline">Génération...</span>
        </>
      ) : (
        <>
          <Download size={20} />
          <span className="hidden sm:inline">Télécharger CV</span>
          <span className="sm:hidden">CV</span>
        </>
      )}
    </motion.button>
  )
}

