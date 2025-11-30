'use client'

import { Plus, Calendar } from 'lucide-react'
import { Reservation, Room } from '@/types/hotel'

interface Props {
  reservations: Reservation[]
  setReservations: (reservations: Reservation[]) => void
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
}

export default function ReservationManagement({ reservations }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Nouvelle Réservation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900">{res.guestName}</h3>
            <p className="text-sm text-gray-500">{res.guestEmail}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(res.checkIn).toLocaleDateString()} - {new Date(res.checkOut).toLocaleDateString()}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-2">${res.totalPrice}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

