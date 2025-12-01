'use client'

/**
 * SECTION ESTIMATION ET ACCOMPAGNEMENT PERSONNALISÉ
 * 
 * CONCEPT : Calculateur d'estimation de prix et stratégies d'accompagnement
 * - Calculateur interactif pour estimer le coût d'un projet
 * - Stratégies d'accompagnement personnalisé
 * - Options de services avec prix
 * - Formulaire de demande de devis
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Calculator, Target, Users, Zap, CheckCircle, Send, TrendingUp, Clock, Award } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface ServiceOption {
  id: string
  name: string
  description: string
  basePrice: number
  icon: React.ReactNode
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Page d\'atterrissage optimisée pour conversions',
    basePrice: 500,
    icon: <Target size={24} />,
  },
  {
    id: 'website',
    name: 'Site Web Complet',
    description: 'Site multi-pages avec design personnalisé',
    basePrice: 1500,
    icon: <Zap size={24} />,
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Boutique en ligne avec gestion produits',
    basePrice: 3000,
    icon: <TrendingUp size={24} />,
  },
  {
    id: 'webapp',
    name: 'Application Web',
    description: 'Application web complexe avec backend',
    basePrice: 5000,
    icon: <Users size={24} />,
  },
]

const features = [
  { name: 'Design Responsive', price: 200 },
  { name: 'SEO Optimisé', price: 300 },
  { name: 'Intégration CMS', price: 400 },
  { name: 'E-commerce (WooCommerce)', price: 800 },
  { name: 'Système de paiement', price: 500 },
  { name: 'Multi-langue', price: 400 },
  { name: 'Blog intégré', price: 300 },
  { name: 'Formulaires avancés', price: 250 },
  { name: 'Intégration API tierce', price: 600 },
  { name: 'Dashboard Admin', price: 700 },
  { name: 'Application Mobile', price: 2000 },
  { name: 'Maintenance mensuelle', price: 150 },
]

const strategies = [
  {
    title: 'Analyse et Conception',
    description: 'Étude approfondie de vos besoins et conception d\'une stratégie sur mesure',
    steps: ['Audit de votre présence actuelle', 'Analyse de la concurrence', 'Définition des objectifs', 'Conception de l\'architecture'],
    icon: <Target size={32} />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Développement Agile',
    description: 'Méthodologie agile pour un développement itératif et transparent',
    steps: ['Sprints de développement', 'Tests continus', 'Déploiements progressifs', 'Feedback régulier'],
    icon: <Zap size={32} />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Optimisation et Performance',
    description: 'Optimisation continue pour des performances maximales',
    steps: ['Optimisation SEO', 'Performance web', 'Sécurité renforcée', 'Tests de charge'],
    icon: <TrendingUp size={32} />,
    color: 'from-green-500 to-teal-500',
  },
  {
    title: 'Accompagnement Post-Lancement',
    description: 'Support continu et évolution de votre projet',
    steps: ['Formation équipe', 'Support technique', 'Mises à jour régulières', 'Évolutions futures'],
    icon: <Users size={32} />,
    color: 'from-orange-500 to-red-500',
  },
]

export default function EstimationService() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedService, setSelectedService] = useState<string>('website')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  const calculatePrice = () => {
    const service = serviceOptions.find(s => s.id === selectedService)
    if (!service) return 0

    let total = service.basePrice
    selectedFeatures.forEach(featureId => {
      const feature = features.find(f => f.name === featureId)
      if (feature) total += feature.price
    })

    return total
  }

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    )
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Merci ${formData.name} ! Votre demande de devis a été envoyée. Je vous contacterai bientôt.`)
    setFormData({ name: '', email: '', company: '', message: '' })
  }

  return (
    <section id="estimation" ref={ref} className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <Calculator className="text-blue-600" size={64} />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Estimation & Accompagnement Personnalisé
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto">
            Obtenez une estimation personnalisée et découvrez notre stratégie d'accompagnement sur mesure
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculateur d'Estimation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Calculator className="text-blue-600" size={28} />
              Calculateur d'Estimation
            </h3>

            {/* Type de Service */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">Type de Projet</label>
              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <motion.button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedService === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${selectedService === service.id ? 'text-blue-600' : 'text-gray-400'}`}>
                        {service.icon}
                      </div>
                      <span className={`font-bold ${selectedService === service.id ? 'text-blue-600' : 'text-gray-700'}`}>
                        {service.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <p className="text-xs text-gray-500 mt-2">À partir de {formatCurrency(service.basePrice)}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">Fonctionnalités Additionnelles</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {features.map((feature) => (
                  <motion.button
                    key={feature.name}
                    onClick={() => toggleFeature(feature.name)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                      selectedFeatures.includes(feature.name)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      {selectedFeatures.includes(feature.name) ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={`${selectedFeatures.includes(feature.name) ? 'text-green-700 font-semibold' : 'text-gray-700'}`}>
                        {feature.name}
                      </span>
                    </div>
                    <span className="text-gray-600 font-medium">+{formatCurrency(feature.price)}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Estimation Totale */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Estimation Totale</span>
                <span className="text-3xl font-bold">{formatCurrency(calculatePrice())}</span>
              </div>
              <p className="text-sm text-blue-100">
                * Estimation indicative, prix final selon spécifications détaillées
              </p>
            </motion.div>
          </motion.div>

          {/* Stratégies d'Accompagnement */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Award className="text-purple-600" size={28} />
                Stratégies d'Accompagnement
              </h3>
              <p className="text-gray-600 mb-6">
                Un accompagnement personnalisé à chaque étape de votre projet pour garantir le succès
              </p>
            </div>

            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${strategy.color} flex items-center justify-center text-white flex-shrink-0`}>
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{strategy.title}</h4>
                    <p className="text-gray-600 mb-4">{strategy.description}</p>
                    <ul className="space-y-2">
                      {strategy.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Formulaire de Devis */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Demandez un Devis Personnalisé
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nom complet</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Entreprise</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de l'entreprise"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Estimation calculée</label>
              <input
                type="text"
                value={`${calculatePrice().toLocaleString('fr-DZ')} د.ج`}
                readOnly
                className="w-full px-4 py-3 bg-blue-50 border border-blue-300 rounded-lg text-blue-700 font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Détails du projet</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Décrivez votre projet, vos besoins spécifiques, vos objectifs..."
              />
            </div>
            <motion.button
              type="submit"
              className="md:col-span-2 px-8 py-4 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send size={20} />
              Envoyer la Demande de Devis
            </motion.button>
          </form>
        </motion.div>

        {/* Avantages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: <Clock size={32} />, title: 'Livraison Rapide', desc: 'Respect des délais' },
            { icon: <Award size={32} />, title: 'Qualité Garantie', desc: 'Code propre et maintenable' },
            { icon: <Users size={32} />, title: 'Support Continu', desc: 'Accompagnement personnalisé' },
            { icon: <TrendingUp size={32} />, title: 'Évolutif', desc: 'Croissance avec votre projet' },
          ].map((advantage, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-200"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-blue-600 mb-4 flex justify-center">{advantage.icon}</div>
              <h4 className="font-bold text-gray-800 mb-2">{advantage.title}</h4>
              <p className="text-sm text-gray-600">{advantage.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

