'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Stethoscope, Users, Calendar, FileText, BarChart3, Clock, Activity } from 'lucide-react'

type TabType = 'dashboard' | 'patients' | 'appointments' | 'treatments'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  lastVisit?: Date
  nextAppointment?: Date
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: Date
  time: string
  treatment: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Treatment {
  id: string
  patientId: string
  patientName: string
  type: 'cleaning' | 'filling' | 'extraction' | 'crown' | 'root_canal' | 'orthodontic'
  date: Date
  cost: number
  notes?: string
}

export default function DentistPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showRdvModal, setShowRdvModal] = useState(false)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', dateOfBirth: '' })
  const [newRdv, setNewRdv] = useState({ patientId: '', date: '', time: '', treatment: '' })
  const [newTreatment, setNewTreatment] = useState({ patientId: '', type: 'cleaning' as 'cleaning' | 'filling' | 'extraction' | 'crown' | 'root_canal' | 'orthodontic', date: '', cost: 0, notes: '' })

  useEffect(() => {
    const savedPatients = localStorage.getItem('dentist-patients')
    const savedAppointments = localStorage.getItem('dentist-appointments')
    const savedTreatments = localStorage.getItem('dentist-treatments')

    if (savedPatients) {
      const parsed = JSON.parse(savedPatients)
      setPatients(parsed.map((p: any) => ({
        ...p,
        dateOfBirth: new Date(p.dateOfBirth),
        lastVisit: p.lastVisit ? new Date(p.lastVisit) : undefined,
        nextAppointment: p.nextAppointment ? new Date(p.nextAppointment) : undefined,
      })))
    } else {
      const sample: Patient[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 1234', dateOfBirth: new Date('1985-05-15'), lastVisit: new Date('2024-01-10') },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 5678', dateOfBirth: new Date('1990-03-20'), lastVisit: new Date('2024-01-05') },
      ]
      setPatients(sample)
      localStorage.setItem('dentist-patients', JSON.stringify(sample))
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
        { id: '1', patientId: '1', patientName: 'Ahmed Benali', date: today, time: '10:00', treatment: 'Nettoyage', status: 'scheduled' },
      ]
      setAppointments(sample)
      localStorage.setItem('dentist-appointments', JSON.stringify(sample))
    }

    if (savedTreatments) {
      const parsed = JSON.parse(savedTreatments)
      setTreatments(parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (patients.length > 0) localStorage.setItem('dentist-patients', JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('dentist-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (treatments.length > 0) localStorage.setItem('dentist-treatments', JSON.stringify(treatments))
  }, [treatments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'patients' as TabType, label: 'Patients', icon: Users },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'treatments' as TabType, label: 'Traitements', icon: Activity },
  ]

  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' && a.date.toDateString() === today.toDateString()
  })
  const totalRevenue = treatments.reduce((sum, t) => sum + t.cost, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
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
                      ? 'text-sky-600 border-b-2 border-sky-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Patients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{patients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Traitements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{treatments.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {todayAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Rendez-vous d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{apt.patientName}</span>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{apt.time}</span>
                        <span className="text-gray-500">- {apt.treatment}</span>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Patients</h3>
                  <p className="text-sm text-gray-600">Dossiers patients avec historique dentaire</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des consultations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Traitements</h3>
                  <p className="text-sm text-gray-600">Suivi des soins et interventions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Radiographies</h3>
                  <p className="text-sm text-gray-600">Gestion des images dentaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et devis</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rappels</h3>
                  <p className="text-sm text-gray-600">Notifications de contrôles réguliers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Patients</h2>
              <button 
                onClick={() => setShowPatientModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Nouveau Patient
              </button>
            </div>
            {patients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun patient enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {patients.map((patient) => (
                  <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{patient.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{patient.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{patient.phone}</p>
                    {patient.lastVisit && (
                      <p className="text-xs text-gray-500">Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}</p>
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
              <button 
                onClick={() => setShowRdvModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Nouveau RDV
              </button>
            </div>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun rendez-vous programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Traitement: {apt.treatment}</p>
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

        {activeTab === 'treatments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Traitements</h2>
              <button 
                onClick={() => setShowTreatmentModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Nouveau Traitement
              </button>
            </div>
            {treatments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun traitement enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{treatment.patientName}</h3>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          {treatment.type.replace('_', ' ')} - {new Date(treatment.date).toLocaleDateString('fr-FR')}
                        </p>
                        {treatment.notes && (
                          <p className="text-sm text-gray-500 mt-1">{treatment.notes}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-gray-900">DZD{treatment.cost.toFixed(2)}</span>
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
        isOpen={showPatientModal}
        onClose={() => {
          setShowPatientModal(false)
          setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '' })
        }}
        title="Nouveau Patient"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input
              type="date"
              value={newPatient.dateOfBirth}
              onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPatientModal(false)
                setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newPatient.name && newPatient.email && newPatient.phone && newPatient.dateOfBirth) {
                  const patient: Patient = {
                    id: Date.now().toString(),
                    name: newPatient.name,
                    email: newPatient.email,
                    phone: newPatient.phone,
                    dateOfBirth: new Date(newPatient.dateOfBirth),
                  }
                  setPatients([...patients, patient])
                  setShowPatientModal(false)
                  setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '' })
                }
              }}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRdvModal}
        onClose={() => {
          setShowRdvModal(false)
          setNewRdv({ patientId: '', date: '', time: '', treatment: '' })
        }}
        title="Nouveau RDV"
        size="lg"
      >
        <div className="space-y-4">
          {patients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={newRdv.patientId}
                onChange={(e) => setNewRdv({ ...newRdv, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name} - {patient.phone}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newRdv.date}
                onChange={(e) => setNewRdv({ ...newRdv, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newRdv.time}
                onChange={(e) => setNewRdv({ ...newRdv, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Traitement</label>
            <input
              type="text"
              value={newRdv.treatment}
              onChange={(e) => setNewRdv({ ...newRdv, treatment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Ex: Nettoyage dentaire"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowRdvModal(false)
                setNewRdv({ patientId: '', date: '', time: '', treatment: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newRdv.patientId && newRdv.date && newRdv.time && newRdv.treatment) {
                  const patient = patients.find(p => p.id === newRdv.patientId)
                  if (patient) {
                    const appointment: Appointment = {
                      id: Date.now().toString(),
                      patientId: newRdv.patientId,
                      patientName: patient.name,
                      date: new Date(newRdv.date),
                      time: newRdv.time,
                      treatment: newRdv.treatment,
                      status: 'scheduled',
                    }
                    setAppointments([...appointments, appointment])
                    setShowRdvModal(false)
                    setNewRdv({ patientId: '', date: '', time: '', treatment: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTreatmentModal}
        onClose={() => {
          setShowTreatmentModal(false)
          setNewTreatment({ patientId: '', type: 'cleaning', date: '', cost: 0, notes: '' })
        }}
        title="Nouveau Traitement"
        size="lg"
      >
        <div className="space-y-4">
          {patients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={newTreatment.patientId}
                onChange={(e) => setNewTreatment({ ...newTreatment, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name} - {patient.phone}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newTreatment.type}
                onChange={(e) => setNewTreatment({ ...newTreatment, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="cleaning">Nettoyage</option>
                <option value="filling">Plombage</option>
                <option value="extraction">Extraction</option>
                <option value="crown">Couronne</option>
                <option value="root_canal">Traitement de canal</option>
                <option value="orthodontic">Orthodontie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newTreatment.date}
                onChange={(e) => setNewTreatment({ ...newTreatment, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD)</label>
            <input
              type="number"
              value={newTreatment.cost}
              onChange={(e) => setNewTreatment({ ...newTreatment, cost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newTreatment.notes}
              onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              rows={3}
              placeholder="Notes sur le traitement"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTreatmentModal(false)
                setNewTreatment({ patientId: '', type: 'cleaning', date: '', cost: 0, notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newTreatment.patientId && newTreatment.date) {
                  const patient = patients.find(p => p.id === newTreatment.patientId)
                  if (patient) {
                    const treatment: Treatment = {
                      id: Date.now().toString(),
                      patientId: newTreatment.patientId,
                      patientName: patient.name,
                      type: newTreatment.type,
                      date: new Date(newTreatment.date),
                      cost: newTreatment.cost,
                      notes: newTreatment.notes || undefined,
                    }
                    setTreatments([...treatments, treatment])
                    setShowTreatmentModal(false)
                    setNewTreatment({ patientId: '', type: 'cleaning', date: '', cost: 0, notes: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}