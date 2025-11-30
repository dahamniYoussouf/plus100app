'use client'

import { useState, useEffect } from 'react'
import { Wrench, Calendar, Settings, Car, BarChart3, Clock, Package, DollarSign, Users } from 'lucide-react'
import { Service, Appointment, Part } from '@/types/mechanic'

type TabType = 'dashboard' | 'services' | 'appointments' | 'parts'

export default function MechanicPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [parts, setParts] = useState<Part[]>([])

  useEffect(() => {
    const savedServices = localStorage.getItem('mechanic-services')
    const savedAppointments = localStorage.getItem('mechanic-appointments')
    const savedParts = localStorage.getItem('mechanic-parts')

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        {
          id: '1',
          name: 'Changement d\'huile',
          description: 'Changement d\'huile moteur et filtre avec vérification du niveau',
          category: 'oil',
          price: 45.99,
          duration: 0.5,
          parts: ['Huile moteur 5L', 'Filtre à huile'],
        },
        {
          id: '2',
          name: 'Révision complète',
          description: 'Vérification complète du véhicule avec diagnostic électronique',
          category: 'inspection',
          price: 89.99,
          duration: 2,
          parts: ['Divers'],
        },
        {
          id: '3',
          name: 'Réparation Freins',
          description: 'Remplacement des plaquettes et disques de frein',
          category: 'brake',
          price: 125.99,
          duration: 1.5,
          parts: ['Plaquettes', 'Disques'],
        },
      ]
      setServices(sample)
      localStorage.setItem('mechanic-services', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({ ...a, appointmentDate: new Date(a.appointmentDate) })))
    }

    if (savedParts) {
      setParts(JSON.parse(savedParts))
    }
  }, [])

  const todayAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.appointmentDate)
    const today = new Date()
    return apptDate.toDateString() === today.toDateString()
  })

  const categoryNames: Record<string, string> = {
    engine: 'Moteur',
    brake: 'Freinage',
    tire: 'Pneus',
    oil: 'Huile',
    electrical: 'Électricité',
    body: 'Carrosserie',
    inspection: 'Inspection'
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'services' as TabType, label: 'Services', icon: Settings },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'parts' as TabType, label: 'Pièces', icon: Car },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                Gestion Mécanique Auto
              </h1>
              <p className="text-sm text-gray-500 mt-1">Gestion complète d'atelier mécanique avec services et rendez-vous</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-10">
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Services</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                  </div>
                  <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rendez-vous</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{appointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pièces</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{parts.length}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {todayAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Rendez-vous Aujourd'hui
                </h3>
                <div className="space-y-2">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">
                        {apt.customerName} - {apt.vehicleMake} {apt.vehicleModel}
                      </span>
                      <span className="font-semibold text-blue-700 mt-1 sm:mt-0">
                        {new Date(apt.appointmentDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                  <p className="text-sm text-gray-600">Catalogue complet de services avec prix et durée</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planning et gestion des rendez-vous clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Pièces Détachées</h3>
                  <p className="text-sm text-gray-600">Gestion du stock de pièces avec compatibilités</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients avec historique véhicules</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Génération de devis et factures</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses de performance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ajouter Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{service.name}</h3>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs whitespace-nowrap">
                      {categoryNames[service.category] || service.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-gray-500">Pièces nécessaires:</p>
                    <div className="flex flex-wrap gap-1">
                      {service.parts.map((part, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-gray-900">${service.price}</span>
                      <span className="text-sm text-gray-500 ml-2">({service.duration}h)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Rendez-vous</h2>
            <p className="text-gray-600 mb-6">Gestion des rendez-vous clients et planning</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouveau Rendez-vous</h3>
                <p className="text-sm text-gray-600">Programmer un nouveau rendez-vous client</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                <p className="text-sm text-gray-600">Visualiser le planning des rendez-vous</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique des rendez-vous</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Pièces Détachées</h2>
            <p className="text-gray-600 mb-6">Gestion du stock de pièces détachées</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Stock</h3>
                <p className="text-sm text-gray-600">Suivi des niveaux de stock de pièces</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                <p className="text-sm text-gray-600">Gestion des commandes de pièces</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Compatibilité</h3>
                <p className="text-sm text-gray-600">Vérification de compatibilité avec véhicules</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
