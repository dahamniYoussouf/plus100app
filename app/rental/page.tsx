'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Calendar, DollarSign, BarChart3, Key, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'vehicles' | 'rentals' | 'customers' | 'maintenance'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  type: 'economy' | 'standard' | 'luxury' | 'suv' | 'van'
  dailyRate: number
  status: 'available' | 'rented' | 'maintenance'
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric'
  features: string[]
}

interface Rental {
  id: string
  vehicleId: string
  vehicleInfo: string
  customerId: string
  customerName: string
  startDate: Date
  endDate: Date
  dailyRate: number
  totalAmount: number
  deposit: number
  status: 'active' | 'completed' | 'cancelled'
  pickupLocation: string
  returnLocation?: string
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  licenseNumber: string
  idNumber: string
  rentals: string[]
}

export default function RentalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const savedVehicles = localStorage.getItem('rental-vehicles')
    const savedRentals = localStorage.getItem('rental-rentals')
    const savedCustomers = localStorage.getItem('rental-customers')

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    } else {
      const sample: Vehicle[] = [
        {
          id: '1',
          make: 'Renault',
          model: 'Clio',
          year: 2023,
          licensePlate: '12345-A-16',
          type: 'economy',
          dailyRate: 3000,
          status: 'available',
          mileage: 15000,
          fuelType: 'gasoline',
          features: ['Climatisation', 'GPS'],
        },
        {
          id: '2',
          make: 'Peugeot',
          model: '3008',
          year: 2022,
          licensePlate: '67890-B-16',
          type: 'suv',
          dailyRate: 6000,
          status: 'rented',
          mileage: 30000,
          fuelType: 'diesel',
          features: ['Climatisation', 'GPS', 'Caméra de recul'],
        },
      ]
      setVehicles(sample)
      localStorage.setItem('rental-vehicles', JSON.stringify(sample))
    }

    if (savedRentals) {
      const parsed = JSON.parse(savedRentals)
      setRentals(parsed.map((r: any) => ({
        ...r,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
      })))
    } else {
      const sample: Rental[] = [
        {
          id: '1',
          vehicleId: '2',
          vehicleInfo: 'Peugeot 3008 2022',
          customerId: '1',
          customerName: 'Ahmed Benali',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-01-20'),
          dailyRate: 6000,
          totalAmount: 30000,
          deposit: 10000,
          status: 'active',
          pickupLocation: 'Aéroport Alger',
        },
      ]
      setRentals(sample)
      localStorage.setItem('rental-rentals', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          licenseNumber: 'DL123456',
          idNumber: '123456789012',
          rentals: ['1'],
        },
      ]
      setCustomers(sample)
      localStorage.setItem('rental-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('rental-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (rentals.length > 0) localStorage.setItem('rental-rentals', JSON.stringify(rentals))
  }, [rentals])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('rental-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'rentals' as TabType, label: 'Locations', icon: Key },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Car },
  ]

  const availableVehicles = vehicles.filter(v => v.status === 'available').length
  const activeRentals = rentals.filter(r => r.status === 'active').length
  const totalRevenue = rentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalAmount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{vehicles.length}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableVehicles}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Locations Actives</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeRentals}</p>
                  </div>
                  <Key className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Véhicules</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ajouter Véhicule
              </button>
            </div>
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun véhicule</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{vehicle.make} {vehicle.model}</h3>
                        <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.licensePlate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' :
                         vehicle.status === 'rented' ? 'Loué' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600 capitalize">
                        {vehicle.type === 'economy' ? 'Économique' :
                         vehicle.type === 'standard' ? 'Standard' :
                         vehicle.type === 'luxury' ? 'Luxe' :
                         vehicle.type === 'suv' ? 'SUV' : 'Utilitaire'}
                      </p>
                      <p className="text-sm text-gray-600">⛽ {vehicle.fuelType === 'gasoline' ? 'Essence' : vehicle.fuelType === 'diesel' ? 'Diesel' : 'Électrique'}</p>
                      <p className="text-sm text-gray-600">📊 {vehicle.mileage.toLocaleString()} km</p>
                      {vehicle.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vehicle.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xl font-bold text-gray-900">DZD{vehicle.dailyRate.toLocaleString()}/jour</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rentals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Locations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle Location
              </button>
            </div>
            {rentals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune location</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.map((rental) => (
                  <div key={rental.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{rental.customerName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rental.vehicleInfo}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                        rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rental.status === 'completed' ? 'Terminée' :
                         rental.status === 'cancelled' ? 'Annulée' : 'Active'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(rental.startDate).toLocaleDateString('fr-FR')} - {new Date(rental.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">📍 Prise: {rental.pickupLocation}</p>
                      {rental.returnLocation && (
                        <p className="text-gray-600">📍 Retour: {rental.returnLocation}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-gray-700 font-medium">💰 Total: DZD{rental.totalAmount.toLocaleString()}</p>
                        <p className="text-gray-600">💵 Dépôt: DZD{rental.deposit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {customers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{customer.name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                      {customer.email && <p className="text-sm text-gray-600">📧 {customer.email}</p>}
                      <p className="text-sm text-gray-600">🪪 Permis: {customer.licenseNumber}</p>
                      <p className="text-sm text-gray-600">🆔 ID: {customer.idNumber}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 mt-4">
                      <p className="text-xs text-gray-500">Locations: {customer.rentals.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Maintenance</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion de la maintenance des véhicules</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
