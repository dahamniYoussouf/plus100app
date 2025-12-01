'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Film, Calendar, Ticket, Users, BarChart3, TrendingUp, Clock, Play } from 'lucide-react'

type TabType = 'dashboard' | 'movies' | 'sessions' | 'bookings'

interface Movie {
  id: string
  title: string
  genre: string
  duration: number
  rating: string
  releaseDate: Date
  director: string
  status: 'now_showing' | 'coming_soon' | 'ended'
}

interface Session {
  id: string
  movieId: string
  movieTitle: string
  hall: string
  date: Date
  time: string
  seatsAvailable: number
  totalSeats: number
  price: number
}

interface Booking {
  id: string
  sessionId: string
  movieTitle: string
  customerName: string
  customerEmail: string
  seats: number
  totalPrice: number
  bookingDate: Date
  status: 'confirmed' | 'cancelled'
}

export default function CinemaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [movies, setMovies] = useState<Movie[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showFilmModal, setShowFilmModal] = useState(false)
  const [newFilm, setNewFilm] = useState({ title: '', genre: '', duration: 120, rating: '', releaseDate: '', director: '', status: 'now_showing' as 'now_showing' | 'coming_soon' | 'ended' })

  useEffect(() => {
    const savedMovies = localStorage.getItem('cinema-movies')
    const savedSessions = localStorage.getItem('cinema-sessions')
    const savedBookings = localStorage.getItem('cinema-bookings')

    if (savedMovies) {
      const parsed = JSON.parse(savedMovies)
      setMovies(parsed.map((m: any) => ({
        ...m,
        releaseDate: new Date(m.releaseDate),
      })))
    } else {
      const sample: Movie[] = [
        { id: '1', title: 'Le Dernier Roi', genre: 'Drame', duration: 120, rating: 'PG-13', releaseDate: new Date('2024-01-15'), director: 'Ahmed Benali', status: 'now_showing' },
        { id: '2', title: 'Les Aventures de Sami', genre: 'Aventure', duration: 105, rating: 'G', releaseDate: new Date('2024-02-01'), director: 'Fatima Kadri', status: 'now_showing' },
        { id: '3', title: 'L\'Étoile du Désert', genre: 'Action', duration: 135, rating: 'PG-13', releaseDate: new Date('2024-03-01'), director: 'Omar Cherif', status: 'coming_soon' },
      ]
      setMovies(sample)
      localStorage.setItem('cinema-movies', JSON.stringify(sample))
    }

    if (savedSessions) {
      const parsed = JSON.parse(savedSessions)
      setSessions(parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date),
      })))
    } else {
      const today = new Date()
      const sample: Session[] = [
        { id: '1', movieId: '1', movieTitle: 'Le Dernier Roi', hall: 'Salle A', date: today, time: '18:00', seatsAvailable: 45, totalSeats: 100, price: 8.50 },
        { id: '2', movieId: '1', movieTitle: 'Le Dernier Roi', hall: 'Salle A', date: today, time: '21:00', seatsAvailable: 78, totalSeats: 100, price: 10.00 },
        { id: '3', movieId: '2', movieTitle: 'Les Aventures de Sami', hall: 'Salle B', date: today, time: '16:00', seatsAvailable: 92, totalSeats: 80, price: 7.50 },
      ]
      setSessions(sample)
      localStorage.setItem('cinema-sessions', JSON.stringify(sample))
    }

    if (savedBookings) {
      const parsed = JSON.parse(savedBookings)
      setBookings(parsed.map((b: any) => ({
        ...b,
        bookingDate: new Date(b.bookingDate),
      })))
    }
  }, [])

  useEffect(() => {
    if (movies.length > 0) localStorage.setItem('cinema-movies', JSON.stringify(movies))
  }, [movies])

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('cinema-sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('cinema-bookings', JSON.stringify(bookings))
  }, [bookings])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'movies' as TabType, label: 'Films', icon: Film },
    { id: 'sessions' as TabType, label: 'Séances', icon: Calendar },
    { id: 'bookings' as TabType, label: 'Réservations', icon: Ticket },
  ]

  const nowShowing = movies.filter(m => m.status === 'now_showing').length
  const todaySessions = sessions.filter(s => {
    const today = new Date()
    return s.date.toDateString() === today.toDateString()
  })
  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0)
  const totalBookings = bookings.filter(b => b.status === 'confirmed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                      ? 'text-gray-600 border-b-2 border-gray-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Films</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{movies.length}</p>
                  </div>
                  <Film className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">À l'Affiche</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{nowShowing}</p>
                  </div>
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalBookings}</p>
                  </div>
                  <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Films</h3>
                  <p className="text-sm text-gray-600">Catalogue de films avec informations détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Séances</h3>
                  <p className="text-sm text-gray-600">Planification des séances par salle</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Système de réservation de billets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Salles</h3>
                  <p className="text-sm text-gray-600">Gestion des salles et capacités</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tarification</h3>
                  <p className="text-sm text-gray-600">Gestion des tarifs et promotions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de fréquentation et revenus</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Films</h2>
              <button 
                onClick={() => setShowFilmModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ajouter Film
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {movies.map((movie) => (
                <div key={movie.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Réalisateur: {movie.director}</p>
                  <p className="text-sm text-gray-600 mb-1">Genre: {movie.genre}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs text-gray-500">{movie.duration} min</span>
                    <span className="text-xs text-gray-500">{movie.rating}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs capitalize  DZD{
                      movie.status === 'now_showing' ? 'bg-green-100 text-green-800' :
                      movie.status === 'coming_soon' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {movie.status === 'now_showing' ? 'À l\'affiche' :
                       movie.status === 'coming_soon' ? 'Bientôt' : 'Terminé'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(movie.releaseDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Séances</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvelle Séance
              </button>
            </div>
            {sessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune séance programmée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const occupancyRate = ((session.totalSeats - session.seatsAvailable) / session.totalSeats) * 100
                  return (
                    <div key={session.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{session.movieTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(session.date).toLocaleDateString('fr-FR')} à {session.time} - {session.hall}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600">
                              Places: {session.seatsAvailable}/{session.totalSeats}
                            </span>
                            <span className="text-sm text-gray-500">
                              Taux: {occupancyRate.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-lg font-bold text-gray-900">DZD{session.price.toFixed(2)}</span>
                          <span className={`px-2 py-1 rounded text-xs  DZD{
                            session.seatsAvailable < 10 ? 'bg-red-100 text-red-800' :
                            session.seatsAvailable < 30 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {session.seatsAvailable < 10 ? 'Presque complet' :
                             session.seatsAvailable < 30 ? 'Peu de places' : 'Disponible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvelle Réservation
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.movieTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{booking.customerName} - {booking.customerEmail}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {booking.seats} place(s) • Réservé le {new Date(booking.bookingDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{booking.totalPrice.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
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
        isOpen={showFilmModal}
        onClose={() => {
          setShowFilmModal(false)
          setNewFilm({ title: '', genre: '', duration: 120, rating: '', releaseDate: '', director: '', status: 'now_showing' })
        }}
        title="Ajouter Film"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={newFilm.title}
              onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ex: Le Roi Lion"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <input
                type="text"
                value={newFilm.genre}
                onChange={(e) => setNewFilm({ ...newFilm, genre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: Action, Drame"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Réalisateur</label>
              <input
                type="text"
                value={newFilm.director}
                onChange={(e) => setNewFilm({ ...newFilm, director: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: John Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={newFilm.duration}
                onChange={(e) => setNewFilm({ ...newFilm, duration: parseInt(e.target.value) || 120 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="text"
                value={newFilm.rating}
                onChange={(e) => setNewFilm({ ...newFilm, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: PG-13"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newFilm.status}
                onChange={(e) => setNewFilm({ ...newFilm, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="now_showing">À l'affiche</option>
                <option value="coming_soon">Bientôt</option>
                <option value="ended">Terminé</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de sortie</label>
            <input
              type="date"
              value={newFilm.releaseDate}
              onChange={(e) => setNewFilm({ ...newFilm, releaseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowFilmModal(false)
                setNewFilm({ title: '', genre: '', duration: 120, rating: '', releaseDate: '', director: '', status: 'now_showing' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newFilm.title && newFilm.genre && newFilm.director && newFilm.releaseDate) {
                  const movie: Movie = {
                    id: Date.now().toString(),
                    title: newFilm.title,
                    genre: newFilm.genre,
                    duration: newFilm.duration,
                    rating: newFilm.rating,
                    releaseDate: new Date(newFilm.releaseDate),
                    director: newFilm.director,
                    status: newFilm.status,
                  }
                  setMovies([...movies, movie])
                  setShowFilmModal(false)
                  setNewFilm({ title: '', genre: '', duration: 120, rating: '', releaseDate: '', director: '', status: 'now_showing' })
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}