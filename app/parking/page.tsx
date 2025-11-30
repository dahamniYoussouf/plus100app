'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Calendar, Ticket, BarChart3, MapPin, Clock, TrendingUp, Package, CreditCard } from 'lucide-react'

type TabType = 'dashboard' | 'spaces' | 'vehicles' | 'payments' | 'reservations'

interface ParkingSpace {
  id: string
  number: string
  floor: number
  zone: string
  type: 'regular' | 'disabled' | 'electric' | 'reserved'
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  hourlyRate: number
  dailyRate: number
}

interface Vehicle {
  id: string
  plateNumber: string
  make: string
  model: string
  color: string
  ownerName: string
  ownerPhone: string
  entryTime: Date
  spaceId?: string
  spaceNumber?: string
  type: 'car' | 'motorcycle' | 'truck' | 'other'
}

interface Payment {
  id: string
  vehicleId: string
  plateNumber: string
  spaceId: string
  spaceNumber: string
  entryTime: Date
  exitTime: Date
  duration: number
  amount: number
  paymentMethod: 'cash' | 'card' | 'mobile'
  status: 'paid' | 'pending' | 'refunded'
}

interface Reservation {
  id: string
  ownerName: string
  ownerPhone: string
  spaceId: string
  spaceNumber: string
  startDate: Date
  endDate: Date
  duration: number
  amount: number
  status: 'active' | 'completed' | 'cancelled'
}

export default function ParkingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [spaces, setSpaces] = useState<ParkingSpace[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const savedSpaces = localStorage.getItem('parking-spaces')
    const savedVehicles = localStorage.getItem('parking-vehicles')
    const savedPayments = localStorage.getItem('parking-payments')
    const savedReservations = localStorage.getItem('parking-reservations')

    if (savedSpaces) {
      setSpaces(JSON.parse(savedSpaces))
    } else {
      const sample: ParkingSpace[] = [
        { id: '1', number: 'A-101', floor: 1, zone: 'A', type: 'regular', status: 'occupied', hourlyRate: 2, dailyRate: 15 },
        { id: '2', number: 'A-102', floor: 1, zone: 'A', type: 'regular', status: 'available', hourlyRate: 2, dailyRate: 15 },
        { id: '3', number: 'B-201', floor: 2, zone: 'B', type: 'electric', status: 'available', hourlyRate: 3, dailyRate: 20 },
        { id: '4', number: 'C-301', floor: 3, zone: 'C', type: 'disabled', status: 'available', hourlyRate: 2, dailyRate: 15 },
        { id: '5', number: 'D-401', floor: 4, zone: 'D', type: 'reserved', status: 'reserved', hourlyRate: 4, dailyRate: 25 },
      ]
      setSpaces(sample)
      localStorage.setItem('parking-spaces', JSON.stringify(sample))
    }

    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed.map((v: any) => ({ ...v, entryTime: new Date(v.entryTime) })))
    } else {
      const sample: Vehicle[] = [
        { id: '1', plateNumber: 'ABC-123', make: 'Toyota', model: 'Corolla', color: 'Blanc', ownerName: 'Sarah Benali', ownerPhone: '+213 555 1234', entryTime: new Date(), spaceId: '1', spaceNumber: 'A-101', type: 'car' },
      ]
      setVehicles(sample)
      localStorage.setItem('parking-vehicles', JSON.stringify(sample))
    }

    if (savedPayments) {
      const parsed = JSON.parse(savedPayments)
      setPayments(parsed.map((p: any) => ({ ...p, entryTime: new Date(p.entryTime), exitTime: new Date(p.exitTime) })))
    } else {
      const today = new Date()
      const sample: Payment[] = [
        { id: '1', vehicleId: '1', plateNumber: 'ABC-123', spaceId: '1', spaceNumber: 'A-101', entryTime: new Date(today.getTime() - 2 * 60 * 60 * 1000), exitTime: today, duration: 2, amount: 4, paymentMethod: 'card', status: 'paid' },
      ]
      setPayments(sample)
      localStorage.setItem('parking-payments', JSON.stringify(sample))
    }

    if (savedReservations) {
      const parsed = JSON.parse(savedReservations)
      setReservations(parsed.map((r: any) => ({ ...r, startDate: new Date(r.startDate), endDate: new Date(r.endDate) })))
    } else {
      const today = new Date()
      const sample: Reservation[] = [
        { id: '1', ownerName: 'Ahmed Kadri', ownerPhone: '+213 555 5678', spaceId: '5', spaceNumber: 'D-401', startDate: today, endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), duration: 7, amount: 175, status: 'active' },
      ]
      setReservations(sample)
      localStorage.setItem('parking-reservations', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (spaces.length > 0) localStorage.setItem('parking-spaces', JSON.stringify(spaces))
  }, [spaces])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('parking-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (payments.length > 0) localStorage.setItem('parking-payments', JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    if (reservations.length > 0) localStorage.setItem('parking-reservations', JSON.stringify(reservations))
  }, [reservations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'spaces' as TabType, label: 'Places', icon: MapPin },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'payments' as TabType, label: 'Paiements', icon: CreditCard },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Calendar },
  ]

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) + reservations.filter(r => r.status === 'active').reduce((sum, r) => sum + r.amount, 0)
  const availableSpaces = spaces.filter(s => s.status === 'available').length
  const occupiedSpaces = spaces.filter(s => s.status === 'occupied').length
  const activeReservations = reservations.filter(r => r.status === 'active').length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-gray-700 border-b-2 border-gray-700'
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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Places libres</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableSpaces}</p>
                  </div>
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Places occupées</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{occupiedSpaces}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeReservations}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Véhicules en parking</h3>
                <div className="space-y-3">
                  {vehicles.slice(0, 5).map((vehicle) => {
                    const duration = Math.floor((new Date().getTime() - vehicle.entryTime.getTime()) / (1000 * 60))
                    return (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{vehicle.plateNumber}</p>
                          <p className="text-sm text-gray-500">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-gray-500 mt-1">Depuis: {duration} min • Place: {vehicle.spaceNumber}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold text-gray-900">{vehicle.ownerName}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Paiements récents</h3>
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{payment.plateNumber}</p>
                        <p className="text-sm text-gray-500">Place: {payment.spaceNumber}</p>
                        <p className="text-xs text-gray-500 mt-1">Durée: {payment.duration}h</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">DZD{payment.amount.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'Remboursé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spaces' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Places de parking</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Nouvelle place
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {spaces.map((space) => (
                <div key={space.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">Place {space.number}</h3>
                      <p className="text-sm text-gray-600 mb-2">Étage {space.floor} • Zone {space.zone}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          space.status === 'available' ? 'bg-green-100 text-green-800' :
                          space.status === 'occupied' ? 'bg-red-100 text-red-800' :
                          space.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {space.status === 'available' ? 'Disponible' : space.status === 'occupied' ? 'Occupée' : space.status === 'reserved' ? 'Réservée' : 'Maintenance'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs capitalize">{space.type === 'regular' ? 'Régulière' : space.type === 'disabled' ? 'Handicapée' : space.type === 'electric' ? 'Électrique' : 'Réservée'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarif horaire:</span>
                      <span className="font-medium text-gray-900">DZD{space.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarif journalier:</span>
                      <span className="font-medium text-gray-900">DZD{space.dailyRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Véhicules</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Nouveau véhicule
              </button>
            </div>
            <div className="space-y-4">
              {vehicles.map((vehicle) => {
                const duration = Math.floor((new Date().getTime() - vehicle.entryTime.getTime()) / (1000 * 60))
                return (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{vehicle.plateNumber}</h3>
                        <p className="text-sm text-gray-600 mt-1">{vehicle.make} {vehicle.model} • {vehicle.color}</p>
                        <p className="text-sm text-gray-600 mt-1">Propriétaire: {vehicle.ownerName}</p>
                        <p className="text-sm text-gray-600 mt-1">Téléphone: {vehicle.ownerPhone}</p>
                        <p className="text-sm text-gray-500 mt-1">Place: {vehicle.spaceNumber || 'Non assignée'}</p>
                        <p className="text-sm text-gray-500 mt-1">Entrée: {new Date(vehicle.entryTime).toLocaleString('fr-FR')}</p>
                        <p className="text-sm text-gray-500 mt-1">Durée: {duration} minutes</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                          {vehicle.type === 'car' ? 'Voiture' : vehicle.type === 'motorcycle' ? 'Moto' : vehicle.type === 'truck' ? 'Camion' : 'Autre'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Paiements</h2>
            </div>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Paiement #{payment.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">Plaque: {payment.plateNumber}</p>
                      <p className="text-sm text-gray-600 mt-1">Place: {payment.spaceNumber}</p>
                      <p className="text-sm text-gray-500 mt-1">Entrée: {new Date(payment.entryTime).toLocaleString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1">Sortie: {new Date(payment.exitTime).toLocaleString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1">Durée: {payment.duration} heures</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {payment.paymentMethod === 'cash' ? 'Espèces' : payment.paymentMethod === 'card' ? 'Carte' : 'Mobile'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status === 'paid' ? 'Payé' : payment.status === 'pending' ? 'En attente' : 'Remboursé'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{payment.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Nouvelle réservation
              </button>
            </div>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Réservation #{reservation.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">Propriétaire: {reservation.ownerName}</p>
                      <p className="text-sm text-gray-600 mt-1">Téléphone: {reservation.ownerPhone}</p>
                      <p className="text-sm text-gray-600 mt-1">Place: {reservation.spaceNumber}</p>
                      <p className="text-sm text-gray-500 mt-1">Du: {new Date(reservation.startDate).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1">Au: {new Date(reservation.endDate).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1">Durée: {reservation.duration} jours</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        reservation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'active' ? 'Active' : reservation.status === 'completed' ? 'Terminée' : 'Annulée'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{reservation.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
