'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Truck, Users, MapPin, Route, BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp, Package } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'vehicles' | 'drivers' | 'routes' | 'shipments'

interface Vehicle {
  id: string
  plateNumber: string
  type: 'truck' | 'van' | 'car' | 'motorcycle'
  brand: string
  model: string
  capacity: number
  driverId?: string
  driverName?: string
  status: 'available' | 'in_use' | 'maintenance' | 'offline'
  location?: string
  mileage: number
  lastMaintenance?: Date
}

interface Driver {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  vehicleId?: string
  vehiclePlate?: string
  status: 'available' | 'on_delivery' | 'off_duty'
  totalDeliveries: number
  rating: number
  joinDate: Date
}

interface Route {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  estimatedTime: number
  vehicleId?: string
  driverId?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  startTime?: Date
  endTime?: Date
}

interface Shipment {
  id: string
  trackingNumber: string
  senderName: string
  senderAddress: string
  recipientName: string
  recipientAddress: string
  weight: number
  routeId?: string
  vehicleId?: string
  driverId?: string
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled'
  createdAt: Date
  deliveredAt?: Date
}

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showDriverModal, setShowDriverModal] = useState(false)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const [newShipment, setNewShipment] = useState({ senderName: '', senderAddress: '', recipientName: '', recipientAddress: '', weight: 0, routeId: '', vehicleId: '', driverId: '' })
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', type: 'truck' as 'truck' | 'van' | 'car' | 'motorcycle', brand: '', model: '', capacity: 0, mileage: 0 })
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', email: '', licenseNumber: '' })

  useEffect(() => {
    const savedVehicles = localStorage.getItem('transport-vehicles')
    const savedDrivers = localStorage.getItem('transport-drivers')
    const savedRoutes = localStorage.getItem('transport-routes')
    const savedShipments = localStorage.getItem('transport-shipments')

    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed.map((v: any) => ({ ...v, lastMaintenance: v.lastMaintenance ? new Date(v.lastMaintenance) : undefined })))
    } else {
      const sample: Vehicle[] = [
        { id: '1', plateNumber: 'TR-1234', type: 'truck', brand: 'Mercedes', model: 'Actros', capacity: 20000, driverId: '1', driverName: 'Karim Benali', status: 'in_use', location: 'Alger', mileage: 125000, lastMaintenance: new Date() },
        { id: '2', plateNumber: 'VN-5678', type: 'van', brand: 'Ford', model: 'Transit', capacity: 5000, status: 'available', location: 'Oran', mileage: 85000 },
        { id: '3', plateNumber: 'CR-9012', type: 'car', brand: 'Toyota', model: 'Corolla', capacity: 500, status: 'maintenance', mileage: 45000 },
      ]
      setVehicles(sample)
      localStorage.setItem('transport-vehicles', JSON.stringify(sample))
    }

    if (savedDrivers) {
      const parsed = JSON.parse(savedDrivers)
      setDrivers(parsed.map((d: any) => ({ ...d, joinDate: new Date(d.joinDate) })))
    } else {
      const sample: Driver[] = [
        { id: '1', name: 'Karim Benali', phone: '+213 555 1234', email: 'karim@transport.com', licenseNumber: 'DL-12345', vehicleId: '1', vehiclePlate: 'TR-1234', status: 'on_delivery', totalDeliveries: 245, rating: 4.8, joinDate: new Date('2023-03-15') },
        { id: '2', name: 'Mohamed Amrani', phone: '+213 555 5678', email: 'mohamed@transport.com', licenseNumber: 'DL-67890', status: 'available', totalDeliveries: 180, rating: 4.6, joinDate: new Date('2023-06-20') },
      ]
      setDrivers(sample)
      localStorage.setItem('transport-drivers', JSON.stringify(sample))
    }

    if (savedRoutes) {
      const parsed = JSON.parse(savedRoutes)
      setRoutes(parsed.map((r: any) => ({ ...r, startTime: r.startTime ? new Date(r.startTime) : undefined, endTime: r.endTime ? new Date(r.endTime) : undefined })))
    } else {
      const today = new Date()
      const sample: Route[] = [
        { id: '1', name: 'Alger - Oran', origin: 'Alger', destination: 'Oran', distance: 432, estimatedTime: 5, vehicleId: '1', driverId: '1', status: 'in_progress', startTime: today },
        { id: '2', name: 'Alger - Constantine', origin: 'Alger', destination: 'Constantine', distance: 431, estimatedTime: 5, status: 'scheduled' },
      ]
      setRoutes(sample)
      localStorage.setItem('transport-routes', JSON.stringify(sample))
    }

    if (savedShipments) {
      const parsed = JSON.parse(savedShipments)
      setShipments(parsed.map((s: any) => ({ ...s, createdAt: new Date(s.createdAt), deliveredAt: s.deliveredAt ? new Date(s.deliveredAt) : undefined })))
    } else {
      const today = new Date()
      const sample: Shipment[] = [
        { id: '1', trackingNumber: 'TRK-001', senderName: 'Ahmed Benali', senderAddress: 'Alger', recipientName: 'Fatima Kadri', recipientAddress: 'Oran', weight: 25, routeId: '1', vehicleId: '1', driverId: '1', status: 'in_transit', createdAt: today },
        { id: '2', trackingNumber: 'TRK-002', senderName: 'Mohamed Tazi', senderAddress: 'Alger', recipientName: 'Sara Benali', recipientAddress: 'Constantine', weight: 15, status: 'pending', createdAt: today },
      ]
      setShipments(sample)
      localStorage.setItem('transport-shipments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('transport-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (drivers.length > 0) localStorage.setItem('transport-drivers', JSON.stringify(drivers))
  }, [drivers])

  useEffect(() => {
    if (routes.length > 0) localStorage.setItem('transport-routes', JSON.stringify(routes))
  }, [routes])

  useEffect(() => {
    if (shipments.length > 0) localStorage.setItem('transport-shipments', JSON.stringify(shipments))
  }, [shipments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Truck },
    { id: 'drivers' as TabType, label: 'Chauffeurs', icon: Users },
    { id: 'routes' as TabType, label: 'Itinéraires', icon: Route },
    { id: 'shipments' as TabType, label: 'Expéditions', icon: Package },
  ]

  const totalVehicles = useMemo(() => vehicles.length, [vehicles.length])
  const availableVehicles = useMemo(() => vehicles.filter(v => v.status === 'available').length, [vehicles])
  const totalDrivers = useMemo(() => drivers.length, [drivers.length])
  const activeRoutes = useMemo(() => routes.filter(r => r.status === 'in_progress').length, [routes])
  const totalShipments = useMemo(() => shipments.length, [shipments.length])
  const deliveredShipments = useMemo(() => shipments.filter(s => s.status === 'delivered').length, [shipments])

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalVehicles}</p>
                  </div>
                  <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableVehicles}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Chauffeurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalDrivers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Expéditions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalShipments}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Véhicules</h3>
                <div className="space-y-3">
                  {vehicles.slice(0, 5).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">{vehicle.plateNumber} • {vehicle.type === 'truck' ? 'Camion' : vehicle.type === 'van' ? 'Fourgon' : vehicle.type === 'car' ? 'Voiture' : 'Moto'}</p>
                        {vehicle.driverName && (
                          <p className="text-xs text-gray-400 mt-1">Chauffeur: {vehicle.driverName}</p>
                        )}
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs  DZD{
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                        vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'in_use' ? 'En cours' : vehicle.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Expéditions récentes</h3>
                <div className="space-y-3">
                  {shipments.slice(0, 5).map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">#{shipment.trackingNumber}</p>
                        <p className="text-sm text-gray-500">{shipment.senderName} → {shipment.recipientName}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(shipment.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs  DZD{
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.status === 'delivered' ? 'Livré' : shipment.status === 'in_transit' ? 'En transit' : shipment.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  ))}
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
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Nouveau véhicule
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-12 h-12 text-orange-500" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                      <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{vehicle.type === 'truck' ? 'Camion' : vehicle.type === 'van' ? 'Fourgon' : vehicle.type === 'car' ? 'Voiture' : 'Moto'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacité:</span>
                      <span className="font-medium text-gray-900">{vehicle.capacity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kilométrage:</span>
                      <span className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    {vehicle.driverName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chauffeur:</span>
                        <span className="font-medium text-gray-900">{vehicle.driverName}</span>
                      </div>
                    )}
                    {vehicle.location && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{vehicle.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                        vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'in_use' ? 'En cours' : vehicle.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                      </span>
                    </div>
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
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Nouveau chauffeur
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-500">{driver.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Permis:</span>
                      <span className="font-medium text-gray-900">{driver.licenseNumber}</span>
                    </div>
                    {driver.vehiclePlate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Véhicule:</span>
                        <span className="font-medium text-gray-900">{driver.vehiclePlate}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraisons:</span>
                      <span className="font-medium text-gray-900">{driver.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <span>⭐</span>
                        {driver.rating}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        driver.status === 'available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'on_delivery' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? 'Disponible' : driver.status === 'on_delivery' ? 'En livraison' : 'Hors service'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Itinéraires</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvel itinéraire
              </button>
            </div>
            <div className="space-y-4">
              {routes.map((route) => (
                <div key={route.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{route.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{route.origin}</span>
                        </div>
                        <span>→</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{route.destination}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{route.distance} km</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {route.estimatedTime}h
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                      route.status === 'completed' ? 'bg-green-100 text-green-800' :
                      route.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      route.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {route.status === 'completed' ? 'Terminé' : route.status === 'in_progress' ? 'En cours' : route.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shipments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expéditions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <button
                  onClick={() => setShowShipmentModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Nouvelle expédition
                </button>
              </button>
            </div>
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">#{shipment.trackingNumber}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="text-gray-500">De: </span>
                          <span className="font-medium">{shipment.senderName}</span>
                          <span className="text-gray-400"> ({shipment.senderAddress})</span>
                        </div>
                        <span>→</span>
                        <div>
                          <span className="text-gray-500">À: </span>
                          <span className="font-medium">{shipment.recipientName}</span>
                          <span className="text-gray-400"> ({shipment.recipientAddress})</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">Poids: {shipment.weight} kg</p>
                      <p className="text-xs text-gray-400 mt-2">Créé le {new Date(shipment.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                      shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                      shipment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shipment.status === 'delivered' ? 'Livré' : shipment.status === 'in_transit' ? 'En transit' : shipment.status === 'cancelled' ? 'Annulé' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showVehicleModal}
        onClose={() => {
          setShowVehicleModal(false)
          setNewVehicle({ plateNumber: '', type: 'truck', brand: '', model: '', capacity: 0, mileage: 0 })
        }}
        title="Nouveau véhicule"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
            <input
              type="text"
              value={newVehicle.plateNumber}
              onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
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
                <option value="car">Voiture</option>
                <option value="motorcycle">Moto</option>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={newVehicle.brand}
                onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Mercedes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Sprinter"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
            <input
              type="number"
              value={newVehicle.mileage}
              onChange={(e) => setNewVehicle({ ...newVehicle, mileage: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowVehicleModal(false)
                setNewVehicle({ plateNumber: '', type: 'truck', brand: '', model: '', capacity: 0, mileage: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newVehicle.plateNumber && newVehicle.brand && newVehicle.model) {
                  const vehicle: Vehicle = {
                    id: Date.now().toString(),
                    plateNumber: newVehicle.plateNumber,
                    type: newVehicle.type,
                    brand: newVehicle.brand,
                    model: newVehicle.model,
                    capacity: newVehicle.capacity,
                    status: 'available',
                    mileage: newVehicle.mileage,
                  }
                  setVehicles([...vehicles, vehicle])
                  setShowVehicleModal(false)
                  setNewVehicle({ plateNumber: '', type: 'truck', brand: '', model: '', capacity: 0, mileage: 0 })
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
          setNewDriver({ name: '', phone: '', email: '', licenseNumber: '' })
        }}
        title="Nouveau chauffeur"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
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
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDriverModal(false)
                setNewDriver({ name: '', phone: '', email: '', licenseNumber: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDriver.name && newDriver.phone && newDriver.email && newDriver.licenseNumber) {
                  const driver: Driver = {
                    id: Date.now().toString(),
                    name: newDriver.name,
                    phone: newDriver.phone,
                    email: newDriver.email,
                    licenseNumber: newDriver.licenseNumber,
                    status: 'available',
                    totalDeliveries: 0,
                    rating: 5,
                    joinDate: new Date(),
                  }
                  setDrivers([...drivers, driver])
                  setShowDriverModal(false)
                  setNewDriver({ name: '', phone: '', email: '', licenseNumber: '' })
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
        isOpen={showShipmentModal}
        onClose={() => {
          setShowShipmentModal(false)
          setNewShipment({ senderName: '', senderAddress: '', recipientName: '', recipientAddress: '', weight: 0, routeId: '', vehicleId: '', driverId: '' })
        }}
        title="Nouvelle expédition"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom expéditeur</label>
              <input
                type="text"
                value={newShipment.senderName}
                onChange={(e) => setNewShipment({ ...newShipment, senderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse expéditeur</label>
              <input
                type="text"
                value={newShipment.senderAddress}
                onChange={(e) => setNewShipment({ ...newShipment, senderAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Alger"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom destinataire</label>
              <input
                type="text"
                value={newShipment.recipientName}
                onChange={(e) => setNewShipment({ ...newShipment, recipientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Fatima Kadri"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse destinataire</label>
              <input
                type="text"
                value={newShipment.recipientAddress}
                onChange={(e) => setNewShipment({ ...newShipment, recipientAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: Oran"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {routes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select
                  value={newShipment.routeId}
                  onChange={(e) => setNewShipment({ ...newShipment, routeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>
            )}
            {vehicles.filter(v => v.status === 'available').length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                <select
                  value={newShipment.vehicleId}
                  onChange={(e) => setNewShipment({ ...newShipment, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  {vehicles.filter(v => v.status === 'available').map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.plateNumber} - {vehicle.type}</option>
                  ))}
                </select>
              </div>
            )}
            {drivers.filter(d => d.status === 'available').length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur</label>
                <select
                  value={newShipment.driverId}
                  onChange={(e) => setNewShipment({ ...newShipment, driverId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  {drivers.filter(d => d.status === 'available').map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
            <input
              type="number"
              value={newShipment.weight}
              onChange={(e) => setNewShipment({ ...newShipment, weight: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowShipmentModal(false)
                setNewShipment({ senderName: '', senderAddress: '', recipientName: '', recipientAddress: '', weight: 0, routeId: '', vehicleId: '', driverId: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newShipment.senderName && newShipment.senderAddress && newShipment.recipientName && newShipment.recipientAddress && newShipment.weight > 0) {
                  const shipment: Shipment = {
                    id: Date.now().toString(),
                    trackingNumber: `TRK- DZD{Date.now().toString().slice(-6)}`,
                    senderName: newShipment.senderName,
                    senderAddress: newShipment.senderAddress,
                    recipientName: newShipment.recipientName,
                    recipientAddress: newShipment.recipientAddress,
                    weight: newShipment.weight,
                    routeId: newShipment.routeId || undefined,
                    vehicleId: newShipment.vehicleId || undefined,
                    driverId: newShipment.driverId || undefined,
                    status: 'pending',
                    createdAt: new Date(),
                  }
                  setShipments([...shipments, shipment])
                  // Mettre à jour le statut du véhicule et du chauffeur si assignés
                  if (newShipment.vehicleId) {
                    setVehicles(vehicles.map(v => v.id === newShipment.vehicleId ? { ...v, status: 'in_use' as const } : v))
                  }
                  if (newShipment.driverId) {
                    setDrivers(drivers.map(d => d.id === newShipment.driverId ? { ...d, status: 'on_delivery' as const } : d))
                  }
                  setShowShipmentModal(false)
                  setNewShipment({ senderName: '', senderAddress: '', recipientName: '', recipientAddress: '', weight: 0, routeId: '', vehicleId: '', driverId: '' })
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
