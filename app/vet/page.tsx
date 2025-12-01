'use client'

import { useState, useEffect, useMemo } from 'react'
import { Heart, Users, Calendar, FileText, BarChart3, Droplet, Activity, Edit2, Trash2, Search, Plus } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'animals' | 'appointments' | 'vaccinations'

interface Animal {
  id: string
  name: string
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other'
  breed: string
  ownerName: string
  ownerPhone: string
  dateOfBirth: Date
  lastVisit?: Date
}

interface Appointment {
  id: string
  animalId: string
  animalName: string
  date: Date
  time: string
  reason: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Vaccination {
  id: string
  animalId: string
  animalName: string
  vaccine: string
  date: Date
  nextDue?: Date
}

export default function VetPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [animals, setAnimals] = useState<Animal[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [showAnimalModal, setShowAnimalModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showVaccinationModal, setShowVaccinationModal] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null)
  const [newAnimal, setNewAnimal] = useState({ name: '', species: 'dog' as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
  const [newAppointment, setNewAppointment] = useState({ animalId: '', date: '', time: '', reason: '' })
  const [newVaccination, setNewVaccination] = useState({ animalId: '', vaccine: '', date: '', nextDue: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

  useEffect(() => {
    const savedAnimals = localStorage.getItem('vet-animals')
    const savedAppointments = localStorage.getItem('vet-appointments')
    const savedVaccinations = localStorage.getItem('vet-vaccinations')

    if (savedAnimals) {
      const parsed = JSON.parse(savedAnimals)
      setAnimals(parsed.map((a: any) => ({
        ...a,
        dateOfBirth: new Date(a.dateOfBirth),
        lastVisit: a.lastVisit ? new Date(a.lastVisit) : undefined,
      })))
    } else {
      const sample: Animal[] = [
        { id: '1', name: 'Max', species: 'dog', breed: 'Golden Retriever', ownerName: 'Ahmed Benali', ownerPhone: '+213 555 1234', dateOfBirth: new Date('2020-03-15'), lastVisit: new Date('2024-01-10') },
        { id: '2', name: 'Luna', species: 'cat', breed: 'Persian', ownerName: 'Fatima Kadri', ownerPhone: '+213 555 5678', dateOfBirth: new Date('2021-06-20'), lastVisit: new Date('2024-01-05') },
      ]
      setAnimals(sample)
      localStorage.setItem('vet-animals', JSON.stringify(sample))
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
        { id: '1', animalId: '1', animalName: 'Max', date: today, time: '10:00', reason: 'Vaccination annuelle', status: 'scheduled' },
      ]
      setAppointments(sample)
      localStorage.setItem('vet-appointments', JSON.stringify(sample))
    }

    if (savedVaccinations) {
      const parsed = JSON.parse(savedVaccinations)
      setVaccinations(parsed.map((v: any) => ({
        ...v,
        date: new Date(v.date),
        nextDue: v.nextDue ? new Date(v.nextDue) : undefined,
      })))
    }
  }, [])

  useEffect(() => {
    if (animals.length > 0) localStorage.setItem('vet-animals', JSON.stringify(animals))
  }, [animals])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('vet-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (vaccinations.length > 0) localStorage.setItem('vet-vaccinations', JSON.stringify(vaccinations))
  }, [vaccinations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'animals' as TabType, label: 'Animaux', icon: Heart },
    { id: 'appointments' as TabType, label: 'Consultations', icon: Calendar },
    { id: 'vaccinations' as TabType, label: 'Vaccinations', icon: Droplet },
  ]

  const todayAppointments = useMemo(() => appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' && a.date.toDateString() === today.toDateString()
  }), [appointments])

  const filteredAnimals = useMemo(() => {
    let filtered = animals
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.breed.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [animals, searchQuery])

  const filteredAppointments = useMemo(() => {
    let filtered = appointments
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [appointments, searchQuery])

  const filteredVaccinations = useMemo(() => {
    let filtered = vaccinations
    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.animalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vaccine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [vaccinations, searchQuery])

  const handleAddAnimal = () => {
    if (newAnimal.name && newAnimal.breed && newAnimal.ownerName && newAnimal.ownerPhone && newAnimal.dateOfBirth) {
      const animal: Animal = {
        id: editingAnimal?.id || Date.now().toString(),
        name: newAnimal.name,
        species: newAnimal.species,
        breed: newAnimal.breed,
        ownerName: newAnimal.ownerName,
        ownerPhone: newAnimal.ownerPhone,
        dateOfBirth: new Date(newAnimal.dateOfBirth),
        lastVisit: editingAnimal?.lastVisit,
      }
      if (editingAnimal) {
        setAnimals(animals.map(a => a.id === editingAnimal.id ? animal : a))
      } else {
        setAnimals([...animals, animal])
      }
      setShowAnimalModal(false)
      setEditingAnimal(null)
      setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
    }
  }

  const handleAddAppointment = () => {
    if (newAppointment.animalId && newAppointment.date && newAppointment.time && newAppointment.reason) {
      const animal = animals.find(a => a.id === newAppointment.animalId)
      if (!animal) return
      
      const appointment: Appointment = {
        id: editingAppointment?.id || Date.now().toString(),
        animalId: newAppointment.animalId,
        animalName: animal.name,
        date: new Date(newAppointment.date),
        time: newAppointment.time,
        reason: newAppointment.reason,
        status: 'scheduled',
      }
      if (editingAppointment) {
        setAppointments(appointments.map(a => a.id === editingAppointment.id ? appointment : a))
      } else {
        setAppointments([...appointments, appointment])
        setAnimals(animals.map(a => a.id === newAppointment.animalId ? { ...a, lastVisit: new Date(newAppointment.date) } : a))
      }
      setShowAppointmentModal(false)
      setEditingAppointment(null)
      setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
    }
  }

  const handleAddVaccination = () => {
    if (newVaccination.animalId && newVaccination.vaccine && newVaccination.date) {
      const animal = animals.find(a => a.id === newVaccination.animalId)
      if (!animal) return
      
      const vaccination: Vaccination = {
        id: editingVaccination?.id || Date.now().toString(),
        animalId: newVaccination.animalId,
        animalName: animal.name,
        vaccine: newVaccination.vaccine,
        date: new Date(newVaccination.date),
        nextDue: newVaccination.nextDue ? new Date(newVaccination.nextDue) : undefined,
      }
      if (editingVaccination) {
        setVaccinations(vaccinations.map(v => v.id === editingVaccination.id ? vaccination : v))
      } else {
        setVaccinations([...vaccinations, vaccination])
      }
      setShowVaccinationModal(false)
      setEditingVaccination(null)
      setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'animal') {
      setAnimals(animals.filter(a => a.id !== id))
    } else if (type === 'appointment') {
      setAppointments(appointments.filter(a => a.id !== id))
    } else if (type === 'vaccination') {
      setVaccinations(vaccinations.filter(v => v.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal)
    setNewAnimal({ ...animal, dateOfBirth: animal.dateOfBirth.toISOString().split('T')[0] })
    setShowAnimalModal(true)
  }

  const openEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setNewAppointment({ ...appointment, date: appointment.date.toISOString().split('T')[0] })
    setShowAppointmentModal(true)
  }

  const openEditVaccination = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination)
    setNewVaccination({ ...vaccination, date: vaccination.date.toISOString().split('T')[0], nextDue: vaccination.nextDue ? vaccination.nextDue.toISOString().split('T')[0] : '' })
    setShowVaccinationModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
                      ? 'text-pink-600 border-b-2 border-pink-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Animaux</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{animals.length}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Vaccinations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{vaccinations.length}</p>
                  </div>
                  <Droplet className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Consultations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{appointments.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'animals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Animaux</h2>
              <button 
                onClick={() => {
                  setEditingAnimal(null)
                  setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
                  setShowAnimalModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvel Animal
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un animal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {filteredAnimals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun animal trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredAnimals.map((animal) => (
                  <div key={animal.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{animal.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditAnimal(animal)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'animal', id: animal.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 capitalize">{animal.species} - {animal.breed}</p>
                    <p className="text-sm text-gray-600 mb-1">Propriétaire: {animal.ownerName}</p>
                    <p className="text-sm text-gray-600 mb-3">{animal.ownerPhone}</p>
                    {animal.lastVisit && (
                      <p className="text-xs text-gray-500">Dernière visite: {new Date(animal.lastVisit).toLocaleDateString('fr-FR')}</p>
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Consultations</h2>
              <button 
                onClick={() => {
                  setEditingAppointment(null)
                  setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
                  setShowAppointmentModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Consultation
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une consultation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune consultation trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{apt.animalName}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditAppointment(apt)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'appointment', id: apt.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Raison: {apt.reason}</p>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vaccinations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Vaccinations</h2>
              <button 
                onClick={() => {
                  setEditingVaccination(null)
                  setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
                  setShowVaccinationModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Vaccination
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une vaccination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {filteredVaccinations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vaccination trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVaccinations.map((vacc) => (
                  <div key={vacc.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{vacc.animalName}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditVaccination(vacc)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'vaccination', id: vacc.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{vacc.vaccine}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Date: {new Date(vacc.date).toLocaleDateString('fr-FR')}
                        </p>
                        {vacc.nextDue && (
                          <p className="text-sm text-orange-600 mt-1">
                            Prochaine dose: {new Date(vacc.nextDue).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Animal Modal */}
      <Modal
        isOpen={showAnimalModal}
        onClose={() => {
          setShowAnimalModal(false)
          setEditingAnimal(null)
          setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
        }}
        title={editingAnimal ? 'Modifier l\'animal' : 'Nouvel animal'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'animal *</label>
            <input
              type="text"
              value={newAnimal.name}
              onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Max"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Espèce *</label>
              <select
                value={newAnimal.species}
                onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="dog">Chien</option>
                <option value="cat">Chat</option>
                <option value="bird">Oiseau</option>
                <option value="rabbit">Lapin</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Race *</label>
              <input
                type="text"
                value={newAnimal.breed}
                onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Golden Retriever"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du propriétaire *</label>
              <input
                type="text"
                value={newAnimal.ownerName}
                onChange={(e) => setNewAnimal({ ...newAnimal, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newAnimal.ownerPhone}
                onChange={(e) => setNewAnimal({ ...newAnimal, ownerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
            <input
              type="date"
              value={newAnimal.dateOfBirth}
              onChange={(e) => setNewAnimal({ ...newAnimal, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowAnimalModal(false)
                setEditingAnimal(null)
                setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddAnimal}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              {editingAnimal ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Appointment Modal */}
      <Modal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false)
          setEditingAppointment(null)
          setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
        }}
        title={editingAppointment ? 'Modifier la consultation' : 'Nouvelle consultation'}
        size="lg"
      >
        <div className="space-y-4">
          {animals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal *</label>
              <select
                value={newAppointment.animalId}
                onChange={(e) => setNewAppointment({ ...newAppointment, animalId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Sélectionner un animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} - {animal.ownerName}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison *</label>
            <textarea
              value={newAppointment.reason}
              onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Ex: Vaccination annuelle, Examen de routine..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowAppointmentModal(false)
                setEditingAppointment(null)
                setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddAppointment}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              {editingAppointment ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Vaccination Modal */}
      <Modal
        isOpen={showVaccinationModal}
        onClose={() => {
          setShowVaccinationModal(false)
          setEditingVaccination(null)
          setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
        }}
        title={editingVaccination ? 'Modifier la vaccination' : 'Nouvelle vaccination'}
        size="lg"
      >
        <div className="space-y-4">
          {animals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal *</label>
              <select
                value={newVaccination.animalId}
                onChange={(e) => setNewVaccination({ ...newVaccination, animalId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Sélectionner un animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>{animal.name} - {animal.ownerName}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccin *</label>
            <input
              type="text"
              value={newVaccination.vaccine}
              onChange={(e) => setNewVaccination({ ...newVaccination, vaccine: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Vaccin antirabique, DHPP..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de vaccination *</label>
              <input
                type="date"
                value={newVaccination.date}
                onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine dose (optionnel)</label>
              <input
                type="date"
                value={newVaccination.nextDue}
                onChange={(e) => setNewVaccination({ ...newVaccination, nextDue: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowVaccinationModal(false)
                setEditingVaccination(null)
                setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddVaccination}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              {editingVaccination ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmer la suppression"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
