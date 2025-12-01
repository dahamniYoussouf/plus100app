'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, Calendar, DollarSign, BarChart3, Trophy, Clock, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'facilities' | 'members' | 'bookings' | 'events' | 'coaches'

interface Facility {
  id: string
  name: string
  type: 'gym' | 'pool' | 'tennis' | 'football' | 'basketball' | 'other'
  capacity: number
  hourlyRate: number
  status: 'available' | 'maintenance' | 'booked'
  features: string[]
}

interface Member {
  id: string
  name: string
  phone: string
  email?: string
  membershipType: 'monthly' | 'yearly' | 'day_pass'
  startDate: Date
  endDate?: Date
  status: 'active' | 'expired' | 'suspended'
  facilities: string[]
}

interface Booking {
  id: string
  facilityId: string
  facilityName: string
  memberId: string
  memberName: string
  date: Date
  startTime: string
  endTime: string
  status: 'confirmed' | 'cancelled' | 'completed'
}

interface Event {
  id: string
  name: string
  type: 'tournament' | 'training' | 'competition' | 'workshop'
  date: Date
  time: string
  facilityId: string
  facilityName: string
  participants: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const savedFacilities = localStorage.getItem('sports-facilities')
    const savedMembers = localStorage.getItem('sports-members')
    const savedBookings = localStorage.getItem('sports-bookings')
    const savedEvents = localStorage.getItem('sports-events')

    if (savedFacilities) {
      setFacilities(JSON.parse(savedFacilities))
    } else {
      const sample: Facility[] = [
        {
          id: '1',
          name: 'Salle de Musculation',
          type: 'gym',
          capacity: 30,
          hourlyRate: 2000,
          status: 'available',
          features: ['Équipements modernes', 'Climatisation'],
        },
        {
          id: '2',
          name: 'Piscine Olympique',
          type: 'pool',
          capacity: 50,
          hourlyRate: 3000,
          status: 'available',
          features: ['25m', 'Chauffée'],
        },
        {
          id: '3',
          name: 'Terrain de Football',
          type: 'football',
          capacity: 22,
          hourlyRate: 5000,
          status: 'booked',
          features: ['Gazon synthétique', 'Éclairage'],
        },
      ]
      setFacilities(sample)
      localStorage.setItem('sports-facilities', JSON.stringify(sample))
    }

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
        endDate: m.endDate ? new Date(m.endDate) : undefined,
      })))
    } else {
      const sample: Member[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          membershipType: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          status: 'active',
          facilities: ['1', '2'],
        },
      ]
      setMembers(sample)
      localStorage.setItem('sports-members', JSON.stringify(sample))
    }

    if (savedBookings) {
      const parsed = JSON.parse(savedBookings)
      setBookings(parsed.map((b: any) => ({ ...b, date: new Date(b.date) })))
    } else {
      const today = new Date()
      const sample: Booking[] = [
        {
          id: '1',
          facilityId: '3',
          facilityName: 'Terrain de Football',
          memberId: '1',
          memberName: 'Ahmed Benali',
          date: today,
          startTime: '18:00',
          endTime: '19:00',
          status: 'confirmed',
        },
      ]
      setBookings(sample)
      localStorage.setItem('sports-bookings', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      const sample: Event[] = [
        {
          id: '1',
          name: 'Tournoi de Football',
          type: 'tournament',
          date: new Date('2024-02-15'),
          time: '14:00',
          facilityId: '3',
          facilityName: 'Terrain de Football',
          participants: 16,
          status: 'upcoming',
        },
      ]
      setEvents(sample)
      localStorage.setItem('sports-events', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (facilities.length > 0) localStorage.setItem('sports-facilities', JSON.stringify(facilities))
  }, [facilities])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('sports-members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('sports-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('sports-events', JSON.stringify(events))
  }, [events])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'facilities' as TabType, label: 'Installations', icon: Activity },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
    { id: 'bookings' as TabType, label: 'Réservations', icon: Calendar },
    { id: 'events' as TabType, label: 'Événements', icon: Trophy },
    { id: 'coaches' as TabType, label: 'Entraîneurs', icon: Users },
  ]

  const activeMembers = members.filter(m => m.status === 'active').length
  const todayBookings = bookings.filter(b => {
    const today = new Date()
    return b.date.toDateString() === today.toDateString() && b.status === 'confirmed'
  }).length
  const availableFacilities = facilities.filter(f => f.status === 'available').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
                      ? 'text-orange-600 border-b-2 border-orange-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Membres Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeMembers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Installations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{facilities.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableFacilities}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Installations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ajouter Installation
              </button>
            </div>
            {facilities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune installation</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {facilities.map((facility) => (
                  <div key={facility.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{facility.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {facility.type === 'gym' ? 'Musculation' :
                           facility.type === 'pool' ? 'Piscine' :
                           facility.type === 'tennis' ? 'Tennis' :
                           facility.type === 'football' ? 'Football' :
                           facility.type === 'basketball' ? 'Basketball' : 'Autre'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        facility.status === 'available' ? 'bg-green-100 text-green-800' :
                        facility.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {facility.status === 'available' ? 'Disponible' :
                         facility.status === 'booked' ? 'Réservé' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👥 Capacité: {facility.capacity} personnes</p>
                      {facility.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {facility.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-lg font-bold text-gray-900">DZD{facility.hourlyRate.toLocaleString()}/heure</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau Membre
              </button>
            </div>
            {members.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun membre</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {member.membershipType === 'monthly' ? 'Mensuel' :
                           member.membershipType === 'yearly' ? 'Annuel' : 'Journée'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status === 'active' ? 'Actif' :
                         member.status === 'expired' ? 'Expiré' : 'Suspendu'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">📞 {member.phone}</p>
                      {member.email && <p className="text-sm text-gray-600">📧 {member.email}</p>}
                      <p className="text-sm text-gray-600">
                        📅 {new Date(member.startDate).toLocaleDateString('fr-FR')}
                        {member.endDate && ` -  DZD{new Date(member.endDate).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvelle Réservation
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{booking.memberName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{booking.facilityName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status === 'completed' ? 'Terminée' :
                         booking.status === 'cancelled' ? 'Annulée' : 'Confirmée'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(booking.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">
                        ⏰ {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {event.type === 'tournament' ? 'Tournoi' :
                           event.type === 'training' ? 'Entraînement' :
                           event.type === 'competition' ? 'Compétition' : 'Atelier'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">📍 {event.facilityName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'completed' ? 'Terminé' :
                         event.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}
                      </p>
                      <p className="text-gray-600">👥 {event.participants} participants</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'coaches' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Entraîneurs</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des entraîneurs et coachs</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
