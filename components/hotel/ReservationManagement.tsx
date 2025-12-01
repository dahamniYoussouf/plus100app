'use client'

import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import { Reservation, Room } from '@/types/hotel'
import Modal from '@/components/Modal'

interface Props {
  reservations: Reservation[]
  setReservations: (reservations: Reservation[]) => void
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
}

export default function ReservationManagement({ reservations, setReservations, rooms, setRooms }: Props) {
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [newReservation, setNewReservation] = useState({ roomId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Réservations</h2>
        <button 
          onClick={() => setShowReservationModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
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

      <Modal
        isOpen={showReservationModal}
        onClose={() => {
          setShowReservationModal(false)
          setNewReservation({ roomId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1 })
        }}
        title="Nouvelle Réservation"
        size="lg"
      >
        <div className="space-y-4">
          {rooms.filter(r => r.status === 'available').length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chambre</label>
              <select
                value={newReservation.roomId}
                onChange={(e) => setNewReservation({ ...newReservation, roomId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une chambre</option>
                {rooms.filter(r => r.status === 'available').map(room => (
                  <option key={room.id} value={room.id}>Chambre {room.number} - {room.type} - DZD{room.price}/nuit</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
            <input
              type="text"
              value={newReservation.guestName}
              onChange={(e) => setNewReservation({ ...newReservation, guestName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newReservation.guestEmail}
                onChange={(e) => setNewReservation({ ...newReservation, guestEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newReservation.guestPhone}
                onChange={(e) => setNewReservation({ ...newReservation, guestPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée</label>
              <input
                type="date"
                value={newReservation.checkIn}
                onChange={(e) => setNewReservation({ ...newReservation, checkIn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
              <input
                type="date"
                value={newReservation.checkOut}
                onChange={(e) => setNewReservation({ ...newReservation, checkOut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'invités</label>
            <input
              type="number"
              value={newReservation.guests}
              onChange={(e) => setNewReservation({ ...newReservation, guests: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowReservationModal(false)
                setNewReservation({ roomId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newReservation.roomId && newReservation.guestName && newReservation.checkIn && newReservation.checkOut) {
                  const room = rooms.find(r => r.id === newReservation.roomId)
                  if (room) {
                    const checkIn = new Date(newReservation.checkIn)
                    const checkOut = new Date(newReservation.checkOut)
                    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
                    const reservation: Reservation = {
                      id: Date.now().toString(),
                      roomId: newReservation.roomId,
                      guestName: newReservation.guestName,
                      guestEmail: newReservation.guestEmail,
                      guestPhone: newReservation.guestPhone,
                      checkIn,
                      checkOut,
                      numberOfGuests: newReservation.guests,
                      totalPrice: room.price * nights,
                      status: 'confirmed',
                      paymentStatus: 'unpaid',
                      createdAt: new Date(),
                    }
                    setReservations([...reservations, reservation])
                    // Mettre à jour le statut de la chambre
                    setRooms(rooms.map(r => r.id === newReservation.roomId ? { ...r, status: 'occupied' as const } : r))
                    setShowReservationModal(false)
                    setNewReservation({ roomId: '', guestName: '', guestEmail: '', guestPhone: '', checkIn: '', checkOut: '', guests: 1 })
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
    </div>
  )
}

