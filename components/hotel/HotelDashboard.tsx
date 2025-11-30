'use client'

import { Bed, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { Room, Reservation } from '@/types/hotel'

interface Props {
  rooms: Room[]
  reservations: Reservation[]
}

export default function HotelDashboard({ rooms, reservations }: Props) {
  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.status === 'available').length,
    occupiedRooms: rooms.filter((r) => r.status === 'occupied').length,
    totalRevenue: reservations
      .filter((r) => r.status === 'checked-out' && r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.totalPrice, 0),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chambres Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalRooms}</p>
            </div>
            <Bed className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.availableRooms}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupées</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.occupiedRooms}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

