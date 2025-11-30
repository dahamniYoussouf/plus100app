'use client'

/**
 * SECTION TÉMOIGNAGES - Recommandations interactives
 * 
 * CONCEPT : Section où les visiteurs peuvent laisser des témoignages
 * - Carrousel de témoignages existants
 * - Formulaire pour ajouter un nouveau témoignage
 * - Animations et interactions fluides
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Star, Quote, User, ChevronLeft, ChevronRight, Send } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  message: string
  rating: number
  date: string
}

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Client Gama Outillage',
    role: 'Directeur',
    company: 'Gama Outillage',
    message: 'Excellent travail sur notre plateforme e-commerce. Le développeur a su comprendre nos besoins et livrer une solution robuste et performante.',
    rating: 5,
    date: '2023',
  },
  {
    id: 2,
    name: 'Équipe Tawssil',
    role: 'Product Manager',
    company: 'Tawssil Food Delivery',
    message: 'Développement professionnel de notre application de livraison. Code propre, respect des délais, et excellente communication tout au long du projet.',
    rating: 5,
    date: '2022',
  },
  {
    id: 3,
    name: 'Manager Levio',
    role: 'Tech Lead',
    company: 'Levio',
    message: 'Expert en Agentforce avec une compréhension approfondie des workflows complexes. Toujours prêt à relever de nouveaux défis techniques.',
    rating: 5,
    date: '2024',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
  })

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      ...formData,
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }),
    }
    setTestimonials([...testimonials, newTestimonial])
    setFormData({ name: '', role: '', company: '', message: '', rating: 5 })
    setShowForm(false)
    alert('Merci pour votre témoignage !')
  }

  return (
    <section id="testimonials" ref={ref} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Témoignages & Recommandations</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez ce que disent les clients et collègues. Ajoutez votre propre témoignage !
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200"
                  >
                    <Quote className="text-blue-500 mb-4" size={40} />
                    <p className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                      "{testimonial.message}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <User className="text-white" size={24} />
                          </div>
                          <div>
                            <h4 className="text-gray-800 font-semibold text-lg">{testimonial.name}</h4>
                            <p className="text-gray-600 text-sm">
                              {testimonial.role} - {testimonial.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-16">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`${
                                i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                              }`}
                              size={16}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-600 text-sm">{testimonial.date}</span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-300 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Add Testimonial Button */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ajouter un Témoignage
            </motion.button>
          </motion.div>
        )}

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Partagez votre expérience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Votre nom *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Votre rôle *"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Entreprise"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <div>
                  <label className="text-gray-700 mb-2 block font-medium">Note (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className={`${
                          formData.rating >= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        } transition-colors`}
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Votre message *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={20} />
                  Envoyer
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', role: '', company: '', message: '', rating: 5 })
                  }}
                  className="px-6 py-3 border-2 border-gray-600 rounded-lg font-semibold hover:border-gray-400 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}

