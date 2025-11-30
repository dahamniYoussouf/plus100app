'use client'

/**
 * SOLUTIONS INTERACTIVES - Schémas visuels de solutions
 * 
 * CONCEPT : Visualisation interactive des solutions développées
 * - Schémas animés qui montrent l'architecture des projets
 * - Interactions au hover pour révéler des détails
 * - Animations fluides pour expliquer les flux
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Database, Cloud, Smartphone, Globe, Zap, Shield, Code, Server } from 'lucide-react'

const solutions = [
  {
    title: 'Gama Outillage E-commerce',
    description: 'Plateforme e-commerce WordPress avec WooCommerce',
    icon: Globe,
    color: 'from-green-500 to-teal-500',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    architecture: [
      { name: 'Frontend WordPress', icon: Globe, position: 'top' },
      { name: 'WooCommerce', icon: Database, position: 'right' },
      { name: 'Payment Gateway', icon: Shield, position: 'bottom' },
      { name: 'Delivery System', icon: Smartphone, position: 'left' },
    ],
    flow: [
      'Client visite le site',
      'Sélectionne des produits',
      'Passe commande',
      'Paiement sécurisé',
      'Livraison dans 58 wilayas',
    ],
  },
  {
    title: 'Tawssil Food Delivery',
    description: 'Application de livraison de nourriture full stack',
    icon: Smartphone,
    color: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    screenshot: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    architecture: [
      { name: 'Mobile App', icon: Smartphone, position: 'top' },
      { name: 'API Backend', icon: Server, position: 'right' },
      { name: 'Real-time Tracking', icon: Zap, position: 'bottom' },
      { name: 'Payment System', icon: Shield, position: 'left' },
    ],
    flow: [
      'Utilisateur commande',
      'Restaurant reçoit',
      'Préparation',
      'Livraison assignée',
      'Suivi en temps réel',
      'Livraison complétée',
    ],
  },
  {
    title: 'Agentforce Solutions',
    description: 'Applications Agentforce avec workflow automatisé',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    architecture: [
      { name: 'Agentforce Platform', icon: Cloud, position: 'top' },
      { name: 'Workflow Engine', icon: Zap, position: 'right' },
      { name: 'API Integration', icon: Server, position: 'bottom' },
      { name: 'Dashboard', icon: Database, position: 'left' },
    ],
    flow: [
      'Déclenchement workflow',
      'Traitement automatique',
      'Intégration API',
      'Notification utilisateur',
      'Rapport généré',
    ],
  },
]

export default function Solutions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  return (
    <section id="solutions" ref={ref} className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Solutions Interactives</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez l'architecture et le flux de mes solutions développées
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            const isSelected = selectedSolution === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
                onClick={() => setSelectedSolution(isSelected ? null : index)}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${solution.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{solution.title}</h3>
                <p className="text-gray-400 mb-6">{solution.description}</p>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 space-y-6"
                  >
                    {/* Screenshot du projet */}
                    {(solution as any).screenshot && (
                      <div className="mb-6 rounded-xl overflow-hidden">
                        <img
                          src={(solution as any).screenshot}
                          alt={`${solution.title} screenshot`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Architecture Diagram */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Architecture</h4>
                      <div className="relative h-64 bg-gray-900/50 rounded-lg p-4">
                        {/* Center Node */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <motion.div
                            className={`w-16 h-16 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center shadow-lg`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon className="text-white" size={24} />
                          </motion.div>
                        </div>

                        {/* Architecture Nodes */}
                        {solution.architecture.map((node, nodeIndex) => {
                          const NodeIcon = node.icon
                          const isHovered = hoveredNode === `${index}-${nodeIndex}`
                          const positions: Record<string, { top: string; left: string }> = {
                            top: { top: '10%', left: '50%' },
                            right: { top: '50%', left: '90%' },
                            bottom: { top: '90%', left: '50%' },
                            left: { top: '50%', left: '10%' },
                          }

                          return (
                            <motion.div
                              key={nodeIndex}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2"
                              style={positions[node.position]}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: nodeIndex * 0.1 }}
                              onMouseEnter={() => setHoveredNode(`${index}-${nodeIndex}`)}
                              onMouseLeave={() => setHoveredNode(null)}
                            >
                              <motion.div
                                className={`w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center cursor-pointer ${
                                  isHovered ? 'bg-gradient-to-r ' + solution.color : ''
                                } transition-all`}
                                whileHover={{ scale: 1.2 }}
                              >
                                <NodeIcon className="text-white" size={20} />
                              </motion.div>
                              <motion.div
                                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                              >
                                <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded">
                                  {node.name}
                                </span>
                              </motion.div>
                              {/* Connection Line */}
                              <svg
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ width: '100%', height: '100%' }}
                              >
                                <motion.line
                                  x1="50%"
                                  y1="50%"
                                  x2={node.position === 'top' || node.position === 'bottom' ? '50%' : node.position === 'right' ? '90%' : '10%'}
                                  y2={node.position === 'top' ? '10%' : node.position === 'bottom' ? '90%' : '50%'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeDasharray="5,5"
                                  className="text-gray-600"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 1, delay: nodeIndex * 0.1 }}
                                />
                              </svg>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Flow Steps */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Flux de Processus</h4>
                      <div className="space-y-3">
                        {solution.flow.map((step, stepIndex) => (
                          <motion.div
                            key={stepIndex}
                            className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
                          >
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${solution.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                              {stepIndex + 1}
                            </div>
                            <span className="text-gray-300">{step}</span>
                            {stepIndex < solution.flow.length - 1 && (
                              <motion.div
                                className="ml-auto text-gray-600"
                                animate={{ y: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity, delay: stepIndex * 0.2 }}
                              >
                                ↓
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isSelected && (
                  <motion.button
                    className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    Cliquez pour voir les détails →
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

