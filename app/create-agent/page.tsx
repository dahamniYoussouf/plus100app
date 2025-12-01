'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Star, Palette, Settings, Eye, Save, Play, X, CheckCircle, Plus, Trash2, Zap, Database, Shield, Code, Globe, FileText, Workflow, Brain, BarChart3, Mail, Calendar, Cloud, Lock, AlertTriangle, Target, Copy, Download, Upload } from 'lucide-react'
import Link from 'next/link'

interface AgentConfig {
  id: string
  name: string
  description: string
  personality: string
  avatar: string
  color: string
  skills: string[]
  knowledge: string[]
  responses: { trigger: string; response: string }[]
  features: {
    jobSearch: boolean
    chat: boolean
    voice: boolean
    analytics: boolean
    automation: boolean
  }
  // Nouvelles sections inspirées du monde réel
  trainingExamples: { input: string; output: string }[]
  integrations: { name: string; enabled: boolean; apiKey?: string }[]
  rules: { type: 'allow' | 'deny' | 'must'; rule: string }[]
  templates: string[]
  workflows: { name: string; trigger: string; actions: string[] }[]
  memory: {
    enabled: boolean
    type: 'session' | 'persistent' | 'vector'
    maxContext: number
  }
  limits: {
    maxTokens: number
    maxRequests: number
    timeout: number
    rateLimit: number
  }
  apiEndpoints: { name: string; url: string; method: string }[]
}

export default function CreateAgentPage() {
  const [step, setStep] = useState(1)
  const [agent, setAgent] = useState<AgentConfig>({
    id: `agent- DZD{Date.now()}`,
    name: '',
    description: '',
    personality: 'friendly',
    avatar: '🤖',
    color: '#3B82F6',
    skills: [],
    knowledge: [],
    responses: [],
    features: {
      jobSearch: false,
      chat: true,
      voice: false,
      analytics: false,
      automation: false,
    },
    trainingExamples: [],
    integrations: [
      { name: 'OpenAI', enabled: false },
      { name: 'Anthropic Claude', enabled: false },
      { name: 'Google Gemini', enabled: false },
      { name: 'Web Search', enabled: false },
      { name: 'Email API', enabled: false },
      { name: 'Calendar API', enabled: false },
    ],
    rules: [],
    templates: [],
    workflows: [],
    memory: {
      enabled: true,
      type: 'session',
      maxContext: 1000,
    },
    limits: {
      maxTokens: 2000,
      maxRequests: 100,
      timeout: 30,
      rateLimit: 10,
    },
    apiEndpoints: [],
  })
  const [newSkill, setNewSkill] = useState('')
  const [newKnowledge, setNewKnowledge] = useState('')
  const [responseTrigger, setResponseTrigger] = useState('')
  const [responseText, setResponseText] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const personalities = [
    { id: 'friendly', name: 'Amical', icon: '😊', description: 'Chaleureux et accueillant' },
    { id: 'professional', name: 'Professionnel', icon: '💼', description: 'Sérieux et efficace' },
    { id: 'creative', name: 'Créatif', icon: '🎨', description: 'Innovant et original' },
    { id: 'technical', name: 'Technique', icon: '⚙️', description: 'Précis et détaillé' },
    { id: 'funny', name: 'Humoristique', icon: '😂', description: 'Drôle et léger' },
  ]

  const colors = [
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Rouge', value: '#EF4444' },
  ]

  const avatars = ['🤖', '👾', '🤖', '🎯', '⚡', '🌟', '🚀', '💎', '🎭', '🔮']

  const handleAddSkill = () => {
    if (newSkill.trim() && !agent.skills.includes(newSkill.trim())) {
      setAgent({ ...agent, skills: [...agent.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setAgent({ ...agent, skills: agent.skills.filter(s => s !== skill) })
  }

  const handleAddKnowledge = () => {
    if (newKnowledge.trim() && !agent.knowledge.includes(newKnowledge.trim())) {
      setAgent({ ...agent, knowledge: [...agent.knowledge, newKnowledge.trim()] })
      setNewKnowledge('')
    }
  }

  const handleRemoveKnowledge = (knowledge: string) => {
    setAgent({ ...agent, knowledge: agent.knowledge.filter(k => k !== knowledge) })
  }

  const handleAddResponse = () => {
    if (responseTrigger.trim() && responseText.trim()) {
      setAgent({
        ...agent,
        responses: [...agent.responses, { trigger: responseTrigger.trim(), response: responseText.trim() }],
      })
      setResponseTrigger('')
      setResponseText('')
    }
  }

  const handleRemoveResponse = (index: number) => {
    setAgent({ ...agent, responses: agent.responses.filter((_, i) => i !== index) })
  }

  const handleSave = () => {
    // Sauvegarder dans localStorage
    const savedAgents = JSON.parse(localStorage.getItem('savedAgents') || '[]')
    savedAgents.push(agent)
    localStorage.setItem('savedAgents', JSON.stringify(savedAgents))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const steps = [
    { id: 1, name: 'Basique', icon: Bot },
    { id: 2, name: 'Personnalité', icon: Star },
    { id: 3, name: 'Compétences', icon: Settings },
    { id: 4, name: 'Apparence', icon: Palette },
    { id: 5, name: 'Fonctionnalités', icon: Eye },
    { id: 6, name: 'Training', icon: Brain },
    { id: 7, name: 'Intégrations', icon: Zap },
    { id: 8, name: 'Règles', icon: Shield },
    { id: 9, name: 'Workflows', icon: Workflow },
    { id: 10, name: 'Avancé', icon: Code },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Bot className="text-blue-600" size={28} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Créateur d'Agent Intelligent
                </h1>
              </Link>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Retour au Portfolio
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon
              const isActive = step === stepItem.id
              const isCompleted = step > stepItem.id

              return (
                <div key={stepItem.id} className="flex items-center flex-1">
                  <motion.button
                    onClick={() => setStep(stepItem.id)}
                    className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all  DZD{
                      isActive
                        ? 'bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-semibold">{stepItem.name}</span>
                  </motion.button>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1 rounded  DZD{
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Étape 1: Informations de Base */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Bot className="text-blue-600" />
                  Informations de Base
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de l'Agent *
                    </label>
                    <input
                      type="text"
                      value={agent.name}
                      onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                      placeholder="Ex: Assistant Recrutement, Agent Vente..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={agent.description}
                      onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                      placeholder="Décrivez le rôle et la mission de votre agent..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 2: Personnalité */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="text-purple-600" />
                  Personnalité
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {personalities.map((personality) => (
                    <motion.button
                      key={personality.id}
                      onClick={() => setAgent({ ...agent, personality: personality.id })}
                      className={`p-4 rounded-lg border-2 transition-all text-left  DZD{
                        agent.personality === personality.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-3xl mb-2">{personality.icon}</div>
                      <h3 className="font-semibold text-gray-900">{personality.name}</h3>
                      <p className="text-sm text-gray-600">{personality.description}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Réponses Personnalisées */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Réponses Personnalisées</h3>
                  <div className="space-y-3 mb-4">
                    {agent.responses.map((response, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-700">
                            "{response.trigger}"
                          </p>
                          <p className="text-sm text-gray-600">→ {response.response}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveResponse(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={responseTrigger}
                      onChange={(e) => setResponseTrigger(e.target.value)}
                      placeholder="Déclencheur (ex: bonjour)"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Réponse"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddResponse}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Ajouter Réponse
                  </button>
                </div>
              </motion.div>
            )}

            {/* Étape 3: Compétences et Connaissances */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="text-green-600" />
                  Compétences & Connaissances
                </h2>

                {/* Compétences */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Compétences
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Ajouter une compétence (ex: React, Python...)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Connaissances */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Base de Connaissances
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.knowledge.map((knowledge) => (
                      <span
                        key={knowledge}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {knowledge}
                        <button onClick={() => handleRemoveKnowledge(knowledge)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKnowledge}
                      onChange={(e) => setNewKnowledge(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKnowledge()}
                      placeholder="Ajouter une connaissance (ex: Recrutement, E-commerce...)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleAddKnowledge}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 4: Apparence */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="text-pink-600" />
                  Apparence
                </h2>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Avatar
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {avatars.map((avatar) => (
                        <motion.button
                          key={avatar}
                          onClick={() => setAgent({ ...agent, avatar })}
                          className={`p-4 text-3xl rounded-lg border-2 transition-all  DZD{
                            agent.avatar === avatar
                              ? 'border-blue-500 bg-blue-50 scale-110'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {avatar}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Couleur */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Couleur Principale
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {colors.map((color) => (
                        <motion.button
                          key={color.value}
                          onClick={() => setAgent({ ...agent, color: color.value })}
                          className={`p-4 rounded-lg border-2 transition-all  DZD{
                            agent.color === color.value
                              ? 'border-gray-900 scale-110'
                              : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color.value }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-white font-semibold">{color.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 5: Fonctionnalités */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Eye className="text-orange-600" />
                  Fonctionnalités
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'chat', label: 'Chat Conversationnel', icon: '💬' },
                    { key: 'jobSearch', label: 'Recherche d\'Emploi', icon: '🔍' },
                    { key: 'voice', label: 'Reconnaissance Vocale', icon: '🎤' },
                    { key: 'analytics', label: 'Analytiques & Statistiques', icon: '📊' },
                    { key: 'automation', label: 'Automatisation de Tâches', icon: '⚙️' },
                  ].map((feature) => (
                    <motion.button
                      key={feature.key}
                      onClick={() =>
                        setAgent({
                          ...agent,
                          features: {
                            ...agent.features,
                            [feature.key]: !agent.features[feature.key as keyof typeof agent.features],
                          },
                        })
                      }
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between  DZD{
                        agent.features[feature.key as keyof typeof agent.features]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <span className="font-semibold">{feature.label}</span>
                      </div>
                      {agent.features[feature.key as keyof typeof agent.features] ? (
                        <CheckCircle className="text-blue-600" size={24} />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Étape 6: Training & Exemples */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Brain className="text-indigo-600" />
                  Training & Exemples (Inspiré d'AutoGPT)
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Ajoutez des exemples d'entrée/sortie pour entraîner votre agent
                </p>

                <div className="space-y-4">
                  {agent.trainingExamples.map((example, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-gray-700">Exemple {index + 1}</span>
                        <button
                          onClick={() =>
                            setAgent({
                              ...agent,
                              trainingExamples: agent.trainingExamples.filter((_, i) => i !== index),
                            })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">Input:</span>
                          <p className="text-sm text-gray-700">{example.input}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Output:</span>
                          <p className="text-sm text-gray-700">{example.output}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <input
                      type="text"
                      placeholder="Exemple d'entrée (input)..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = (e.target as HTMLInputElement).value
                          if (input.trim()) {
                            setAgent({
                              ...agent,
                              trainingExamples: [
                                ...agent.trainingExamples,
                                { input: input.trim(), output: '' },
                              ],
                            })
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 7: Intégrations API */}
            {step === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="text-yellow-600" />
                  Intégrations API (Inspiré de LangChain)
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Connectez votre agent à des services externes
                </p>

                <div className="space-y-3">
                  {agent.integrations.map((integration, index) => (
                    <div
                      key={index}
                      className="p-4 border-2 rounded-lg transition-all"
                      style={{
                        borderColor: integration.enabled ? agent.color : '#e5e7eb',
                        backgroundColor: integration.enabled ? ` DZD{agent.color}10` : 'transparent',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={integration.enabled}
                            onChange={(e) => {
                              const newIntegrations = [...agent.integrations]
                              newIntegrations[index].enabled = e.target.checked
                              setAgent({ ...agent, integrations: newIntegrations })
                            }}
                            className="w-5 h-5"
                          />
                          <span className="font-semibold">{integration.name}</span>
                        </div>
                        {integration.enabled && integration.name === 'Web Search' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      {integration.enabled && (
                        <input
                          type="password"
                          placeholder={`Clé API  DZD{integration.name}...`}
                          className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={integration.apiKey || ''}
                          onChange={(e) => {
                            const newIntegrations = [...agent.integrations]
                            newIntegrations[index].apiKey = e.target.value
                            setAgent({ ...agent, integrations: newIntegrations })
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Étape 8: Règles & Limitations */}
            {step === 8 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-red-600" />
                  Règles & Limitations (Inspiré de ChatGPT Custom Instructions)
                </h2>

                <div className="space-y-6">
                  {/* Règles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Règles de Comportement</h3>
                    <div className="space-y-2 mb-4">
                      {agent.rules.map((rule, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold  DZD{
                                rule.type === 'allow'
                                  ? 'bg-green-100 text-green-700'
                                  : rule.type === 'deny'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {rule.type === 'allow' ? '✓ Autoriser' : rule.type === 'deny' ? '✗ Interdire' : '! Doit'}
                            </span>
                            <span className="text-sm text-gray-700">{rule.rule}</span>
                          </div>
                          <button
                            onClick={() =>
                              setAgent({
                                ...agent,
                                rules: agent.rules.filter((_, i) => i !== index),
                              })
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <select
                        id="ruleType"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        defaultValue="allow"
                      >
                        <option value="allow">Autoriser</option>
                        <option value="deny">Interdire</option>
                        <option value="must">Doit faire</option>
                      </select>
                      <input
                        type="text"
                        id="newRule"
                        placeholder="Nouvelle règle..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const ruleType = (document.getElementById('ruleType') as HTMLSelectElement)
                              .value as 'allow' | 'deny' | 'must'
                            const ruleText = (e.target as HTMLInputElement).value
                            if (ruleText.trim()) {
                              setAgent({
                                ...agent,
                                rules: [...agent.rules, { type: ruleType, rule: ruleText.trim() }],
                              })
                              ;(e.target as HTMLInputElement).value = ''
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const ruleType = (document.getElementById('ruleType') as HTMLSelectElement)
                            .value as 'allow' | 'deny' | 'must'
                          const ruleText = (document.getElementById('newRule') as HTMLInputElement).value
                          if (ruleText.trim()) {
                            setAgent({
                              ...agent,
                              rules: [...agent.rules, { type: ruleType, rule: ruleText.trim() }],
                            })
                            ;(document.getElementById('newRule') as HTMLInputElement).value = ''
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Plus size={16} className="inline" />
                      </button>
                    </div>
                  </div>

                  {/* Limitations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Limites Techniques</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Tokens
                        </label>
                        <input
                          type="number"
                          value={agent.limits.maxTokens}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              limits: { ...agent.limits, maxTokens: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Requêtes/jour
                        </label>
                        <input
                          type="number"
                          value={agent.limits.maxRequests}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              limits: { ...agent.limits, maxRequests: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Timeout (sec)
                        </label>
                        <input
                          type="number"
                          value={agent.limits.timeout}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              limits: { ...agent.limits, timeout: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rate Limit/min
                        </label>
                        <input
                          type="number"
                          value={agent.limits.rateLimit}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              limits: { ...agent.limits, rateLimit: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mémoire */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Configuration Mémoire</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={agent.memory.enabled}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              memory: { ...agent.memory, enabled: e.target.checked },
                            })
                          }
                          className="w-5 h-5"
                        />
                        <span>Activer la mémoire persistante</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'session', label: 'Session', desc: 'Par conversation' },
                          { value: 'persistent', label: 'Persistante', desc: 'Toujours disponible' },
                          { value: 'vector', label: 'Vectorielle', desc: 'Recherche sémantique' },
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() =>
                              setAgent({
                                ...agent,
                                memory: { ...agent.memory, type: type.value as any },
                              })
                            }
                            className={`p-3 rounded-lg border-2 text-left transition-all  DZD{
                              agent.memory.type === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-semibold text-sm">{type.label}</div>
                            <div className="text-xs text-gray-600">{type.desc}</div>
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Contexte (tokens)
                        </label>
                        <input
                          type="number"
                          value={agent.memory.maxContext}
                          onChange={(e) =>
                            setAgent({
                              ...agent,
                              memory: { ...agent.memory, maxContext: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 9: Workflows & Automatisation */}
            {step === 9 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Workflow className="text-purple-600" />
                  Workflows & Automatisation (Inspiré de Zapier)
                </h2>

                <div className="space-y-4">
                  {agent.workflows.map((workflow, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        <button
                          onClick={() =>
                            setAgent({
                              ...agent,
                              workflows: agent.workflows.filter((_, i) => i !== index),
                            })
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Déclencheur:</span>{' '}
                          <span className="text-gray-600">{workflow.trigger}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Actions:</span>
                          <ul className="list-disc list-inside text-gray-600 ml-2">
                            {workflow.actions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3">Créer un nouveau workflow</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        id="workflowName"
                        placeholder="Nom du workflow..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        id="workflowTrigger"
                        placeholder="Déclencheur (ex: Nouveau message reçu)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          const name = (document.getElementById('workflowName') as HTMLInputElement).value
                          const trigger = (document.getElementById('workflowTrigger') as HTMLInputElement).value
                          if (name.trim() && trigger.trim()) {
                            setAgent({
                              ...agent,
                              workflows: [
                                ...agent.workflows,
                                { name: name.trim(), trigger: trigger.trim(), actions: [] },
                              ],
                            })
                            ;(document.getElementById('workflowName') as HTMLInputElement).value = ''
                            ;(document.getElementById('workflowTrigger') as HTMLInputElement).value = ''
                          }
                        }}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Ajouter Workflow
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 10: Configuration Avancée */}
            {step === 10 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Code className="text-gray-800" />
                  Configuration Avancée
                </h2>

                <div className="space-y-6">
                  {/* Templates */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Templates Prédéfinis</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Agent Recrutement', 'Agent Support', 'Agent Vente', 'Agent Analyse'].map((template) => (
                        <button
                          key={template}
                          onClick={() => {
                            // Appliquer un template prédéfini
                            alert(`Template " DZD{template}" sera appliqué`)
                          }}
                          className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                          <div className="font-semibold text-sm">{template}</div>
                          <div className="text-xs text-gray-600 mt-1">Cliquez pour appliquer</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Export/Import */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Export/Import</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const dataStr = JSON.stringify(agent, null, 2)
                          const dataBlob = new Blob([dataStr], { type: 'application/json' })
                          const url = URL.createObjectURL(dataBlob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = ` DZD{agent.name || 'agent'}.json`
                          link.click()
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download size={20} />
                        Exporter JSON
                      </button>
                      <label className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                        <Upload size={20} />
                        Importer JSON
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (event) => {
                                try {
                                  const imported = JSON.parse(event.target?.result as string)
                                  setAgent(imported)
                                  alert('Agent importé avec succès !')
                                } catch (error) {
                                  alert('Erreur lors de l\'import')
                                }
                              }
                              reader.readAsText(file)
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() => {
                  if (step < 10) {
                    setStep(step + 1)
                  } else {
                    handleSave()
                  }
                }}
                disabled={step === 1 && (!agent.name || !agent.description)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:via-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {step < 10 ? 'Suivant' : 'Sauvegarder'}
                {step === 10 && <Save size={20} />}
              </button>
            </div>
          </div>

          {/* Prévisualisation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold mb-4">Prévisualisation</h3>
              <div
                className="rounded-xl p-6 mb-4"
                style={{
                  background: `linear-gradient(135deg,  DZD{agent.color}15,  DZD{agent.color}35)`,
                  border: `2px solid  DZD{agent.color}40`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ backgroundColor: ` DZD{agent.color}20` }}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{agent.name || 'Nom de l\'agent'}</h4>
                    <p className="text-sm text-gray-600">
                      {personalities.find(p => p.id === agent.personality)?.name || 'Personnalité'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {agent.description || 'Description de l\'agent...'}
                </p>
                {agent.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ backgroundColor: ` DZD{agent.color}20`, color: agent.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(agent.features).map(([key, enabled]) => (
                    enabled && (
                      <div key={key} className="flex items-center gap-1 text-gray-600">
                        <CheckCircle size={12} className="text-green-500" />
                        <span className="capitalize">{key}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {isSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  <span className="font-semibold">Agent sauvegardé avec succès !</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

