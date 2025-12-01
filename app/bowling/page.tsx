'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, Trophy, BarChart3, Target, Zap } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'lanes' | 'bookings' | 'tournaments' | 'members'

interface Lane {
  id: string
  number: number
  status: 'available' | 'occupied' | 'maintenance'
  currentGame?: string
  startTime?: Date
  players?: number
}

interface Booking {
  id: string
  customerName: string
  phone: string
  email?: string
  laneId: string
  laneNumber: number
  date: Date
  time: string
  duration: number
  players: number
  price: number
  status: 'confirmed' | 'completed' | 'cancelled'
}

interface Tournament {
  id: string
  name: string
  date: Date
  participants: number
  maxParticipants: number
  prize: number
  status: 'upcoming' | 'ongoing' | 'completed'
  winner?: string
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipType: 'basic' | 'premium' | 'vip'
  gamesPlayed: number
  averageScore: number
  joinDate: Date
}

export default function BowlingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [lanes, setLanes] = useState<Lane[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showTournamentModal, setShowTournamentModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [newBooking, setNewBooking] = useState({ customerName: '', phone: '', email: '', laneId: '', date: '', time: '', duration: 60, players: 2, price: 0 })
  const [newTournament, setNewTournament] = useState({ name: '', date: '', maxParticipants: 16, prize: 0 })
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', membershipType: 'basic' as 'basic' | 'premium' | 'vip' })

  useEffect(() => {
    const savedLanes = localStorage.getItem('bowling-lanes')
    const savedBookings = localStorage.getItem('bowling-bookings')
    const savedTournaments = localStorage.getItem('bowling-tournaments')
    const savedMembers = localStorage.getItem('bowling-members')

    if (savedLanes) {
      const parsed = JSON.parse(savedLanes)
      setLanes(parsed.map((l: any) => ({ ...l, startTime: l.startTime ? new Date(l.startTime) : undefined })))
    } else {
      const sample: Lane[] = [
        { id: '1', number: 1, status: 'occupied', currentGame: 'Ahmed & Friends', startTime: new Date(), players: 4 },
        { id: '2', number: 2, status: 'available' },
        { id: '3', number: 3, status: 'occupied', currentGame: 'Tournoi', startTime: new Date(), players: 6 },
        { id: '4', number: 4, status: 'available' },
        { id: '5', number: 5, status: 'maintenance' },
        { id: '6', number: 6, status: 'available' },
        { id: '7', number: 7, status: 'occupied', currentGame: 'Famille Benali', startTime: new Date(), players: 3 },
        { id: '8', number: 8, status: 'available' },
      ]
      setLanes(sample)
      localStorage.setItem('bowling-lanes', JSON.stringify(sample))
    }

    if (savedBookings) {
      const parsed = JSON.parse(savedBookings)
      setBookings(parsed.map((b: any) => ({ ...b, date: new Date(b.date) })))
    } else {
      const today = new Date()
      const sample: Booking[] = [
        {
          id: '1',
          customerName: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          laneId: '2',
          laneNumber: 2,
          date: today,
          time: '18:00',
          duration: 60,
          players: 4,
          price: 40,
          status: 'confirmed',
        },
        {
          id: '2',
          customerName: 'Fatima Kadri',
          phone: '+213 555 5678',
          laneId: '4',
          laneNumber: 4,
          date: today,
          time: '20:00',
          duration: 90,
          players: 6,
          price: 60,
          status: 'confirmed',
        },
      ]
      setBookings(sample)
      localStorage.setItem('bowling-bookings', JSON.stringify(sample))
    }

    if (savedTournaments) {
      const parsed = JSON.parse(savedTournaments)
      setTournaments(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })))
    } else {
      const sample: Tournament[] = [
        {
          id: '1',
          name: 'Championnat du Weekend',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          participants: 12,
          maxParticipants: 16,
          prize: 500,
          status: 'upcoming',
        },
        {
          id: '2',
          name: 'Tournoi Amateur',
          date: new Date(),
          participants: 8,
          maxParticipants: 8,
          prize: 200,
          status: 'ongoing',
        },
      ]
      setTournaments(sample)
      localStorage.setItem('bowling-tournaments', JSON.stringify(sample))
    }

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({ ...m, joinDate: new Date(m.joinDate) })))
    } else {
      const sample: Member[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 1234', membershipType: 'premium', gamesPlayed: 45, averageScore: 165, joinDate: new Date('2023-01-15') },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 5678', membershipType: 'vip', gamesPlayed: 78, averageScore: 182, joinDate: new Date('2022-06-20') },
      ]
      setMembers(sample)
      localStorage.setItem('bowling-members', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (lanes.length > 0) localStorage.setItem('bowling-lanes', JSON.stringify(lanes))
  }, [lanes])

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('bowling-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    if (tournaments.length > 0) localStorage.setItem('bowling-tournaments', JSON.stringify(tournaments))
  }, [tournaments])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('bowling-members', JSON.stringify(members))
  }, [members])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'lanes' as TabType, label: 'Pistes', icon: Target },
    { id: 'bookings' as TabType, label: 'Réservations', icon: Calendar },
    { id: 'tournaments' as TabType, label: 'Tournois', icon: Trophy },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
  ]

  const availableLanes = lanes.filter(l => l.status === 'available').length
  const occupiedLanes = lanes.filter(l => l.status === 'occupied').length
  const todayBookings = bookings.filter(b => {
    const today = new Date()
    return b.date.toDateString() === today.toDateString() && b.status === 'confirmed'
  })
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pistes disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableLanes}</p>
                  </div>
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pistes occupées</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{occupiedLanes}</p>
                  </div>
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">État des pistes</h3>
                <div className="grid grid-cols-4 gap-3">
                  {lanes.map((lane) => (
                    <div
                      key={lane.id}
                      className={`p-4 rounded-lg text-center ${
                        lane.status === 'available' ? 'bg-green-50 border-2 border-green-200' :
                        lane.status === 'occupied' ? 'bg-blue-50 border-2 border-blue-200' :
                        'bg-red-50 border-2 border-red-200'
                      }`}
                    >
                      <p className="text-2xl font-bold text-gray-900">{lane.number}</p>
                      <p className={`text-xs mt-1 font-medium ${
                        lane.status === 'available' ? 'text-green-700' :
                        lane.status === 'occupied' ? 'text-blue-700' :
                        'text-red-700'
                      }`}>
                        {lane.status === 'available' ? 'Disponible' :
                         lane.status === 'occupied' ? 'Occupée' :
                         'Maintenance'}
                      </p>
                      {lane.players && (
                        <p className="text-xs text-gray-500 mt-1">{lane.players} joueurs</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Réservations aujourd'hui</h3>
                <div className="space-y-3">
                  {todayBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">Piste {booking.laneNumber} • {booking.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">DZD{booking.price}</p>
                        <p className="text-xs text-gray-500">{booking.players} joueurs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lanes' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Pistes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {lanes.map((lane) => (
                <div
                  key={lane.id}
                  className={`bg-white rounded-xl shadow-lg border-2 p-4 sm:p-6 text-center ${
                    lane.status === 'available' ? 'border-green-200 bg-green-50' :
                    lane.status === 'occupied' ? 'border-blue-200 bg-blue-50' :
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <p className="text-4xl font-bold text-gray-900 mb-2">Piste {lane.number}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lane.status === 'available' ? 'bg-green-100 text-green-800' :
                    lane.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lane.status === 'available' ? 'Disponible' :
                     lane.status === 'occupied' ? 'Occupée' :
                     'Maintenance'}
                  </span>
                  {lane.currentGame && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Partie en cours</p>
                      <p className="text-sm font-medium text-gray-900">{lane.currentGame}</p>
                      {lane.players && (
                        <p className="text-xs text-gray-500 mt-1">{lane.players} joueurs</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button 
                onClick={() => setShowBookingModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle réservation
              </button>
            </div>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{booking.customerName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{booking.phone}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Piste {booking.laneNumber} • {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time} ({booking.duration} min)
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{booking.players} joueurs</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'completed' ? 'Complétée' : booking.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{booking.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tournois</h2>
              <button 
                onClick={() => setShowTournamentModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau tournoi
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{tournament.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tournament.status === 'completed' ? 'Terminé' : tournament.status === 'ongoing' ? 'En cours' : 'À venir'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(tournament.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants:</span>
                      <span className="text-gray-900">{tournament.participants}/{tournament.maxParticipants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-bold text-amber-600">DZD{tournament.prize}</span>
                    </div>
                    {tournament.winner && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Gagnant:</span>
                        <span className="font-bold text-green-600">{tournament.winner}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
              <button 
                onClick={() => setShowMemberModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau membre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {members.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{member.email}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.membershipType === 'vip' ? 'bg-purple-100 text-purple-800' :
                        member.membershipType === 'premium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.membershipType === 'vip' ? 'VIP' : member.membershipType === 'premium' ? 'Premium' : 'Basique'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Parties jouées:</span>
                      <span className="font-medium text-gray-900">{member.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score moyen:</span>
                      <span className="font-bold text-blue-600">{member.averageScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false)
          setNewBooking({ customerName: '', phone: '', email: '', laneId: '', date: '', time: '', duration: 60, players: 2, price: 0 })
        }}
        title="Nouvelle réservation"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
            <input
              type="text"
              value={newBooking.customerName}
              onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newBooking.phone}
                onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
              <input
                type="email"
                value={newBooking.email}
                onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
          </div>
          {lanes.filter(l => l.status === 'available').length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Piste</label>
              <select
                value={newBooking.laneId}
                onChange={(e) => {
                  const lane = lanes.find(l => l.id === e.target.value)
                  setNewBooking({ ...newBooking, laneId: e.target.value, price: lane ? (newBooking.duration / 60) * 10 : 0 })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une piste</option>
                {lanes.filter(l => l.status === 'available').map(lane => (
                  <option key={lane.id} value={lane.id}>Piste {lane.number}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input
                type="number"
                value={newBooking.duration}
                onChange={(e) => {
                  const duration = parseInt(e.target.value) || 60
                  const lane = lanes.find(l => l.id === newBooking.laneId)
                  setNewBooking({ ...newBooking, duration, price: lane ? (duration / 60) * 10 : 0 })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="30"
                step="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de joueurs</label>
              <input
                type="number"
                value={newBooking.players}
                onChange={(e) => setNewBooking({ ...newBooking, players: parseInt(e.target.value) || 2 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="8"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
            <input
              type="number"
              value={newBooking.price}
              onChange={(e) => setNewBooking({ ...newBooking, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowBookingModal(false)
                setNewBooking({ customerName: '', phone: '', email: '', laneId: '', date: '', time: '', duration: 60, players: 2, price: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newBooking.customerName && newBooking.phone && newBooking.laneId && newBooking.date && newBooking.time) {
                  const lane = lanes.find(l => l.id === newBooking.laneId)
                  if (lane) {
                    const booking: Booking = {
                      id: Date.now().toString(),
                      customerName: newBooking.customerName,
                      phone: newBooking.phone,
                      email: newBooking.email || undefined,
                      laneId: newBooking.laneId,
                      laneNumber: lane.number,
                      date: new Date(newBooking.date),
                      time: newBooking.time,
                      duration: newBooking.duration,
                      players: newBooking.players,
                      price: newBooking.price,
                      status: 'confirmed',
                    }
                    setBookings([...bookings, booking])
                    setShowBookingModal(false)
                    setNewBooking({ customerName: '', phone: '', email: '', laneId: '', date: '', time: '', duration: 60, players: 2, price: 0 })
                  }
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTournamentModal}
        onClose={() => {
          setShowTournamentModal(false)
          setNewTournament({ name: '', date: '', maxParticipants: 16, prize: 0 })
        }}
        title="Nouveau tournoi"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du tournoi</label>
            <input
              type="text"
              value={newTournament.name}
              onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Championnat du Weekend"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newTournament.date}
              onChange={(e) => setNewTournament({ ...newTournament, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participants maximum</label>
            <input
              type="number"
              value={newTournament.maxParticipants}
              onChange={(e) => setNewTournament({ ...newTournament, maxParticipants: parseInt(e.target.value) || 16 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
            <input
              type="number"
              value={newTournament.prize}
              onChange={(e) => setNewTournament({ ...newTournament, prize: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTournamentModal(false)
                setNewTournament({ name: '', date: '', maxParticipants: 16, prize: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newTournament.name && newTournament.date) {
                  const tournament: Tournament = {
                    id: Date.now().toString(),
                    name: newTournament.name,
                    date: new Date(newTournament.date),
                    participants: 0,
                    maxParticipants: newTournament.maxParticipants,
                    prize: newTournament.prize,
                    status: 'upcoming',
                  }
                  setTournaments([...tournaments, tournament])
                  setShowTournamentModal(false)
                  setNewTournament({ name: '', date: '', maxParticipants: 16, prize: 0 })
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false)
          setNewMember({ name: '', email: '', phone: '', membershipType: 'basic' })
        }}
        title="Nouveau membre"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: ahmed@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={newMember.phone}
              onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: +213 555 1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'adhésion</label>
            <select
              value={newMember.membershipType}
              onChange={(e) => setNewMember({ ...newMember, membershipType: e.target.value as 'basic' | 'premium' | 'vip' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basique</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMemberModal(false)
                setNewMember({ name: '', email: '', phone: '', membershipType: 'basic' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMember.name && newMember.email && newMember.phone) {
                  const member: Member = {
                    id: Date.now().toString(),
                    name: newMember.name,
                    email: newMember.email,
                    phone: newMember.phone,
                    membershipType: newMember.membershipType,
                    gamesPlayed: 0,
                    averageScore: 0,
                    joinDate: new Date(),
                  }
                  setMembers([...members, member])
                  setShowMemberModal(false)
                  setNewMember({ name: '', email: '', phone: '', membershipType: 'basic' })
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
