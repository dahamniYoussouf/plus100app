'use client'

import { useState, useEffect } from 'react'
import { Flag, Users, Calendar, Ticket, BarChart3, MapPin, Clock, TrendingUp, Package, Star, UtensilsCrossed } from 'lucide-react'

type TabType = 'dashboard' | 'attractions' | 'visitors' | 'tickets' | 'restaurants' | 'events'

interface Attraction {
  id: string
  name: string
  description: string
  type: 'roller_coaster' | 'water_ride' | 'family' | 'thrill' | 'kids' | 'show'
  capacity: number
  waitTime: number
  status: 'operational' | 'maintenance' | 'closed'
  minHeight?: number
  maxHeight?: number
  duration: number
  price: number
  visitors: number
  rating?: number
}

interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  visitDate: Date
  ticketType: 'adult' | 'child' | 'senior' | 'family' | 'season'
  attractions: string[]
  totalSpent: number
  wristband?: boolean
}

interface Ticket {
  id: string
  visitorId: string
  visitorName: string
  date: Date
  type: 'adult' | 'child' | 'senior' | 'family' | 'season'
  price: number
  quantity: number
  total: number
  paymentMethod: 'cash' | 'card' | 'online'
  status: 'valid' | 'used' | 'expired'
  validUntil?: Date
}

interface Restaurant {
  id: string
  name: string
  description: string
  type: 'fast_food' | 'restaurant' | 'cafe' | 'snack' | 'bar'
  location: string
  capacity: number
  currentOccupancy: number
  rating?: number
  menuItems: number
  revenue: number
  status: 'open' | 'closed' | 'maintenance'
}

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  type: 'show' | 'parade' | 'fireworks' | 'concert' | 'workshop'
  attendees: number
  capacity: number
  price: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export default function ParkPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const savedAttractions = localStorage.getItem('park-attractions')
    const savedVisitors = localStorage.getItem('park-visitors')
    const savedTickets = localStorage.getItem('park-tickets')
    const savedRestaurants = localStorage.getItem('park-restaurants')
    const savedEvents = localStorage.getItem('park-events')

    if (savedAttractions) {
      setAttractions(JSON.parse(savedAttractions))
    } else {
      const sample: Attraction[] = [
        { id: '1', name: 'Montagne Russe Extrême', description: 'Montagne russe à grande vitesse', type: 'roller_coaster', capacity: 24, waitTime: 45, status: 'operational', minHeight: 140, maxHeight: 200, duration: 3, price: 5, visitors: 1250, rating: 4.8 },
        { id: '2', name: 'Rivière Sauvage', description: 'Promenade en bateau dans la jungle', type: 'water_ride', capacity: 20, waitTime: 30, status: 'operational', minHeight: 100, duration: 8, price: 4, visitors: 980, rating: 4.6 },
        { id: '3', name: 'Carrousel Magique', description: 'Carrousel pour toute la famille', type: 'family', capacity: 40, waitTime: 10, status: 'operational', duration: 3, price: 3, visitors: 2100, rating: 4.7 },
        { id: '4', name: 'Tour de la Terreur', description: 'Tour d\'observation panoramique', type: 'thrill', capacity: 30, waitTime: 20, status: 'operational', minHeight: 120, duration: 5, price: 6, visitors: 850, rating: 4.9 },
        { id: '5', name: 'Parc Enfants', description: 'Zone de jeux pour enfants', type: 'kids', capacity: 50, waitTime: 5, status: 'operational', maxHeight: 120, duration: 0, price: 2, visitors: 3200, rating: 4.5 },
      ]
      setAttractions(sample)
      localStorage.setItem('park-attractions', JSON.stringify(sample))
    }

    if (savedVisitors) {
      const parsed = JSON.parse(savedVisitors)
      setVisitors(parsed.map((v: any) => ({ ...v, visitDate: new Date(v.visitDate) })))
    } else {
      const sample: Visitor[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', visitDate: new Date(), ticketType: 'adult', attractions: ['1', '2', '3'], totalSpent: 45, wristband: true },
        { id: '2', name: 'Ahmed Kadri', email: 'ahmed@email.com', phone: '+213 555 5678', visitDate: new Date(), ticketType: 'family', attractions: ['3', '5'], totalSpent: 80, wristband: true },
      ]
      setVisitors(sample)
      localStorage.setItem('park-visitors', JSON.stringify(sample))
    }

    if (savedTickets) {
      const parsed = JSON.parse(savedTickets)
      setTickets(parsed.map((t: any) => ({ ...t, date: new Date(t.date), validUntil: t.validUntil ? new Date(t.validUntil) : undefined })))
    } else {
      const today = new Date()
      const sample: Ticket[] = [
        { id: '1', visitorId: '1', visitorName: 'Sarah Benali', date: today, type: 'adult', price: 35, quantity: 1, total: 35, paymentMethod: 'card', status: 'valid', validUntil: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        { id: '2', visitorId: '2', visitorName: 'Ahmed Kadri', date: today, type: 'family', price: 120, quantity: 4, total: 120, paymentMethod: 'card', status: 'valid', validUntil: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
      ]
      setTickets(sample)
      localStorage.setItem('park-tickets', JSON.stringify(sample))
    }

    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants))
    } else {
      const sample: Restaurant[] = [
        { id: '1', name: 'Restaurant Principal', description: 'Restaurant avec vue panoramique', type: 'restaurant', location: 'Zone centrale', capacity: 150, currentOccupancy: 85, rating: 4.5, menuItems: 25, revenue: 12500, status: 'open' },
        { id: '2', name: 'Fast Food Express', description: 'Service rapide burgers et frites', type: 'fast_food', location: 'Zone enfants', capacity: 80, currentOccupancy: 45, rating: 4.2, menuItems: 15, revenue: 8500, status: 'open' },
        { id: '3', name: 'Café des Attractions', description: 'Café et snacks légers', type: 'cafe', location: 'Entrée principale', capacity: 50, currentOccupancy: 20, rating: 4.3, menuItems: 20, revenue: 3200, status: 'open' },
      ]
      setRestaurants(sample)
      localStorage.setItem('park-restaurants', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      const today = new Date()
      const sample: Event[] = [
        { id: '1', title: 'Parade des Personnages', description: 'Parade quotidienne avec mascottes', date: today, time: '15:00', location: 'Avenue principale', type: 'parade', attendees: 0, capacity: 1000, price: 0, status: 'upcoming' },
        { id: '2', title: 'Feu d\'Artifice Nocturne', description: 'Spectacle de feux d\'artifice', date: today, time: '21:00', location: 'Lac central', type: 'fireworks', attendees: 0, capacity: 2000, price: 0, status: 'upcoming' },
        { id: '3', title: 'Spectacle Musical', description: 'Spectacle de musique live', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), time: '19:00', location: 'Amphithéâtre', type: 'concert', attendees: 0, capacity: 500, price: 15, status: 'upcoming' },
      ]
      setEvents(sample)
      localStorage.setItem('park-events', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (attractions.length > 0) localStorage.setItem('park-attractions', JSON.stringify(attractions))
  }, [attractions])

  useEffect(() => {
    if (visitors.length > 0) localStorage.setItem('park-visitors', JSON.stringify(visitors))
  }, [visitors])

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('park-tickets', JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    if (restaurants.length > 0) localStorage.setItem('park-restaurants', JSON.stringify(restaurants))
  }, [restaurants])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('park-events', JSON.stringify(events))
  }, [events])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'attractions' as TabType, label: 'Attractions', icon: Flag },
    { id: 'visitors' as TabType, label: 'Visiteurs', icon: Users },
    { id: 'tickets' as TabType, label: 'Billets', icon: Ticket },
    { id: 'restaurants' as TabType, label: 'Restaurants', icon: UtensilsCrossed },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
  ]

  const totalRevenue = tickets.filter(t => t.status === 'valid' || t.status === 'used').reduce((sum, t) => sum + t.total, 0) + restaurants.reduce((sum, r) => sum + r.revenue, 0)
  const totalVisitors = visitors.length
  const operationalAttractions = attractions.filter(a => a.status === 'operational').length
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Visiteurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalVisitors}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Attractions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{operationalAttractions}</p>
                  </div>
                  <Flag className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Événements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Attractions populaires</h3>
                <div className="space-y-3">
                  {attractions.sort((a, b) => b.visitors - a.visitors).slice(0, 5).map((attraction) => (
                    <div key={attraction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{attraction.name}</p>
                        <p className="text-sm text-gray-500">Temps d'attente: {attraction.waitTime} min</p>
                        {attraction.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{attraction.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">{attraction.visitors} visiteurs</p>
                        <span className={`text-xs px-2 py-1 rounded-full  DZD{
                          attraction.status === 'operational' ? 'bg-green-100 text-green-800' :
                          attraction.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {attraction.status === 'operational' ? 'Opérationnelle' : attraction.status === 'maintenance' ? 'Maintenance' : 'Fermée'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Restaurants</h3>
                <div className="space-y-3">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{restaurant.name}</p>
                        <p className="text-sm text-gray-500">{restaurant.location}</p>
                        <p className="text-xs text-gray-500 mt-1">Occupation: {restaurant.currentOccupancy}/{restaurant.capacity}</p>
                        {restaurant.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{restaurant.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">DZD{restaurant.revenue.toFixed(0)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full  DZD{
                          restaurant.status === 'open' ? 'bg-green-100 text-green-800' :
                          restaurant.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {restaurant.status === 'open' ? 'Ouvert' : restaurant.status === 'closed' ? 'Fermé' : 'Maintenance'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Attractions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle attraction
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {attractions.map((attraction) => (
                <div key={attraction.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{attraction.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{attraction.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs  DZD{
                          attraction.status === 'operational' ? 'bg-green-100 text-green-800' :
                          attraction.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {attraction.status === 'operational' ? 'Opérationnelle' : attraction.status === 'maintenance' ? 'Maintenance' : 'Fermée'}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs capitalize">{attraction.type === 'roller_coaster' ? 'Montagne russe' : attraction.type === 'water_ride' ? 'Attraction aquatique' : attraction.type === 'family' ? 'Famille' : attraction.type === 'thrill' ? 'Sensation' : attraction.type === 'kids' ? 'Enfants' : 'Spectacle'}</span>
                        {attraction.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{attraction.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacité:</span>
                      <span className="font-medium text-gray-900">{attraction.capacity} personnes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temps d'attente:</span>
                      <span className="font-medium text-gray-900">{attraction.waitTime} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-medium text-gray-900">{attraction.duration} min</span>
                    </div>
                    {(attraction.minHeight || attraction.maxHeight) && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taille requise:</span>
                        <span className="font-medium text-gray-900">
                          {attraction.minHeight ? ` DZD{attraction.minHeight}cm` : ''}
                          {attraction.minHeight && attraction.maxHeight ? ' - ' : ''}
                          {attraction.maxHeight ? ` DZD{attraction.maxHeight}cm` : ''}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Visiteurs:</span>
                      <span className="font-medium text-gray-900">{attraction.visitors}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-green-600">DZD{attraction.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Visiteurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau visiteur
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {visitors.map((visitor) => (
                <div key={visitor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{visitor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{visitor.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{visitor.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date visite:</span>
                      <span className="font-medium text-gray-900">{new Date(visitor.visitDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type billet:</span>
                      <span className="font-medium text-gray-900 capitalize">{visitor.ticketType === 'adult' ? 'Adulte' : visitor.ticketType === 'child' ? 'Enfant' : visitor.ticketType === 'senior' ? 'Senior' : visitor.ticketType === 'family' ? 'Famille' : 'Saison'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Attractions:</span>
                      <span className="font-medium text-gray-900">{visitor.attractions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{visitor.totalSpent.toFixed(2)}</span>
                    </div>
                    {visitor.wristband && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bracelet:</span>
                        <span className="font-medium text-green-600">✓ Actif</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Billets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau billet
              </button>
            </div>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Billet #{ticket.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{ticket.visitorName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(ticket.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Type: {ticket.type === 'adult' ? 'Adulte' : ticket.type === 'child' ? 'Enfant' : ticket.type === 'senior' ? 'Senior' : ticket.type === 'family' ? 'Famille' : 'Saison'}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {ticket.paymentMethod === 'cash' ? 'Espèces' : ticket.paymentMethod === 'card' ? 'Carte' : 'En ligne'}</p>
                      {ticket.validUntil && (
                        <p className="text-sm text-gray-500 mt-1">Valide jusqu'au: {new Date(ticket.validUntil).toLocaleDateString('fr-FR')}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'used' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status === 'valid' ? 'Valide' : ticket.status === 'used' ? 'Utilisé' : 'Expiré'}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Quantité: {ticket.quantity}</p>
                        <p className="text-lg font-bold text-gray-900">DZD{ticket.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Restaurants</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau restaurant
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{restaurant.description}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupation:</span>
                      <span className="font-medium text-gray-900">{restaurant.currentOccupancy}/{restaurant.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{restaurant.type === 'fast_food' ? 'Fast food' : restaurant.type === 'restaurant' ? 'Restaurant' : restaurant.type === 'cafe' ? 'Café' : restaurant.type === 'snack' ? 'Snack' : 'Bar'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plats:</span>
                      <span className="font-medium text-gray-900">{restaurant.menuItems}</span>
                    </div>
                    {restaurant.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{restaurant.rating}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Revenus:</span>
                      <span className="font-bold text-green-600">DZD{restaurant.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        restaurant.status === 'open' ? 'bg-green-100 text-green-800' :
                        restaurant.status === 'closed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {restaurant.status === 'open' ? 'Ouvert' : restaurant.status === 'closed' ? 'Fermé' : 'Maintenance'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvel événement
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium text-gray-900">{event.attendees}/{event.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{event.type === 'show' ? 'Spectacle' : event.type === 'parade' ? 'Parade' : event.type === 'fireworks' ? 'Feux d\'artifice' : event.type === 'concert' ? 'Concert' : 'Atelier'}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-purple-600">DZD{event.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status === 'upcoming' ? 'À venir' : event.status === 'ongoing' ? 'En cours' : 'Terminé'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
