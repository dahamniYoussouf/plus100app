'use client'

import { useState } from 'react'
import { Plus, Search, CheckCircle, XCircle, DollarSign, Users, Calendar, Plane } from 'lucide-react'
import { Reservation, Circuit } from '@/types/travel'

interface ReservationManagementProps {
  reservations: Reservation[]
  setReservations: (reservations: Reservation[]) => void
  circuits: Circuit[]
}

export default function ReservationManagement({
  reservations,
  setReservations,
  circuits,
}: ReservationManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch =
      res.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateStatus = (id: string, newStatus: Reservation['status']) => {
    setReservations(reservations.map((r) => (r.id === id ? { ...r, status: newStatus } : r)))
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h2>
          <p className="text-gray-500">Suivez et gérez toutes les réservations</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="paid">Payée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReservations.map((reservation) => {
          const circuit = circuits.find((c) => c.id === reservation.circuitId)
          return (
            <div key={reservation.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{reservation.clientName}</h3>
                  <p className="text-sm text-gray-500">{reservation.clientEmail}</p>
                  <p className="text-sm text-gray-500">{reservation.clientPhone}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium  DZD{statusColors[reservation.status]}`}>
                  {reservation.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{circuit?.name || 'Circuit supprimé'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{reservation.participants} participant(s)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-gray-900"> DZD{reservation.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(reservation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {reservation.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{reservation.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'confirmed')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmer
                  </button>
                )}
                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'paid')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <DollarSign className="w-4 h-4" />
                    Marquer Payée
                  </button>
                )}
                {reservation.status !== 'cancelled' && (
                  <button
                    onClick={() => updateStatus(reservation.id, 'cancelled')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  )
}

