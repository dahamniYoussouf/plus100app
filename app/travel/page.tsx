'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Users, DollarSign, Settings, LogOut, Plane, Hotel } from 'lucide-react'
import DestinationManagement from '@/components/travel/DestinationManagement'
import CircuitManagement from '@/components/travel/CircuitManagement'
import ReservationManagement from '@/components/travel/ReservationManagement'
import TravelDashboard from '@/components/travel/TravelDashboard'
import { Destination, Circuit, Reservation } from '@/types/travel'

type TabType = 'dashboard' | 'destinations' | 'circuits' | 'reservations'

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedDestinations = localStorage.getItem('travel-destinations')
    const savedCircuits = localStorage.getItem('travel-circuits')
    const savedReservations = localStorage.getItem('travel-reservations')

    if (savedDestinations) {
      setDestinations(JSON.parse(savedDestinations))
    } else {
      // Initialize with sample data
      const sampleDestinations: Destination[] = [
        {
          id: '1',
          name: 'Paris - Ville Lumière',
          country: 'France',
          city: 'Paris',
          description: 'Découvrez la beauté de Paris avec ses monuments emblématiques',
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          price: 1200,
          duration: 3,
          category: 'city',
          highlights: ['Tour Eiffel', 'Louvre', 'Champs-Élysées', 'Montmartre'],
          included: ['Hôtel 3 étoiles', 'Petit-déjeuner', 'Visites guidées'],
          notIncluded: ['Vols', 'Repas supplémentaires', 'Assurance'],
        },
        {
          id: '2',
          name: 'Sahara Desert Adventure',
          country: 'Algérie',
          city: 'Tamanrasset',
          description: 'Aventure dans le désert du Sahara avec nuit sous les étoiles',
          image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
          price: 850,
          duration: 4,
          category: 'adventure',
          highlights: ['Randonnée dans le désert', 'Nuit sous les étoiles', 'Culture touarègue'],
          included: ['Campement', 'Tous les repas', 'Guide local'],
          notIncluded: ['Transport', 'Équipement de camping', 'Assurance'],
        },
        {
          id: '3',
          name: 'Bali Tropical Paradise',
          country: 'Indonésie',
          city: 'Bali',
          description: 'Plages de sable blanc et temples sacrés',
          image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
          price: 1500,
          duration: 7,
          category: 'beach',
          highlights: ['Plages paradisiaques', 'Temples balinais', 'Spa traditionnel'],
          included: ['Hôtel 4 étoiles', 'Petit-déjeuner', 'Transferts'],
          notIncluded: ['Vols internationaux', 'Repas', 'Activités optionnelles'],
        },
      ]
      setDestinations(sampleDestinations)
      localStorage.setItem('travel-destinations', JSON.stringify(sampleDestinations))
    }

    if (savedCircuits) {
      const parsed = JSON.parse(savedCircuits)
      setCircuits(parsed.map((c: any) => ({
        ...c,
        startDate: c.startDate ? new Date(c.startDate) : undefined,
        endDate: c.endDate ? new Date(c.endDate) : undefined,
        createdAt: new Date(c.createdAt),
        itinerary: c.itinerary || [],
      })))
    }

    if (savedReservations) {
      const parsed = JSON.parse(savedReservations)
      setReservations(parsed.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      })))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (destinations.length > 0) {
      localStorage.setItem('travel-destinations', JSON.stringify(destinations))
    }
  }, [destinations])

  useEffect(() => {
    if (circuits.length > 0 || localStorage.getItem('travel-circuits')) {
      localStorage.setItem('travel-circuits', JSON.stringify(circuits))
    }
  }, [circuits])

  useEffect(() => {
    if (reservations.length > 0 || localStorage.getItem('travel-reservations')) {
      localStorage.setItem('travel-reservations', JSON.stringify(reservations))
    }
  }, [reservations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: Calendar },
    { id: 'destinations' as TabType, label: 'Destinations', icon: MapPin },
    { id: 'circuits' as TabType, label: 'Circuits', icon: Plane },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
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

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'dashboard' && (
          <TravelDashboard
            destinations={destinations}
            circuits={circuits}
            reservations={reservations}
          />
        )}
        {activeTab === 'destinations' && (
          <DestinationManagement
            destinations={destinations}
            setDestinations={setDestinations}
          />
        )}
        {activeTab === 'circuits' && (
          <CircuitManagement
            circuits={circuits}
            setCircuits={setCircuits}
            destinations={destinations}
          />
        )}
        {activeTab === 'reservations' && (
          <ReservationManagement
            reservations={reservations}
            setReservations={setReservations}
            circuits={circuits}
          />
        )}
      </main>
    </div>
  )
}

