'use client'

import { useState, useEffect } from 'react'
import { UtensilsCrossed, Calendar, Users, Package, BarChart3, TrendingUp, MapPin, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'events' | 'menus' | 'orders' | 'clients'

interface Event {
  id: string
  name: string
  clientName: string
  clientPhone: string
  date: Date
  time: string
  location: string
  guestCount: number
  type: 'wedding' | 'corporate' | 'birthday' | 'anniversary' | 'other'
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  totalPrice: number
  deposit?: number
  notes?: string
}

interface Menu {
  id: string
  name: string
  description: string
  pricePerPerson: number
  category: 'starter' | 'main' | 'dessert' | 'full'
  items: string[]
  available: boolean
}

interface Order {
  id: string
  eventId: string
  eventName: string
  menuId: string
  menuName: string
  quantity: number
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  createdAt: Date
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  eventCount: number
  totalSpent: number
  lastEvent?: Date
}

export default function CateringPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [events, setEvents] = useState<Event[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const savedEvents = localStorage.getItem('catering-events')
    const savedMenus = localStorage.getItem('catering-menus')
    const savedOrders = localStorage.getItem('catering-orders')
    const savedClients = localStorage.getItem('catering-clients')

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      })))
    } else {
      const today = new Date()
      const sample: Event[] = [
        {
          id: '1',
          name: 'Mariage Fatima & Ahmed',
          clientName: 'Fatima Benali',
          clientPhone: '+213 555 1234',
          date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          time: '18:00',
          location: 'Salle des Fêtes, Alger',
          guestCount: 150,
          type: 'wedding',
          status: 'confirmed',
          totalPrice: 4500,
          deposit: 1500,
          notes: 'Menu halal requis, service complet',
        },
        {
          id: '2',
          name: 'Anniversaire Entreprise',
          clientName: 'Mohamed Kadri',
          clientPhone: '+213 555 5678',
          date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
          time: '12:00',
          location: 'Siège Social, Oran',
          guestCount: 50,
          type: 'corporate',
          status: 'pending',
          totalPrice: 1200,
        },
      ]
      setEvents(sample)
      localStorage.setItem('catering-events', JSON.stringify(sample))
    }

    if (savedMenus) {
      setMenus(JSON.parse(savedMenus))
    } else {
      const sample: Menu[] = [
        {
          id: '1',
          name: 'Menu Mariage Premium',
          description: 'Menu complet pour mariage avec entrées, plats principaux et desserts',
          pricePerPerson: 30,
          category: 'full',
          items: ['Salade variée', 'Couscous royal', 'Tajine d\'agneau', 'Pâtisseries orientales', 'Fruits frais'],
          available: true,
        },
        {
          id: '2',
          name: 'Menu Corporate',
          description: 'Menu professionnel pour événements d\'entreprise',
          pricePerPerson: 25,
          category: 'full',
          items: ['Buffet froid', 'Plats chauds variés', 'Desserts', 'Café et thé'],
          available: true,
        },
        {
          id: '3',
          name: 'Menu Anniversaire',
          description: 'Menu festif pour anniversaires',
          pricePerPerson: 20,
          category: 'full',
          items: ['Amuse-bouches', 'Plats variés', 'Gâteau d\'anniversaire', 'Boissons'],
          available: true,
        },
      ]
      setMenus(sample)
      localStorage.setItem('catering-menus', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastEvent: c.lastEvent ? new Date(c.lastEvent) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Fatima Benali',
          email: 'fatima@email.com',
          phone: '+213 555 1234',
          address: 'Alger',
          eventCount: 2,
          totalSpent: 6000,
          lastEvent: new Date('2024-01-15'),
        },
      ]
      setClients(sample)
      localStorage.setItem('catering-clients', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('catering-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (menus.length > 0) localStorage.setItem('catering-menus', JSON.stringify(menus))
  }, [menus])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('catering-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('catering-clients', JSON.stringify(clients))
  }, [clients])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
    { id: 'menus' as TabType, label: 'Menus', icon: UtensilsCrossed },
    { id: 'orders' as TabType, label: 'Commandes', icon: Package },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
  ]

  const totalRevenue = events.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.totalPrice, 0)
  const upcomingEvents = events.filter(e => e.status === 'confirmed' || e.status === 'pending')
  const todayEvents = events.filter(e => {
    const today = new Date()
    return (e.status === 'confirmed' || e.status === 'pending') &&
      e.date.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                      ? 'text-purple-600 border-b-2 border-purple-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Événements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{events.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayEvents.length}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {todayEvents.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Événements d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{event.name}</span>
                        <span className="text-gray-500 ml-2">- {event.location}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{event.time}</span>
                        <span className="text-gray-500">({event.guestCount} invités)</span>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Événements</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des événements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Menus Personnalisés</h3>
                  <p className="text-sm text-gray-600">Création de menus adaptés à chaque événement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Gestion des commandes et livraisons</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et historique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Devis & Factures</h3>
                  <p className="text-sm text-gray-600">Génération de devis et factures</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            event.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status === 'completed' ? 'Terminé' :
                             event.status === 'cancelled' ? 'Annulé' :
                             event.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-4">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{event.guestCount} invités</span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs capitalize">
                              {event.type === 'wedding' ? 'Mariage' :
                               event.type === 'corporate' ? 'Entreprise' :
                               event.type === 'birthday' ? 'Anniversaire' :
                               event.type === 'anniversary' ? 'Anniversaire de mariage' : 'Autre'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">Client: {event.clientName}</span>
                            <span className="text-gray-500">{event.clientPhone}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-gray-900">DZD{event.totalPrice}</span>
                            {event.deposit && (
                              <span className="text-sm text-gray-500">Acompte: DZD{event.deposit}</span>
                            )}
                          </div>
                          {event.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-xs text-gray-600">{event.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'menus' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menus</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau Menu
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {menus.map((menu) => (
                <div key={menu.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{menu.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{menu.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Contenu du menu:</p>
                    <ul className="space-y-1">
                      {menu.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">DZD{menu.pricePerPerson}/personne</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      menu.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {menu.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commandes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.eventName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.menuName} x {order.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">DZD{order.total}</span>
                        <span className={`block mt-1 px-2 py-1 rounded text-xs ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livré' :
                           order.status === 'ready' ? 'Prêt' :
                           order.status === 'preparing' ? 'En préparation' : 'En attente'}
                        </span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                        <p className="text-xs text-gray-500">Événements</p>
                        <p className="font-bold text-purple-600">{client.eventCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total dépensé</p>
                        <p className="font-bold text-gray-900">DZD{client.totalSpent}</p>
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
