'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Stethoscope, Users, Calendar, FileText, BarChart3, TrendingUp, Clock, Pill, Activity, AlertCircle, Heart } from 'lucide-react'

type TabType = 'dashboard' | 'patients' | 'appointments' | 'records'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  address: string
  city: string
  postalCode?: string
  bloodType?: string
  allergies?: string[]
  chronicConditions?: string[]
  medications?: string[]
  insuranceNumber?: string
  insuranceProvider?: string
  emergencyContact?: string
  emergencyPhone?: string
  occupation?: string
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  firstVisit: Date
  lastVisit?: Date
  totalVisits: number
  primaryDoctor?: string
  notes?: string
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  date: Date
  time: string
  duration: number
  reason: string
  type: 'consultation' | 'followup' | 'emergency' | 'vaccination' | 'checkup'
  doctor: string
  room?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  notes?: string
  reminderSent?: boolean
  createdAt: Date
  updatedAt?: Date
}

interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  date: Date
  visitType: 'consultation' | 'emergency' | 'followup' | 'vaccination' | 'checkup'
  chiefComplaint: string
  symptoms: string[]
  diagnosis: string[]
  treatment: string[]
  medications: Array<{ name: string; dosage: string; duration: string }>
  vitalSigns?: {
    bloodPressure?: string
    temperature?: number
    heartRate?: number
    weight?: number
    height?: number
  }
  labTests?: Array<{ name: string; result?: string; date?: Date }>
  doctor: string
  notes?: string
  followUpDate?: Date
  attachments?: string[]
}

export default function ClinicPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [patients, setPatients] = useState<Patient[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showRdvModal, setShowRdvModal] = useState(false)
  const [showDossierModal, setShowDossierModal] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', dateOfBirth: '', gender: 'male' as 'male' | 'female', address: '', city: '' })
  const [newRdv, setNewRdv] = useState({ patientId: '', date: '', time: '', reason: '', type: 'consultation' as 'consultation' | 'followup' | 'emergency' | 'vaccination' | 'checkup', doctor: '' })
  const [newDossier, setNewDossier] = useState({ patientId: '', date: '', chiefComplaint: '', symptoms: '', diagnosis: '', treatment: '' })

  useEffect(() => {
    const savedPatients = localStorage.getItem('clinic-patients')
    const savedAppointments = localStorage.getItem('clinic-appointments')
    const savedRecords = localStorage.getItem('clinic-records')

    if (savedPatients) {
      const parsed = JSON.parse(savedPatients)
      setPatients(parsed.map((p: any) => ({
        ...p,
        dateOfBirth: new Date(p.dateOfBirth),
      })))
    } else {
      const sample: Patient[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          dateOfBirth: new Date('1985-05-15'),
          gender: 'male',
          address: '123 Rue Didouche Mourad',
          city: 'Alger',
          postalCode: '16000',
          bloodType: 'O+',
          allergies: ['Penicilline', 'Aspirine'],
          chronicConditions: ['Hypertension'],
          medications: ['Lisinopril 10mg - 1x/jour'],
          insuranceNumber: 'ASN-123456789',
          insuranceProvider: 'CNAS',
          emergencyContact: 'Fatima Benali',
          emergencyPhone: '+213 555 1235',
          occupation: 'Ingénieur',
          maritalStatus: 'married',
          firstVisit: new Date('2023-01-15'),
          lastVisit: new Date('2024-01-10'),
          totalVisits: 8,
          primaryDoctor: 'Dr. Mohamed Amrani',
          notes: 'Patient régulier, bon suivi des traitements',
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          dateOfBirth: new Date('1990-03-20'),
          gender: 'female',
          address: '45 Boulevard de la République',
          city: 'Oran',
          postalCode: '31000',
          bloodType: 'A+',
          allergies: [],
          medications: [],
          insuranceNumber: 'ASN-987654321',
          insuranceProvider: 'CASNOS',
          emergencyContact: 'Mohamed Kadri',
          emergencyPhone: '+213 555 5679',
          occupation: 'Enseignante',
          maritalStatus: 'married',
          firstVisit: new Date('2023-06-10'),
          lastVisit: new Date('2024-01-15'),
          totalVisits: 5,
          primaryDoctor: 'Dr. Sarah Benali',
        },
        {
          id: '3',
          name: 'Omar Cherif',
          email: 'omar@email.com',
          phone: '+213 555 9876',
          dateOfBirth: new Date('1978-11-08'),
          gender: 'male',
          address: '78 Avenue de la Liberté',
          city: 'Constantine',
          postalCode: '25000',
          bloodType: 'B+',
          allergies: ['Iode'],
          chronicConditions: ['Diabète Type 2'],
          medications: ['Metformine 500mg - 2x/jour'],
          insuranceNumber: 'ASN-456789123',
          insuranceProvider: 'CNAS',
          emergencyContact: 'Leila Cherif',
          emergencyPhone: '+213 555 9877',
          occupation: 'Commerçant',
          maritalStatus: 'married',
          firstVisit: new Date('2022-03-20'),
          lastVisit: new Date('2024-01-08'),
          totalVisits: 12,
          primaryDoctor: 'Dr. Mohamed Amrani',
          notes: 'Diabète bien contrôlé, suivi trimestriel',
        },
        {
          id: '4',
          name: 'Leila Amrani',
          email: 'leila@email.com',
          phone: '+213 555 2468',
          dateOfBirth: new Date('1995-07-22'),
          gender: 'female',
          address: '12 Rue des Martyrs',
          city: 'Tizi Ouzou',
          postalCode: '15000',
          bloodType: 'O-',
          allergies: [],
          medications: [],
          insuranceNumber: 'ASN-789123456',
          insuranceProvider: 'CASNOS',
          emergencyContact: 'Yacine Amrani',
          emergencyPhone: '+213 555 2469',
          occupation: 'Étudiante',
          maritalStatus: 'single',
          firstVisit: new Date('2024-01-05'),
          lastVisit: new Date('2024-01-05'),
          totalVisits: 1,
          primaryDoctor: 'Dr. Sarah Benali',
        },
      ]
      setPatients(sample)
      localStorage.setItem('clinic-patients', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })))
    } else {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const sample: Appointment[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmed Benali',
          patientPhone: '+213 555 1234',
          date: today,
          time: '10:00',
          duration: 30,
          reason: 'Consultation générale - Suivi hypertension',
          type: 'followup',
          doctor: 'Dr. Mohamed Amrani',
          room: 'Cabinet 1',
          status: 'scheduled',
          reminderSent: true,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Fatima Kadri',
          patientPhone: '+213 555 5678',
          date: tomorrow,
          time: '14:30',
          duration: 20,
          reason: 'Suivi médical - Bilan annuel',
          type: 'checkup',
          doctor: 'Dr. Sarah Benali',
          room: 'Cabinet 2',
          status: 'scheduled',
          reminderSent: false,
          createdAt: new Date('2024-01-18'),
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Omar Cherif',
          patientPhone: '+213 555 9876',
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          time: '09:00',
          duration: 30,
          reason: 'Suivi diabète - Contrôle glycémique',
          type: 'followup',
          doctor: 'Dr. Mohamed Amrani',
          room: 'Cabinet 1',
          status: 'scheduled',
          reminderSent: false,
          createdAt: new Date('2024-01-19'),
        },
        {
          id: '4',
          patientId: '1',
          patientName: 'Ahmed Benali',
          patientPhone: '+213 555 1234',
          date: new Date('2024-01-10'),
          time: '10:30',
          duration: 25,
          reason: 'Consultation - Contrôle tension',
          type: 'consultation',
          doctor: 'Dr. Mohamed Amrani',
          room: 'Cabinet 1',
          status: 'completed',
          notes: 'Tension artérielle stable. Renouvellement prescription Lisinopril.',
          reminderSent: true,
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-10'),
        },
      ]
      setAppointments(sample)
      localStorage.setItem('clinic-appointments', JSON.stringify(sample))
    }

    if (savedRecords) {
      const parsed = JSON.parse(savedRecords)
      setRecords(parsed.map((r: any) => ({
        ...r,
        date: new Date(r.date),
        followUpDate: r.followUpDate ? new Date(r.followUpDate) : undefined,
        labTests: r.labTests ? r.labTests.map((lt: any) => ({
          ...lt,
          date: lt.date ? new Date(lt.date) : undefined,
        })) : undefined,
      })))
    } else {
      const sample: MedicalRecord[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmed Benali',
          date: new Date('2024-01-10'),
          visitType: 'consultation',
          chiefComplaint: 'Contrôle tension artérielle',
          symptoms: [],
          diagnosis: ['Hypertension contrôlée'],
          treatment: ['Continuer traitement actuel'],
          medications: [
            { name: 'Lisinopril', dosage: '10mg', duration: '1 comprimé/jour' },
          ],
          vitalSigns: {
            bloodPressure: '130/85 mmHg',
            temperature: 36.6,
            heartRate: 72,
            weight: 78,
            height: 175,
          },
          doctor: 'Dr. Mohamed Amrani',
          notes: 'Tension artérielle stable. Patient suit bien son traitement. Continuer surveillance mensuelle.',
          followUpDate: new Date('2024-02-10'),
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Fatima Kadri',
          date: new Date('2024-01-15'),
          visitType: 'checkup',
          chiefComplaint: 'Bilan de santé annuel',
          symptoms: [],
          diagnosis: ['État de santé général bon'],
          treatment: ['Aucun traitement nécessaire'],
          medications: [],
          vitalSigns: {
            bloodPressure: '115/75 mmHg',
            temperature: 36.5,
            heartRate: 68,
            weight: 62,
            height: 165,
          },
          labTests: [
            { name: 'Numération formule sanguine', result: 'Normale', date: new Date('2024-01-15') },
            { name: 'Glycémie à jeun', result: '4.8 mmol/L', date: new Date('2024-01-15') },
            { name: 'Cholestérol total', result: '5.2 mmol/L', date: new Date('2024-01-15') },
          ],
          doctor: 'Dr. Sarah Benali',
          notes: 'Bilan complet excellent. Recommandations: activité physique régulière, alimentation équilibrée.',
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Omar Cherif',
          date: new Date('2024-01-08'),
          visitType: 'followup',
          chiefComplaint: 'Suivi diabète',
          symptoms: [],
          diagnosis: ['Diabète Type 2 bien contrôlé'],
          treatment: ['Maintenir régime alimentaire et activité physique'],
          medications: [
            { name: 'Metformine', dosage: '500mg', duration: '2 comprimés/jour' },
          ],
          vitalSigns: {
            bloodPressure: '125/80 mmHg',
            temperature: 36.7,
            heartRate: 75,
            weight: 85,
            height: 180,
          },
          labTests: [
            { name: 'HbA1c', result: '6.8%', date: new Date('2024-01-08') },
            { name: 'Glycémie à jeun', result: '6.2 mmol/L', date: new Date('2024-01-08') },
          ],
          doctor: 'Dr. Mohamed Amrani',
          notes: 'Diabète bien contrôlé. HbA1c dans la cible. Continuer surveillance trimestrielle.',
          followUpDate: new Date('2024-04-08'),
        },
      ]
      setRecords(sample)
      localStorage.setItem('clinic-records', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (patients.length > 0) localStorage.setItem('clinic-patients', JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    if (appointments.length > 0) localStorage.setItem('clinic-appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    if (records.length > 0) localStorage.setItem('clinic-records', JSON.stringify(records))
  }, [records])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'patients' as TabType, label: 'Patients', icon: Users },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'records' as TabType, label: 'Dossiers', icon: FileText },
  ]

  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled')
  const todayAppointments = appointments.filter(a => {
    const today = new Date()
    return a.status === 'scheduled' &&
      a.date.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
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
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Patients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{patients.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">RDV Programmés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{scheduledAppointments.length}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dossiers</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{records.length}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
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
                        <span className="text-gray-500">- {apt.reason}</span>
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
                  <p className="text-sm text-gray-600">Dossiers patients complets avec historique médical</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des rendez-vous</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Dossiers Médicaux</h3>
                  <p className="text-sm text-gray-600">Historique médical et prescriptions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Prescriptions</h3>
                  <p className="text-sm text-gray-600">Gestion des ordonnances et médicaments</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses médicales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Sécurité</h3>
                  <p className="text-sm text-gray-600">Confidentialité et protection des données</p>
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
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
                {patients.map((patient) => {
                  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  return (
                    <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs">
                          {patient.gender === 'male' ? '♂' : '♀'} {age} ans
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">📧 {patient.email}</p>
                        <p className="text-sm text-gray-600">📞 {patient.phone}</p>
                        <p className="text-sm text-gray-600">📍 {patient.address}, {patient.city}</p>
                        {patient.occupation && (
                          <p className="text-sm text-gray-600">💼 {patient.occupation}</p>
                        )}
                        {patient.bloodType && (
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-gray-600">Groupe sanguin: {patient.bloodType}</span>
                          </div>
                        )}
                      </div>

                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1 font-medium">⚠️ Allergies:</p>
                          <div className="flex flex-wrap gap-1">
                            {patient.allergies.map((allergy, i) => (
                              <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                {allergy}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1 font-medium">🏥 Conditions chroniques:</p>
                          <div className="flex flex-wrap gap-1">
                            {patient.chronicConditions.map((condition, i) => (
                              <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {patient.medications && patient.medications.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1 font-medium">💊 Médicaments:</p>
                          <div className="space-y-1">
                            {patient.medications.map((med, i) => (
                              <span key={i} className="block px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Médecin principal:</span>
                          <span className="font-medium text-gray-700">{patient.primaryDoctor || 'Non assigné'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Visites:</span>
                          <span className="font-medium text-emerald-600">{patient.totalVisits}</span>
                        </div>
                        {patient.lastVisit && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Dernière visite:</span>
                            <span className="text-gray-600">{new Date(patient.lastVisit).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {patient.insuranceProvider && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Assurance:</span>
                            <span className="text-gray-600">{patient.insuranceProvider}</span>
                          </div>
                        )}
                        {patient.emergencyContact && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Contact urgence:</p>
                            <p className="text-xs font-medium text-gray-700">{patient.emergencyContact}</p>
                            <p className="text-xs text-gray-600">{patient.emergencyPhone}</p>
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

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rendez-vous</h2>
              <button 
                onClick={() => setShowRdvModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
                  <div key={apt.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{apt.patientName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            apt.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'no_show' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {apt.status === 'completed' ? 'Terminé' :
                             apt.status === 'cancelled' ? 'Annulé' :
                             apt.status === 'in_progress' ? 'En cours' :
                             apt.status === 'no_show' ? 'Absent' : 'Programmé'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {new Date(apt.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {apt.time} ({apt.duration} min)
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>👤 {apt.doctor}</span>
                            {apt.room && <span>🚪 {apt.room}</span>}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs capitalize ${
                              apt.type === 'emergency' ? 'bg-red-100 text-red-800' :
                              apt.type === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                              apt.type === 'checkup' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {apt.type === 'consultation' ? 'Consultation' :
                               apt.type === 'followup' ? 'Suivi' :
                               apt.type === 'emergency' ? 'Urgence' :
                               apt.type === 'vaccination' ? 'Vaccination' : 'Bilan'}
                            </span>
                            {apt.reminderSent && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                ✓ Rappel envoyé
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Motif:</span> {apt.reason}
                          </p>
                          
                          {apt.notes && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs text-blue-800">
                                <span className="font-medium">Notes:</span> {apt.notes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            {apt.createdAt && (
                              <span>Créé le {new Date(apt.createdAt).toLocaleDateString('fr-FR')}</span>
                            )}
                            {apt.updatedAt && (
                              <span>Modifié le {new Date(apt.updatedAt).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dossiers Médicaux</h2>
              <button 
                onClick={() => setShowDossierModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Nouveau Dossier
              </button>
            </div>
            {records.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun dossier médical</p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{record.patientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">👤 {record.doctor}</span>
                          <span className={`px-2 py-1 rounded text-xs capitalize ${
                            record.visitType === 'emergency' ? 'bg-red-100 text-red-800' :
                            record.visitType === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                            record.visitType === 'checkup' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.visitType === 'consultation' ? 'Consultation' :
                             record.visitType === 'followup' ? 'Suivi' :
                             record.visitType === 'emergency' ? 'Urgence' :
                             record.visitType === 'vaccination' ? 'Vaccination' : 'Bilan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-900 mb-1">Motif de consultation</p>
                        <p className="text-sm text-blue-800">{record.chiefComplaint}</p>
                        {record.symptoms && record.symptoms.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-blue-700 mb-1">Symptômes:</p>
                            <div className="flex flex-wrap gap-1">
                              {record.symptoms.map((symptom, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {record.vitalSigns && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-900 mb-2">📊 Signes vitaux</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {record.vitalSigns.bloodPressure && (
                              <div>
                                <p className="text-xs text-gray-500">Tension</p>
                                <p className="text-sm font-medium text-gray-900">{record.vitalSigns.bloodPressure}</p>
                              </div>
                            )}
                            {record.vitalSigns.temperature && (
                              <div>
                                <p className="text-xs text-gray-500">Température</p>
                                <p className="text-sm font-medium text-gray-900">{record.vitalSigns.temperature}°C</p>
                              </div>
                            )}
                            {record.vitalSigns.heartRate && (
                              <div>
                                <p className="text-xs text-gray-500">Rythme cardiaque</p>
                                <p className="text-sm font-medium text-gray-900">{record.vitalSigns.heartRate} bpm</p>
                              </div>
                            )}
                            {record.vitalSigns.weight && record.vitalSigns.height && (
                              <div>
                                <p className="text-xs text-gray-500">Poids / Taille</p>
                                <p className="text-sm font-medium text-gray-900">{record.vitalSigns.weight}kg / {record.vitalSigns.height}cm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium text-gray-900 mb-1">🏥 Diagnostic</p>
                        <div className="flex flex-wrap gap-1">
                          {record.diagnosis.map((diag, i) => (
                            <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              {diag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-900 mb-1">💉 Traitement</p>
                        <div className="flex flex-wrap gap-1">
                          {record.treatment.map((treat, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {treat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {record.medications && record.medications.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-yellow-900 mb-2">💊 Prescriptions</p>
                          <div className="space-y-1">
                            {record.medications.map((med, i) => (
                              <div key={i} className="bg-white rounded p-2">
                                <p className="text-sm font-medium text-gray-900">{med.name}</p>
                                <p className="text-xs text-gray-600">Dosage: {med.dosage} • Durée: {med.duration}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.labTests && record.labTests.length > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-purple-900 mb-2">🧪 Tests de laboratoire</p>
                          <div className="space-y-2">
                            {record.labTests.map((test, i) => (
                              <div key={i} className="bg-white rounded p-2">
                                <p className="text-sm font-medium text-gray-900">{test.name}</p>
                                {test.result && (
                                  <p className="text-xs text-gray-600">Résultat: <span className="font-medium">{test.result}</span></p>
                                )}
                                {test.date && (
                                  <p className="text-xs text-gray-500">Date: {new Date(test.date).toLocaleDateString('fr-FR')}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.notes && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-900 mb-1">📝 Notes médicales</p>
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </div>
                      )}

                      {record.followUpDate && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-blue-900">🔄 Rendez-vous de suivi</p>
                          <p className="text-sm text-blue-800 mt-1">
                            {new Date(record.followUpDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      )}
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
          setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', gender: 'male', address: '', city: '' })
        }}
        title="Nouveau Patient"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={newPatient.dateOfBirth}
                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newPatient.address}
              onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: 123 Rue Didouche Mourad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              value={newPatient.city}
              onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Alger"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPatientModal(false)
                setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', gender: 'male', address: '', city: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newPatient.name && newPatient.email && newPatient.phone && newPatient.dateOfBirth && newPatient.address && newPatient.city) {
                  const patient: Patient = {
                    id: Date.now().toString(),
                    name: newPatient.name,
                    email: newPatient.email,
                    phone: newPatient.phone,
                    dateOfBirth: new Date(newPatient.dateOfBirth),
                    gender: newPatient.gender,
                    address: newPatient.address,
                    city: newPatient.city,
                    firstVisit: new Date(),
                    totalVisits: 0,
                  }
                  setPatients([...patients, patient])
                  setShowPatientModal(false)
                  setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', gender: 'male', address: '', city: '' })
                }
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
          setNewRdv({ patientId: '', date: '', time: '', reason: '', type: 'consultation', doctor: '' })
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newRdv.time}
                onChange={(e) => setNewRdv({ ...newRdv, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newRdv.type}
                onChange={(e) => setNewRdv({ ...newRdv, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="consultation">Consultation</option>
                <option value="followup">Suivi</option>
                <option value="emergency">Urgence</option>
                <option value="vaccination">Vaccination</option>
                <option value="checkup">Bilan de santé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
              <input
                type="text"
                value={newRdv.doctor}
                onChange={(e) => setNewRdv({ ...newRdv, doctor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: Dr. Benali"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
            <textarea
              value={newRdv.reason}
              onChange={(e) => setNewRdv({ ...newRdv, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={3}
              placeholder="Raison de la consultation"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowRdvModal(false)
                setNewRdv({ patientId: '', date: '', time: '', reason: '', type: 'consultation', doctor: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newRdv.patientId && newRdv.date && newRdv.time && newRdv.reason && newRdv.doctor) {
                  const patient = patients.find(p => p.id === newRdv.patientId)
                  if (patient) {
                    const appointment: Appointment = {
                      id: Date.now().toString(),
                      patientId: newRdv.patientId,
                      patientName: patient.name,
                      patientPhone: patient.phone,
                      date: new Date(newRdv.date),
                      time: newRdv.time,
                      duration: 30,
                      reason: newRdv.reason,
                      type: newRdv.type,
                      doctor: newRdv.doctor,
                      status: 'scheduled',
                      createdAt: new Date(),
                    }
                    setAppointments([...appointments, appointment])
                    setShowRdvModal(false)
                    setNewRdv({ patientId: '', date: '', time: '', reason: '', type: 'consultation', doctor: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDossierModal}
        onClose={() => {
          setShowDossierModal(false)
          setNewDossier({ patientId: '', date: '', chiefComplaint: '', symptoms: '', diagnosis: '', treatment: '' })
        }}
        title="Nouveau Dossier"
        size="lg"
      >
        <div className="space-y-4">
          {patients.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={newDossier.patientId}
                onChange={(e) => setNewDossier({ ...newDossier, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>{patient.name} - {patient.phone}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newDossier.date}
              onChange={(e) => setNewDossier({ ...newDossier, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif de consultation</label>
            <input
              type="text"
              value={newDossier.chiefComplaint}
              onChange={(e) => setNewDossier({ ...newDossier, chiefComplaint: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Douleur abdominale"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptômes (séparés par des virgules)</label>
            <input
              type="text"
              value={newDossier.symptoms}
              onChange={(e) => setNewDossier({ ...newDossier, symptoms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Fièvre, Nausée, Fatigue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic (séparés par des virgules)</label>
            <input
              type="text"
              value={newDossier.diagnosis}
              onChange={(e) => setNewDossier({ ...newDossier, diagnosis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Infection urinaire"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Traitement (séparés par des virgules)</label>
            <input
              type="text"
              value={newDossier.treatment}
              onChange={(e) => setNewDossier({ ...newDossier, treatment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ex: Antibiotiques, Repos"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDossierModal(false)
                setNewDossier({ patientId: '', date: '', chiefComplaint: '', symptoms: '', diagnosis: '', treatment: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDossier.patientId && newDossier.date && newDossier.chiefComplaint) {
                  const patient = patients.find(p => p.id === newDossier.patientId)
                  if (patient) {
                    const record: MedicalRecord = {
                      id: Date.now().toString(),
                      patientId: newDossier.patientId,
                      patientName: patient.name,
                      date: new Date(newDossier.date),
                      visitType: 'consultation',
                      chiefComplaint: newDossier.chiefComplaint,
                      symptoms: newDossier.symptoms.split(',').map(s => s.trim()).filter(s => s),
                      diagnosis: newDossier.diagnosis.split(',').map(d => d.trim()).filter(d => d),
                      treatment: newDossier.treatment.split(',').map(t => t.trim()).filter(t => t),
                      medications: [],
                    }
                    setRecords([...records, record])
                    setShowDossierModal(false)
                    setNewDossier({ patientId: '', date: '', chiefComplaint: '', symptoms: '', diagnosis: '', treatment: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}