'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Calendar, DollarSign, BarChart3, TrendingUp, Package, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'services' | 'vehicles' | 'subscriptions' | 'appointments'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: 'basic' | 'premium' | 'deluxe' | 'interior' | 'exterior'
  available: boolean
}

interface Vehicle {
  id: string
  ownerName: string
  ownerPhone: string
  licensePlate: string
  make: string
  model: string
  color: string
  lastWash?: Date
  washCount: number
  subscriptionType?: 'monthly' | 'quarterly' | 'yearly'
}

interface Subscription {
  id: string
  vehicleId: string
  ownerName: string
  licensePlate: string
  type: 'monthly' | 'quarterly' | 'yearly'
  price: number
  startDate: Date
  endDate: Date
  washesIncluded: number
  washesUsed: number
  status: 'active' | 'expired' | 'cancelled'
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
  price: number
}

export default function CarwashPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [services, setServices] = useState<Service[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const savedServices = localStorage.getItem('carwash-services')
    const savedVehicles = localStorage.getItem('carwash-vehicles')
    const savedSubscriptions = localStorage.getItem('carwash-subscriptions')
    const savedAppointments = localStorage.getItem('carwash-appointments')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        {
          id: '1',
          name: 'Lavage Basique',
          description: 'Lavage extérieur complet',
          price: 15,
          duration: 20,
          category: 'basic',
          available: true,
        },
        {
          id: '2',
          name: 'Lavage Premium',
          description: 'Lavage extérieur + intérieur',
          price: 30,
          duration: 45,
          category: 'premium',
          available: true,
        },
        {
          id: '3',
          name: 'Lavage Deluxe',
          description: 'Lavage complet + cire + intérieur détaillé',
          price: 50,
          duration: 90,
          category: 'deluxe',
          available: true,
        },
        {
          id: '4',
          name: 'Nettoyage Intérieur',
          description: 'Aspiration et nettoyage intérieur complet',
          price: 25,
          duration: 30,
          category: 'interior',
          available: true,
        },
      ]
      setServices(sample)
      localStorage.setItem('carwash-services', JSON.stringify(sample))
    }

    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed.map((v: any) => ({
        ...v,
        lastWash: v.lastWash ? new Date(v.lastWash) : undefined,
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
          color: 'Blanc',
          lastWash: new Date('2024-01-15'),
          washCount: 12,
          subscriptionType: 'monthly',
        },
        {
          id: '2',
          ownerName: 'Fatima Kadri',
          ownerPhone: '+213 555 5678',
          licensePlate: '67890-B-31',
          make: 'Peugeot',
          model: '208',
          color: 'Rouge',
          washCount: 5,
        },
      ]
      setVehicles(sample)
      localStorage.setItem('carwash-vehicles', JSON.stringify(sample))
    }

    if (savedSubscriptions) {
      const parsed = JSON.parse(savedSubscriptions)
      setSubscriptions(parsed.map((s: any) => ({
        ...s,
        startDate: new Date(s.startDate),
        endDate: new Date(s.endDate),
      })))
    } else {
      const sample: Subscription[] = [
        {
          id: '1',
          vehicleId: '1',
          ownerName: 'Ahmed Benali',
          licensePlate: '12345-A-16',
          type: 'monthly',
          price: 40,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          washesIncluded: 4,
          washesUsed: 2,
          status: 'active',
        },
      ]
      setSubscriptions(sample)
      localStorage.setItem('carwash-subscriptions', JSON.stringify(sample))
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
          serviceId: '2',
          serviceName: 'Lavage Premium',
          date: today,
          time: '14:00',
          status: 'scheduled',
          price: 30,
        },
      ]
      setAppointments(sample)
      localStorage.setItem('carwash-appointments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('carwash-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('carwash-vehicles', JSON.stringify(vehicles))
  }, [vehicles])

  useEffect(() => {
    if (subscriptions.length > 0) localStorage.setItem('carwash-subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('carwash-appointments', JSON.stringify(appointments))
  }, [appointments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'services' as TabType, label: 'Services', icon: Car },
    { id: 'vehicles' as TabType, label: 'Véhicules', icon: Car },
    { id: 'subscriptions' as TabType, label: 'Abonnements', icon: Package },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
  ]

  const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0)
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' && a.date.toDateString() === today.toDateString()
  })
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
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
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Services</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Abonnements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeSubscriptions}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {todayAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Rendez-vous d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{apt.ownerName}</span>
                        <span className="text-gray-500 ml-2">- {apt.licensePlate}</span>
                        <span className="text-gray-500 ml-2">- {apt.serviceName}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{apt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Services de Lavage</h3>
                  <p className="text-sm text-gray-600">Gestion des différents types de lavage</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des rendez-vous</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Abonnements</h3>
                  <p className="text-sm text-gray-600">Forfaits mensuels et annuels</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Véhicules</h3>
                  <p className="text-sm text-gray-600">Base de données des véhicules clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
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
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{service.duration} min</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                        service.category === 'basic' ? 'bg-blue-100 text-blue-800' :
                        service.category === 'premium' ? 'bg-purple-100 text-purple-800' :
                        service.category === 'deluxe' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {service.category}
                      </span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
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
                      <p className="text-sm text-gray-600">🎨 {vehicle.color}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Lavages:</span>
                        <span className="font-medium text-cyan-600">{vehicle.washCount}</span>
                      </div>
                      {vehicle.lastWash && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernier lavage:</span>
                          <span className="text-gray-600">{new Date(vehicle.lastWash).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {vehicle.subscriptionType && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Abonnement:</span>
                          <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded capitalize">
                            {vehicle.subscriptionType}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Abonnements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Nouvel Abonnement
              </button>
            </div>
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun abonnement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((subscription) => {
                  const usageRate = (subscription.washesUsed / subscription.washesIncluded) * 100
                  return (
                    <div key={subscription.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{subscription.ownerName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{subscription.licensePlate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status === 'active' ? 'Actif' :
                           subscription.status === 'expired' ? 'Expiré' : 'Annulé'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{subscription.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Prix:</span>
                          <span className="font-bold text-gray-900">DZD{subscription.price}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Lavages:</span>
                          <span className="font-medium">{subscription.washesUsed}/{subscription.washesIncluded}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              usageRate >= 90 ? 'bg-red-500' :
                              usageRate >= 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${usageRate}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Du {new Date(subscription.startDate).toLocaleDateString('fr-FR')}</span>
                          <span>Au {new Date(subscription.endDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rendez-vous</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
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
                          <div className="flex items-center gap-4">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          apt.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status === 'completed' ? 'Terminé' :
                           apt.status === 'cancelled' ? 'Annulé' :
                           apt.status === 'in_progress' ? 'En cours' : 'Programmé'}
                        </span>
                        <span className="text-lg font-bold text-gray-900">DZD{apt.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
        )}
      </main>
    </div>
  )
}
