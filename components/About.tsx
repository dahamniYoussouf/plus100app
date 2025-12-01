'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 overflow-hidden relative">
            {/* Image de fond */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
                alt="Development"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Je suis <span className="text-blue-600 font-semibold text-xl">APP</span>, un{' '}
              <span className="text-blue-600 font-semibold">Développeur Full Stack</span> passionné avec une
              expérience approfondie dans le développement d'applications web scalables et de solutions sur mesure.
              Mon expertise s'étend sur plusieurs plateformes et technologies, me permettant de livrer des solutions
              complètes qui répondent aux exigences métier complexes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Avec une solide base en <span className="text-purple-600 font-semibold">Salesforce</span> et{' '}
              <span className="text-pink-600 font-semibold">Agentforce</span> chez <span className="text-blue-600 font-semibold">Levio</span>, je me spécialise dans la création
              d'applications personnalisées et d'intégrations qui optimisent les processus métier. Mon expérience avec{' '}
              <span className="text-green-600 font-semibold">WordPress</span> inclut le développement de la plateforme e-commerce pour{' '}
              <a href="https://gamaoutillage.net/" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:text-green-700 underline">
                Gama Outillage
              </a>, un fournisseur d'outillage leader en Algérie.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              J'ai également travaillé sur <span className="text-orange-600 font-semibold">Tawssil Food Delivery</span>, construisant une plateforme de livraison de nourriture complète depuis zéro. Je suis dédié à écrire du code propre et maintenable, et à rester à jour avec les dernières tendances et meilleures pratiques de l'industrie. Que ce soit le développement front-end, l'architecture back-end, ou les intégrations cloud, j'apporte une approche holistique à chaque projet.
            </p>
              </div>
              
              {/* Images de projets */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative h-32 rounded-lg overflow-hidden border-2 border-blue-500/30"
                >
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
                    alt="Web Development"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-semibold">Web Development</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative h-32 rounded-lg overflow-hidden border-2 border-purple-500/30"
                >
                  <img
                    src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80"
                    alt="Mobile App"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-semibold">Mobile Apps</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative h-32 rounded-lg overflow-hidden border-2 border-green-500/30"
                >
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80"
                    alt="E-commerce"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-semibold">E-commerce</span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="relative h-32 rounded-lg overflow-hidden border-2 border-orange-500/30"
                >
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80"
                    alt="Cloud Services"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-semibold">Cloud & API</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

