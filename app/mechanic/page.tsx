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
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [showPartForm, setShowPartForm] = useState(false)

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

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('mechanic-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('mechanic-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (parts.length > 0) localStorage.setItem('mechanic-parts', JSON.stringify(parts))
  }, [parts])

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

  const handleAddService = () => setShowServiceForm(true)
  const handleAddAppointment = () => setShowAppointmentForm(true)
  const handleAddPart = () => setShowPartForm(true)

  const handleSubmitService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newService: Service = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as Service['category'],
      price: parseFloat(formData.get('price') as string),
      duration: parseFloat(formData.get('duration') as string),
      parts: (formData.get('parts') as string)?.split(',').map(p => p.trim()).filter(p => p) || [],
    }
    setServices([...services, newService])
    setShowServiceForm(false)
    e.currentTarget.reset()
  }

  const handleSubmitAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const serviceIds = Array.from(formData.getAll('serviceIds')) as string[]
    const selectedServices = services.filter(s => serviceIds.includes(s.id))
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0)
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      customerName: formData.get('customerName') as string,
      customerPhone: formData.get('customerPhone') as string,
      vehicleMake: formData.get('vehicleMake') as string,
      vehicleModel: formData.get('vehicleModel') as string,
      licensePlate: formData.get('licensePlate') as string,
      serviceIds,
      appointmentDate: new Date(`${formData.get('date')}T${formData.get('time')}`),
      status: 'scheduled',
      notes: formData.get('notes') as string || undefined,
      totalPrice,
    }
    setAppointments([...appointments, newAppointment])
    setShowAppointmentForm(false)
    e.currentTarget.reset()
  }

  const handleSubmitPart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPart: Part = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      stock: parseInt(formData.get('stock') as string),
      price: parseFloat(formData.get('price') as string),
      compatibleWith: (formData.get('compatibleWith') as string)?.split(',').map(c => c.trim()).filter(c => c) || [],
    }
    setParts([...parts, newPart])
    setShowPartForm(false)
    e.currentTarget.reset()
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
              <button 
                onClick={handleAddService}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
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
                      <span className="text-lg sm:text-xl font-bold text-gray-900">${service.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-2">({service.duration}h)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rendez-vous</h2>
              <button 
                onClick={handleAddAppointment}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Nouveau Rendez-vous
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun rendez-vous enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{apt.customerName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{apt.vehicleMake} {apt.vehicleModel} - {apt.licensePlate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        apt.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status === 'completed' ? 'Terminé' :
                         apt.status === 'cancelled' ? 'Annulé' :
                         apt.status === 'in-progress' ? 'En cours' : 'Programmé'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(apt.appointmentDate).toLocaleDateString('fr-FR')} à {new Date(apt.appointmentDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-gray-600">📞 {apt.customerPhone}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {apt.serviceIds.map(serviceId => {
                            const service = services.find(s => s.id === serviceId)
                            return service ? (
                              <span key={serviceId} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                                {service.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-gray-700 font-medium">💰 Total: ${apt.totalPrice.toFixed(2)}</p>
                      </div>
                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">Notes: {apt.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pièces Détachées</h2>
              <button 
                onClick={handleAddPart}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Ajouter Pièce
              </button>
            </div>
            {parts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune pièce enregistrée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {parts.map((part) => (
                  <div key={part.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{part.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        part.stock > 10 ? 'bg-green-100 text-green-800' :
                        part.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Stock: {part.stock}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📦 Catégorie: {part.category}</p>
                      <p className="text-sm text-gray-600">💰 Prix: ${part.price.toFixed(2)}</p>
                      {part.compatibleWith.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Compatible avec:</p>
                          <div className="flex flex-wrap gap-1">
                            {part.compatibleWith.map((comp, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Ajouter Service */}
        {showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Ajouter Service</h3>
                  <button onClick={() => setShowServiceForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="engine">Moteur</option>
                      <option value="brake">Freinage</option>
                      <option value="tire">Pneus</option>
                      <option value="oil">Huile</option>
                      <option value="electrical">Électricité</option>
                      <option value="body">Carrosserie</option>
                      <option value="inspection">Inspection</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix ($)</label>
                      <input type="number" name="price" required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Durée (h)</label>
                      <input type="number" name="duration" required min="0.5" step="0.5" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pièces nécessaires (séparées par des virgules)</label>
                    <input type="text" name="parts" placeholder="Huile moteur, Filtre, ..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowServiceForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nouveau Rendez-vous */}
        {showAppointmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nouveau Rendez-vous</h3>
                  <button onClick={() => setShowAppointmentForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitAppointment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
                    <input type="text" name="customerName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input type="tel" name="customerPhone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                      <input type="text" name="vehicleMake" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                      <input type="text" name="vehicleModel" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
                    <input type="text" name="licensePlate" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input type="date" name="date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                      <input type="time" name="time" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                      {services.map(service => (
                        <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="serviceIds" value={service.id} className="rounded" />
                          <span className="text-sm text-gray-700">{service.name} (${service.price.toFixed(2)})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="notes" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowAppointmentForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Créer</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ajouter Pièce */}
        {showPartForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Ajouter Pièce</h3>
                  <button onClick={() => setShowPartForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitPart} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <input type="text" name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input type="number" name="stock" required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix ($)</label>
                      <input type="number" name="price" required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compatible avec (séparés par des virgules)</label>
                    <input type="text" name="compatibleWith" placeholder="Renault Clio, Peugeot 208, ..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowPartForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
