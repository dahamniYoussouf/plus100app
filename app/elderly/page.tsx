'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Calendar, Pill, FileText, BarChart3, Clock, Activity, Phone } from 'lucide-react'

type TabType = 'dashboard' | 'persons' | 'medications' | 'appointments' | 'care' | 'emergency'

interface Person {
  id: string
  name: string
  dateOfBirth: Date
  phone: string
  emergencyContact: string
  emergencyPhone: string
  address: string
  medicalConditions: string[]
  allergies: string[]
  notes?: string
}

interface Medication {
  id: string
  personId: string
  personName: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: Date
  endDate?: Date
  doctor: string
  notes?: string
}

interface Appointment {
  id: string
  personId: string
  personName: string
  type: 'doctor' | 'therapy' | 'checkup' | 'other'
  doctor: string
  date: Date
  time: string
  location: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface CareActivity {
  id: string
  personId: string
  personName: string
  type: 'meal' | 'medication' | 'exercise' | 'hygiene' | 'social' | 'other'
  date: Date
  time: string
  notes?: string
  completed: boolean
}

export default function ElderlyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [persons, setPersons] = useState<Person[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [careActivities, setCareActivities] = useState<CareActivity[]>([])

  useEffect(() => {
    const savedPersons = localStorage.getItem('elderly-persons')
    const savedMedications = localStorage.getItem('elderly-medications')
    const savedAppointments = localStorage.getItem('elderly-appointments')
    const savedCare = localStorage.getItem('elderly-care')

    if (savedPersons) {
      const parsed = JSON.parse(savedPersons)
      setPersons(parsed.map((p: any) => ({ ...p, dateOfBirth: new Date(p.dateOfBirth) })))
    } else {
      const sample: Person[] = [
        {
          id: '1',
          name: 'Mohamed Benali',
          dateOfBirth: new Date('1945-03-15'),
          phone: '+213 555 1111',
          emergencyContact: 'Ahmed Benali',
          emergencyPhone: '+213 555 1234',
          address: '123 Rue des Fleurs, Alger',
          medicalConditions: ['Hypertension', 'Diabète'],
          allergies: ['Pénicilline'],
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          dateOfBirth: new Date('1950-07-20'),
          phone: '+213 555 2222',
          emergencyContact: 'Leila Kadri',
          emergencyPhone: '+213 555 5678',
          address: '456 Avenue de la Paix, Oran',
          medicalConditions: ['Arthrite'],
          allergies: [],
        },
      ]
      setPersons(sample)
      localStorage.setItem('elderly-persons', JSON.stringify(sample))
    }

    if (savedMedications) {
      const parsed = JSON.parse(savedMedications)
      setMedications(parsed.map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
        endDate: m.endDate ? new Date(m.endDate) : undefined,
      })))
    } else {
      const sample: Medication[] = [
        {
          id: '1',
          personId: '1',
          personName: 'Mohamed Benali',
          name: 'Métformine',
          dosage: '500mg',
          frequency: '2 fois par jour',
          times: ['08:00', '20:00'],
          startDate: new Date('2024-01-01'),
          doctor: 'Dr. Amine',
        },
      ]
      setMedications(sample)
      localStorage.setItem('elderly-medications', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      const sample: Appointment[] = [
        {
          id: '1',
          personId: '1',
          personName: 'Mohamed Benali',
          type: 'checkup',
          doctor: 'Dr. Amine',
          date: nextWeek,
          time: '10:00',
          location: 'Cabinet médical',
          status: 'scheduled',
        },
      ]
      setAppointments(sample)
      localStorage.setItem('elderly-appointments', JSON.stringify(sample))
    }

    if (savedCare) {
      const parsed = JSON.parse(savedCare)
      setCareActivities(parsed.map((c: any) => ({ ...c, date: new Date(c.date) })))
    } else {
      const today = new Date()
      const sample: CareActivity[] = [
        {
          id: '1',
          personId: '1',
          personName: 'Mohamed Benali',
          type: 'medication',
          date: today,
          time: '08:00',
          completed: true,
        },
        {
          id: '2',
          personId: '1',
          personName: 'Mohamed Benali',
          type: 'meal',
          date: today,
          time: '12:00',
          completed: false,
        },
      ]
      setCareActivities(sample)
      localStorage.setItem('elderly-care', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (persons.length > 0) localStorage.setItem('elderly-persons', JSON.stringify(persons))
  }, [persons])

  useEffect(() => {
    if (medications.length > 0) localStorage.setItem('elderly-medications', JSON.stringify(medications))
  }, [medications])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('elderly-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (careActivities.length > 0) localStorage.setItem('elderly-care', JSON.stringify(careActivities))
  }, [careActivities])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'persons' as TabType, label: 'Personnes', icon: Users },
    { id: 'medications' as TabType, label: 'Médicaments', icon: Pill },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'care' as TabType, label: 'Soins', icon: Heart },
    { id: 'emergency' as TabType, label: 'Urgences', icon: Phone },
  ]

  const totalPersons = persons.length
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.date.toDateString() === today.toDateString() && a.status === 'scheduled'
  })
  const activeMedications = medications.filter(m => !m.endDate || new Date(m.endDate) >= new Date())
  const todayCare = careActivities.filter(c => {
    const today = new Date()
    return c.date.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                      ? 'text-purple-600 border-b-2 border-purple-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Personnes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalPersons}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Médicaments Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeMedications.length}</p>
                  </div>
                  <Pill className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Soins Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayCare.length}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Personnes</h3>
                  <p className="text-sm text-gray-600">Dossiers complets avec informations médicales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Médicaments</h3>
                  <p className="text-sm text-gray-600">Suivi des médicaments et rappels</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification des rendez-vous médicaux</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Soins Quotidiens</h3>
                  <p className="text-sm text-gray-600">Suivi des activités de soins</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contacts Urgence</h3>
                  <p className="text-sm text-gray-600">Accès rapide aux contacts d'urgence</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et historique</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'persons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personnes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle Personne
              </button>
            </div>
            {persons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune personne enregistrée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {persons.map((person) => {
                  const age = new Date().getFullYear() - new Date(person.dateOfBirth).getFullYear()
                  return (
                    <div key={person.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{person.name}</h3>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">🎂 {age} ans</p>
                        <p className="text-sm text-gray-600">📞 {person.phone}</p>
                        <p className="text-sm text-gray-600">📍 {person.address}</p>
                        <p className="text-sm text-gray-600">🚨 Urgence: {person.emergencyContact} ({person.emergencyPhone})</p>
                        {person.medicalConditions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Conditions médicales:</p>
                            <div className="flex flex-wrap gap-1">
                              {person.medicalConditions.map((condition, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                  {condition}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {person.allergies.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Allergies:</p>
                            <div className="flex flex-wrap gap-1">
                              {person.allergies.map((allergy, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Médicaments</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau Médicament
              </button>
            </div>
            {medications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun médicament enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{med.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Pour: {med.personName}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">💊 Dosage: {med.dosage}</p>
                      <p className="text-gray-600">⏰ Fréquence: {med.frequency}</p>
                      {med.times.length > 0 && (
                        <p className="text-gray-600">🕐 Heures: {med.times.join(', ')}</p>
                      )}
                      <p className="text-gray-600">👨‍⚕️ Prescrit par: {med.doctor}</p>
                      <p className="text-gray-500 text-xs">
                        Début: {new Date(med.startDate).toLocaleDateString('fr-FR')}
                        {med.endDate && ` - Fin: ${new Date(med.endDate).toLocaleDateString('fr-FR')}`}
                      </p>
                      {med.notes && (
                        <p className="text-gray-500 text-xs mt-1">Note: {med.notes}</p>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                        <h3 className="font-semibold text-gray-900 text-lg">{apt.personName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {apt.type === 'doctor' ? 'Médecin' :
                           apt.type === 'therapy' ? 'Thérapie' :
                           apt.type === 'checkup' ? 'Contrôle' : 'Autre'}
                        </p>
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
                      <p className="text-gray-600">👨‍⚕️ {apt.doctor}</p>
                      <p className="text-gray-600">
                        📅 {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                      </p>
                      <p className="text-gray-600">📍 {apt.location}</p>
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

        {activeTab === 'care' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Soins Quotidiens</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle Activité
              </button>
            </div>
            {careActivities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune activité de soin</p>
              </div>
            ) : (
              <div className="space-y-4">
                {careActivities.map((care) => (
                  <div key={care.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{care.personName}</h3>
                        <div className="space-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            {care.type === 'meal' ? '🍽️ Repas' :
                             care.type === 'medication' ? '💊 Médicament' :
                             care.type === 'exercise' ? '🏃 Exercice' :
                             care.type === 'hygiene' ? '🚿 Hygiène' :
                             care.type === 'social' ? '👥 Social' : 'Autre'}
                          </p>
                          <p className="text-gray-600">
                            📅 {new Date(care.date).toLocaleDateString('fr-FR')} à {care.time}
                          </p>
                          {care.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {care.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        care.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {care.completed ? 'Terminé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contacts d'Urgence</h2>
            {persons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune personne enregistrée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {persons.map((person) => (
                  <div key={person.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6">
                    <h3 className="font-semibold text-red-900 text-lg mb-3">{person.name}</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Contact Urgence</p>
                        <p className="font-medium text-gray-900">{person.emergencyContact}</p>
                        <p className="text-sm text-gray-600">{person.emergencyPhone}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                        <p className="text-sm text-gray-900">{person.phone}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Adresse</p>
                        <p className="text-sm text-gray-900">{person.address}</p>
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
