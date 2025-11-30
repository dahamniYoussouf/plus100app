'use client'

import { useState, useEffect } from 'react'
import { Calendar, Ticket, Users, MapPin, BarChart3, TrendingUp, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'events' | 'tickets' | 'participants'

interface Event {
  id: string
  name: string
  description: string
  date: Date
  time: string
  location: string
  capacity: number
  price: number
  category: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
}

interface Ticket {
  id: string
  eventId: string
  eventName: string
  attendeeName: string
  attendeeEmail: string
  quantity: number
  totalPrice: number
  purchaseDate: Date
  status: 'confirmed' | 'cancelled'
}

interface Participant {
  id: string
  name: string
  email: string
  phone: string
  eventsAttended: number
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [events, setEvents] = useState<Event[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    const savedEvents = localStorage.getItem('events-events')
    const savedTickets = localStorage.getItem('events-tickets')
    const savedParticipants = localStorage.getItem('events-participants')

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      })))
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const sample: Event[] = [
        { id: '1', name: 'Concert Jazz', description: 'Concert de jazz en plein air', date: tomorrow, time: '19:00', location: 'Parc Central', capacity: 500, price: 25.00, category: 'Musique', status: 'upcoming' },
        { id: '2', name: 'Festival Culinaire', description: 'Découverte des saveurs locales', date: new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000), time: '14:00', location: 'Place du Marché', capacity: 300, price: 15.00, category: 'Gastronomie', status: 'upcoming' },
      ]
      setEvents(sample)
      localStorage.setItem('events-events', JSON.stringify(sample))
    }

    if (savedTickets) {
      const parsed = JSON.parse(savedTickets)
      setTickets(parsed.map((t: any) => ({
        ...t,
        purchaseDate: new Date(t.purchaseDate),
      })))
    }

    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('events-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('events-tickets', JSON.stringify(tickets))
  }, [tickets])

  useEffect(() => {
    if (participants.length > 0) localStorage.setItem('events-participants', JSON.stringify(participants))
  }, [participants])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
    { id: 'tickets' as TabType, label: 'Billets', icon: Ticket },
    { id: 'participants' as TabType, label: 'Participants', icon: Users },
  ]

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const totalRevenue = tickets.filter(t => t.status === 'confirmed').reduce((sum, t) => sum + t.totalPrice, 0)
  const totalTickets = tickets.filter(t => t.status === 'confirmed').reduce((sum, t) => sum + t.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
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
                      ? 'text-violet-600 border-b-2 border-violet-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Événements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{events.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">À Venir</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingEvents.length}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Billets Vendus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalTickets}</p>
                  </div>
                  <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Événements</h3>
                  <p className="text-sm text-gray-600">Création et planification d'événements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Vente de Billets</h3>
                  <p className="text-sm text-gray-600">Système de billetterie en ligne</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
                  <p className="text-sm text-gray-600">Gestion des inscriptions et participants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Check-in</h3>
                  <p className="text-sm text-gray-600">Validation des billets à l'entrée</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses d'événements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Promotions</h3>
                  <p className="text-sm text-gray-600">Codes promo et réductions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => {
                const ticketsSold = tickets.filter(t => t.eventId === event.id && t.status === 'confirmed').reduce((sum, t) => sum + t.quantity, 0)
                return (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {ticketsSold}/{event.capacity} participants
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">€{event.price.toFixed(2)}</span>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status === 'upcoming' ? 'À venir' :
                         event.status === 'ongoing' ? 'En cours' :
                         event.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Billets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Vendre Billet
              </button>
            </div>
            {tickets.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun billet vendu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{ticket.eventName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ticket.attendeeName} - {ticket.attendeeEmail}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {ticket.quantity} billet(s) • Acheté le {new Date(ticket.purchaseDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">€{ticket.totalPrice.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ticket.status === 'confirmed' ? 'Confirmé' : 'Annulé'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Participants</h2>
            </div>
            {participants.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun participant enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{participant.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{participant.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{participant.phone}</p>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Événements</p>
                      <p className="font-bold text-violet-600">{participant.eventsAttended}</p>
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