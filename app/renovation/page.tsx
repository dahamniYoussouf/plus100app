'use client'

import { useState, useEffect } from 'react'
import { Wrench, Users, Calendar, DollarSign, BarChart3, Home, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'projects' | 'clients' | 'quotes' | 'materials'

interface Project {
  id: string
  clientName: string
  address: string
  type: 'kitchen' | 'bathroom' | 'living_room' | 'bedroom' | 'full_renovation'
  status: 'quote' | 'approved' | 'in_progress' | 'completed'
  startDate?: Date
  endDate?: Date
  budget: number
  spent: number
  progress: number
  description: string
}

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  projects: string[]
}

interface Quote {
  id: string
  projectId: string
  clientName: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  validUntil: Date
  items: Array<{ description: string; amount: number }>
}

export default function RenovationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    const savedProjects = localStorage.getItem('renovation-projects')
    const savedClients = localStorage.getItem('renovation-clients')
    const savedQuotes = localStorage.getItem('renovation-quotes')

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({
        ...p,
        startDate: p.startDate ? new Date(p.startDate) : undefined,
        endDate: p.endDate ? new Date(p.endDate) : undefined,
      })))
    } else {
      const sample: Project[] = [
        {
          id: '1',
          clientName: 'Fatima Kadri',
          address: '123 Rue des Fleurs, Alger',
          type: 'kitchen',
          status: 'in_progress',
          startDate: new Date('2024-02-01'),
          budget: 50000,
          spent: 30000,
          progress: 60,
          description: 'Rénovation complète de la cuisine',
        },
      ]
      setProjects(sample)
      localStorage.setItem('renovation-projects', JSON.stringify(sample))
    }

    if (savedClients) {
      setClients(JSON.parse(savedClients))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Fatima Kadri',
          phone: '+213 555 1234',
          email: 'fatima@email.com',
          address: '123 Rue des Fleurs, Alger',
          projects: ['1'],
        },
      ]
      setClients(sample)
      localStorage.setItem('renovation-clients', JSON.stringify(sample))
    }

    if (savedQuotes) {
      const parsed = JSON.parse(savedQuotes)
      setQuotes(parsed.map((q: any) => ({ ...q, validUntil: new Date(q.validUntil) })))
    } else {
      const sample: Quote[] = [
        {
          id: '1',
          projectId: '1',
          clientName: 'Fatima Kadri',
          amount: 50000,
          status: 'accepted',
          validUntil: new Date('2024-12-31'),
          items: [
            { description: 'Carrelage', amount: 15000 },
            { description: 'Électroménager', amount: 20000 },
            { description: 'Main d\'œuvre', amount: 15000 },
          ],
        },
      ]
      setQuotes(sample)
      localStorage.setItem('renovation-quotes', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('renovation-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('renovation-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (quotes.length > 0) localStorage.setItem('renovation-quotes', JSON.stringify(quotes))
  }, [quotes])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'projects' as TabType, label: 'Projets', icon: Home },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'quotes' as TabType, label: 'Devis', icon: DollarSign },
    { id: 'materials' as TabType, label: 'Matériaux', icon: Wrench },
  ]

  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const totalRevenue = projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.budget, 0)
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
                    activeTab === tab.id
                      ? 'text-amber-600 border-b-2 border-amber-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
                  </div>
                  <Home className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Devis en Attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingQuotes}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{project.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          {project.type === 'kitchen' ? 'Cuisine' :
                           project.type === 'bathroom' ? 'Salle de bain' :
                           project.type === 'living_room' ? 'Salon' :
                           project.type === 'bedroom' ? 'Chambre' : 'Rénovation complète'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">📍 {project.address}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'approved' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'in_progress' ? 'En cours' :
                         project.status === 'approved' ? 'Approuvé' : 'Devis'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progression</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-600 h-2 rounded-full"
                            style={{ width: ` DZD{project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget: DZD{project.budget.toLocaleString()}</span>
                        <span className="text-gray-900 font-medium">Dépensé: DZD{project.spent.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{client.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      {client.email && <p className="text-sm text-gray-600">📧 {client.email}</p>}
                      {client.address && <p className="text-sm text-gray-600">📍 {client.address}</p>}
                    </div>
                    <div className="pt-4 border-t border-gray-200 mt-4">
                      <p className="text-xs text-gray-500">Projets: {client.projects.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Devis</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau Devis
              </button>
            </div>
            {quotes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun devis</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{quote.clientName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Valide jusqu'au: {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.status === 'accepted' ? 'Accepté' :
                         quote.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {quote.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{item.description}</span>
                          <span className="font-medium text-gray-900">DZD{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-lg font-bold text-gray-900">Total: DZD{quote.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Matériaux</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des matériaux de rénovation</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
