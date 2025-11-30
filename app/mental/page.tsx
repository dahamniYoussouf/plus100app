'use client'

import { useState, useEffect } from 'react'
import { Heart, Users, Calendar, FileText, BarChart3, Clock, Brain, Lock } from 'lucide-react'

type TabType = 'dashboard' | 'patients' | 'sessions' | 'notes' | 'treatment'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  reason: string
  firstSession: Date
  lastSession?: Date
  totalSessions: number
  status: 'active' | 'completed' | 'on_hold'
  emergencyContact?: string
  emergencyPhone?: string
  notes?: string
}

interface Session {
  id: string
  patientId: string
  patientName: string
  date: Date
  time: string
  duration: number
  type: 'initial' | 'regular' | 'crisis' | 'followup'
  topics: string[]
  mood?: number
  progress?: string
  therapist: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

interface Note {
  id: string
  patientId: string
  patientName: string
  date: Date
  type: 'session' | 'observation' | 'treatment' | 'assessment'
  content: string
  therapist: string
  confidential: boolean
}

interface Treatment {
  id: string
  patientId: string
  patientName: string
  name: string
  description: string
  startDate: Date
  endDate?: Date
  status: 'active' | 'completed' | 'paused'
  goals: string[]
  progress?: string
}

export default function MentalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [patients, setPatients] = useState<Patient[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem('mental-patients')
    const savedSessions = localStorage.getItem('mental-sessions')
    const savedNotes = localStorage.getItem('mental-notes')
    const savedTreatments = localStorage.getItem('mental-treatments')

    if (savedPatients) {
      const parsed = JSON.parse(savedPatients)
      setPatients(parsed.map((p: any) => ({
        ...p,
        dateOfBirth: new Date(p.dateOfBirth),
        firstSession: new Date(p.firstSession),
        lastSession: p.lastSession ? new Date(p.lastSession) : undefined,
      })))
    } else {
      const sample: Patient[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          dateOfBirth: new Date('1990-05-15'),
          reason: 'Anxiété et stress professionnel',
          firstSession: new Date('2023-11-01'),
          lastSession: new Date('2024-01-20'),
          totalSessions: 10,
          status: 'active',
          emergencyContact: 'Fatima Benali',
          emergencyPhone: '+213 555 1235',
          notes: 'Progrès significatifs, continuer thérapie cognitive',
        },
        {
          id: '2',
          name: 'Leila Amrani',
          email: 'leila@email.com',
          phone: '+213 555 5678',
          dateOfBirth: new Date('1995-07-22'),
          reason: 'Dépression légère',
          firstSession: new Date('2024-01-10'),
          lastSession: new Date('2024-01-18'),
          totalSessions: 3,
          status: 'active',
        },
      ]
      setPatients(sample)
      localStorage.setItem('mental-patients', JSON.stringify(sample))
    }

    if (savedSessions) {
      const parsed = JSON.parse(savedSessions)
      setSessions(parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date),
      })))
    } else {
      const today = new Date()
      const sample: Session[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmed Benali',
          date: today,
          time: '14:00',
          duration: 50,
          type: 'regular',
          topics: ['Gestion du stress', 'Techniques de relaxation'],
          mood: 6,
          progress: 'Amélioration continue de la gestion du stress',
          therapist: 'Dr. Sarah Benali',
          status: 'scheduled',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Leila Amrani',
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          time: '16:00',
          duration: 50,
          type: 'regular',
          topics: ['Thérapie cognitive', 'Estime de soi'],
          therapist: 'Dr. Mohamed Amrani',
          status: 'scheduled',
        },
      ]
      setSessions(sample)
      localStorage.setItem('mental-sessions', JSON.stringify(sample))
    }

    if (savedNotes) {
      const parsed = JSON.parse(savedNotes)
      setNotes(parsed.map((n: any) => ({
        ...n,
        date: new Date(n.date),
      })))
    }

    if (savedTreatments) {
      const parsed = JSON.parse(savedTreatments)
      setTreatments(parsed.map((t: any) => ({
        ...t,
        startDate: new Date(t.startDate),
        endDate: t.endDate ? new Date(t.endDate) : undefined,
      })))
    } else {
      const sample: Treatment[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Ahmed Benali',
          name: 'Thérapie Cognitive Comportementale',
          description: 'TCC pour gestion de l\'anxiété et du stress',
          startDate: new Date('2023-11-01'),
          status: 'active',
          goals: [
            'Réduire les symptômes d\'anxiété',
            'Améliorer les stratégies d\'adaptation',
            'Développer la confiance en soi',
          ],
          progress: 'Progrès significatifs, patient applique les techniques apprises',
        },
      ]
      setTreatments(sample)
      localStorage.setItem('mental-treatments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (patients.length > 0) localStorage.setItem('mental-patients', JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('mental-sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (notes.length > 0) localStorage.setItem('mental-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (treatments.length > 0) localStorage.setItem('mental-treatments', JSON.stringify(treatments))
  }, [treatments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'patients' as TabType, label: 'Patients', icon: Users },
    { id: 'sessions' as TabType, label: 'Séances', icon: Calendar },
    { id: 'notes' as TabType, label: 'Notes', icon: FileText },
    { id: 'treatment' as TabType, label: 'Traitements', icon: Brain },
  ]

  const activePatients = patients.filter(p => p.status === 'active').length
  const todaySessions = sessions.filter(s => {
    const today = new Date()
    return s.status === 'scheduled' && s.date.toDateString() === today.toDateString()
  })
  const totalSessions = sessions.filter(s => s.status === 'completed').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Patients Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activePatients}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Séances Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todaySessions.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Séances Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalSessions}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Traitements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{treatments.length}</p>
                  </div>
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
            </div>

            {todaySessions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Séances d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todaySessions.map((session) => (
                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{session.patientName}</span>
                        <span className="text-gray-500 ml-2">- {session.type === 'regular' ? 'Séance régulière' : 'Évaluation'}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{session.time}</span>
                        <span className="text-gray-500">({session.duration} min)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Confidentialité</h3>
              </div>
              <p className="text-sm text-purple-800">
                Toutes les informations sont strictement confidentielles et protégées selon les normes de déontologie professionnelle.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Patients</h3>
                  <p className="text-sm text-gray-600">Dossiers patients avec historique complet</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Séances</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des séances thérapeutiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes Confidentielles</h3>
                  <p className="text-sm text-gray-600">Système sécurisé de prise de notes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Plans de Traitement</h3>
                  <p className="text-sm text-gray-600">Création et suivi de plans thérapeutiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Progrès</h3>
                  <p className="text-sm text-gray-600">Évaluation et suivi de la progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Patients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                    <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' :
                          patient.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.status === 'active' ? 'Actif' :
                           patient.status === 'completed' ? 'Terminé' : 'En pause'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">📧 {patient.email}</p>
                        <p className="text-sm text-gray-600">📞 {patient.phone}</p>
                        <p className="text-sm text-gray-600">🎂 {age} ans</p>
                        <div className="bg-purple-50 border border-purple-200 rounded p-2">
                          <p className="text-xs font-medium text-purple-900">Motif de consultation:</p>
                          <p className="text-sm text-purple-800">{patient.reason}</p>
                        </div>
                        {patient.emergencyContact && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-xs font-medium text-red-900">Contact urgence:</p>
                            <p className="text-xs text-red-800">{patient.emergencyContact} - {patient.emergencyPhone}</p>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Séances:</span>
                          <span className="font-medium text-purple-600">{patient.totalSessions}</span>
                        </div>
                        {patient.lastSession && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Dernière séance:</span>
                            <span className="text-gray-600">{new Date(patient.lastSession).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {patient.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Notes:</p>
                            <p className="text-xs text-gray-700">{patient.notes}</p>
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

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Séances</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle Séance
              </button>
            </div>
            {sessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune séance programmée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{session.patientName}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'completed' ? 'bg-green-100 text-green-800' :
                            session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {session.status === 'completed' ? 'Terminée' :
                             session.status === 'cancelled' ? 'Annulée' : 'Programmée'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-4">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(session.date).toLocaleDateString('fr-FR')} à {session.time}
                            </span>
                            <span className="text-gray-500">({session.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">👤 {session.therapist}</span>
                            <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                              session.type === 'regular' ? 'bg-blue-100 text-blue-800' :
                              session.type === 'initial' ? 'bg-purple-100 text-purple-800' :
                              session.type === 'crisis' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.type === 'regular' ? 'Régulière' :
                               session.type === 'initial' ? 'Initiale' :
                               session.type === 'crisis' ? 'Crise' : 'Suivi'}
                            </span>
                          </div>
                          {session.topics && session.topics.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Sujets abordés:</p>
                              <div className="flex flex-wrap gap-1">
                                {session.topics.map((topic, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {session.mood !== undefined && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-purple-500" />
                              <span className="text-sm text-gray-600">Humeur: {session.mood}/10</span>
                            </div>
                          )}
                          {session.progress && (
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                              <p className="text-xs text-green-800">{session.progress}</p>
                            </div>
                          )}
                          {session.notes && (
                            <div className="bg-gray-50 border border-gray-200 rounded p-2">
                              <p className="text-xs text-gray-700">{session.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notes Confidentielles</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle Note
              </button>
            </div>
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune note enregistrée</p>
                <p className="text-sm text-gray-500 mt-2">Les notes sont strictement confidentielles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{note.patientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(note.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.confidential && (
                          <Lock className="w-4 h-4 text-purple-600" />
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          note.type === 'session' ? 'bg-blue-100 text-blue-800' :
                          note.type === 'observation' ? 'bg-yellow-100 text-yellow-800' :
                          note.type === 'treatment' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {note.type === 'session' ? 'Séance' :
                           note.type === 'observation' ? 'Observation' :
                           note.type === 'treatment' ? 'Traitement' : 'Évaluation'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Par {note.therapist}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Plans de Traitement</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau Plan
              </button>
            </div>
            {treatments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun plan de traitement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{treatment.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Patient: {treatment.patientName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Début: {new Date(treatment.startDate).toLocaleDateString('fr-FR')}
                          {treatment.endDate && ` - Fin: ${new Date(treatment.endDate).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        treatment.status === 'active' ? 'bg-green-100 text-green-800' :
                        treatment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {treatment.status === 'active' ? 'Actif' :
                         treatment.status === 'completed' ? 'Terminé' : 'En pause'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{treatment.description}</p>
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-900 mb-2">Objectifs:</p>
                      <ul className="space-y-1">
                        {treatment.goals.map((goal, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {treatment.progress && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-xs font-medium text-green-900 mb-1">Progrès:</p>
                        <p className="text-sm text-green-800">{treatment.progress}</p>
                      </div>
                    )}
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
