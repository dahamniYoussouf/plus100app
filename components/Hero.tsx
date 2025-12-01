'use client'

/**
 * HERO SECTION - Première impression visuelle
 * 
 * CONCEPT : Section pleine hauteur qui accueille le visiteur avec un impact visuel fort
 * - Fond avec gradient animé et pattern de grille subtil pour la profondeur
 * - Titre avec effet gradient pour attirer l'attention
 * - Mise en avant des technologies clés (Agentforce, Salesforce, WordPress)
 * - Boutons d'action pour guider l'utilisateur vers les sections importantes
 * - Flèche animée qui bouge pour indiquer qu'on peut scroller
 */

import { motion } from 'framer-motion'
import { ChevronDown, Download } from 'lucide-react'

export default function Hero() {
  // Fonction pour scroller de manière fluide vers une section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden section-padding">
      {/* 
        FOND ANIMÉ - Crée une ambiance moderne
        - Gradient bleu-violet-rose pour un effet dynamique
        - Pattern de grille CSS pour ajouter de la texture sans image
        - Opacité réduite pour ne pas distraire du contenu
        - Images de fond réelles
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50" />
      
      {/* Images de fond réelles */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80" 
          alt="Code background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* CONTENU PRINCIPAL - Centré verticalement et horizontalement */}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Photo de profil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
              alt="APP"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent" />
          </div>
        </motion.div>
        {/* 
          ANIMATION EN CASCADE - Chaque élément apparaît progressivement
          - initial: état de départ (invisible, légèrement en bas)
          - animate: état final (visible, position normale)
          - transition: durée et délai pour créer un effet de cascade
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* TITRE PRINCIPAL - Le plus important visuellement */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* text-gradient: classe custom qui applique un gradient coloré au texte */}
            <span className="text-gradient">APP</span>
          </motion.h1>
          
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Développeur Full Stack
          </motion.h2>

          {/* DESCRIPTION - Mise en avant des technologies avec couleurs différentes */}
          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Spécialisé en <span className="text-blue-600 font-semibold">Agentforce</span>,{' '}
            <span className="text-purple-600 font-semibold">Salesforce</span>,{' '}
            <span className="text-pink-600 font-semibold">WordPress</span>, et{' '}
            <span className="text-gradient font-semibold">Développement Full Stack</span>
          </motion.p>

          {/* BOUTONS D'ACTION - Deux styles différents pour hiérarchiser */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* BOUTON PRIMAIRE - Gradient coloré, action principale (Contact) */}
            <motion.button
              onClick={() => scrollToSection('#contact')}
              className="px-8 py-3 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              whileHover={{ scale: 1.05 }}  // Agrandit au survol
              whileTap={{ scale: 0.95 }}     // Rétrécit au clic (feedback tactile)
            >
              Get In Touch
            </motion.button>
            {/* BOUTON SECONDAIRE - Bordure, action secondaire (Expérience) */}
            <motion.button
              onClick={() => scrollToSection('#solutions')}
              className="px-8 py-3 border-2 border-gray-600 rounded-lg font-semibold hover:border-gray-400 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} />
              Voir les Solutions
            </motion.button>
          </motion.div>
        </motion.div>

        {/* FLÈCHE ANIMÉE - Indicateur visuel pour encourager le scroll */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.button
            onClick={() => scrollToSection('#about')}
            animate={{ y: [0, 10, 0] }}  // Animation infinie : monte et descend
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600 hover:text-gray-800"
          >
            <ChevronDown size={32} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

