'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Calendar, FileText, BarChart3, Droplet, Activity } from 'lucide-react'
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
  const [newAnimal, setNewAnimal] = useState({ name: '', species: 'dog' as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
  const [newAppointment, setNewAppointment] = useState({ animalId: '', date: '', time: '', reason: '' })
  const [newVaccination, setNewVaccination] = useState({ animalId: '', vaccine: '', date: '', nextDue: '' })

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

  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' && a.date.toDateString() === today.toDateString()
  })

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Animaux</h3>
                  <p className="text-sm text-gray-600">Dossiers animaux avec historique médical</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Consultations</h3>
                  <p className="text-sm text-gray-600">Rendez-vous et examens vétérinaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Vaccinations</h3>
                  <p className="text-sm text-gray-600">Suivi des vaccinations et rappels</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Chirurgies</h3>
                  <p className="text-sm text-gray-600">Gestion des interventions chirurgicales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Prescriptions</h3>
                  <p className="text-sm text-gray-600">Ordonnances et médicaments</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rappels</h3>
                  <p className="text-sm text-gray-600">Notifications de vaccinations et contrôles</p>
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
                onClick={() => setShowAnimalModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Nouvel Animal
              </button>
            </div>
            {animals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun animal enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {animals.map((animal) => (
                  <div key={animal.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{animal.name}</h3>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouvelle Consultation
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune consultation programmée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.animalName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Raison: {apt.reason}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
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
                onClick={() => setShowVaccinationModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Nouvelle Vaccination
              </button>
            </div>
            {vaccinations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vaccination enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vaccinations.map((vacc) => (
                  <div key={vacc.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{vacc.animalName}</h3>
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

      {/* Modals */}
      <Modal
        isOpen={showAnimalModal}
        onClose={() => {
          setShowAnimalModal(false)
          setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
        }}
        title="Nouvel Animal"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'animal</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Espèce</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du propriétaire</label>
              <input
                type="text"
                value={newAnimal.ownerName}
                onChange={(e) => setNewAnimal({ ...newAnimal, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
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
                setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newAnimal.name && newAnimal.breed && newAnimal.ownerName && newAnimal.ownerPhone && newAnimal.dateOfBirth) {
                  const animal: Animal = {
                    id: Date.now().toString(),
                    name: newAnimal.name,
                    species: newAnimal.species,
                    breed: newAnimal.breed,
                    ownerName: newAnimal.ownerName,
                    ownerPhone: newAnimal.ownerPhone,
                    dateOfBirth: new Date(newAnimal.dateOfBirth),
                  }
                  setAnimals([...animals, animal])
                  setShowAnimalModal(false)
                  setNewAnimal({ name: '', species: 'dog', breed: '', ownerName: '', ownerPhone: '', dateOfBirth: '' })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false)
          setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
        }}
        title="Nouvelle Consultation"
        size="lg"
      >
        <div className="space-y-4">
          {animals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
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
                setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newAppointment.animalId && newAppointment.date && newAppointment.time && newAppointment.reason) {
                  const animal = animals.find(a => a.id === newAppointment.animalId)
                  if (animal) {
                    const appointment: Appointment = {
                      id: Date.now().toString(),
                      animalId: newAppointment.animalId,
                      animalName: animal.name,
                      date: new Date(newAppointment.date),
                      time: newAppointment.time,
                      reason: newAppointment.reason,
                      status: 'scheduled',
                    }
                    setAppointments([...appointments, appointment])
                    setAnimals(animals.map(a => a.id === newAppointment.animalId ? { ...a, lastVisit: new Date(newAppointment.date) } : a))
                    setShowAppointmentModal(false)
                    setNewAppointment({ animalId: '', date: '', time: '', reason: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showVaccinationModal}
        onClose={() => {
          setShowVaccinationModal(false)
          setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
        }}
        title="Nouvelle Vaccination"
        size="lg"
      >
        <div className="space-y-4">
          {animals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccin</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de vaccination</label>
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
                setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newVaccination.animalId && newVaccination.vaccine && newVaccination.date) {
                  const animal = animals.find(a => a.id === newVaccination.animalId)
                  if (animal) {
                    const vaccination: Vaccination = {
                      id: Date.now().toString(),
                      animalId: newVaccination.animalId,
                      animalName: animal.name,
                      vaccine: newVaccination.vaccine,
                      date: new Date(newVaccination.date),
                      nextDue: newVaccination.nextDue ? new Date(newVaccination.nextDue) : undefined,
                    }
                    setVaccinations([...vaccinations, vaccination])
                    setShowVaccinationModal(false)
                    setNewVaccination({ animalId: '', vaccine: '', date: '', nextDue: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}