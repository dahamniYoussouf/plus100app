'use client'

import { Plus, Bed } from 'lucide-react'
import { Room, Reservation } from '@/types/hotel'

interface Props {
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
  reservations: Reservation[]
}

export default function RoomManagement({ rooms }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Chambres</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Ajouter Chambre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`bg-white rounded-lg shadow p-4 ${
              room.status === 'available' ? 'border-green-300' : room.status === 'occupied' ? 'border-red-300' : ''
            } border-2`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Chambre {room.number}</h3>
              <Bed className={`w-5 h-5 ${room.status === 'available' ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className="text-sm text-gray-600 capitalize">{room.type}</p>
            <p className="text-sm text-gray-600">${room.price}/nuit</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
              room.status === 'available' ? 'bg-green-100 text-green-800' :
              room.status === 'occupied' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {room.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

