'use client'

/**
 * SECTION MARKETING HERO - Agent Vocal Interactif
 * 
 * CONCEPT : Section marketing impressionnante avec agent vocal
 * - Agent animé qui parle et écoute
 * - Reconnaissance vocale en temps réel
 * - Synthèse vocale pour les réponses
 * - Design "wow" pour attirer les clients
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, Star, Zap, TrendingUp, Users, Award } from 'lucide-react'

interface Message {
  id: number
  text: string
  type: 'user' | 'agent'
  timestamp: Date
}

export default function MarketingHero() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [agentText, setAgentText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialiser la synthèse vocale
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    // Initialiser la reconnaissance vocale
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = 'fr-FR'

        recognitionInstance.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          setAgentText(transcript)
        }

        recognitionInstance.onerror = (event: any) => {
          console.error('Erreur de reconnaissance:', event.error)
        }

        setRecognition(recognitionInstance)
      }
    }

    // Message de bienvenue
    const welcomeMessage: Message = {
      id: 1,
      text: "Bonjour ! Je suis votre assistant vocal. Parlez-moi de vos besoins et je vous présenterai mes solutions.",
      type: 'agent',
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    speakText(welcomeMessage.text)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakText = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognition) {
      setIsListening(true)
      setAgentText('')
      recognition.start()
    } else {
      alert('La reconnaissance vocale n\'est pas disponible dans votre navigateur.')
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
      
      if (agentText.trim()) {
        const userMessage: Message = {
          id: Date.now(),
          text: agentText,
          type: 'user',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        
        // Générer une réponse
        setTimeout(() => {
          const response = generateResponse(agentText)
          const agentMessage: Message = {
            id: Date.now() + 1,
            text: response,
            type: 'agent',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, agentMessage])
          speakText(response)
        }, 500)
      }
      
      setAgentText('')
    }
  }

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase()
    
    if (lowerInput.includes('expérience') || lowerInput.includes('expérience')) {
      return "J'ai une expérience solide avec Agentforce chez Levio, WordPress pour Gama Outillage, et le développement full stack pour Tawssil Food Delivery. Je peux vous présenter mes réalisations en détail."
    }
    if (lowerInput.includes('compétence') || lowerInput.includes('compétences') || lowerInput.includes('savoir')) {
      return "Mes compétences incluent Agentforce, Salesforce, WordPress, React, Node.js, et bien d'autres technologies. Consultez la section Skills pour plus de détails."
    }
    if (lowerInput.includes('projet') || lowerInput.includes('réalisations')) {
      return "J'ai développé plusieurs projets majeurs : une plateforme e-commerce pour Gama Outillage, une application de livraison pour Tawssil, et des solutions Agentforce complexes. Voulez-vous en savoir plus sur un projet spécifique ?"
    }
    if (lowerInput.includes('prix') || lowerInput.includes('tarif') || lowerInput.includes('coût')) {
      return "Je serais ravi de discuter de votre projet et de vous proposer une solution adaptée à vos besoins. Contactez-moi via le formulaire pour un devis personnalisé."
    }
    if (lowerInput.includes('contact') || lowerInput.includes('joindre') || lowerInput.includes('contacter')) {
      return "Vous pouvez me contacter via le formulaire de contact en bas de la page, ou directement par email. Je réponds généralement dans les 24 heures."
    }
    if (lowerInput.includes('disponible') || lowerInput.includes('disponibilité')) {
      return "Je suis disponible pour de nouveaux projets. N'hésitez pas à me contacter pour discuter de vos besoins."
    }
    
    return "Merci pour votre question. Je peux vous aider avec des informations sur mes expériences, compétences, projets, ou comment me contacter. Que souhaitez-vous savoir ?"
  }

  const stats = [
    { icon: Users, value: '50+', label: 'Clients Satisfaits', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
    { icon: Award, value: '100+', label: 'Projets Livrés', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80' },
    { icon: TrendingUp, value: '98%', label: 'Taux de Satisfaction', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80' },
    { icon: Zap, value: '24/7', label: 'Support Disponible', image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80' },
  ]

  return (
    <section id="marketing" className="min-h-screen section-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="text-blue-400" size={20} />
            <span className="text-blue-300 text-sm font-semibold">Agent Vocal Interactif</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Parlez avec Moi</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Découvrez mes solutions grâce à notre agent vocal intelligent. 
            <span className="text-blue-600 font-semibold"> Parlez naturellement</span> et obtenez des réponses instantanées.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Agent Vocal Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200"
          >
            {/* Agent Avatar */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="relative w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4"
                animate={{
                  scale: isListening ? [1, 1.1, 1] : isSpeaking ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 1.5, repeat: isListening || isSpeaking ? Infinity : 0 }}
              >
                <Mic className="text-white" size={48} />
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-400"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {isSpeaking && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Volume2 className="text-green-400" size={24} />
                  </motion.div>
                )}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Assistant Vocal</h3>
              <p className="text-gray-600 text-sm">
                {isListening ? '🎤 J\'écoute...' : isSpeaking ? '🔊 Je parle...' : '👋 Prêt à discuter'}
              </p>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto mb-6 space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Mic size={16} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 text-xs">👤</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {agentText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 text-sm italic"
                >
                  {agentText}...
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <motion.button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? (
                  <>
                    <MicOff size={20} />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    Parler
                  </>
                )}
              </motion.button>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="text-gray-600 text-sm mb-3 font-medium">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {['Vos expériences', 'Vos compétences', 'Vos projets', 'Comment vous contacter'].map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      const response = generateResponse(suggestion)
                      const agentMessage: Message = {
                        id: Date.now(),
                        text: response,
                        type: 'agent',
                        timestamp: new Date(),
                      }
                      setMessages((prev) => [...prev, agentMessage])
                      speakText(response)
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs transition-colors border border-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats & Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative group"
                  >
                    {/* Image de fond */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                      <img
                        src={stat.image}
                        alt={stat.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="relative z-10 p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Features */}
            <div className="bg-white backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Pourquoi Choisir Mes Services ?</h3>
              <div className="space-y-4">
                {[
                  '✅ Solutions sur mesure adaptées à vos besoins',
                  '✅ Technologies modernes et performantes',
                  '✅ Support continu et maintenance',
                  '✅ Respect des délais et du budget',
                  '✅ Code propre et maintenable',
                  '✅ Expérience utilisateur optimale',
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="text-gray-700 flex items-center gap-3"
                  >
                    <span className="text-green-600">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Prêt à Démarrer ?</h3>
              <p className="text-blue-100 mb-6">
                Discutons de votre projet et créons ensemble une solution qui dépasse vos attentes.
              </p>
              <motion.a
                href="#contact"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contactez-moi Maintenant
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

