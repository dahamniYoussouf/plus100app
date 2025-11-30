'use client'

import { useState, useEffect } from 'react'
import { Zap, Calendar, Users, FileText, BarChart3, DollarSign, Wrench } from 'lucide-react'

type TabType = 'dashboard' | 'interventions' | 'clients' | 'quotes' | 'technicians'

interface Intervention {
  id: string
  clientId: string
  clientName: string
  address: string
  type: 'repair' | 'installation' | 'maintenance' | 'emergency' | 'inspection'
  description: string
  scheduledDate: Date
  scheduledTime: string
  technicianId?: string
  technicianName?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  price?: number
  duration?: number
  notes?: string
}

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  totalInterventions: number
  lastIntervention?: Date
}

interface Quote {
  id: string
  clientId: string
  clientName: string
  description: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
  validUntil?: Date
}

interface Technician {
  id: string
  name: string
  phone: string
  email: string
  specializations: string[]
  status: 'available' | 'busy' | 'off_duty'
  totalInterventions: number
}

export default function ElectricianPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])

  useEffect(() => {
    const savedInterventions = localStorage.getItem('electrician-interventions')
    const savedClients = localStorage.getItem('electrician-clients')
    const savedQuotes = localStorage.getItem('electrician-quotes')
    const savedTechnicians = localStorage.getItem('electrician-technicians')

    if (savedInterventions) {
      const parsed = JSON.parse(savedInterventions)
      setInterventions(parsed.map((i: any) => ({
        ...i,
        scheduledDate: new Date(i.scheduledDate),
      })))
    } else {
      const today = new Date()
      const sample: Intervention[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Fatima Kadri',
          address: '456 Avenue de la Paix, Oran',
          type: 'repair',
          description: 'Réparation panne électrique',
          scheduledDate: today,
          scheduledTime: '14:00',
          technicianId: '1',
          technicianName: 'Karim Benali',
          status: 'scheduled',
          price: 120,
          duration: 90,
        },
      ]
      setInterventions(sample)
      localStorage.setItem('electrician-interventions', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastIntervention: c.lastIntervention ? new Date(c.lastIntervention) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Fatima Kadri',
          phone: '+213 555 5678',
          address: '456 Avenue de la Paix, Oran',
          totalInterventions: 2,
        },
      ]
      setClients(sample)
      localStorage.setItem('electrician-clients', JSON.stringify(sample))
    }

    if (savedQuotes) {
      const parsed = JSON.parse(savedQuotes)
      setQuotes(parsed.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        validUntil: q.validUntil ? new Date(q.validUntil) : undefined,
      })))
    }

    if (savedTechnicians) {
      setTechnicians(JSON.parse(savedTechnicians))
    } else {
      const sample: Technician[] = [
        {
          id: '1',
          name: 'Karim Benali',
          phone: '+213 555 2222',
          email: 'karim@electrician.com',
          specializations: ['Réparations', 'Installations électriques'],
          status: 'available',
          totalInterventions: 60,
        },
      ]
      setTechnicians(sample)
      localStorage.setItem('electrician-technicians', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (interventions.length > 0) localStorage.setItem('electrician-interventions', JSON.stringify(interventions))
  }, [interventions])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('electrician-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (quotes.length > 0) localStorage.setItem('electrician-quotes', JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    if (technicians.length > 0) localStorage.setItem('electrician-technicians', JSON.stringify(technicians))
  }, [technicians])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'interventions' as TabType, label: 'Interventions', icon: Wrench },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'quotes' as TabType, label: 'Devis', icon: FileText },
    { id: 'technicians' as TabType, label: 'Techniciens', icon: Users },
  ]

  const todayInterventions = interventions.filter(i => {
    const today = new Date()
    return i.scheduledDate.toDateString() === today.toDateString() && i.status !== 'completed'
  })
  const totalRevenue = interventions.filter(i => i.status === 'completed').reduce((sum, i) => sum + (i.price || 0), 0)
  const activeInterventions = interventions.filter(i => i.status === 'in_progress').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
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
                      ? 'text-yellow-600 border-b-2 border-yellow-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Interventions Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayInterventions.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeInterventions}</p>
                  </div>
                  <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Interventions</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des interventions électriques</p>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Techniciens</h3>
                  <p className="text-sm text-gray-600">Gestion des techniciens et planning</p>
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

        {activeTab === 'interventions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Interventions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouvelle Intervention
              </button>
            </div>
            {interventions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune intervention</p>
              </div>
            ) : (
              <div className="space-y-4">
                {interventions.map((intervention) => (
                  <div key={intervention.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{intervention.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{intervention.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        intervention.status === 'completed' ? 'bg-green-100 text-green-800' :
                        intervention.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        intervention.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {intervention.status === 'completed' ? 'Terminée' :
                         intervention.status === 'in_progress' ? 'En cours' :
                         intervention.status === 'cancelled' ? 'Annulée' : 'Programmée'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">📍 {intervention.address}</p>
                      <p className="text-gray-600 capitalize">
                        Type: {intervention.type === 'repair' ? 'Réparation' :
                               intervention.type === 'installation' ? 'Installation' :
                               intervention.type === 'maintenance' ? 'Maintenance' :
                               intervention.type === 'emergency' ? 'Urgence' : 'Inspection'}
                      </p>
                      <p className="text-gray-600">
                        📅 {new Date(intervention.scheduledDate).toLocaleDateString('fr-FR')} à {intervention.scheduledTime}
                      </p>
                      {intervention.technicianName && (
                        <p className="text-gray-600">👤 Technicien: {intervention.technicianName}</p>
                      )}
                      {intervention.duration && (
                        <p className="text-gray-600">⏱️ Durée: {intervention.duration} min</p>
                      )}
                      {intervention.price && (
                        <p className="text-gray-700 font-medium">💰 Prix: DZD{intervention.price}</p>
                      )}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
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
                        <span className="text-gray-500">Interventions:</span>
                        <span className="font-medium text-yellow-600">{client.totalInterventions}</span>
                      </div>
                      {client.lastIntervention && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernière:</span>
                          <span className="text-gray-600">{new Date(client.lastIntervention).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
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
                      <p className="text-gray-600">
                        📅 Créé le: {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-700 font-medium text-lg">💰 Total: DZD{quote.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'technicians' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Techniciens</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouveau Technicien
              </button>
            </div>
            {technicians.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun technicien</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {technicians.map((tech) => (
                  <div key={tech.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{tech.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tech.status === 'available' ? 'bg-green-100 text-green-800' :
                        tech.status === 'busy' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tech.status === 'available' ? 'Disponible' :
                         tech.status === 'busy' ? 'Occupé' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {tech.phone}</p>
                      <p className="text-sm text-gray-600">📧 {tech.email}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tech.specializations.map((spec, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Interventions:</span>
                        <span className="font-medium text-gray-900">{tech.totalInterventions}</span>
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
