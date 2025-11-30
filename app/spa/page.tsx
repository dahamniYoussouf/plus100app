'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Calendar, Sparkles, BarChart3, TrendingUp, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'services' | 'appointments' | 'clients'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: 'massage' | 'facial' | 'body' | 'wellness'
  available: boolean
}

interface Appointment {
  id: string
  clientId: string
  clientName: string
  serviceId: string
  serviceName: string
  date: Date
  time: string
  duration: number
  price: number
  status: 'scheduled' | 'completed' | 'cancelled'
  therapist?: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  preferences?: string[]
  visitCount: number
  lastVisit?: Date
}

export default function SpaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const savedServices = localStorage.getItem('spa-services')
    const savedAppointments = localStorage.getItem('spa-appointments')
    const savedClients = localStorage.getItem('spa-clients')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        {
          id: '1',
          name: 'Massage Relaxant',
          description: 'Massage complet du corps pour détente profonde',
          duration: 60,
          price: 80,
          category: 'massage',
          available: true,
        },
        {
          id: '2',
          name: 'Soin Visage',
          description: 'Soin complet du visage avec produits naturels',
          duration: 45,
          price: 65,
          category: 'facial',
          available: true,
        },
        {
          id: '3',
          name: 'Enveloppement Corps',
          description: 'Enveloppement au miel et argile pour peau douce',
          duration: 75,
          price: 95,
          category: 'body',
          available: true,
        },
        {
          id: '4',
          name: 'Sauna & Hammam',
          description: 'Séance complète sauna et hammam traditionnel',
          duration: 90,
          price: 50,
          category: 'wellness',
          available: true,
        },
      ]
      setServices(sample)
      localStorage.setItem('spa-services', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
        lastVisit: a.lastVisit ? new Date(a.lastVisit) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Appointment[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Fatima Kadri',
          serviceId: '1',
          serviceName: 'Massage Relaxant',
          date: today,
          time: '14:00',
          duration: 60,
          price: 80,
          status: 'scheduled',
          therapist: 'Sarah',
        },
      ]
      setAppointments(sample)
      localStorage.setItem('spa-appointments', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          preferences: ['Massage', 'Relaxation'],
          visitCount: 5,
          lastVisit: new Date('2024-01-15'),
        },
      ]
      setClients(sample)
      localStorage.setItem('spa-clients', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('spa-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('spa-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('spa-clients', JSON.stringify(clients))
  }, [clients])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'services' as TabType, label: 'Services', icon: Sparkles },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
  ]

  const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0)
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled')
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' &&
      a.date.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
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
                      ? 'text-rose-600 border-b-2 border-rose-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Services</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                  </div>
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{totalRevenue}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {todayAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Rendez-vous d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{apt.clientName}</span>
                        <span className="text-gray-500 ml-2">- {apt.serviceName}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{apt.time}</span>
                        <span className="text-gray-500">({apt.duration} min)</span>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Services Bien-être</h3>
                  <p className="text-sm text-gray-600">Massages, soins, hammam et plus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des séances</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et préférences</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Thérapeutes</h3>
                  <p className="text-sm text-gray-600">Gestion des praticiens et planning</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                Ajouter Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{service.name}</h3>
                    <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded text-xs capitalize whitespace-nowrap">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{service.duration} min</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900">€{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rendez-vous</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                Nouveau RDV
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun rendez-vous programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{apt.serviceName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time} ({apt.duration} min)
                        </p>
                        {apt.therapist && (
                          <p className="text-sm text-gray-500 mt-1">Thérapeute: {apt.therapist}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status === 'completed' ? 'Terminé' :
                           apt.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">€{apt.price}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{client.phone}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Visites</p>
                        <p className="font-bold text-rose-600">{client.visitCount}</p>
                      </div>
                      {client.preferences && client.preferences.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Préférences</p>
                          <div className="flex flex-wrap gap-1">
                            {client.preferences.slice(0, 2).map((pref, i) => (
                              <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded text-xs">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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