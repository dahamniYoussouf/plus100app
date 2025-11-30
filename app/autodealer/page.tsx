'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Calendar, DollarSign, BarChart3, TrendingUp, FileText, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'vehicles' | 'clients' | 'sales' | 'appointments' | 'inventory'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  condition: 'new' | 'used' | 'certified'
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'manual' | 'automatic'
  color: string
  vin: string
  status: 'available' | 'sold' | 'reserved' | 'maintenance'
  features: string[]
  images?: string[]
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  totalPurchases: number
  lastContact?: Date
  notes?: string
}

interface Sale {
  id: string
  vehicleId: string
  vehicleInfo: string
  clientId: string
  clientName: string
  salePrice: number
  downPayment: number
  financing?: boolean
  saleDate: Date
  salesperson: string
  status: 'completed' | 'pending' | 'cancelled'
}

interface Appointment {
  id: string
  clientId: string
  clientName: string
  vehicleId?: string
  vehicleInfo?: string
  type: 'test_drive' | 'consultation' | 'service' | 'delivery'
  date: Date
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function AutodealerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const savedVehicles = localStorage.getItem('autodealer-vehicles')
    const savedClients = localStorage.getItem('autodealer-clients')
    const savedSales = localStorage.getItem('autodealer-sales')
    const savedAppointments = localStorage.getItem('autodealer-appointments')

    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles))
    } else {
      const sample: Vehicle[] = [
        {
          id: '1',
          make: 'Renault',
          model: 'Clio V',
          year: 2023,
          mileage: 5000,
          price: 18500,
          condition: 'new',
          fuelType: 'gasoline',
          transmission: 'manual',
          color: 'Blanc',
          vin: 'VF1RFA0E123456789',
          status: 'available',
          features: ['Climatisation', 'GPS', 'Caméra de recul'],
        },
        {
          id: '2',
          make: 'Peugeot',
          model: '208',
          year: 2022,
          mileage: 25000,
          price: 14500,
          condition: 'used',
          fuelType: 'diesel',
          transmission: 'automatic',
          color: 'Rouge',
          vin: 'VF3RFA0E987654321',
          status: 'available',
          features: ['Climatisation', 'GPS'],
        },
        {
          id: '3',
          make: 'Dacia',
          model: 'Sandero',
          year: 2024,
          mileage: 0,
          price: 12000,
          condition: 'new',
          fuelType: 'gasoline',
          transmission: 'manual',
          color: 'Gris',
          vin: 'VF1RFA0E456789123',
          status: 'reserved',
          features: ['Climatisation'],
        },
      ]
      setVehicles(sample)
      localStorage.setItem('autodealer-vehicles', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastContact: c.lastContact ? new Date(c.lastContact) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          address: '123 Rue des Fleurs, Alger',
          totalPurchases: 1,
          lastContact: new Date('2024-01-15'),
        },
      ]
      setClients(sample)
      localStorage.setItem('autodealer-clients', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({ ...s, saleDate: new Date(s.saleDate) })))
    } else {
      const sample: Sale[] = [
        {
          id: '1',
          vehicleId: '1',
          vehicleInfo: 'Renault Clio V 2023',
          clientId: '1',
          clientName: 'Ahmed Benali',
          salePrice: 18500,
          downPayment: 5000,
          financing: true,
          saleDate: new Date('2024-01-15'),
          salesperson: 'Omar Amrani',
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('autodealer-sales', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      const today = new Date()
      const sample: Appointment[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Fatima Kadri',
          vehicleId: '2',
          vehicleInfo: 'Peugeot 208',
          type: 'test_drive',
          date: today,
          time: '14:00',
          status: 'scheduled',
        },
      ]
      setAppointments(sample)
      localStorage.setItem('autodealer-appointments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('autodealer-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('autodealer-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('autodealer-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('autodealer-appointments', JSON.stringify(appointments))
  }, [appointments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'sales' as TabType, label: 'Ventes', icon: DollarSign },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'inventory' as TabType, label: 'Stock', icon: FileText },
  ]

  const availableVehicles = vehicles.filter(v => v.status === 'available').length
  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.salePrice, 0)
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.date.toDateString() === today.toDateString() && a.status === 'scheduled'
  })
  const pendingSales = sales.filter(s => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
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
                      ? 'text-red-600 border-b-2 border-red-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Véhicules Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableVehicles}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes en Attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingSales}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Véhicules</h3>
                  <p className="text-sm text-gray-600">Inventaire complet des véhicules neufs et d'occasion</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et historique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ventes</h3>
                  <p className="text-sm text-gray-600">Gestion des ventes et financement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Essais routiers et consultations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Financement</h3>
                  <p className="text-sm text-gray-600">Gestion des options de financement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de vente et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Véhicules</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouveau Véhicule
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
                        <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.mileage.toLocaleString()} km</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        vehicle.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status === 'available' ? 'Disponible' :
                         vehicle.status === 'sold' ? 'Vendu' :
                         vehicle.status === 'reserved' ? 'Réservé' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">🎨 {vehicle.color}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {vehicle.condition === 'new' ? 'Neuf' :
                         vehicle.condition === 'used' ? 'Occasion' : 'Certifié'} • {vehicle.fuelType} • {vehicle.transmission === 'manual' ? 'Manuelle' : 'Automatique'}
                      </p>
                      <p className="text-sm text-gray-600">🔑 VIN: {vehicle.vin}</p>
                      {vehicle.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {vehicle.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">DZD{vehicle.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{client.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📧 {client.email}</p>
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      {client.address && <p className="text-sm text-gray-600">📍 {client.address}</p>}
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Achats:</span>
                        <span className="font-medium text-red-600">{client.totalPurchases}</span>
                      </div>
                      {client.lastContact && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernier contact:</span>
                          <span className="text-gray-600">{new Date(client.lastContact).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouvelle Vente
              </button>
            </div>
            {sales.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{sale.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{sale.vehicleInfo}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sale.status === 'completed' ? 'Terminée' :
                         sale.status === 'cancelled' ? 'Annulée' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">👤 Vendeur: {sale.salesperson}</p>
                      <p className="text-gray-600">
                        📅 {new Date(sale.saleDate).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-gray-700 font-medium">💰 Prix: DZD{sale.salePrice.toLocaleString()}</p>
                        <p className="text-gray-600">Acompte: DZD{sale.downPayment.toLocaleString()}</p>
                      </div>
                      {sale.financing && (
                        <p className="text-xs text-blue-600">💳 Financement: Oui</p>
                      )}
                    </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{apt.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {apt.type === 'test_drive' ? 'Essai routier' :
                           apt.type === 'consultation' ? 'Consultation' :
                           apt.type === 'service' ? 'Service' : 'Livraison'}
                        </p>
                        {apt.vehicleInfo && (
                          <p className="text-sm text-gray-500 mt-1">Véhicule: {apt.vehicleInfo}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status === 'completed' ? 'Terminé' :
                         apt.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                      </p>
                      {apt.notes && (
                        <p className="text-gray-500 text-xs mt-1">Note: {apt.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-500">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{availableVehicles}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-500">Réservés</p>
                  <p className="text-2xl font-bold text-yellow-600">{vehicles.filter(v => v.status === 'reserved').length}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Vendus</p>
                  <p className="text-2xl font-bold text-gray-600">{vehicles.filter(v => v.status === 'sold').length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
