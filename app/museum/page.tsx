'use client'

import { useState, useEffect } from 'react'
import { Building, Users, Calendar, Ticket, BarChart3, BookOpen, Image, MapPin, Clock, TrendingUp, Package } from 'lucide-react'

type TabType = 'dashboard' | 'exhibitions' | 'visitors' | 'tickets' | 'collections' | 'events'

interface Exhibition {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  curator: string
  visitors: number
  status: 'upcoming' | 'ongoing' | 'ended'
  category: 'art' | 'history' | 'science' | 'culture' | 'temporary'
  price: number
  artworks?: number
}

interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  visitDate: Date
  ticketType: 'adult' | 'child' | 'senior' | 'student' | 'group'
  exhibitionIds: string[]
  totalSpent: number
  membership?: 'regular' | 'premium' | 'patron'
}

interface Ticket {
  id: string
  visitorId: string
  visitorName: string
  exhibitionId: string
  exhibitionTitle: string
  date: Date
  type: 'adult' | 'child' | 'senior' | 'student' | 'group'
  price: number
  quantity: number
  total: number
  paymentMethod: 'cash' | 'card' | 'online'
  status: 'valid' | 'used' | 'expired'
}

interface Collection {
  id: string
  name: string
  description: string
  category: 'art' | 'history' | 'science' | 'culture'
  items: number
  value: number
  location: string
  curator: string
  lastUpdated: Date
  status: 'on_display' | 'storage' | 'loan' | 'restoration'
}

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  type: 'workshop' | 'lecture' | 'tour' | 'concert' | 'other'
  attendees: number
  capacity: number
  price: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export default function MuseumPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const savedExhibitions = localStorage.getItem('museum-exhibitions')
    const savedVisitors = localStorage.getItem('museum-visitors')
    const savedTickets = localStorage.getItem('museum-tickets')
    const savedCollections = localStorage.getItem('museum-collections')
    const savedEvents = localStorage.getItem('museum-events')

    if (savedExhibitions) {
      const parsed = JSON.parse(savedExhibitions)
      setExhibitions(parsed.map((e: any) => ({ ...e, startDate: new Date(e.startDate), endDate: new Date(e.endDate) })))
    } else {
      const today = new Date()
      const sample: Exhibition[] = [
        { id: '1', title: 'Art Moderne Algérien', description: 'Exposition d\'œuvres d\'artistes algériens contemporains', startDate: today, endDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000), location: 'Salle principale', curator: 'Dr. Ahmed Benali', visitors: 1250, status: 'ongoing', category: 'art', price: 15, artworks: 45 },
        { id: '2', title: 'Histoire de l\'Algérie', description: 'Collection permanente sur l\'histoire du pays', startDate: new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000), endDate: new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000), location: 'Aile historique', curator: 'Dr. Fatima Kadri', visitors: 5420, status: 'ongoing', category: 'history', price: 10, artworks: 120 },
        { id: '3', title: 'Sciences Naturelles', description: 'Exposition interactive sur la faune et la flore', startDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), endDate: new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000), location: 'Pavillon sciences', curator: 'Dr. Mohamed Tazi', visitors: 0, status: 'upcoming', category: 'science', price: 12, artworks: 30 },
      ]
      setExhibitions(sample)
      localStorage.setItem('museum-exhibitions', JSON.stringify(sample))
    }

    if (savedVisitors) {
      const parsed = JSON.parse(savedVisitors)
      setVisitors(parsed.map((v: any) => ({ ...v, visitDate: new Date(v.visitDate) })))
    } else {
      const sample: Visitor[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', visitDate: new Date(), ticketType: 'adult', exhibitionIds: ['1', '2'], totalSpent: 25, membership: 'regular' },
        { id: '2', name: 'Ahmed Kadri', email: 'ahmed@email.com', phone: '+213 555 5678', visitDate: new Date(), ticketType: 'student', exhibitionIds: ['1'], totalSpent: 8, membership: 'premium' },
      ]
      setVisitors(sample)
      localStorage.setItem('museum-visitors', JSON.stringify(sample))
    }

    if (savedTickets) {
      const parsed = JSON.parse(savedTickets)
      setTickets(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })))
    } else {
      const today = new Date()
      const sample: Ticket[] = [
        { id: '1', visitorId: '1', visitorName: 'Sarah Benali', exhibitionId: '1', exhibitionTitle: 'Art Moderne Algérien', date: today, type: 'adult', price: 15, quantity: 1, total: 15, paymentMethod: 'card', status: 'valid' },
        { id: '2', visitorId: '2', visitorName: 'Ahmed Kadri', exhibitionId: '1', exhibitionTitle: 'Art Moderne Algérien', date: today, type: 'student', price: 8, quantity: 1, total: 8, paymentMethod: 'card', status: 'used' },
      ]
      setTickets(sample)
      localStorage.setItem('museum-tickets', JSON.stringify(sample))
    }

    if (savedCollections) {
      const parsed = JSON.parse(savedCollections)
      setCollections(parsed.map((c: any) => ({ ...c, lastUpdated: new Date(c.lastUpdated) })))
    } else {
      const sample: Collection[] = [
        { id: '1', name: 'Peintures Algériennes', description: 'Collection de peintures d\'artistes algériens', category: 'art', items: 250, value: 5000000, location: 'Aile art', curator: 'Dr. Ahmed Benali', lastUpdated: new Date(), status: 'on_display' },
        { id: '2', name: 'Artéfacts Historiques', description: 'Objets historiques de différentes périodes', category: 'history', items: 500, value: 8000000, location: 'Aile historique', curator: 'Dr. Fatima Kadri', lastUpdated: new Date(), status: 'on_display' },
        { id: '3', name: 'Fossiles', description: 'Collection de fossiles et spécimens', category: 'science', items: 180, value: 2000000, location: 'Pavillon sciences', curator: 'Dr. Mohamed Tazi', lastUpdated: new Date(), status: 'storage' },
      ]
      setCollections(sample)
      localStorage.setItem('museum-collections', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      const today = new Date()
      const sample: Event[] = [
        { id: '1', title: 'Visite Guidée Art Moderne', description: 'Visite guidée de l\'exposition d\'art moderne', date: today, time: '14:00', location: 'Salle principale', type: 'tour', attendees: 15, capacity: 25, price: 5, status: 'upcoming' },
        { id: '2', title: 'Conférence Histoire', description: 'Conférence sur l\'histoire de l\'Algérie', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), time: '18:00', location: 'Auditorium', type: 'lecture', attendees: 0, capacity: 100, price: 10, status: 'upcoming' },
      ]
      setEvents(sample)
      localStorage.setItem('museum-events', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (exhibitions.length > 0) localStorage.setItem('museum-exhibitions', JSON.stringify(exhibitions))
  }, [exhibitions])

  useEffect(() => {
    if (visitors.length > 0) localStorage.setItem('museum-visitors', JSON.stringify(visitors))
  }, [visitors])

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('museum-tickets', JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    if (collections.length > 0) localStorage.setItem('museum-collections', JSON.stringify(collections))
  }, [collections])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('museum-events', JSON.stringify(events))
  }, [events])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'exhibitions' as TabType, label: 'Expositions', icon: Image },
    { id: 'visitors' as TabType, label: 'Visiteurs', icon: Users },
    { id: 'tickets' as TabType, label: 'Billets', icon: Ticket },
    { id: 'collections' as TabType, label: 'Collections', icon: BookOpen },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
  ]

  const totalRevenue = tickets.filter(t => t.status === 'valid' || t.status === 'used').reduce((sum, t) => sum + t.total, 0)
  const totalVisitors = visitors.length
  const ongoingExhibitions = exhibitions.filter(e => e.status === 'ongoing').length
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Visiteurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalVisitors}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Expositions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{ongoingExhibitions}</p>
                  </div>
                  <Image className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Expositions en cours</h3>
                <div className="space-y-3">
                  {exhibitions.filter(e => e.status === 'ongoing').slice(0, 5).map((exhibition) => (
                    <div key={exhibition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{exhibition.title}</p>
                        <p className="text-sm text-gray-500">{exhibition.location} • {exhibition.curator}</p>
                        <p className="text-xs text-gray-500 mt-1">{exhibition.visitors} visiteurs</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-amber-600">DZD{exhibition.price}</p>
                        <span className="text-xs text-gray-500 capitalize">{exhibition.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à venir</h3>
                <div className="space-y-3">
                  {events.filter(e => e.status === 'upcoming').slice(0, 5).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.attendees}/{event.capacity} participants</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-purple-600">DZD{event.price}</p>
                        <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exhibitions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expositions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouvelle exposition
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{exhibition.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exhibition.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs  DZD{
                          exhibition.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          exhibition.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {exhibition.status === 'ongoing' ? 'En cours' : exhibition.status === 'upcoming' ? 'À venir' : 'Terminée'}
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs capitalize">{exhibition.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{exhibition.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Curateur: {exhibition.curator}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(exhibition.startDate).toLocaleDateString('fr-FR')} - {new Date(exhibition.endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {exhibition.artworks && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Image className="w-4 h-4" />
                        <span>{exhibition.artworks} œuvres</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Visiteurs:</span>
                      <span className="font-medium text-gray-900">{exhibition.visitors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-amber-600">DZD{exhibition.price}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                      <span className="font-medium text-gray-900 capitalize">{visitor.ticketType === 'adult' ? 'Adulte' : visitor.ticketType === 'child' ? 'Enfant' : visitor.ticketType === 'senior' ? 'Senior' : visitor.ticketType === 'student' ? 'Étudiant' : 'Groupe'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{visitor.totalSpent.toFixed(2)}</span>
                    </div>
                    {visitor.membership && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Adhésion:</span>
                        <span className="font-medium text-amber-600 capitalize">{visitor.membership === 'regular' ? 'Régulière' : visitor.membership === 'premium' ? 'Premium' : 'Mécène'}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                      <p className="text-sm text-gray-900 mt-2 font-medium">{ticket.exhibitionTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(ticket.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Type: {ticket.type === 'adult' ? 'Adulte' : ticket.type === 'child' ? 'Enfant' : ticket.type === 'senior' ? 'Senior' : ticket.type === 'student' ? 'Étudiant' : 'Groupe'}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {ticket.paymentMethod === 'cash' ? 'Espèces' : ticket.paymentMethod === 'card' ? 'Carte' : 'En ligne'}</p>
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

        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collections</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouvelle collection
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{collection.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium text-gray-900 capitalize">{collection.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pièces:</span>
                      <span className="font-medium text-gray-900">{collection.items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur:</span>
                      <span className="font-medium text-green-600">DZD{collection.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{collection.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Curateur: {collection.curator}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        collection.status === 'on_display' ? 'bg-green-100 text-green-800' :
                        collection.status === 'storage' ? 'bg-gray-100 text-gray-800' :
                        collection.status === 'loan' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {collection.status === 'on_display' ? 'Exposée' : collection.status === 'storage' ? 'Stockage' : collection.status === 'loan' ? 'Prêt' : 'Restauration'}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                      <span className="font-medium text-gray-900 capitalize">{event.type === 'workshop' ? 'Atelier' : event.type === 'lecture' ? 'Conférence' : event.type === 'tour' ? 'Visite' : event.type === 'concert' ? 'Concert' : 'Autre'}</span>
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
