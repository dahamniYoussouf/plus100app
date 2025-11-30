'use client'

import { useState, useEffect } from 'react'
import { Lock, Users, Calendar, Clock, Trophy, BarChart3, Gamepad2, Star } from 'lucide-react'

type TabType = 'dashboard' | 'rooms' | 'bookings' | 'teams' | 'leaderboard'

interface Room {
  id: string
  name: string
  description: string
  theme: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  duration: number
  maxPlayers: number
  price: number
  status: 'available' | 'occupied' | 'maintenance'
  currentSession?: string
  startTime?: Date
  players?: number
  successRate: number
  averageTime?: number
}

interface Booking {
  id: string
  customerName: string
  phone: string
  email?: string
  roomId: string
  roomName: string
  date: Date
  time: string
  players: number
  price: number
  status: 'confirmed' | 'completed' | 'cancelled'
  result?: 'escaped' | 'failed'
  timeTaken?: number
}

interface Team {
  id: string
  name: string
  members: string[]
  totalGames: number
  wins: number
  bestTime?: number
  favoriteRoom?: string
  joinDate: Date
}

interface LeaderboardEntry {
  id: string
  teamName: string
  roomName: string
  time: number
  date: Date
  players: number
}

export default function EscapePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const savedRooms = localStorage.getItem('escape-rooms')
    const savedBookings = localStorage.getItem('escape-bookings')
    const savedTeams = localStorage.getItem('escape-teams')
    const savedLeaderboard = localStorage.getItem('escape-leaderboard')

    if (savedRooms) {
      const parsed = JSON.parse(savedRooms)
      setRooms(parsed.map((r: any) => ({ ...r, startTime: r.startTime ? new Date(r.startTime) : undefined })))
    } else {
      const sample: Room[] = [
        { id: '1', name: 'La Prison Évadée', description: 'Évadez-vous de la prison la plus sécurisée', theme: 'Prison', difficulty: 'medium', duration: 60, maxPlayers: 6, price: 120, status: 'occupied', currentSession: 'Équipe Alpha', startTime: new Date(), players: 4, successRate: 65, averageTime: 52 },
        { id: '2', name: 'Le Laboratoire Secret', description: 'Découvrez les secrets du laboratoire', theme: 'Science', difficulty: 'hard', duration: 75, maxPlayers: 8, price: 150, status: 'available', successRate: 45, averageTime: 68 },
        { id: '3', name: 'Le Manoir Hanté', description: 'Survivez au manoir maudit', theme: 'Horreur', difficulty: 'expert', duration: 90, maxPlayers: 6, price: 180, status: 'available', successRate: 30, averageTime: 85 },
        { id: '4', name: 'Le Trésor Perdu', description: 'Trouvez le trésor caché', theme: 'Aventure', difficulty: 'easy', duration: 45, maxPlayers: 4, price: 90, status: 'available', successRate: 80, averageTime: 38 },
        { id: '5', name: 'Mission Espionnage', description: 'Infiltrez la base secrète', theme: 'Espionnage', difficulty: 'hard', duration: 75, maxPlayers: 6, price: 150, status: 'maintenance', successRate: 40, averageTime: 70 },
      ]
      setRooms(sample)
      localStorage.setItem('escape-rooms', JSON.stringify(sample))
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
          roomId: '1',
          roomName: 'La Prison Évadée',
          date: today,
          time: '18:00',
          players: 4,
          price: 120,
          status: 'confirmed',
        },
        {
          id: '2',
          customerName: 'Fatima Kadri',
          phone: '+213 555 5678',
          roomId: '2',
          roomName: 'Le Laboratoire Secret',
          date: today,
          time: '20:00',
          players: 6,
          price: 150,
          status: 'completed',
          result: 'escaped',
          timeTaken: 58,
        },
      ]
      setBookings(sample)
      localStorage.setItem('escape-bookings', JSON.stringify(sample))
    }

    if (savedTeams) {
      const parsed = JSON.parse(savedTeams)
      setTeams(parsed.map((t: any) => ({ ...t, joinDate: new Date(t.joinDate) })))
    } else {
      const sample: Team[] = [
        { id: '1', name: 'Équipe Alpha', members: ['Ahmed', 'Mohamed', 'Sara', 'Yasmine'], totalGames: 8, wins: 5, bestTime: 38, favoriteRoom: 'Le Trésor Perdu', joinDate: new Date('2023-06-15') },
        { id: '2', name: 'Les Évadés', members: ['Fatima', 'Khadija', 'Omar'], totalGames: 12, wins: 7, bestTime: 42, favoriteRoom: 'La Prison Évadée', joinDate: new Date('2023-03-20') },
      ]
      setTeams(sample)
      localStorage.setItem('escape-teams', JSON.stringify(sample))
    }

    if (savedLeaderboard) {
      const parsed = JSON.parse(savedLeaderboard)
      setLeaderboard(parsed.map((l: any) => ({ ...l, date: new Date(l.date) })))
    } else {
      const sample: LeaderboardEntry[] = [
        { id: '1', teamName: 'Équipe Alpha', roomName: 'Le Trésor Perdu', time: 38, date: new Date(), players: 4 },
        { id: '2', teamName: 'Les Évadés', roomName: 'La Prison Évadée', time: 42, date: new Date(), players: 3 },
        { id: '3', teamName: 'Les Champions', roomName: 'Le Laboratoire Secret', time: 55, date: new Date(), players: 6 },
      ]
      setLeaderboard(sample)
      localStorage.setItem('escape-leaderboard', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (rooms.length > 0) localStorage.setItem('escape-rooms', JSON.stringify(rooms))
  }, [rooms])

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('escape-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    if (teams.length > 0) localStorage.setItem('escape-teams', JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    if (leaderboard.length > 0) localStorage.setItem('escape-leaderboard', JSON.stringify(leaderboard))
  }, [leaderboard])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'rooms' as TabType, label: 'Salles', icon: Lock },
    { id: 'bookings' as TabType, label: 'Réservations', icon: Calendar },
    { id: 'teams' as TabType, label: 'Équipes', icon: Users },
    { id: 'leaderboard' as TabType, label: 'Classement', icon: Trophy },
  ]

  const availableRooms = rooms.filter(r => r.status === 'available').length
  const occupiedRooms = rooms.filter(r => r.status === 'occupied').length
  const todayBookings = bookings.filter(b => {
    const today = new Date()
    return b.date.toDateString() === today.toDateString() && b.status === 'confirmed'
  })
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)
  const successRate = bookings.filter(b => b.status === 'completed' && b.result === 'escaped').length / Math.max(bookings.filter(b => b.status === 'completed').length, 1) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
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
                      ? 'text-red-600 border-b-2 border-red-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Salles disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableRooms}</p>
                  </div>
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Salles occupées</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{occupiedRooms}</p>
                  </div>
                  <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Taux de réussite</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{successRate.toFixed(0)}%</p>
                  </div>
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Réservations aujourd'hui</h3>
                <div className="space-y-3">
                  {todayBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.roomName}</p>
                        <p className="text-xs text-gray-400 mt-1">{booking.time} • {booking.players} joueurs</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-red-600">DZD{booking.price}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Confirmée</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top 3 Classement</h3>
                <div className="space-y-3">
                  {leaderboard.sort((a, b) => a.time - b.time).slice(0, 3).map((entry, idx) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                          idx === 1 ? 'bg-gray-100 text-gray-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.teamName}</p>
                          <p className="text-sm text-gray-500">{entry.roomName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{entry.time} min</p>
                        <p className="text-xs text-gray-500">{entry.players} joueurs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Salles</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ajouter une salle
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`bg-white rounded-xl shadow-lg border-2 p-4 sm:p-6 ${
                    room.status === 'available' ? 'border-green-200' :
                    room.status === 'occupied' ? 'border-blue-200' :
                    'border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{room.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{room.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{room.theme}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          room.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          room.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          room.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {room.difficulty === 'easy' ? 'Facile' :
                           room.difficulty === 'medium' ? 'Moyen' :
                           room.difficulty === 'hard' ? 'Difficile' :
                           'Expert'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="text-gray-900">{room.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joueurs max:</span>
                      <span className="text-gray-900">{room.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux de réussite:</span>
                      <span className="font-medium text-gray-900">{room.successRate}%</span>
                    </div>
                    {room.averageTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temps moyen:</span>
                        <span className="text-gray-900">{room.averageTime} min</span>
                      </div>
                    )}
                    {room.currentSession && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Session en cours</p>
                        <p className="text-sm font-medium text-blue-600">{room.currentSession}</p>
                        {room.players && (
                          <p className="text-xs text-gray-500 mt-1">{room.players} joueurs</p>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-red-600">DZD{room.price}</span>
                    </div>
                    <span className={`block text-center mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      room.status === 'available' ? 'bg-green-100 text-green-800' :
                      room.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {room.status === 'available' ? 'Disponible' :
                       room.status === 'occupied' ? 'Occupée' :
                       'Maintenance'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouvelle réservation
              </button>
            </div>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Réservation #{booking.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{booking.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{booking.phone}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.roomName} • {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{booking.players} joueurs</p>
                      {booking.result && (
                        <p className={`text-sm font-medium mt-2 ${
                          booking.result === 'escaped' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {booking.result === 'escaped' ? '✓ Évasion réussie' : '✗ Évasion échouée'}
                          {booking.timeTaken && ` en ${booking.timeTaken} min`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouvelle équipe
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Membres:</p>
                    <div className="flex flex-wrap gap-1">
                      {team.members.map((member, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{member}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Parties:</span>
                      <span className="font-medium text-gray-900">{team.totalGames}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Victoires:</span>
                      <span className="font-medium text-green-600">{team.wins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taux de réussite:</span>
                      <span className="font-medium text-gray-900">{((team.wins / team.totalGames) * 100).toFixed(0)}%</span>
                    </div>
                    {team.bestTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Meilleur temps:</span>
                        <span className="font-bold text-red-600">{team.bestTime} min</span>
                      </div>
                    )}
                    {team.favoriteRoom && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Salle préférée:</span>
                        <span className="font-medium text-red-600">{team.favoriteRoom}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Classement</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rang</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipe</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salle</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Temps</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Joueurs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboard.sort((a, b) => a.time - b.time).map((entry, idx) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            idx === 0 ? 'bg-yellow-100 text-yellow-800' :
                            idx === 1 ? 'bg-gray-100 text-gray-800' :
                            idx === 2 ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.teamName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.roomName}</td>
                        <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">{entry.time} min</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">{entry.players}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      </div>
        )}
      </main>
    </div>
  )
}
