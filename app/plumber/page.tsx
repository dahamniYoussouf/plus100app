'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Droplet, Calendar, Users, FileText, BarChart3, DollarSign, Wrench, MapPin } from 'lucide-react'

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
  completedDate?: Date
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

export default function PlumberPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [showInterventionModal, setShowInterventionModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showTechnicianModal, setShowTechnicianModal] = useState(false)
  const [newIntervention, setNewIntervention] = useState({ clientId: '', address: '', type: 'repair' as 'repair' | 'installation' | 'maintenance' | 'emergency' | 'inspection', description: '', scheduledDate: '', scheduledTime: '', technicianId: '', price: 0, duration: 0 })
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '', address: '' })
  const [newQuote, setNewQuote] = useState({ clientId: '', description: '', items: [{ name: '', quantity: 1, price: 0 }], validUntil: '' })
  const [newTechnician, setNewTechnician] = useState({ name: '', phone: '', email: '', specializations: [] as string[] })

  useEffect(() => {
    const savedInterventions = localStorage.getItem('plumber-interventions')
    const savedClients = localStorage.getItem('plumber-clients')
    const savedQuotes = localStorage.getItem('plumber-quotes')
    const savedTechnicians = localStorage.getItem('plumber-technicians')

    if (savedInterventions) {
      const parsed = JSON.parse(savedInterventions)
      setInterventions(parsed.map((i: any) => ({
        ...i,
        scheduledDate: new Date(i.scheduledDate),
        completedDate: i.completedDate ? new Date(i.completedDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Intervention[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Ahmed Benali',
          address: '123 Rue des Fleurs, Alger',
          type: 'repair',
          description: 'Réparation fuite robinet cuisine',
          scheduledDate: today,
          scheduledTime: '10:00',
          technicianId: '1',
          technicianName: 'Omar Amrani',
          status: 'scheduled',
          price: 80,
          duration: 60,
        },
      ]
      setInterventions(sample)
      localStorage.setItem('plumber-interventions', JSON.stringify(sample))
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
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          address: '123 Rue des Fleurs, Alger',
          totalInterventions: 3,
          lastIntervention: new Date('2024-01-15'),
        },
      ]
      setClients(sample)
      localStorage.setItem('plumber-clients', JSON.stringify(sample))
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
          name: 'Omar Amrani',
          phone: '+213 555 1111',
          email: 'omar@plumber.com',
          specializations: ['Réparations', 'Installations'],
          status: 'available',
          totalInterventions: 45,
        },
      ]
      setTechnicians(sample)
      localStorage.setItem('plumber-technicians', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (interventions.length > 0) localStorage.setItem('plumber-interventions', JSON.stringify(interventions))
  }, [interventions])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('plumber-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (quotes.length > 0) localStorage.setItem('plumber-quotes', JSON.stringify(quotes))
  }, [quotes])

  useEffect(() => {
    if (technicians.length > 0) localStorage.setItem('plumber-technicians', JSON.stringify(technicians))
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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
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
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Interventions Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayInterventions.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeInterventions}</p>
                  </div>
                  <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
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
                  <p className="text-sm text-gray-600">Planification et suivi des interventions</p>
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
              <button 
                onClick={() => setShowInterventionModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
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
                      {intervention.notes && (
                        <p className="text-gray-500 text-xs mt-1">Note: {intervention.notes}</p>
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
              <button 
                onClick={() => setShowClientModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
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
                        <span className="font-medium text-cyan-600">{client.totalInterventions}</span>
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
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
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
                      {quote.validUntil && (
                        <p className="text-gray-600">
                          ⏰ Valide jusqu'au: {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                        </p>
                      )}
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
              <button 
                onClick={() => setShowTechnicianModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
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
                          <span key={idx} className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded text-xs">
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

      {/* Modals */}
      <Modal
        isOpen={showInterventionModal}
        onClose={() => {
          setShowInterventionModal(false)
          setNewIntervention({ clientId: '', address: '', type: 'repair', description: '', scheduledDate: '', scheduledTime: '', technicianId: '', price: 0, duration: 0 })
        }}
        title="Nouvelle Intervention"
        size="lg"
      >
        <div className="space-y-4">
          {clients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newIntervention.clientId}
                onChange={(e) => setNewIntervention({ ...newIntervention, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newIntervention.address}
              onChange={(e) => setNewIntervention({ ...newIntervention, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Adresse de l'intervention"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newIntervention.type}
                onChange={(e) => setNewIntervention({ ...newIntervention, type: e.target.value as 'repair' | 'installation' | 'maintenance' | 'emergency' | 'inspection' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="repair">Réparation</option>
                <option value="installation">Installation</option>
                <option value="maintenance">Maintenance</option>
                <option value="emergency">Urgence</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>
            {technicians.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
                <select
                  value={newIntervention.technicianId}
                  onChange={(e) => setNewIntervention({ ...newIntervention, technicianId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un technicien</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newIntervention.description}
              onChange={(e) => setNewIntervention({ ...newIntervention, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={3}
              placeholder="Description de l'intervention..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newIntervention.scheduledDate}
                onChange={(e) => setNewIntervention({ ...newIntervention, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newIntervention.scheduledTime}
                onChange={(e) => setNewIntervention({ ...newIntervention, scheduledTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD, optionnel)</label>
              <input
                type="number"
                value={newIntervention.price}
                onChange={(e) => setNewIntervention({ ...newIntervention, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes, optionnel)</label>
              <input
                type="number"
                value={newIntervention.duration}
                onChange={(e) => setNewIntervention({ ...newIntervention, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowInterventionModal(false)
                setNewIntervention({ clientId: '', address: '', type: 'repair', description: '', scheduledDate: '', scheduledTime: '', technicianId: '', price: 0, duration: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newIntervention.clientId && newIntervention.address && newIntervention.description && newIntervention.scheduledDate && newIntervention.scheduledTime) {
                  const client = clients.find(c => c.id === newIntervention.clientId)
                  const technician = newIntervention.technicianId ? technicians.find(t => t.id === newIntervention.technicianId) : undefined
                  if (client) {
                    const intervention: Intervention = {
                      id: Date.now().toString(),
                      clientId: newIntervention.clientId,
                      clientName: client.name,
                      address: newIntervention.address,
                      type: newIntervention.type,
                      description: newIntervention.description,
                      scheduledDate: new Date(newIntervention.scheduledDate),
                      scheduledTime: newIntervention.scheduledTime,
                      technicianId: newIntervention.technicianId || undefined,
                      technicianName: technician?.name,
                      status: 'scheduled',
                      price: newIntervention.price > 0 ? newIntervention.price : undefined,
                      duration: newIntervention.duration > 0 ? newIntervention.duration : undefined,
                    }
                    setInterventions([...interventions, intervention])
                    setShowInterventionModal(false)
                    setNewIntervention({ clientId: '', address: '', type: 'repair', description: '', scheduledDate: '', scheduledTime: '', technicianId: '', price: 0, duration: 0 })
                  }
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false)
          setNewClient({ name: '', phone: '', email: '', address: '' })
        }}
        title="Nouveau Client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newClient.address}
              onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Adresse complète"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowClientModal(false)
                setNewClient({ name: '', phone: '', email: '', address: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newClient.name && newClient.phone && newClient.address) {
                  const client: Client = {
                    id: Date.now().toString(),
                    name: newClient.name,
                    phone: newClient.phone,
                    email: newClient.email || undefined,
                    address: newClient.address,
                    totalInterventions: 0,
                  }
                  setClients([...clients, client])
                  setShowClientModal(false)
                  setNewClient({ name: '', phone: '', email: '', address: '' })
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false)
          setNewQuote({ clientId: '', description: '', items: [{ name: '', quantity: 1, price: 0 }], validUntil: '' })
        }}
        title="Nouveau Devis"
        size="lg"
      >
        <div className="space-y-4">
          {clients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newQuote.clientId}
                onChange={(e) => setNewQuote({ ...newQuote, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newQuote.description}
              onChange={(e) => setNewQuote({ ...newQuote, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              rows={3}
              placeholder="Description du devis..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Articles</label>
            {newQuote.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updatedItems = [...newQuote.items]
                    updatedItems[idx].name = e.target.value
                    setNewQuote({ ...newQuote, items: updatedItems })
                  }}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Nom"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...newQuote.items]
                    updatedItems[idx].quantity = parseInt(e.target.value) || 1
                    setNewQuote({ ...newQuote, items: updatedItems })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  min="1"
                  placeholder="Qté"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const updatedItems = [...newQuote.items]
                      updatedItems[idx].price = parseFloat(e.target.value) || 0
                      setNewQuote({ ...newQuote, items: updatedItems })
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    min="0"
                    placeholder="Prix"
                  />
                  {newQuote.items.length > 1 && (
                    <button
                      onClick={() => {
                        setNewQuote({ ...newQuote, items: newQuote.items.filter((_, i) => i !== idx) })
                      }}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setNewQuote({ ...newQuote, items: [...newQuote.items, { name: '', quantity: 1, price: 0 }] })
              }}
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              + Ajouter un article
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valide jusqu'au (optionnel)</label>
            <input
              type="date"
              value={newQuote.validUntil}
              onChange={(e) => setNewQuote({ ...newQuote, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowQuoteModal(false)
                setNewQuote({ clientId: '', description: '', items: [{ name: '', quantity: 1, price: 0 }], validUntil: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newQuote.clientId && newQuote.description && newQuote.items.every(item => item.name && item.quantity > 0 && item.price > 0)) {
                  const client = clients.find(c => c.id === newQuote.clientId)
                  if (client) {
                    const total = newQuote.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
                    const quote: Quote = {
                      id: Date.now().toString(),
                      clientId: newQuote.clientId,
                      clientName: client.name,
                      description: newQuote.description,
                      items: newQuote.items,
                      total,
                      status: 'pending',
                      createdAt: new Date(),
                      validUntil: newQuote.validUntil ? new Date(newQuote.validUntil) : undefined,
                    }
                    setQuotes([...quotes, quote])
                    setShowQuoteModal(false)
                    setNewQuote({ clientId: '', description: '', items: [{ name: '', quantity: 1, price: 0 }], validUntil: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTechnicianModal}
        onClose={() => {
          setShowTechnicianModal(false)
          setNewTechnician({ name: '', phone: '', email: '', specializations: [] })
        }}
        title="Nouveau Technicien"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newTechnician.name}
              onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newTechnician.phone}
                onChange={(e) => setNewTechnician({ ...newTechnician, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newTechnician.email}
                onChange={(e) => setNewTechnician({ ...newTechnician, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spécialisations (séparées par des virgules)</label>
            <input
              type="text"
              value={newTechnician.specializations.join(', ')}
              onChange={(e) => setNewTechnician({ ...newTechnician, specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ex: Réparation, Installation, Maintenance"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTechnicianModal(false)
                setNewTechnician({ name: '', phone: '', email: '', specializations: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newTechnician.name && newTechnician.phone && newTechnician.email) {
                  const technician: Technician = {
                    id: Date.now().toString(),
                    name: newTechnician.name,
                    phone: newTechnician.phone,
                    email: newTechnician.email,
                    specializations: newTechnician.specializations,
                    status: 'available',
                    totalInterventions: 0,
                  }
                  setTechnicians([...technicians, technician])
                  setShowTechnicianModal(false)
                  setNewTechnician({ name: '', phone: '', email: '', specializations: [] })
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
