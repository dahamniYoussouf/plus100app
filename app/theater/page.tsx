'use client'

import { useState, useEffect } from 'react'
import { Film, Users, Calendar, Ticket, BarChart3, Video, Clock, TrendingUp, Package, Star, MapPin } from 'lucide-react'

type TabType = 'dashboard' | 'shows' | 'visitors' | 'tickets' | 'actors' | 'schedule'

interface Show {
  id: string
  title: string
  description: string
  genre: 'drama' | 'comedy' | 'musical' | 'tragedy' | 'thriller' | 'other'
  director: string
  duration: number
  price: number
  status: 'upcoming' | 'ongoing' | 'ended'
  performances: number
  totalAttendance: number
  rating?: number
  cast?: string[]
}

interface Visitor {
  id: string
  name: string
  email: string
  phone: string
  visitDate: Date
  ticketType: 'adult' | 'child' | 'senior' | 'student' | 'group'
  showIds: string[]
  totalSpent: number
  membership?: 'regular' | 'premium' | 'patron'
}

interface Ticket {
  id: string
  visitorId: string
  visitorName: string
  showId: string
  showTitle: string
  performanceDate: Date
  performanceTime: string
  seat: string
  type: 'adult' | 'child' | 'senior' | 'student' | 'group'
  price: number
  quantity: number
  total: number
  paymentMethod: 'cash' | 'card' | 'online'
  status: 'valid' | 'used' | 'cancelled'
}

interface Actor {
  id: string
  name: string
  email: string
  phone: string
  role: 'actor' | 'director' | 'technician' | 'other'
  shows: string[]
  experience: number
  rating?: number
  specialization?: string[]
}

interface Performance {
  id: string
  showId: string
  showTitle: string
  date: Date
  time: string
  availableSeats: number
  totalSeats: number
  soldTickets: number
  revenue: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
}

export default function TheaterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [shows, setShows] = useState<Show[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [actors, setActors] = useState<Actor[]>([])
  const [performances, setPerformances] = useState<Performance[]>([])

  useEffect(() => {
    const savedShows = localStorage.getItem('theater-shows')
    const savedVisitors = localStorage.getItem('theater-visitors')
    const savedTickets = localStorage.getItem('theater-tickets')
    const savedActors = localStorage.getItem('theater-actors')
    const savedPerformances = localStorage.getItem('theater-performances')

    if (savedShows) {
      setShows(JSON.parse(savedShows))
    } else {
      const sample: Show[] = [
        { id: '1', title: 'Hamlet', description: 'Tragédie classique de Shakespeare', genre: 'tragedy', director: 'Ahmed Benali', duration: 180, price: 25, status: 'ongoing', performances: 12, totalAttendance: 840, rating: 4.8, cast: ['Sarah Kadri', 'Mohamed Tazi', 'Fatima Benali'] },
        { id: '2', title: 'Comédie Musicale', description: 'Spectacle musical joyeux', genre: 'musical', director: 'Leila Amrani', duration: 120, price: 30, status: 'upcoming', performances: 0, totalAttendance: 0, rating: 4.6, cast: ['Youssef Dahmani', 'Aicha Bensaid'] },
        { id: '3', title: 'Le Rire', description: 'Comédie moderne hilarante', genre: 'comedy', director: 'Karim Belkacem', duration: 90, price: 20, status: 'ongoing', performances: 8, totalAttendance: 560, rating: 4.7, cast: ['Nadia Cherif', 'Omar Khelil'] },
      ]
      setShows(sample)
      localStorage.setItem('theater-shows', JSON.stringify(sample))
    }

    if (savedVisitors) {
      const parsed = JSON.parse(savedVisitors)
      setVisitors(parsed.map((v: any) => ({ ...v, visitDate: new Date(v.visitDate) })))
    } else {
      const sample: Visitor[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', visitDate: new Date(), ticketType: 'adult', showIds: ['1', '3'], totalSpent: 45, membership: 'regular' },
        { id: '2', name: 'Ahmed Kadri', email: 'ahmed@email.com', phone: '+213 555 5678', visitDate: new Date(), ticketType: 'student', showIds: ['1'], totalSpent: 15, membership: 'premium' },
      ]
      setVisitors(sample)
      localStorage.setItem('theater-visitors', JSON.stringify(sample))
    }

    if (savedTickets) {
      const parsed = JSON.parse(savedTickets)
      setTickets(parsed.map((t: any) => ({ ...t, performanceDate: new Date(t.performanceDate) })))
    } else {
      const today = new Date()
      const sample: Ticket[] = [
        { id: '1', visitorId: '1', visitorName: 'Sarah Benali', showId: '1', showTitle: 'Hamlet', performanceDate: today, performanceTime: '20:00', seat: 'A12', type: 'adult', price: 25, quantity: 1, total: 25, paymentMethod: 'card', status: 'valid' },
        { id: '2', visitorId: '2', visitorName: 'Ahmed Kadri', showId: '1', showTitle: 'Hamlet', performanceDate: today, performanceTime: '20:00', seat: 'B5', type: 'student', price: 15, quantity: 1, total: 15, paymentMethod: 'card', status: 'used' },
      ]
      setTickets(sample)
      localStorage.setItem('theater-tickets', JSON.stringify(sample))
    }

    if (savedActors) {
      setActors(JSON.parse(savedActors))
    } else {
      const sample: Actor[] = [
        { id: '1', name: 'Sarah Kadri', email: 'sarah.k@email.com', phone: '+213 555 1111', role: 'actor', shows: ['1', '3'], experience: 10, rating: 4.9, specialization: ['Drama', 'Tragedy'] },
        { id: '2', name: 'Ahmed Benali', email: 'ahmed.b@email.com', phone: '+213 555 2222', role: 'director', shows: ['1'], experience: 15, rating: 4.8, specialization: ['Classical', 'Shakespeare'] },
        { id: '3', name: 'Mohamed Tazi', email: 'mohamed.t@email.com', phone: '+213 555 3333', role: 'actor', shows: ['1'], experience: 8, rating: 4.7, specialization: ['Drama'] },
      ]
      setActors(sample)
      localStorage.setItem('theater-actors', JSON.stringify(sample))
    }

    if (savedPerformances) {
      const parsed = JSON.parse(savedPerformances)
      setPerformances(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })))
    } else {
      const today = new Date()
      const sample: Performance[] = [
        { id: '1', showId: '1', showTitle: 'Hamlet', date: today, time: '20:00', availableSeats: 30, totalSeats: 100, soldTickets: 70, revenue: 1750, status: 'scheduled' },
        { id: '2', showId: '3', showTitle: 'Le Rire', date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), time: '19:30', availableSeats: 45, totalSeats: 80, soldTickets: 35, revenue: 700, status: 'scheduled' },
      ]
      setPerformances(sample)
      localStorage.setItem('theater-performances', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (shows.length > 0) localStorage.setItem('theater-shows', JSON.stringify(shows))
  }, [shows])

  useEffect(() => {
    if (visitors.length > 0) localStorage.setItem('theater-visitors', JSON.stringify(visitors))
  }, [visitors])

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('theater-tickets', JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    if (actors.length > 0) localStorage.setItem('theater-actors', JSON.stringify(actors))
  }, [actors])

  useEffect(() => {
    if (performances.length > 0) localStorage.setItem('theater-performances', JSON.stringify(performances))
  }, [performances])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'shows' as TabType, label: 'Spectacles', icon: Film },
    { id: 'visitors' as TabType, label: 'Visiteurs', icon: Users },
    { id: 'tickets' as TabType, label: 'Billets', icon: Ticket },
    { id: 'actors' as TabType, label: 'Acteurs', icon: Video },
    { id: 'schedule' as TabType, label: 'Programme', icon: Calendar },
  ]

  const totalRevenue = tickets.filter(t => t.status === 'valid' || t.status === 'used').reduce((sum, t) => sum + t.total, 0) + performances.reduce((sum, p) => sum + p.revenue, 0)
  const totalVisitors = visitors.length
  const ongoingShows = shows.filter(s => s.status === 'ongoing').length
  const upcomingPerformances = performances.filter(p => p.status === 'scheduled').length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Visiteurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalVisitors}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Spectacles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{ongoingShows}</p>
                  </div>
                  <Film className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Représentations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingPerformances}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Spectacles en cours</h3>
                <div className="space-y-3">
                  {shows.filter(s => s.status === 'ongoing').slice(0, 5).map((show) => (
                    <div key={show.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{show.title}</p>
                        <p className="text-sm text-gray-500">Mise en scène: {show.director}</p>
                        <p className="text-xs text-gray-500 mt-1">{show.totalAttendance} spectateurs • {show.performances} représentations</p>
                        {show.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{show.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-purple-600">DZD{show.price}</p>
                        <span className="text-xs text-gray-500 capitalize">{show.genre === 'drama' ? 'Drame' : show.genre === 'comedy' ? 'Comédie' : show.genre === 'musical' ? 'Musical' : show.genre === 'tragedy' ? 'Tragédie' : show.genre === 'thriller' ? 'Thriller' : 'Autre'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Prochaines représentations</h3>
                <div className="space-y-3">
                  {performances.filter(p => p.status === 'scheduled').slice(0, 5).map((performance) => (
                    <div key={performance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{performance.showTitle}</p>
                        <p className="text-sm text-gray-500">{new Date(performance.date).toLocaleDateString('fr-FR')} à {performance.time}</p>
                        <p className="text-xs text-gray-500 mt-1">{performance.soldTickets}/{performance.totalSeats} billets vendus</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">DZD{performance.revenue.toFixed(0)}</p>
                        <span className="text-xs text-gray-500">{performance.availableSeats} places libres</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shows' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Spectacles</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau spectacle
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {shows.map((show) => (
                <div key={show.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{show.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{show.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs  DZD{
                          show.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          show.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {show.status === 'ongoing' ? 'En cours' : show.status === 'upcoming' ? 'À venir' : 'Terminé'}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs capitalize">{show.genre === 'drama' ? 'Drame' : show.genre === 'comedy' ? 'Comédie' : show.genre === 'musical' ? 'Musical' : show.genre === 'tragedy' ? 'Tragédie' : show.genre === 'thriller' ? 'Thriller' : 'Autre'}</span>
                        {show.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{show.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video className="w-4 h-4" />
                      <span>Mise en scène: {show.director}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Durée: {show.duration} min</span>
                    </div>
                    {show.cast && show.cast.length > 0 && (
                      <div className="text-gray-600">
                        <p className="text-xs mb-1">Distribution:</p>
                        <p className="text-xs text-gray-500">{show.cast.slice(0, 3).join(', ')}{show.cast.length > 3 ? '...' : ''}</p>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Représentations:</span>
                      <span className="font-medium text-gray-900">{show.performances}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spectateurs:</span>
                      <span className="font-medium text-gray-900">{show.totalAttendance}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-purple-600">DZD{show.price}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                      <span className="text-gray-600">Spectacles:</span>
                      <span className="font-medium text-gray-900">{visitor.showIds.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{visitor.totalSpent.toFixed(2)}</span>
                    </div>
                    {visitor.membership && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Adhésion:</span>
                        <span className="font-medium text-purple-600 capitalize">{visitor.membership === 'regular' ? 'Régulière' : visitor.membership === 'premium' ? 'Premium' : 'Mécène'}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                      <p className="text-sm text-gray-900 mt-2 font-medium">{ticket.showTitle}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(ticket.performanceDate).toLocaleDateString('fr-FR')} à {ticket.performanceTime}</p>
                      <p className="text-sm text-gray-500 mt-1">Siège: {ticket.seat}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Type: {ticket.type === 'adult' ? 'Adulte' : ticket.type === 'child' ? 'Enfant' : ticket.type === 'senior' ? 'Senior' : ticket.type === 'student' ? 'Étudiant' : 'Groupe'}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {ticket.paymentMethod === 'cash' ? 'Espèces' : ticket.paymentMethod === 'card' ? 'Carte' : 'En ligne'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        ticket.status === 'valid' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'used' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ticket.status === 'valid' ? 'Valide' : ticket.status === 'used' ? 'Utilisé' : 'Annulé'}
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

        {activeTab === 'actors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Acteurs & Équipe</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau membre
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {actors.map((actor) => (
                <div key={actor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{actor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{actor.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{actor.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rôle:</span>
                      <span className="font-medium text-gray-900 capitalize">{actor.role === 'actor' ? 'Acteur' : actor.role === 'director' ? 'Metteur en scène' : actor.role === 'technician' ? 'Technicien' : 'Autre'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expérience:</span>
                      <span className="font-medium text-gray-900">{actor.experience} ans</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spectacles:</span>
                      <span className="font-medium text-gray-900">{actor.shows.length}</span>
                    </div>
                    {actor.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{actor.rating}</span>
                      </div>
                    )}
                    {actor.specialization && actor.specialization.length > 0 && (
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">Spécialités:</p>
                        <div className="flex flex-wrap gap-1">
                          {actor.specialization.map((spec, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{spec}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Programme</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle représentation
              </button>
            </div>
            <div className="space-y-4">
              {performances.map((performance) => (
                <div key={performance.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{performance.showTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(performance.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{performance.time}</span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Places disponibles:</span>
                          <span className="font-medium text-gray-900">{performance.availableSeats}/{performance.totalSeats}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Billets vendus:</span>
                          <span className="font-medium text-gray-900">{performance.soldTickets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenus:</span>
                          <span className="font-medium text-green-600">DZD{performance.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        performance.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        performance.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        performance.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {performance.status === 'scheduled' ? 'Programmée' : performance.status === 'ongoing' ? 'En cours' : performance.status === 'completed' ? 'Terminée' : 'Annulée'}
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
