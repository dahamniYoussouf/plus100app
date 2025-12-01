'use client'

import { useState, useEffect } from 'react'
import { Car, Wrench, Calendar, DollarSign, BarChart3, Package, Users, Settings } from 'lucide-react'

type TabType = 'dashboard' | 'services' | 'vehicles' | 'appointments' | 'inventory'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: 'repair' | 'maintenance' | 'inspection' | 'diagnostic'
  available: boolean
}

interface Vehicle {
  id: string
  ownerName: string
  ownerPhone: string
  licensePlate: string
  make: string
  model: string
  year: number
  mileage: number
  lastService?: Date
  serviceHistory: string[]
}

interface Appointment {
  id: string
  vehicleId: string
  ownerName: string
  licensePlate: string
  serviceId: string
  serviceName: string
  date: Date
  time: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  cost?: number
}

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  supplier: string
  minStock: number
}

export default function GaragePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [services, setServices] = useState<Service[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  useEffect(() => {
    const savedServices = localStorage.getItem('garage-services')
    const savedVehicles = localStorage.getItem('garage-vehicles')
    const savedAppointments = localStorage.getItem('garage-appointments')
    const savedInventory = localStorage.getItem('garage-inventory')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        {
          id: '1',
          name: 'Révision Complète',
          description: 'Vidange, filtres, vérifications',
          price: 120,
          duration: 120,
          category: 'maintenance',
          available: true,
        },
        {
          id: '2',
          name: 'Réparation Moteur',
          description: 'Diagnostic et réparation moteur',
          price: 300,
          duration: 240,
          category: 'repair',
          available: true,
        },
        {
          id: '3',
          name: 'Contrôle Technique',
          description: 'Inspection complète du véhicule',
          price: 80,
          duration: 60,
          category: 'inspection',
          available: true,
        },
        {
          id: '4',
          name: 'Diagnostic Électronique',
          description: 'Lecture codes erreur et diagnostic',
          price: 50,
          duration: 30,
          category: 'diagnostic',
          available: true,
        },
      ]
      setServices(sample)
      localStorage.setItem('garage-services', JSON.stringify(sample))
    }

    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed.map((v: any) => ({
        ...v,
        lastService: v.lastService ? new Date(v.lastService) : undefined,
      })))
    } else {
      const sample: Vehicle[] = [
        {
          id: '1',
          ownerName: 'Ahmed Benali',
          ownerPhone: '+213 555 1234',
          licensePlate: '12345-A-16',
          make: 'Renault',
          model: 'Clio',
          year: 2018,
          mileage: 45000,
          lastService: new Date('2024-01-10'),
          serviceHistory: ['Révision Complète - 10/01/2024'],
        },
        {
          id: '2',
          ownerName: 'Fatima Kadri',
          ownerPhone: '+213 555 5678',
          licensePlate: '67890-B-31',
          make: 'Peugeot',
          model: '208',
          year: 2020,
          mileage: 30000,
          serviceHistory: [],
        },
      ]
      setVehicles(sample)
      localStorage.setItem('garage-vehicles', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })))
    } else {
      const today = new Date()
      const sample: Appointment[] = [
        {
          id: '1',
          vehicleId: '1',
          ownerName: 'Ahmed Benali',
          licensePlate: '12345-A-16',
          serviceId: '1',
          serviceName: 'Révision Complète',
          date: today,
          time: '09:00',
          status: 'scheduled',
          cost: 120,
        },
      ]
      setAppointments(sample)
      localStorage.setItem('garage-appointments', JSON.stringify(sample))
    }

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      const sample: InventoryItem[] = [
        {
          id: '1',
          name: 'Huile Moteur 5W30',
          category: 'Lubrifiants',
          quantity: 25,
          unitPrice: 35,
          supplier: 'Total',
          minStock: 10,
        },
        {
          id: '2',
          name: 'Filtre à Huile',
          category: 'Filtres',
          quantity: 15,
          unitPrice: 12,
          supplier: 'Mann Filter',
          minStock: 5,
        },
      ]
      setInventory(sample)
      localStorage.setItem('garage-inventory', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('garage-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('garage-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('garage-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (inventory.length > 0) localStorage.setItem('garage-inventory', JSON.stringify(inventory))
  }, [inventory])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'services' as TabType, label: 'Services', icon: Settings },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'inventory' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + (a.cost || 0), 0)
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' && a.date.toDateString() === today.toDateString()
  })
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{vehicles.length}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockItems.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-3 text-sm">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-500 ml-2">- Stock: {item.quantity} (Min: {item.minStock})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Services Garage</h3>
                  <p className="text-sm text-gray-600">Réparations, maintenance, inspections</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des RDV</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Véhicules</h3>
                  <p className="text-sm text-gray-600">Base de données des véhicules clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Stock</h3>
                  <p className="text-sm text-gray-600">Gestion des pièces et consommables</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                  <p className="text-sm text-gray-600">Suivi des interventions par véhicule</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et factures</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ajouter Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs capitalize">
                        {service.category}
                      </span>
                      <span className="text-sm text-gray-500">{service.duration} min</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">DZD{service.price}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Véhicule
              </button>
            </div>
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun véhicule enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{vehicle.make} {vehicle.model}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">🚗 {vehicle.licensePlate}</p>
                      <p className="text-sm text-gray-600">👤 {vehicle.ownerName}</p>
                      <p className="text-sm text-gray-600">📞 {vehicle.ownerPhone}</p>
                      <p className="text-sm text-gray-600">📅 {vehicle.year} • {vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    {vehicle.lastService && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Dernier service: {new Date(vehicle.lastService).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rendez-vous</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau RDV
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun rendez-vous</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{apt.ownerName}</h3>
                        <div className="space-y-2 text-sm mt-2">
                          <p className="text-gray-600">🚗 {apt.licensePlate}</p>
                          <p className="text-gray-600">🔧 {apt.serviceName}</p>
                          <p className="text-gray-600">
                            📅 {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          apt.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status === 'completed' ? 'Terminé' :
                           apt.status === 'cancelled' ? 'Annulé' :
                           apt.status === 'in_progress' ? 'En cours' : 'Programmé'}
                        </span>
                        {apt.cost && (
                          <span className="text-lg font-bold text-gray-900">DZD{apt.cost}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Stock</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvel Article
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {inventory.map((item) => (
                <div key={item.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6  DZD{
                  item.quantity <= item.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Catégorie: {item.category}</p>
                    <p className="text-sm text-gray-600">Fournisseur: {item.supplier}</p>
                    <p className="text-sm text-gray-600">Prix unitaire: DZD{item.unitPrice}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Stock:</span>
                      <span className={`font-medium  DZD{
                        item.quantity <= item.minStock ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Stock min:</span>
                      <span className="text-gray-700">{item.minStock}</span>
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
