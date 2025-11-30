'use client'

import { useState, useEffect } from 'react'
import { Hotel, Bed, Calendar, Users, BarChart3, Settings } from 'lucide-react'
import HotelDashboard from '@/components/hotel/HotelDashboard'
import RoomManagement from '@/components/hotel/RoomManagement'
import ReservationManagement from '@/components/hotel/ReservationManagement'
import { Room, Reservation as HotelReservation } from '@/types/hotel'

type TabType = 'dashboard' | 'rooms' | 'reservations'

export default function HotelPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [rooms, setRooms] = useState<Room[]>([])
  const [reservations, setReservations] = useState<HotelReservation[]>([])

  useEffect(() => {
    const savedRooms = localStorage.getItem('hotel-rooms')
    const savedReservations = localStorage.getItem('hotel-reservations')

    if (savedRooms) {
      setRooms(JSON.parse(savedRooms))
    } else {
      const sample: Room[] = Array.from({ length: 20 }, (_, i) => ({
        id: `room-${i + 1}`,
        number: `${Math.floor(i / 5) + 1}${String((i % 5) + 1).padStart(2, '0')}`,
        type: i < 8 ? 'single' : i < 16 ? 'double' : i < 19 ? 'suite' : 'deluxe',
        floor: Math.floor(i / 5) + 1,
        price: i < 8 ? 80 : i < 16 ? 120 : i < 19 ? 200 : 300,
        status: i < 15 ? 'available' : 'occupied',
        amenities: ['WiFi', 'TV', 'AC'],
        maxGuests: i < 8 ? 1 : i < 16 ? 2 : i < 19 ? 4 : 6,
      }))
      setRooms(sample)
      localStorage.setItem('hotel-rooms', JSON.stringify(sample))
    }

    if (savedReservations) {
      const parsed = JSON.parse(savedReservations)
      setReservations(
        parsed.map((r: any) => ({
          ...r,
          checkIn: new Date(r.checkIn),
          checkOut: new Date(r.checkOut),
          createdAt: new Date(r.createdAt),
        }))
      )
    }
  }, [])

  useEffect(() => {
    if (rooms.length > 0) localStorage.setItem('hotel-rooms', JSON.stringify(rooms))
  }, [rooms])

  useEffect(() => {
    if (reservations.length > 0 || localStorage.getItem('hotel-reservations')) {
      localStorage.setItem('hotel-reservations', JSON.stringify(reservations))
    }
  }, [reservations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'rooms' as TabType, label: 'Chambres', icon: Bed },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="p-6">
        {activeTab === 'dashboard' && (
          <HotelDashboard rooms={rooms} reservations={reservations} />
        )}
        {activeTab === 'rooms' && (
          <RoomManagement rooms={rooms} setRooms={setRooms} reservations={reservations} />
        )}
        {activeTab === 'reservations' && (
          <ReservationManagement
            reservations={reservations}
            setReservations={setReservations}
            rooms={rooms}
            setRooms={setRooms}
          />
        )}
      </main>
    </div>
  )
}

