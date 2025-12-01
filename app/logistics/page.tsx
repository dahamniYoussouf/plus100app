'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Truck, Package, Users, BarChart3, MapPin, Clock, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'shipments' | 'vehicles' | 'drivers' | 'routes' | 'warehouses'

interface Shipment {
  id: string
  trackingNumber: string
  origin: string
  destination: string
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled'
  weight: number
  volume: number
  vehicleId?: string
  driverId?: string
  estimatedDelivery: Date
  actualDelivery?: Date
  clientName: string
}

interface Vehicle {
  id: string
  licensePlate: string
  type: 'truck' | 'van' | 'container'
  capacity: number
  status: 'available' | 'in_transit' | 'maintenance'
  currentLocation?: string
  driverId?: string
}

interface Driver {
  id: string
  name: string
  phone: string
  licenseNumber: string
  status: 'available' | 'on_delivery' | 'off'
  currentVehicleId?: string
  deliveriesCompleted: number
}

interface Route {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  estimatedTime: number
  status: 'active' | 'inactive'
}

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ licensePlate: '', type: 'truck' as 'truck' | 'van' | 'container', capacity: 0 })
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', licenseNumber: '' })

  useEffect(() => {
    const savedShipments = localStorage.getItem('logistics-shipments')
    const savedVehicles = localStorage.getItem('logistics-vehicles')
    const savedDrivers = localStorage.getItem('logistics-drivers')
    const savedRoutes = localStorage.getItem('logistics-routes')

    if (savedShipments) {
      const parsed = JSON.parse(savedShipments)
      setShipments(parsed.map((s: any) => ({
        ...s,
        estimatedDelivery: new Date(s.estimatedDelivery),
        actualDelivery: s.actualDelivery ? new Date(s.actualDelivery) : undefined,
      })))
    } else {
      const sample: Shipment[] = [
        {
          id: '1',
          trackingNumber: 'LOG-001',
          origin: 'Alger',
          destination: 'Oran',
          status: 'in_transit',
          weight: 500,
          volume: 2.5,
          vehicleId: '1',
          driverId: '1',
          estimatedDelivery: new Date('2024-01-20'),
          clientName: 'Client ABC',
        },
      ]
      setShipments(sample)
      localStorage.setItem('logistics-shipments', JSON.stringify(sample))
    }

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    } else {
      const sample: Vehicle[] = [
        {
          id: '1',
          licensePlate: '12345-A-16',
          type: 'truck',
          capacity: 5000,
          status: 'in_transit',
          currentLocation: 'En route vers Oran',
          driverId: '1',
        },
        {
          id: '2',
          licensePlate: '67890-B-16',
          type: 'van',
          capacity: 1000,
          status: 'available',
        },
      ]
      setVehicles(sample)
      localStorage.setItem('logistics-vehicles', JSON.stringify(sample))
    }

    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers))
    } else {
      const sample: Driver[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          licenseNumber: 'DL123456',
          status: 'on_delivery',
          currentVehicleId: '1',
          deliveriesCompleted: 45,
        },
        {
          id: '2',
          name: 'Omar Amrani',
          phone: '+213 555 5678',
          licenseNumber: 'DL789012',
          status: 'available',
          deliveriesCompleted: 32,
        },
      ]
      setDrivers(sample)
      localStorage.setItem('logistics-drivers', JSON.stringify(sample))
    }

    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes))
    } else {
      const sample: Route[] = [
        {
          id: '1',
          name: 'Alger - Oran',
          origin: 'Alger',
          destination: 'Oran',
          distance: 432,
          estimatedTime: 5,
          status: 'active',
        },
      ]
      setRoutes(sample)
      localStorage.setItem('logistics-routes', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (shipments.length > 0) localStorage.setItem('logistics-shipments', JSON.stringify(shipments))
  }, [shipments])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('logistics-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (drivers.length > 0) localStorage.setItem('logistics-drivers', JSON.stringify(drivers))
  }, [drivers])

  useEffect(() => {
    if (routes.length > 0) localStorage.setItem('logistics-routes', JSON.stringify(routes))
  }, [routes])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'shipments' as TabType, label: 'Expéditions', icon: Package },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Truck },
    { id: 'drivers' as TabType, label: 'Chauffeurs', icon: Users },
    { id: 'routes' as TabType, label: 'Itinéraires', icon: MapPin },
    { id: 'warehouses' as TabType, label: 'Entrepôts', icon: Package },
  ]

  const inTransitShipments = shipments.filter(s => s.status === 'in_transit').length
  const availableVehicles = vehicles.filter(v => v.status === 'available').length
  const availableDrivers = drivers.filter(d => d.status === 'available').length
  const deliveredToday = shipments.filter(s => {
    if (!s.actualDelivery) return false
    const today = new Date()
    return s.actualDelivery.toDateString() === today.toDateString() && s.status === 'delivered'
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
                      ? 'text-orange-600 border-b-2 border-orange-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Transit</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{inTransitShipments}</p>
                  </div>
                  <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableVehicles}</p>
                  </div>
                  <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Chauffeurs Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableDrivers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Livrés Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{deliveredToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expéditions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvelle Expédition
              </button>
            </div>
            {shipments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune expédition</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">#{shipment.trackingNumber}</h3>
                        <p className="text-sm text-gray-600 mt-1">{shipment.clientName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {shipment.origin} → {shipment.destination}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.status === 'delivered' ? 'Livré' :
                         shipment.status === 'in_transit' ? 'En transit' :
                         shipment.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-4">
                        <p className="text-gray-600">⚖️ {shipment.weight} kg</p>
                        <p className="text-gray-600">📦 {shipment.volume} m³</p>
                      </div>
                      <p className="text-gray-600">
                        📅 Livraison estimée: {new Date(shipment.estimatedDelivery).toLocaleDateString('fr-FR')}
                      </p>
                      {shipment.actualDelivery && (
                        <p className="text-green-600">
                          ✅ Livré le: {new Date(shipment.actualDelivery).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Véhicules</h2>
              <button 
                onClick={() => setShowVehicleModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter Véhicule
              </button>
            </div>
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun véhicule</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{vehicle.licensePlate}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {vehicle.type === 'truck' ? 'Camion' :
                           vehicle.type === 'van' ? 'Fourgon' : 'Conteneur'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' :
                         vehicle.status === 'in_transit' ? 'En transit' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">📦 Capacité: {vehicle.capacity} kg</p>
                      {vehicle.currentLocation && (
                        <p className="text-sm text-gray-600">📍 {vehicle.currentLocation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Chauffeurs</h2>
              <button 
                onClick={() => setShowDriverModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter Chauffeur
              </button>
            </div>
            {drivers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun chauffeur</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                        <p className="text-sm text-gray-500">Permis: {driver.licenseNumber}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        driver.status === 'available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'on_delivery' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? 'Disponible' :
                         driver.status === 'on_delivery' ? 'En livraison' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">📞 {driver.phone}</p>
                      <p className="text-sm text-gray-600">✅ {driver.deliveriesCompleted} livraisons</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Itinéraires</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvel Itinéraire
              </button>
            </div>
            {routes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun itinéraire</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {routes.map((route) => (
                  <div key={route.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{route.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {route.origin} → {route.destination}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {route.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">📏 Distance: {route.distance} km</p>
                      <p className="text-gray-600">⏰ Temps estimé: {route.estimatedTime} heures</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'warehouses' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Entrepôts</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des entrepôts et stocks</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showVehicleModal}
        onClose={() => {
          setShowVehicleModal(false)
          setNewVehicle({ licensePlate: '', type: 'truck', capacity: 0 })
        }}
        title="Ajouter Véhicule"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
            <input
              type="text"
              value={newVehicle.licensePlate}
              onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: 12345-A-16"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newVehicle.type}
                onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="truck">Camion</option>
                <option value="van">Fourgon</option>
                <option value="container">Conteneur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (kg)</label>
              <input
                type="number"
                value={newVehicle.capacity}
                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowVehicleModal(false)
                setNewVehicle({ licensePlate: '', type: 'truck', capacity: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newVehicle.licensePlate && newVehicle.capacity > 0) {
                  const vehicle: Vehicle = {
                    id: Date.now().toString(),
                    licensePlate: newVehicle.licensePlate,
                    type: newVehicle.type,
                    capacity: newVehicle.capacity,
                    status: 'available',
                  }
                  setVehicles([...vehicles, vehicle])
                  setShowVehicleModal(false)
                  setNewVehicle({ licensePlate: '', type: 'truck', capacity: 0 })
                }
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
        title="Ajouter Chauffeur"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
              <input
                type="text"
                value={newDriver.licenseNumber}
                onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    deliveriesCompleted: 0,
                  }
                  setDrivers([...drivers, driver])
                  setShowDriverModal(false)
                  setNewDriver({ name: '', phone: '', licenseNumber: '' })
                }
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
