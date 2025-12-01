'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Calendar, ShoppingCart, BarChart3, Package, Stethoscope, TrendingUp, Star } from 'lucide-react'

type TabType = 'dashboard' | 'pets' | 'owners' | 'appointments' | 'services' | 'products'

interface Pet {
  id: string
  name: string
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed: string
  age: number
  weight: number
  ownerId: string
  ownerName: string
  medicalHistory?: string[]
  vaccinations?: { name: string; date: Date; nextDue?: Date }[]
  lastCheckup?: Date
  status: 'healthy' | 'sick' | 'recovering'
}

interface Owner {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  pets: string[]
  totalSpent: number
  visits: number
  membership?: 'regular' | 'premium'
}

interface Appointment {
  id: string
  petId: string
  petName: string
  ownerId: string
  ownerName: string
  date: Date
  time: string
  type: 'checkup' | 'vaccination' | 'grooming' | 'surgery' | 'emergency'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  cost: number
}

interface Service {
  id: string
  name: string
  description: string
  type: 'grooming' | 'boarding' | 'training' | 'daycare' | 'other'
  price: number
  duration: number
  bookings: number
  rating?: number
}

interface Product {
  id: string
  name: string
  description: string
  category: 'food' | 'toys' | 'accessories' | 'medicine' | 'other'
  price: number
  cost: number
  stock: number
  sold: number
}

export default function PetsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [pets, setPets] = useState<Pet[]>([])
  const [owners, setOwners] = useState<Owner[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const savedPets = localStorage.getItem('pets-pets')
    const savedOwners = localStorage.getItem('pets-owners')
    const savedAppointments = localStorage.getItem('pets-appointments')
    const savedServices = localStorage.getItem('pets-services')
    const savedProducts = localStorage.getItem('pets-products')

    if (savedPets) {
      const parsed = JSON.parse(savedPets)
      setPets(parsed.map((p: any) => ({
        ...p,
        vaccinations: p.vaccinations?.map((v: any) => ({ ...v, date: new Date(v.date), nextDue: v.nextDue ? new Date(v.nextDue) : undefined })),
        lastCheckup: p.lastCheckup ? new Date(p.lastCheckup) : undefined,
      })))
    } else {
      const sample: Pet[] = [
        { id: '1', name: 'Max', type: 'dog', breed: 'Golden Retriever', age: 3, weight: 25, ownerId: '1', ownerName: 'Sarah Benali', status: 'healthy', lastCheckup: new Date() },
        { id: '2', name: 'Luna', type: 'cat', breed: 'Persian', age: 2, weight: 4, ownerId: '2', ownerName: 'Ahmed Kadri', status: 'healthy', lastCheckup: new Date() },
      ]
      setPets(sample)
      localStorage.setItem('pets-pets', JSON.stringify(sample))
    }

    if (savedOwners) {
      setOwners(JSON.parse(savedOwners))
    } else {
      const sample: Owner[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', pets: ['1'], totalSpent: 450, visits: 5, membership: 'premium' },
        { id: '2', name: 'Ahmed Kadri', email: 'ahmed@email.com', phone: '+213 555 5678', pets: ['2'], totalSpent: 280, visits: 3, membership: 'regular' },
      ]
      setOwners(sample)
      localStorage.setItem('pets-owners', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      const today = new Date()
      const sample: Appointment[] = [
        { id: '1', petId: '1', petName: 'Max', ownerId: '1', ownerName: 'Sarah Benali', date: today, time: '10:00', type: 'checkup', status: 'scheduled', cost: 50 },
        { id: '2', petId: '2', petName: 'Luna', ownerId: '2', ownerName: 'Ahmed Kadri', date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), time: '14:00', type: 'grooming', status: 'scheduled', cost: 35 },
      ]
      setAppointments(sample)
      localStorage.setItem('pets-appointments', JSON.stringify(sample))
    }

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        { id: '1', name: 'Toilettage Complet', description: 'Coupe, bain et soins', type: 'grooming', price: 45, duration: 90, bookings: 25, rating: 4.8 },
        { id: '2', name: 'Garde de Jour', description: 'Garde pendant la journée', type: 'daycare', price: 30, duration: 480, bookings: 40, rating: 4.7 },
        { id: '3', name: 'Dressage', description: 'Sessions de dressage', type: 'training', price: 60, duration: 60, bookings: 15, rating: 4.9 },
      ]
      setServices(sample)
      localStorage.setItem('pets-services', JSON.stringify(sample))
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Nourriture Premium Chien', description: 'Croquettes premium', category: 'food', price: 45, cost: 25, stock: 50, sold: 120 },
        { id: '2', name: 'Jouet Interactif', description: 'Jouet pour chat', category: 'toys', price: 15, cost: 8, stock: 30, sold: 85 },
        { id: '3', name: 'Collier Cuir', description: 'Collier en cuir véritable', category: 'accessories', price: 25, cost: 12, stock: 20, sold: 45 },
      ]
      setProducts(sample)
      localStorage.setItem('pets-products', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (pets.length > 0) localStorage.setItem('pets-pets', JSON.stringify(pets))
  }, [pets])

  useEffect(() => {
    if (owners.length > 0) localStorage.setItem('pets-owners', JSON.stringify(owners))
  }, [owners])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('pets-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('pets-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('pets-products', JSON.stringify(products))
  }, [products])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'pets' as TabType, label: 'Animaux', icon: Heart },
    { id: 'owners' as TabType, label: 'Propriétaires', icon: Users },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'services' as TabType, label: 'Services', icon: Stethoscope },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
  ]

  const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.cost, 0) + services.reduce((sum, s) => sum + s.price * s.bookings, 0) + products.reduce((sum, p) => sum + p.price * p.sold, 0)
  const totalPets = pets.length
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length
  const healthyPets = pets.filter(p => p.status === 'healthy').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Animaux</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalPets}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV programmés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{scheduledAppointments}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Animaux sains</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{healthyPets}</p>
                  </div>
                  <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Rendez-vous à venir</h3>
                <div className="space-y-3">
                  {appointments.filter(a => a.status === 'scheduled').slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{appointment.petName}</p>
                        <p className="text-sm text-gray-500">{appointment.ownerName}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-orange-600">DZD{appointment.cost}</p>
                        <span className="text-xs text-gray-500 capitalize">{appointment.type === 'checkup' ? 'Consultation' : appointment.type === 'vaccination' ? 'Vaccination' : appointment.type === 'grooming' ? 'Toilettage' : appointment.type === 'surgery' ? 'Chirurgie' : 'Urgence'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Services populaires</h3>
                <div className="space-y-3">
                  {services.sort((a, b) => b.bookings - a.bookings).slice(0, 5).map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{service.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{service.type === 'grooming' ? 'Toilettage' : service.type === 'boarding' ? 'Garde' : service.type === 'training' ? 'Dressage' : service.type === 'daycare' ? 'Garde de jour' : 'Autre'}</p>
                        {service.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{service.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-orange-600">DZD{service.price}</p>
                        <p className="text-xs text-gray-500">{service.bookings} réservations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Animaux</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouvel animal
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Propriétaire: {pet.ownerName}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{pet.type === 'dog' ? 'Chien' : pet.type === 'cat' ? 'Chat' : pet.type === 'bird' ? 'Oiseau' : pet.type === 'rabbit' ? 'Lapin' : 'Autre'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Race:</span>
                      <span className="font-medium text-gray-900">{pet.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Âge:</span>
                      <span className="font-medium text-gray-900">{pet.age} ans</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poids:</span>
                      <span className="font-medium text-gray-900">{pet.weight} kg</span>
                    </div>
                    {pet.lastCheckup && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dernier contrôle:</span>
                        <span className="font-medium text-gray-900">{new Date(pet.lastCheckup).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        pet.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        pet.status === 'sick' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pet.status === 'healthy' ? 'En bonne santé' : pet.status === 'sick' ? 'Malade' : 'En convalescence'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'owners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Propriétaires</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau propriétaire
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {owners.map((owner) => (
                <div key={owner.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{owner.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{owner.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{owner.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Animaux:</span>
                      <span className="font-medium text-gray-900">{owner.pets.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Visites:</span>
                      <span className="font-medium text-gray-900">{owner.visits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{owner.totalSpent.toFixed(2)}</span>
                    </div>
                    {owner.membership && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Adhésion:</span>
                        <span className="font-medium text-orange-600 capitalize">{owner.membership === 'regular' ? 'Régulière' : 'Premium'}</span>
                      </div>
                    )}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau rendez-vous
              </button>
            </div>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">RDV #{appointment.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">Animal: {appointment.petName}</p>
                      <p className="text-sm text-gray-600 mt-1">Propriétaire: {appointment.ownerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(appointment.date).toLocaleDateString('fr-FR')} à {appointment.time}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Type: {appointment.type === 'checkup' ? 'Consultation' : appointment.type === 'vaccination' ? 'Vaccination' : appointment.type === 'grooming' ? 'Toilettage' : appointment.type === 'surgery' ? 'Chirurgie' : 'Urgence'}</p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'scheduled' ? 'Programmé' : appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{appointment.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau service
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{service.type === 'grooming' ? 'Toilettage' : service.type === 'boarding' ? 'Garde' : service.type === 'training' ? 'Dressage' : service.type === 'daycare' ? 'Garde de jour' : 'Autre'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-medium text-gray-900">{service.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Réservations:</span>
                      <span className="font-medium text-gray-900">{service.bookings}</span>
                    </div>
                    {service.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-orange-600">DZD{service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau produit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium text-gray-900 capitalize">{product.category === 'food' ? 'Nourriture' : product.category === 'toys' ? 'Jouets' : product.category === 'accessories' ? 'Accessoires' : product.category === 'medicine' ? 'Médicaments' : 'Autre'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold  DZD{product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendus:</span>
                      <span className="font-medium text-gray-900">{product.sold}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-orange-600">DZD{product.price.toFixed(2)}</span>
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
