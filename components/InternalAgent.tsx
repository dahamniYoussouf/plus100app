'use client'

/**
 * AGENT INTERNE - Interface Divisée en 2 Parties
 * 
 * CONCEPT : Agent avec chat et affichage de résultats via robot
 * - Panneau gauche : Discussion/Chat
 * - Panneau droit : Robot avec affichage de résultats
 * - Communication bidirectionnelle
 * - Animations du robot selon les résultats
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Minimize2, Maximize2, MessageSquare, Monitor, Star, Zap, Briefcase, CheckCircle, Clock, Search, ExternalLink, TrendingUp, MapPin, DollarSign } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
  result?: any
}

interface AgentResult {
  type: 'text' | 'chart' | 'list' | 'code' | 'image' | 'jobs' | 'applications'
  data: any
  title?: string
}

interface JobOffer {
  id: number | string
  title: string
  company: string
  location: string
  salary: string
  type: string
  match: number
  description: string
  requirements: string[]
  link: string
  status?: 'pending' | 'applied' | 'rejected' | 'interview'
  appliedAt?: Date
}

export default function InternalAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [currentResult, setCurrentResult] = useState<AgentResult | null>(null)
  const [robotState, setRobotState] = useState<'idle' | 'thinking' | 'speaking' | 'displaying' | 'searching' | 'applying'>('idle')
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([])
  const [applications, setApplications] = useState<JobOffer[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [searchLocation, setSearchLocation] = useState('')
  const [searchSource, setSearchSource] = useState<'real' | 'all'>('real')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Recherche RÉELLE d'offres d'emploi via API
  const searchJobOffers = async (keywords: string = '', location: string = ''): Promise<JobOffer[]> => {
    try {
      const params = new URLSearchParams()
      if (keywords) params.append('keywords', keywords)
      if (location) params.append('location', location)
      params.append('source', 'all') // Recherche multi-sources

      const response = await fetch(`/api/jobs?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche')
      }

      const data = await response.json()
      return data.jobs || []
    } catch (error) {
      console.error('Erreur recherche offres:', error)
      
      // Fallback vers offres de démonstration
      const fallbackJobs: JobOffer[] = [
      {
        id: 1,
        title: 'Développeur Agentforce Senior',
        company: 'Levio',
        location: 'Montréal, QC / Remote',
        salary: '80k - 120k CAD',
        type: 'Temps plein',
        match: 98,
        description: 'Recherche développeur Agentforce expérimenté pour projets de transformation digitale.',
        requirements: ['Agentforce', 'JavaScript', 'React', 'API Integration', '5+ ans'],
        link: 'https://levio.ca/careers',
      },
      {
        id: 2,
        title: 'Salesforce Developer',
        company: 'TechCorp',
        location: 'Paris, France / Remote',
        salary: '60k - 90k EUR',
        type: 'Temps plein',
        match: 92,
        description: 'Développeur Salesforce pour automatisation de processus métier.',
        requirements: ['Salesforce', 'Apex', 'LWC', 'REST API', '3+ ans'],
        link: 'https://techcorp.com/jobs',
      },
      {
        id: 3,
        title: '  (React/Node.js)',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '70k - 100k USD',
        type: 'Temps plein',
        match: 95,
        description: 'Développeur full stack pour application web moderne.',
        requirements: ['React', 'Next.js', 'Node.js', 'TypeScript', '4+ ans'],
        link: 'https://startupxyz.com/careers',
      },
      {
        id: 4,
        title: 'WordPress Developer E-commerce',
        company: 'EcomSolutions',
        location: 'Remote',
        salary: '50k - 75k EUR',
        type: 'Temps plein',
        match: 90,
        description: 'Développeur WordPress/WooCommerce pour plateformes e-commerce.',
        requirements: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', '3+ ans'],
        link: 'https://ecomsolutions.com/jobs',
      },
      {
        id: 5,
        title: 'Agentforce Consultant',
        company: 'DigitalTransformation Inc',
        location: 'Toronto, ON / Remote',
        salary: '85k - 130k CAD',
        type: 'Temps plein',
        match: 96,
        description: 'Consultant Agentforce pour projets d\'automatisation avancés.',
        requirements: ['Agentforce', 'Workflow Automation', 'API', 'Consulting', '5+ ans'],
        link: 'https://digitaltrans.com/careers',
      },
      {
        id: 6,
        title: 'Senior Full Stack Engineer',
        company: 'TechInnovate',
        location: 'San Francisco, CA / Remote',
        salary: '120k - 180k USD',
        type: 'Temps plein',
        match: 93,
        description: 'Ingénieur full stack senior pour plateforme SaaS.',
        requirements: ['React', 'Node.js', 'TypeScript', 'AWS', '6+ ans'],
        link: 'https://techinnovate.com/jobs',
      },
      {
        id: 7,
        title: 'Salesforce Architect',
        company: 'CloudSolutions',
        location: 'Remote',
        salary: '100k - 150k USD',
        type: 'Temps plein',
        match: 88,
        description: 'Architecte Salesforce pour solutions enterprise.',
        requirements: ['Salesforce', 'Architecture', 'Integration', '8+ ans'],
        link: 'https://cloudsolutions.com/careers',
      },
      {
        id: 8,
        title: 'React Developer',
        company: 'FrontendMasters',
        location: 'Remote',
        salary: '65k - 95k USD',
        type: 'Temps plein',
        match: 91,
        description: 'Développeur React pour applications frontend modernes.',
        requirements: ['React', 'TypeScript', 'Next.js', '3+ ans'],
        link: 'https://frontendmasters.com/jobs',
      },
      {
        id: 9,
        title: 'WordPress Plugin Developer',
        company: 'WPExperts',
        location: 'Remote',
        salary: '45k - 70k USD',
        type: 'Temps plein',
        match: 87,
        description: 'Développeur de plugins WordPress personnalisés.',
        requirements: ['WordPress', 'PHP', 'JavaScript', 'Plugin Development', '2+ ans'],
        link: 'https://wpexperts.com/careers',
      },
      {
        id: 10,
        title: 'Agentforce Automation Specialist',
        company: 'AutoFlow Systems',
        location: 'Remote',
        salary: '75k - 110k USD',
        type: 'Temps plein',
        match: 94,
        description: 'Spécialiste en automatisation Agentforce pour workflows complexes.',
        requirements: ['Agentforce', 'Automation', 'Workflow', 'API', '4+ ans'],
        link: 'https://autoflow.com/jobs',
      },
      {
        id: 'fallback-4',
        title: 'React Developer',
        company: 'FrontendMasters',
        location: 'Remote',
        salary: '65k - 95k USD',
        type: 'Temps plein',
        match: 91,
        description: 'Développeur React pour applications frontend modernes.',
        requirements: ['React', 'TypeScript', 'Next.js', '3+ ans'],
        link: 'https://frontendmasters.com/jobs',
      },
      {
        id: 'fallback-5',
        title: 'Agentforce Automation Specialist',
        company: 'AutoFlow Systems',
        location: 'Remote',
        salary: '75k - 110k USD',
        type: 'Temps plein',
        match: 94,
        description: 'Spécialiste en automatisation Agentforce pour workflows complexes.',
        requirements: ['Agentforce', 'Automation', 'Workflow', 'API', '4+ ans'],
        link: 'https://autoflow.com/jobs',
      },
    ]

    // Filtrer selon les mots-clés si nécessaire
    if (keywords) {
      const lowerKeywords = keywords.toLowerCase()
      return fallbackJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(lowerKeywords) ||
          job.company.toLowerCase().includes(lowerKeywords) ||
          job.description.toLowerCase().includes(lowerKeywords)
      )
    }

    return fallbackJobs
    }
  }

  // Fonction de candidature automatique
  const applyToJobs = async (jobs: JobOffer[]): Promise<JobOffer[]> => {
    const appliedJobs: JobOffer[] = []
    
    for (const job of jobs) {
      // Simulation de candidature
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      const appliedJob: JobOffer = {
        ...job,
        status: 'applied',
        appliedAt: new Date(),
      }
      
      appliedJobs.push(appliedJob)
      setApplications((prev) => [...prev, appliedJob])
    }
    
    return appliedJobs
  }

  const generateResponse = (userInput: string): { text: string; result?: AgentResult } => {
    const lowerInput = userInput.toLowerCase()

    // Recherche d'offres d'emploi
    if (lowerInput.includes('offre') || lowerInput.includes('emploi') || lowerInput.includes('job') || lowerInput.includes('recherche')) {
      setIsSearching(true)
      setRobotState('searching')
      
      setTimeout(async () => {
        const jobs = await searchJobOffers(userInput)
        setJobOffers(jobs)
        setIsSearching(false)
        setRobotState('displaying')
        
        return {
          text: `J'ai trouvé ${jobs.length} offres d'emploi pertinentes !`,
          result: {
            type: 'jobs',
            data: jobs,
            title: 'Offres d\'Emploi Trouvées',
          },
        }
      }, 2000)
      
      return {
        text: 'Recherche d\'offres d\'emploi en cours...',
        result: undefined,
      }
    }

    // Candidature automatique
    if (lowerInput.includes('postuler') || lowerInput.includes('candidater') || lowerInput.includes('appliquer') || lowerInput.includes('apply')) {
      if (jobOffers.length === 0) {
        return {
          text: 'Aucune offre trouvée. Recherchez d\'abord des offres avec "recherche offres" ou "offres emploi".',
          result: undefined,
        }
      }
      
      setIsApplying(true)
      setRobotState('applying')
      
      setTimeout(async () => {
        const appliedJobs = await applyToJobs(jobOffers)
        setIsApplying(false)
        setRobotState('displaying')
        
        return {
          text: `Candidatures envoyées à ${appliedJobs.length} offres !`,
          result: {
            type: 'applications',
            data: appliedJobs,
            title: 'Candidatures Envoyées',
          },
        }
      }, jobOffers.length * 1000)
      
      return {
        text: `Envoi de candidatures à ${jobOffers.length} offres en cours...`,
        result: undefined,
      }
    }

    // Voir les candidatures
    if (lowerInput.includes('candidature') || lowerInput.includes('application') || lowerInput.includes('suivi')) {
      return {
        text: `Vous avez ${applications.length} candidatures en cours.`,
        result: {
          type: 'applications',
          data: applications,
          title: 'Mes Candidatures',
        },
      }
    }

    // Analyse de compétences
    if (lowerInput.includes('compétence') || lowerInput.includes('skill')) {
      return {
        text: 'Voici mes compétences principales :',
        result: {
          type: 'list',
          data: [
            { name: 'Agentforce', level: 95, color: 'bg-blue-500' },
            { name: 'Salesforce', level: 90, color: 'bg-purple-500' },
            { name: 'WordPress', level: 88, color: 'bg-green-500' },
            { name: 'React', level: 92, color: 'bg-cyan-500' },
            { name: 'Next.js', level: 90, color: 'bg-gray-500' },
            { name: 'Node.js', level: 88, color: 'bg-green-600' },
          ],
          title: 'Compétences Techniques',
        },
      }
    }

    // Statistiques de projets
    if (lowerInput.includes('projet') || lowerInput.includes('project')) {
      return {
        text: 'Statistiques de mes projets :',
        result: {
          type: 'chart',
          data: {
            labels: ['Gama Outillage', 'Tawssil', 'Levio', 'Autres'],
            values: [35, 25, 30, 10],
            colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'],
          },
          title: 'Répartition des Projets',
        },
      }
    }

    // Code example
    if (lowerInput.includes('code') || lowerInput.includes('exemple')) {
      return {
        text: 'Voici un exemple de code :',
        result: {
          type: 'code',
          data: `function calculatePrice(service, features) {
  let total = service.basePrice;
  features.forEach(feature => {
    total += feature.price;
  });
  return total;
}`,
          title: 'Exemple de Code',
        },
      }
    }

    // Expérience
    if (lowerInput.includes('expérience') || lowerInput.includes('experience')) {
      return {
        text: 'Mon parcours professionnel :',
        result: {
          type: 'list',
          data: [
            { company: 'Levio', role: 'Agentforce Developer', period: '2022 - Présent' },
            { company: 'Gama Outillage', role: 'WordPress Developer', period: '2020 - 2022' },
            { company: 'Tawssil', role: ' ', period: '2019 - 2021' },
          ],
          title: 'Expériences Professionnelles',
        },
      }
    }

    // Par défaut
    return {
      text: 'Je peux vous aider avec : compétences, projets, code, expérience, offres d\'emploi, candidatures. Que souhaitez-vous savoir ?',
      result: undefined,
    }
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')

    // Animation du robot
    setRobotState('thinking')

    const lowerInput = currentInput.toLowerCase()

    // Gestion spéciale pour recherche d'offres
    if (lowerInput.includes('offre') || lowerInput.includes('emploi') || lowerInput.includes('job') || lowerInput.includes('recherche')) {
      setIsSearching(true)
      setRobotState('searching')
      
      setTimeout(async () => {
        const jobs = await searchJobOffers(currentInput, searchLocation)
        setJobOffers(jobs)
        setIsSearching(false)
        setRobotState('displaying')
        
        const agentMessage: Message = {
          id: Date.now() + 1,
          text: `🔍 J'ai trouvé ${jobs.length} offres d'emploi pertinentes !${jobs.length > 0 && jobs[0].id.toString().startsWith('fallback') ? '\n\n⚠️ Mode démonstration : Configurez une clé API pour rechercher de vraies offres. Voir RECHERCHE_EMPLOI_API.md' : ''}`,
          sender: 'agent',
          timestamp: new Date(),
          result: {
            type: 'jobs',
            data: jobs,
            title: 'Offres d\'Emploi Trouvées',
          },
        }
        setMessages((prev) => [...prev, agentMessage])
        setCurrentResult(agentMessage.result)
      }, 2000)
      return
    }

    // Gestion spéciale pour candidatures
    if (lowerInput.includes('postuler') || lowerInput.includes('candidater') || lowerInput.includes('appliquer') || lowerInput.includes('apply')) {
      if (jobOffers.length === 0) {
        const agentMessage: Message = {
          id: Date.now() + 1,
          text: 'Aucune offre trouvée. Recherchez d\'abord des offres avec "recherche offres" ou "offres emploi".',
          sender: 'agent',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, agentMessage])
        setRobotState('speaking')
        setTimeout(() => setRobotState('idle'), 2000)
        return
      }
      
      setIsApplying(true)
      setRobotState('applying')
      
      setTimeout(async () => {
        const appliedJobs = await applyToJobs(jobOffers)
        setIsApplying(false)
        setRobotState('displaying')
        
        const agentMessage: Message = {
          id: Date.now() + 1,
          text: `✅ Candidatures envoyées à ${appliedJobs.length} offres !`,
          sender: 'agent',
          timestamp: new Date(),
          result: {
            type: 'applications',
            data: appliedJobs,
            title: 'Candidatures Envoyées',
          },
        }
        setMessages((prev) => [...prev, agentMessage])
        setCurrentResult(agentMessage.result)
        setJobOffers([]) // Réinitialiser après candidature
      }, jobOffers.length * 1000)
      return
    }

    // Réponses normales
    setTimeout(() => {
      const response = generateResponse(currentInput)
      const agentMessage: Message = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'agent',
        timestamp: new Date(),
        result: response.result || undefined,
      }
      setMessages((prev) => [...prev, agentMessage])

      if (response.result) {
        setRobotState('displaying')
        setCurrentResult(response.result)
      } else {
        setRobotState('speaking')
        setTimeout(() => setRobotState('idle'), 2000)
      }
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Bot className="text-white" size={28} />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 ${
        isMinimized ? 'w-96' : 'w-[900px]'
      } bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden`}
      style={{ height: isMinimized ? 'auto' : '700px', maxHeight: '90vh' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: robotState === 'thinking' ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5, repeat: robotState === 'thinking' ? Infinity : 0 }}
          >
            <Bot className="text-white" size={24} />
          </motion.div>
          <div>
            <h3 className="text-white font-semibold">Agent Interne</h3>
            <p className="text-xs text-blue-100">
              {robotState === 'idle' && 'En ligne'}
              {robotState === 'thinking' && 'Réflexion...'}
              {robotState === 'speaking' && 'Parle...'}
              {robotState === 'displaying' && 'Affichage...'}
              {robotState === 'searching' && 'Recherche offres...'}
              {robotState === 'applying' && 'Envoi candidatures...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {applications.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <CheckCircle size={14} className="text-white" />
              <span className="text-xs font-semibold text-white">
                {applications.length} candidature{applications.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          {jobOffers.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <Briefcase size={14} className="text-white" />
              <span className="text-xs font-semibold text-white">
                {jobOffers.length} offre{jobOffers.length > 1 ? 's' : ''} trouvée{jobOffers.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-1 overflow-hidden">
          {/* Panneau Gauche - Discussion */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-gray-700">
                <MessageSquare size={18} />
                <span className="font-semibold">Discussion</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="text-white" size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.result && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <Star size={14} className="text-blue-500 inline-block mr-1" />
                          <span className="text-xs text-gray-500">Résultat affiché à droite</span>
                        </div>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="text-gray-600" size={16} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Boutons rapides */}
              <div className="flex gap-2 mb-2">
                <motion.button
                  onClick={async () => {
                    setInputText('recherche offres')
                    setIsSearching(true)
                    setRobotState('searching')
                    
                    setTimeout(async () => {
                      const jobs = await searchJobOffers('developer full stack react', searchLocation)
                      setJobOffers(jobs)
                      setIsSearching(false)
                      setRobotState('displaying')
                      
                      const userMsg: Message = {
                        id: Date.now(),
                        text: 'recherche offres',
                        sender: 'user',
                        timestamp: new Date(),
                      }
                      const agentMsg: Message = {
                        id: Date.now() + 1,
                        text: `🔍 J'ai trouvé ${jobs.length} offres d'emploi pertinentes !${jobs.length > 0 && jobs[0].id.toString().startsWith('fallback') ? '\n\n⚠️ Mode démonstration : Configurez une clé API pour rechercher de vraies offres. Voir RECHERCHE_EMPLOI_API.md' : ''}`,
                        sender: 'agent',
                        timestamp: new Date(),
                        result: {
                          type: 'jobs',
                          data: jobs,
                          title: 'Offres d\'Emploi Trouvées',
                        },
                      }
                      setMessages((prev) => [...prev, userMsg, agentMsg])
                      setCurrentResult(agentMsg.result)
                    }, 2000)
                  }}
                  disabled={isSearching || isApplying}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search size={14} />
                  Rechercher Offres
                </motion.button>
                <motion.button
                  onClick={async () => {
                    if (jobOffers.length === 0) {
                      const msg: Message = {
                        id: Date.now(),
                        text: 'Aucune offre trouvée. Recherchez d\'abord des offres.',
                        sender: 'agent',
                        timestamp: new Date(),
                      }
                      setMessages((prev) => [...prev, msg])
                      return
                    }
                    
                    setInputText('postuler toutes')
                    setIsApplying(true)
                    setRobotState('applying')
                    
                    setTimeout(async () => {
                      const appliedJobs = await applyToJobs(jobOffers)
                      setIsApplying(false)
                      setRobotState('displaying')
                      
                      const userMsg: Message = {
                        id: Date.now(),
                        text: 'postuler toutes',
                        sender: 'user',
                        timestamp: new Date(),
                      }
                      const agentMsg: Message = {
                        id: Date.now() + 1,
                        text: `✅ Candidatures envoyées à ${appliedJobs.length} offres !`,
                        sender: 'agent',
                        timestamp: new Date(),
                        result: {
                          type: 'applications',
                          data: appliedJobs,
                          title: 'Candidatures Envoyées',
                        },
                      }
                      setMessages((prev) => [...prev, userMsg, agentMsg])
                      setCurrentResult(agentMsg.result)
                      setJobOffers([])
                    }, jobOffers.length * 1000)
                  }}
                  disabled={jobOffers.length === 0 || isApplying || isSearching}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg disabled:opacity-50 text-xs font-semibold flex items-center justify-center gap-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle size={14} />
                  Postuler Toutes ({jobOffers.length})
                </motion.button>
              </div>
              
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez une question..."
                  className="flex-1 bg-gray-50 text-gray-800 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isSearching || isApplying}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Essayez : "compétences", "projets", "code", "expérience", "recherche offres", "postuler", "candidatures"
              </p>
            </div>
          </div>

          {/* Panneau Droit - Robot & Résultats */}
          <div className="w-1/2 flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2 text-gray-700">
                <Monitor size={18} />
                <span className="font-semibold">Affichage de Résultats</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
              {/* Robot Avatar */}
              <motion.div
                className="relative mb-6"
                animate={{
                  scale: robotState === 'thinking' ? [1, 1.1, 1] : robotState === 'speaking' ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 1, repeat: robotState !== 'idle' ? Infinity : 0 }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl relative">
                  <Bot className="text-white" size={64} />
                  
                  {/* Animation Thinking */}
                  {robotState === 'thinking' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-blue-300"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {/* Animation Speaking */}
                  {robotState === 'speaking' && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap className="text-yellow-400" size={24} />
                    </motion.div>
                  )}

                  {/* Animation Searching */}
                  {robotState === 'searching' && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Search className="text-blue-400" size={24} />
                    </motion.div>
                  )}

                  {/* Animation Applying */}
                  {robotState === 'applying' && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <CheckCircle className="text-green-400" size={24} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Affichage des Résultats */}
              <AnimatePresence mode="wait">
                {currentResult && robotState === 'displaying' ? (
                  <motion.div
                    key={currentResult.type}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="w-full max-h-64 overflow-y-auto"
                  >
                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                      {currentResult.title && (
                        <h4 className="font-bold text-gray-800 mb-3">{currentResult.title}</h4>
                      )}

                      {/* Liste */}
                      {currentResult.type === 'list' && (
                        <div className="space-y-2">
                          {currentResult.data.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">{item.name || item.company || item.role}</span>
                              {item.level && (
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${item.color || 'bg-blue-500'}`}
                                      style={{ width: `${item.level}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600">{item.level}%</span>
                                </div>
                              )}
                              {item.period && (
                                <span className="text-sm text-gray-500">{item.period}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Chart */}
                      {currentResult.type === 'chart' && (
                        <div className="space-y-3">
                          {currentResult.data.labels.map((label: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: currentResult.data.colors[index] }}
                              />
                              <span className="text-sm text-gray-700 flex-1">{label}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${currentResult.data.values[index]}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: currentResult.data.colors[index] }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                                {currentResult.data.values[index]}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Code */}
                      {currentResult.type === 'code' && (
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                          {currentResult.data}
                        </pre>
                      )}

                      {/* Jobs */}
                      {currentResult.type === 'jobs' && (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {currentResult.data.map((job: JobOffer) => (
                            <motion.div
                              key={job.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {job.title}
                                  </h5>
                                  <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                  <TrendingUp size={12} />
                                  <span className="text-xs font-semibold text-green-700">{job.match}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign size={12} />
                                  {job.salary}
                                </span>
                                <span>{job.type}</span>
                              </div>
                              <p className="text-xs text-gray-700 mb-2">{job.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {job.requirements.slice(0, 3).map((req, idx) => (
                                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                                    {req}
                                  </span>
                                ))}
                              </div>
                              <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                Voir l'offre <ExternalLink size={12} />
                              </a>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Applications */}
                      {currentResult.type === 'applications' && (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {currentResult.data.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Aucune candidature pour le moment.</p>
                          ) : (
                            currentResult.data.map((app: JobOffer) => (
                              <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                                      <Briefcase size={16} />
                                      {app.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 mt-1">{app.company}</p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {app.status === 'applied' && (
                                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <CheckCircle size={12} />
                                        Candidaté
                                      </span>
                                    )}
                                    {app.status === 'interview' && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <Clock size={12} />
                                        Entretien
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {app.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={12} />
                                    {app.salary}
                                  </span>
                                </div>
                                {app.appliedAt && (
                                  <p className="text-xs text-gray-500">
                                    Candidaté le {app.appliedAt.toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500"
                  >
                    <Monitor size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Les résultats apparaîtront ici</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* État du Robot */}
              <div className="mt-4 text-center">
                <motion.div
                  className="inline-block px-4 py-2 bg-white rounded-full shadow-md border border-gray-200"
                  animate={{
                    backgroundColor:
                      robotState === 'thinking'
                        ? '#DBEAFE'
                        : robotState === 'speaking'
                        ? '#FEF3C7'
                        : robotState === 'displaying'
                        ? '#D1FAE5'
                        : '#F3F4F6',
                  }}
                >
                  <span className="text-xs font-semibold text-gray-700">
                    {robotState === 'idle' && '🤖 Prêt'}
                    {robotState === 'thinking' && '💭 Réflexion...'}
                    {robotState === 'speaking' && '💬 Parle...'}
                    {robotState === 'displaying' && '📊 Affichage...'}
                    {robotState === 'searching' && '🔍 Recherche offres...'}
                    {robotState === 'applying' && '📝 Envoi candidatures...'}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

