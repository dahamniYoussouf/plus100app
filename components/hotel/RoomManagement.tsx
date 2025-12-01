'use client'

import { useState } from 'react'
import { Plus, Bed } from 'lucide-react'
import { Room, Reservation } from '@/types/hotel'
import Modal from '@/components/Modal'

interface Props {
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
  reservations: Reservation[]
}

export default function RoomManagement({ rooms, setRooms }: Props) {
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [newRoom, setNewRoom] = useState({ number: '', type: 'single' as 'single' | 'double' | 'suite' | 'deluxe', floor: 1, price: 80, maxGuests: 1, amenities: [] as string[] })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Chambres</h2>
        <button 
          onClick={() => setShowRoomModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
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

      <Modal
        isOpen={showRoomModal}
        onClose={() => {
          setShowRoomModal(false)
          setNewRoom({ number: '', type: 'single', floor: 1, price: 80, maxGuests: 1, amenities: [] })
        }}
        title="Ajouter Chambre"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
              <input
                type="text"
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newRoom.type}
                onChange={(e) => {
                  const type = e.target.value as 'single' | 'double' | 'suite' | 'deluxe'
                  const defaults = { single: { price: 80, maxGuests: 1 }, double: { price: 120, maxGuests: 2 }, suite: { price: 200, maxGuests: 4 }, deluxe: { price: 300, maxGuests: 6 } }
                  setNewRoom({ ...newRoom, type, price: defaults[type].price, maxGuests: defaults[type].maxGuests })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="single">Simple</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Étage</label>
              <input
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix/nuit (DZD)</label>
              <input
                type="number"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max invités</label>
              <input
                type="number"
                value={newRoom.maxGuests}
                onChange={(e) => setNewRoom({ ...newRoom, maxGuests: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowRoomModal(false)
                setNewRoom({ number: '', type: 'single', floor: 1, price: 80, maxGuests: 1, amenities: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newRoom.number) {
                  const room: Room = {
                    id: `room-${Date.now()}`,
                    number: newRoom.number,
                    type: newRoom.type,
                    floor: newRoom.floor,
                    price: newRoom.price,
                    status: 'available',
                    amenities: ['WiFi', 'TV', 'AC'],
                    maxGuests: newRoom.maxGuests,
                  }
                  setRooms([...rooms, room])
                  setShowRoomModal(false)
                  setNewRoom({ number: '', type: 'single', floor: 1, price: 80, maxGuests: 1, amenities: [] })
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

