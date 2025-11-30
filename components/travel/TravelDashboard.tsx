'use client'

import { useMemo } from 'react'
import { DollarSign, Users, MapPin, Calendar, TrendingUp, CheckCircle } from 'lucide-react'
import { Destination, Circuit, Reservation } from '@/types/travel'

interface TravelDashboardProps {
  destinations: Destination[]
  circuits: Circuit[]
  reservations: Reservation[]
}

export default function TravelDashboard({ destinations, circuits, reservations }: TravelDashboardProps) {
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayReservations = reservations.filter(
      (r) => new Date(r.createdAt).toDateString() === today.toDateString()
    )

    const confirmedReservations = reservations.filter((r) => r.status === 'confirmed' || r.status === 'paid')

    const totalRevenue = reservations
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + r.totalPrice, 0)

    const pendingRevenue = reservations
      .filter((r) => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.totalPrice, 0)

    return {
      totalDestinations: destinations.length,
      totalCircuits: circuits.length,
      activeCircuits: circuits.filter((c) => c.status === 'published').length,
      totalReservations: reservations.length,
      todayReservations: todayReservations.length,
      confirmedReservations: confirmedReservations.length,
      totalRevenue,
      pendingRevenue,
    }
  }, [destinations, circuits, reservations])

  const upcomingCircuits = useMemo(() => {
    return [...circuits]
      .filter((c) => c.status === 'published' && c.startDate && new Date(c.startDate) >= new Date())
      .sort((a, b) => {
        if (!a.startDate || !b.startDate) return 0
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      })
      .slice(0, 5)
  }, [circuits])

  const recentReservations = useMemo(() => {
    return [...reservations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [reservations])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalReservations}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.todayReservations} aujourd'hui</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Circuits Actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.activeCircuits}/{stats.totalCircuits}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Destinations</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDestinations}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Circuits & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Circuits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Circuits à Venir
          </h2>
          <div className="space-y-3">
            {upcomingCircuits.length > 0 ? (
              upcomingCircuits.map((circuit) => (
                <div key={circuit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{circuit.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {circuit.startDate
                          ? new Date(circuit.startDate).toLocaleDateString()
                          : 'Date non définie'}
                      </span>
                      <span>{circuit.duration} jours</span>
                      <span>${circuit.price}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {circuit.currentParticipants}/{circuit.maxParticipants}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Aucun circuit à venir</p>
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Réservations Récentes
          </h2>
          <div className="space-y-3">
            {recentReservations.length > 0 ? (
              recentReservations.map((reservation) => {
                const circuit = circuits.find((c) => c.id === reservation.circuitId)
                return (
                  <div key={reservation.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{reservation.clientName}</p>
                        <p className="text-sm text-gray-500">{circuit?.name || 'Circuit supprimé'}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reservation.status]}`}
                      >
                        {reservation.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{reservation.participants} participant(s)</span>
                      <span className="font-semibold text-gray-900">
                        ${reservation.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 text-center py-8">Aucune réservation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

