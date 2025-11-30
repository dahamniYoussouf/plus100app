'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, Calendar, FileText, BarChart3, Clock, Target, Heart } from 'lucide-react'

type TabType = 'dashboard' | 'patients' | 'sessions' | 'exercises' | 'progress'

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  condition: string
  injuryDate?: Date
  treatmentStart: Date
  lastSession?: Date
  totalSessions: number
  status: 'active' | 'completed' | 'on_hold'
  notes?: string
}

interface Session {
  id: string
  patientId: string
  patientName: string
  date: Date
  time: string
  duration: number
  type: 'assessment' | 'treatment' | 'followup' | 'exercise'
  exercises: string[]
  painLevel?: number
  progress?: string
  therapist: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

interface Exercise {
  id: string
  name: string
  description: string
  category: 'strength' | 'flexibility' | 'balance' | 'cardio' | 'rehabilitation'
  duration: number
  sets?: number
  reps?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructions: string[]
}

interface Progress {
  id: string
  patientId: string
  patientName: string
  date: Date
  measurements?: {
    rangeOfMotion?: number
    strength?: number
    painLevel?: number
    flexibility?: number
  }
  notes?: string
}

export default function PhysioPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [patients, setPatients] = useState<Patient[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [progress, setProgress] = useState<Progress[]>([])

  useEffect(() => {
    const savedPatients = localStorage.getItem('physio-patients')
    const savedSessions = localStorage.getItem('physio-sessions')
    const savedExercises = localStorage.getItem('physio-exercises')
    const savedProgress = localStorage.getItem('physio-progress')

    if (savedPatients) {
      const parsed = JSON.parse(savedPatients)
      setPatients(parsed.map((p: any) => ({
        ...p,
        dateOfBirth: new Date(p.dateOfBirth),
        injuryDate: p.injuryDate ? new Date(p.injuryDate) : undefined,
        treatmentStart: new Date(p.treatmentStart),
        lastSession: p.lastSession ? new Date(p.lastSession) : undefined,
      })))
    } else {
      const sample: Patient[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          dateOfBirth: new Date('1985-05-15'),
          condition: 'Douleur lombaire chronique',
          injuryDate: new Date('2023-10-01'),
          treatmentStart: new Date('2023-11-01'),
          lastSession: new Date('2024-01-20'),
          totalSessions: 12,
          status: 'active',
          notes: 'Amélioration significative, continuer exercices de renforcement',
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          dateOfBirth: new Date('1990-03-20'),
          condition: 'Tendinite épaule droite',
          injuryDate: new Date('2024-01-05'),
          treatmentStart: new Date('2024-01-10'),
          lastSession: new Date('2024-01-18'),
          totalSessions: 4,
          status: 'active',
        },
      ]
      setPatients(sample)
      localStorage.setItem('physio-patients', JSON.stringify(sample))
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
          time: '10:00',
          duration: 45,
          type: 'treatment',
          exercises: ['Renforcement lombaires', 'Étirements', 'Marche thérapeutique'],
          painLevel: 3,
          progress: 'Amélioration continue',
          therapist: 'Dr. Omar Cherif',
          status: 'scheduled',
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Fatima Kadri',
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          time: '14:30',
          duration: 30,
          type: 'treatment',
          exercises: ['Mobilisation épaule', 'Renforcement', 'Étirements'],
          therapist: 'Dr. Sarah Benali',
          status: 'scheduled',
        },
      ]
      setSessions(sample)
      localStorage.setItem('physio-sessions', JSON.stringify(sample))
    }

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    } else {
      const sample: Exercise[] = [
        {
          id: '1',
          name: 'Renforcement Lombaires',
          description: 'Exercices de renforcement des muscles lombaires',
          category: 'strength',
          duration: 15,
          sets: 3,
          reps: 10,
          difficulty: 'intermediate',
          instructions: [
            'Allongé sur le dos, genoux fléchis',
            'Soulever le bassin en contractant les fessiers',
            'Maintenir 5 secondes',
            'Répéter selon le nombre de séries',
          ],
        },
        {
          id: '2',
          name: 'Étirements Épaule',
          description: 'Étirements pour améliorer la mobilité de l\'épaule',
          category: 'flexibility',
          duration: 10,
          sets: 2,
          reps: 5,
          difficulty: 'beginner',
          instructions: [
            'Debout, bras le long du corps',
            'Lever le bras lentement',
            'Maintenir l\'étirement 30 secondes',
            'Répéter de l\'autre côté',
          ],
        },
      ]
      setExercises(sample)
      localStorage.setItem('physio-exercises', JSON.stringify(sample))
    }

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setProgress(parsed.map((p: any) => ({
        ...p,
        date: new Date(p.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (patients.length > 0) localStorage.setItem('physio-patients', JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('physio-sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    if (exercises.length > 0) localStorage.setItem('physio-exercises', JSON.stringify(exercises))
  }, [exercises])

  useEffect(() => {
    if (progress.length > 0) localStorage.setItem('physio-progress', JSON.stringify(progress))
  }, [progress])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'patients' as TabType, label: 'Patients', icon: Users },
    { id: 'sessions' as TabType, label: 'Séances', icon: Calendar },
    { id: 'exercises' as TabType, label: 'Exercices', icon: Activity },
    { id: 'progress' as TabType, label: 'Progrès', icon: Target },
  ]

  const activePatients = patients.filter(p => p.status === 'active').length
  const todaySessions = sessions.filter(s => {
    const today = new Date()
    return s.status === 'scheduled' && s.date.toDateString() === today.toDateString()
  })
  const totalSessions = sessions.filter(s => s.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
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
                      ? 'text-teal-600 border-b-2 border-teal-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Patients Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activePatients}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Séances Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todaySessions.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Séances Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalSessions}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Exercices</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{exercises.length}</p>
                  </div>
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
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
                        <span className="text-gray-500 ml-2">- {session.type === 'treatment' ? 'Traitement' : 'Évaluation'}</span>
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

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Patients</h3>
                  <p className="text-sm text-gray-600">Dossiers patients avec historique médical</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Séances</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des séances de traitement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Exercices</h3>
                  <p className="text-sm text-gray-600">Bibliothèque d'exercices thérapeutiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Progrès</h3>
                  <p className="text-sm text-gray-600">Mesures et évaluations de progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Plans de Traitement</h3>
                  <p className="text-sm text-gray-600">Création de plans personnalisés</p>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
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
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-xs font-medium text-red-900">Condition:</p>
                          <p className="text-sm text-red-800">{patient.condition}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Séances:</span>
                          <span className="font-medium text-teal-600">{patient.totalSessions}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
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
                              session.type === 'treatment' ? 'bg-blue-100 text-blue-800' :
                              session.type === 'assessment' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.type === 'treatment' ? 'Traitement' :
                               session.type === 'assessment' ? 'Évaluation' :
                               session.type === 'followup' ? 'Suivi' : 'Exercice'}
                            </span>
                          </div>
                          {session.exercises && session.exercises.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Exercices prévus:</p>
                              <div className="flex flex-wrap gap-1">
                                {session.exercises.map((ex, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded text-xs">
                                    {ex}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {session.painLevel !== undefined && (
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-gray-600">Niveau de douleur: {session.painLevel}/10</span>
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

        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Exercices</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouvel Exercice
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{exercise.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Instructions:</p>
                    <ol className="space-y-1 list-decimal list-inside">
                      {exercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-xs text-gray-600">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">Durée: {exercise.duration} min</span>
                      {exercise.sets && <span className="text-gray-500">{exercise.sets} séries</span>}
                      {exercise.reps && <span className="text-gray-500">{exercise.reps} répétitions</span>}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {exercise.difficulty === 'beginner' ? 'Débutant' :
                       exercise.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Suivi des Progrès</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouvelle Évaluation
              </button>
            </div>
            {progress.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun suivi enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.map((record) => (
                  <div key={record.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{record.patientName}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      📅 {new Date(record.date).toLocaleDateString('fr-FR')}
                    </p>
                    {record.measurements && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {record.measurements.rangeOfMotion !== undefined && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-gray-500">Amplitude</p>
                            <p className="text-sm font-bold text-gray-900">{record.measurements.rangeOfMotion}°</p>
                          </div>
                        )}
                        {record.measurements.strength !== undefined && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-gray-500">Force</p>
                            <p className="text-sm font-bold text-gray-900">{record.measurements.strength}/10</p>
                          </div>
                        )}
                        {record.measurements.painLevel !== undefined && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-gray-500">Douleur</p>
                            <p className="text-sm font-bold text-gray-900">{record.measurements.painLevel}/10</p>
                          </div>
                        )}
                        {record.measurements.flexibility !== undefined && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs text-gray-500">Flexibilité</p>
                            <p className="text-sm font-bold text-gray-900">{record.measurements.flexibility}%</p>
                          </div>
                        )}
                      </div>
                    )}
                    {record.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{record.notes}</p>
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
