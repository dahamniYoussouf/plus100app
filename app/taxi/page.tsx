'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { CarTaxiFront, Car, Users, Calendar, MapPin, BarChart3, TrendingUp, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'vehicles' | 'drivers' | 'rides' | 'reservations'

interface Vehicle {
  id: string
  plateNumber: string
  model: string
  year: number
  driverId?: string
  driverName?: string
  status: 'available' | 'on_ride' | 'maintenance' | 'offline'
  location?: string
}

interface Driver {
  id: string
  name: string
  phone: string
  licenseNumber: string
  vehicleId?: string
  status: 'available' | 'on_ride' | 'offline'
  totalRides: number
}

interface Ride {
  id: string
  driverId: string
  driverName: string
  vehicleId: string
  vehiclePlate: string
  customerName: string
  customerPhone: string
  pickup: string
  destination: string
  distance: number
  fare: number
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  startTime?: Date
  endTime?: Date
  createdAt: Date
}

interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  pickup: string
  destination: string
  scheduledTime: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export default function TaxiPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [rides, setRides] = useState<Ride[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', model: '', year: new Date().getFullYear() })
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', licenseNumber: '' })

  useEffect(() => {
    const savedVehicles = localStorage.getItem('taxi-vehicles')
    const savedDrivers = localStorage.getItem('taxi-drivers')
    const savedRides = localStorage.getItem('taxi-rides')
    const savedReservations = localStorage.getItem('taxi-reservations')

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    } else {
      const sample: Vehicle[] = [
        { id: '1', plateNumber: 'ABC-123', model: 'Toyota Corolla', year: 2020, status: 'available', location: 'Centre-ville' },
        { id: '2', plateNumber: 'DEF-456', model: 'Hyundai Elantra', year: 2021, status: 'on_ride', location: 'Quartier Nord' },
        { id: '3', plateNumber: 'GHI-789', model: 'Renault Symbol', year: 2019, status: 'available', location: 'Quartier Sud' },
      ]
      setVehicles(sample)
      localStorage.setItem('taxi-vehicles', JSON.stringify(sample))
    }

    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers))
    } else {
      const sample: Driver[] = [
        { id: '1', name: 'Mohamed Ali', phone: '+213 555 1111', licenseNumber: 'DL-12345', vehicleId: '1', status: 'available', totalRides: 245 },
        { id: '2', name: 'Ahmed Benali', phone: '+213 555 2222', licenseNumber: 'DL-67890', vehicleId: '2', status: 'on_ride', totalRides: 189 },
      ]
      setDrivers(sample)
      localStorage.setItem('taxi-drivers', JSON.stringify(sample))
    }

    if (savedRides) {
      const parsed = JSON.parse(savedRides)
      setRides(parsed.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        startTime: r.startTime ? new Date(r.startTime) : undefined,
        endTime: r.endTime ? new Date(r.endTime) : undefined,
      })))
    }

    if (savedReservations) {
      const parsed = JSON.parse(savedReservations)
      setReservations(parsed.map((r: any) => ({
        ...r,
        scheduledTime: new Date(r.scheduledTime),
      })))
    }
  }, [])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('taxi-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (drivers.length > 0) localStorage.setItem('taxi-drivers', JSON.stringify(drivers))
  }, [drivers])

  useEffect(() => {
    if (rides.length > 0) localStorage.setItem('taxi-rides', JSON.stringify(rides))
  }, [rides])

  useEffect(() => {
    if (reservations.length > 0) localStorage.setItem('taxi-reservations', JSON.stringify(reservations))
  }, [reservations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'drivers' as TabType, label: 'Chauffeurs', icon: Users },
    { id: 'rides' as TabType, label: 'Courses', icon: CarTaxiFront },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Calendar },
  ]

  const availableVehicles = vehicles.filter(v => v.status === 'available').length
  const activeRides = rides.filter(r => r.status === 'in_progress' || r.status === 'accepted').length
  const totalRevenue = rides.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.fare, 0)
  const todayRides = rides.filter(r => {
    const today = new Date()
    return r.createdAt.toDateString() === today.toDateString()
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
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
                      ? 'text-yellow-600 border-b-2 border-yellow-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{vehicles.length}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableVehicles}</p>
                  </div>
                  <CarTaxiFront className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Courses Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayRides}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {activeRides > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Courses en cours</h3>
                <p className="text-2xl font-bold text-blue-700">{activeRides}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Flotte</h3>
                  <p className="text-sm text-gray-600">Suivi des véhicules et leur état</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Chauffeurs</h3>
                  <p className="text-sm text-gray-600">Gestion des chauffeurs et disponibilité</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Courses</h3>
                  <p className="text-sm text-gray-600">Suivi des courses en temps réel</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Gestion des réservations à l'avance</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Géolocalisation</h3>
                  <p className="text-sm text-gray-600">Suivi GPS des véhicules</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Calcul automatique des tarifs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Véhicules</h2>
              <button 
                onClick={() => setShowVehicleModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Ajouter Véhicule
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{vehicle.model}</h3>
                  <p className="text-sm text-gray-600 mb-1">Plaque: {vehicle.plateNumber}</p>
                  <p className="text-sm text-gray-600 mb-3">Année: {vehicle.year}</p>
                  {vehicle.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      {vehicle.location}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'on_ride' ? 'bg-blue-100 text-blue-800' :
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponible' :
                       vehicle.status === 'on_ride' ? 'En course' :
                       vehicle.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Chauffeurs</h2>
              <button 
                onClick={() => setShowDriverModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Nouveau Chauffeur
              </button>
            </div>
            {drivers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun chauffeur enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{driver.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{driver.phone}</p>
                    <p className="text-sm text-gray-600 mb-3">Permis: {driver.licenseNumber}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Courses</p>
                        <p className="font-bold text-yellow-600">{driver.totalRides}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        driver.status === 'available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'on_ride' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? 'Disponible' :
                         driver.status === 'on_ride' ? 'En course' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Courses</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouvelle Course
              </button>
            </div>
            {rides.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <CarTaxiFront className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune course enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Course #{ride.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ride.customerName} - {ride.customerPhone}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">📍 Départ: {ride.pickup}</p>
                          <p className="text-sm text-gray-600">📍 Destination: {ride.destination}</p>
                          <p className="text-sm text-gray-500">Chauffeur: {ride.driverName} • {ride.vehiclePlate}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{ride.fare.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                          ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          ride.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ride.status === 'completed' ? 'Terminée' :
                           ride.status === 'cancelled' ? 'Annulée' :
                           ride.status === 'in_progress' ? 'En cours' :
                           ride.status === 'accepted' ? 'Acceptée' : 'Demandée'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouvelle Réservation
              </button>
            </div>
            {reservations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{reservation.customerName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{reservation.customerPhone}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">📍 {reservation.pickup} → {reservation.destination}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(reservation.scheduledTime).toLocaleDateString('fr-FR')} à {new Date(reservation.scheduledTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status === 'completed' ? 'Terminée' :
                         reservation.status === 'cancelled' ? 'Annulée' :
                         reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showVehicleModal}
        onClose={() => {
          setShowVehicleModal(false)
          setNewVehicle({ plateNumber: '', model: '', year: new Date().getFullYear() })
        }}
        title="Ajouter Véhicule"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
            <input
              type="text"
              value={newVehicle.plateNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: 12345-A-16"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: Renault Clio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="number"
                value={newVehicle.year}
                onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowVehicleModal(false)
                setNewVehicle({ plateNumber: '', model: '', year: new Date().getFullYear() })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newVehicle.plateNumber && newVehicle.model) {
                  const vehicle: Vehicle = {
                    id: Date.now().toString(),
                    plateNumber: newVehicle.plateNumber,
                    model: newVehicle.model,
                    year: newVehicle.year,
                    status: 'available',
                  }
                  setVehicles([...vehicles, vehicle])
                  setShowVehicleModal(false)
                  setNewVehicle({ plateNumber: '', model: '', year: new Date().getFullYear() })
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDriverModal}
        onClose={() => {
          setShowDriverModal(false)
          setNewDriver({ name: '', phone: '', licenseNumber: '' })
        }}
        title="Nouveau Chauffeur"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
              <input
                type="text"
                value={newDriver.licenseNumber}
                onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: PER-123456"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDriverModal(false)
                setNewDriver({ name: '', phone: '', licenseNumber: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDriver.name && newDriver.phone && newDriver.licenseNumber) {
                  const driver: Driver = {
                    id: Date.now().toString(),
                    name: newDriver.name,
                    phone: newDriver.phone,
                    licenseNumber: newDriver.licenseNumber,
                    status: 'available',
                    totalRides: 0,
                  }
                  setDrivers([...drivers, driver])
                  setShowDriverModal(false)
                  setNewDriver({ name: '', phone: '', licenseNumber: '' })
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}