'use client'

import { useState, useEffect } from 'react'
import { Paintbrush, Calendar, Users, FileText, BarChart3, DollarSign, Palette } from 'lucide-react'

type TabType = 'dashboard' | 'projects' | 'clients' | 'quotes' | 'team'

interface Project {
  id: string
  clientId: string
  clientName: string
  address: string
  type: 'interior' | 'exterior' | 'both' | 'decorative'
  description: string
  startDate: Date
  endDate?: Date
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  price: number
  teamMembers: string[]
  notes?: string
}

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  totalProjects: number
  lastProject?: Date
}

interface Quote {
  id: string
  clientId: string
  clientName: string
  description: string
  surface: number // m²
  type: 'interior' | 'exterior' | 'both'
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  validUntil?: Date
}

interface TeamMember {
  id: string
  name: string
  phone: string
  email: string
  role: 'painter' | 'supervisor' | 'apprentice'
  status: 'available' | 'busy' | 'off_duty'
  totalProjects: number
}

export default function PainterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    const savedProjects = localStorage.getItem('painter-projects')
    const savedClients = localStorage.getItem('painter-clients')
    const savedQuotes = localStorage.getItem('painter-quotes')
    const savedTeam = localStorage.getItem('painter-team')

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Project[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Ahmed Benali',
          address: '123 Rue des Fleurs, Alger',
          type: 'interior',
          description: 'Peinture intérieure appartement 3 pièces',
          startDate: today,
          status: 'in_progress',
          price: 1500,
          teamMembers: ['1', '2'],
        },
      ]
      setProjects(sample)
      localStorage.setItem('painter-projects', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastProject: c.lastProject ? new Date(c.lastProject) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          address: '123 Rue des Fleurs, Alger',
          totalProjects: 1,
        },
      ]
      setClients(sample)
      localStorage.setItem('painter-clients', JSON.stringify(sample))
    }

    if (savedQuotes) {
      const parsed = JSON.parse(savedQuotes)
      setQuotes(parsed.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        validUntil: q.validUntil ? new Date(q.validUntil) : undefined,
      })))
    }

    if (savedTeam) {
      setTeam(JSON.parse(savedTeam))
    } else {
      const sample: TeamMember[] = [
        {
          id: '1',
          name: 'Omar Amrani',
          phone: '+213 555 1111',
          email: 'omar@painter.com',
          role: 'painter',
          status: 'busy',
          totalProjects: 25,
        },
        {
          id: '2',
          name: 'Leila Bouzid',
          phone: '+213 555 2222',
          email: 'leila@painter.com',
          role: 'apprentice',
          status: 'busy',
          totalProjects: 8,
        },
      ]
      setTeam(sample)
      localStorage.setItem('painter-team', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('painter-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('painter-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (quotes.length > 0) localStorage.setItem('painter-quotes', JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    if (team.length > 0) localStorage.setItem('painter-team', JSON.stringify(team))
  }, [team])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'projects' as TabType, label: 'Projets', icon: Palette },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'quotes' as TabType, label: 'Devis', icon: FileText },
    { id: 'team' as TabType, label: 'Équipe', icon: Users },
  ]

  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const totalRevenue = projects.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-pink-600 border-b-2 border-pink-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
                  </div>
                  <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Équipe</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{team.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Projets</h3>
                  <p className="text-sm text-gray-600">Suivi des projets de peinture</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Devis</h3>
                  <p className="text-sm text-gray-600">Création et gestion des devis</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Équipe</h3>
                  <p className="text-sm text-gray-600">Gestion de l'équipe de peintres</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const teamMembersList = team.filter(t => project.teamMembers.includes(t.id))
                  return (
                    <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{project.clientName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status === 'completed' ? 'Terminé' :
                           project.status === 'in_progress' ? 'En cours' :
                           project.status === 'cancelled' ? 'Annulé' : 'Planifié'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">📍 {project.address}</p>
                        <p className="text-gray-600 capitalize">
                          Type: {project.type === 'interior' ? 'Intérieur' :
                                 project.type === 'exterior' ? 'Extérieur' :
                                 project.type === 'both' ? 'Intérieur et Extérieur' : 'Décoratif'}
                        </p>
                        <p className="text-gray-600">
                          📅 Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}
                          {project.endDate && ` - Fin: ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                        </p>
                        <p className="text-gray-600">
                          👥 Équipe: {teamMembersList.map(t => t.name).join(', ')}
                        </p>
                        <p className="text-gray-700 font-medium">💰 Prix: DZD{project.price}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
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
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      {client.email && <p className="text-sm text-gray-600">📧 {client.email}</p>}
                      <p className="text-sm text-gray-600">📍 {client.address}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Projets:</span>
                        <span className="font-medium text-pink-600">{client.totalProjects}</span>
                      </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouveau Devis
              </button>
            </div>
            {quotes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun devis</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{quote.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{quote.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.status === 'accepted' ? 'Accepté' :
                         quote.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Surface: {quote.surface} m²</p>
                      <p className="text-gray-700 font-medium text-lg">💰 Total: DZD{quote.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipe</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouveau Membre
              </button>
            </div>
            {team.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun membre</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {team.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.status === 'available' ? 'bg-green-100 text-green-800' :
                        member.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'available' ? 'Disponible' :
                         member.status === 'busy' ? 'Occupé' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {member.phone}</p>
                      <p className="text-sm text-gray-600">📧 {member.email}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        Rôle: {member.role === 'painter' ? 'Peintre' :
                               member.role === 'supervisor' ? 'Superviseur' : 'Apprenti'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Projets:</span>
                        <span className="font-medium text-gray-900">{member.totalProjects}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
