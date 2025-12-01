'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Users, Briefcase, TrendingUp, Phone, Mail, Calendar, BarChart3, DollarSign, Target } from 'lucide-react'

type TabType = 'dashboard' | 'contacts' | 'opportunities' | 'sales'

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  position?: string
  status: 'lead' | 'customer' | 'partner'
  tags: string[]
  lastContact?: Date
  notes?: string
}

interface Opportunity {
  id: string
  contactId: string
  contactName: string
  title: string
  value: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expectedCloseDate: Date
  notes?: string
}

interface Sale {
  id: string
  contactId: string
  contactName: string
  product: string
  amount: number
  date: Date
  status: 'completed' | 'pending'
}

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [showContactModal, setShowContactModal] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '', position: '', status: 'lead' as 'lead' | 'customer' | 'partner' })

  useEffect(() => {
    const savedContacts = localStorage.getItem('crm-contacts')
    const savedOpportunities = localStorage.getItem('crm-opportunities')
    const savedSales = localStorage.getItem('crm-sales')

    if (savedContacts) {
      const parsed = JSON.parse(savedContacts)
      setContacts(parsed.map((c: any) => ({
        ...c,
        lastContact: c.lastContact ? new Date(c.lastContact) : undefined,
      })))
    } else {
      const sample: Contact[] = [
        {
          id: '1',
          name: 'Mohamed Ali',
          email: 'mohamed@company.com',
          phone: '+213 555 1234',
          company: 'Tech Solutions',
          position: 'Directeur',
          status: 'customer',
          tags: ['VIP', 'Technologie'],
          lastContact: new Date('2024-01-20'),
        },
        {
          id: '2',
          name: 'Aicha Benali',
          email: 'aicha@enterprise.com',
          phone: '+213 555 5678',
          company: 'Enterprise Corp',
          position: 'Responsable Achat',
          status: 'lead',
          tags: ['Prospect'],
        },
      ]
      setContacts(sample)
      localStorage.setItem('crm-contacts', JSON.stringify(sample))
    }

    if (savedOpportunities) {
      const parsed = JSON.parse(savedOpportunities)
      setOpportunities(parsed.map((o: any) => ({
        ...o,
        expectedCloseDate: new Date(o.expectedCloseDate),
      })))
    } else {
      const sample: Opportunity[] = [
        {
          id: '1',
          contactId: '2',
          contactName: 'Aicha Benali',
          title: 'Contrat Enterprise - Système CRM',
          value: 25000,
          stage: 'proposal',
          probability: 60,
          expectedCloseDate: new Date('2024-02-28'),
        },
      ]
      setOpportunities(sample)
      localStorage.setItem('crm-opportunities', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date),
      })))
    } else {
      const sample: Sale[] = [
        {
          id: '1',
          contactId: '1',
          contactName: 'Mohamed Ali',
          product: 'Solution CRM Premium',
          amount: 15000,
          date: new Date('2024-01-15'),
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('crm-sales', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (contacts.length > 0) localStorage.setItem('crm-contacts', JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    if (opportunities.length > 0) localStorage.setItem('crm-opportunities', JSON.stringify(opportunities))
  }, [opportunities])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('crm-sales', JSON.stringify(sales))
  }, [sales])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'contacts' as TabType, label: 'Contacts', icon: Users },
    { id: 'opportunities' as TabType, label: 'Opportunités', icon: Target },
    { id: 'sales' as TabType, label: 'Ventes', icon: DollarSign },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0)
  const activeOpportunities = opportunities.filter(o => 
    o.stage !== 'closed_won' && o.stage !== 'closed_lost'
  )
  const pipelineValue = activeOpportunities.reduce((sum, o) => sum + o.value, 0)
  const customers = contacts.filter(c => c.status === 'customer').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Contacts</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{contacts.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{customers}</p>
                  </div>
                  <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pipeline</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{(pipelineValue / 1000).toFixed(0)}k</p>
                  </div>
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{(totalRevenue / 1000).toFixed(0)}k</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {activeOpportunities.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Opportunités Actives</h3>
                <div className="space-y-2">
                  {activeOpportunities.slice(0, 3).map((opp) => (
                    <div key={opp.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{opp.title}</span>
                        <span className="text-gray-500 ml-2">- {opp.contactName}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <span className="font-semibold text-blue-700">DZD{opp.value.toLocaleString()}</span>
                        <span className="text-gray-500">({opp.probability}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Contacts</h3>
                  <p className="text-sm text-gray-600">Base de données complète de contacts et clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Pipeline Ventes</h3>
                  <p className="text-sm text-gray-600">Suivi des opportunités et étapes de vente</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Historique Ventes</h3>
                  <p className="text-sm text-gray-600">Suivi des transactions et revenus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tâches & Rappels</h3>
                  <p className="text-sm text-gray-600">Gestion des tâches et rappels de contact</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Analyses et statistiques détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Segmentation</h3>
                  <p className="text-sm text-gray-600">Catégorisation et tags des contacts</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contacts</h2>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Nouveau Contact
              </button>
            </div>
            {contacts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun contact enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
                    {contact.company && (
                      <p className="text-sm text-gray-600 mb-1">{contact.company}</p>
                    )}
                    {contact.position && (
                      <p className="text-xs text-gray-500 mb-2">{contact.position}</p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                        contact.status === 'partner' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.status === 'customer' ? 'Client' :
                         contact.status === 'partner' ? 'Partenaire' : 'Lead'}
                      </span>
                      {contact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Opportunités</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouvelle Opportunité
              </button>
            </div>
            {opportunities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune opportunité enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Contact: {opp.contactName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Date prévue: {new Date(opp.expectedCloseDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{opp.value.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            opp.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                            opp.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                            opp.stage === 'negotiation' ? 'bg-blue-100 text-blue-800' :
                            opp.stage === 'proposal' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {opp.stage === 'closed_won' ? 'Gagné' :
                             opp.stage === 'closed_lost' ? 'Perdu' :
                             opp.stage === 'negotiation' ? 'Négociation' :
                             opp.stage === 'proposal' ? 'Proposition' :
                             opp.stage === 'qualification' ? 'Qualification' : 'Prospection'}
                          </span>
                          <span className="text-sm text-gray-500">({opp.probability}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouvelle Vente
              </button>
            </div>
            {sales.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{sale.product}</h3>
                        <p className="text-sm text-gray-600 mt-1">{sale.contactName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(sale.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{sale.amount.toLocaleString()}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sale.status === 'completed' ? 'Complétée' : 'En attente'}
                        </span>
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
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setNewContact({ name: '', email: '', phone: '', company: '', position: '', status: 'lead' })
        }}
        title="Nouveau Contact"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise (optionnel)</label>
              <input
                type="text"
                value={newContact.company}
                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Société ABC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste (optionnel)</label>
              <input
                type="text"
                value={newContact.position}
                onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Directeur"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={newContact.status}
              onChange={(e) => setNewContact({ ...newContact, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="lead">Prospect</option>
              <option value="customer">Client</option>
              <option value="partner">Partenaire</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowContactModal(false)
                setNewContact({ name: '', email: '', phone: '', company: '', position: '', status: 'lead' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newContact.name && newContact.email && newContact.phone) {
                  const contact: Contact = {
                    id: Date.now().toString(),
                    name: newContact.name,
                    email: newContact.email,
                    phone: newContact.phone,
                    company: newContact.company || undefined,
                    position: newContact.position || undefined,
                    status: newContact.status,
                    tags: [],
                  }
                  setContacts([...contacts, contact])
                  setShowContactModal(false)
                  setNewContact({ name: '', email: '', phone: '', company: '', position: '', status: 'lead' })
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}