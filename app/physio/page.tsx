'use client'

import { useState, useEffect, useMemo } from 'react'
import { Activity, Users, Calendar, FileText, BarChart3, Clock, Target, Heart, Edit2, Trash2, Search, Plus, X } from 'lucide-react'
import Modal from '@/components/Modal'

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
  
  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [editingProgress, setEditingProgress] = useState<Progress | null>(null)
  
  // Form states
  const [newPatient, setNewPatient] = useState({ name: '', email: '', phone: '', dateOfBirth: '', condition: '', injuryDate: '', treatmentStart: '', status: 'active' as Patient['status'], notes: '' })
  const [newSession, setNewSession] = useState({ patientId: '', date: '', time: '', duration: 45, type: 'treatment' as Session['type'], exercises: [] as string[], painLevel: 0, progress: '', therapist: '', notes: '' })
  const [newExercise, setNewExercise] = useState({ name: '', description: '', category: 'strength' as Exercise['category'], duration: 15, sets: 3, reps: 10, difficulty: 'beginner' as Exercise['difficulty'], instructions: [] as string[] })
  const [newInstruction, setNewInstruction] = useState('')
  const [newProgress, setNewProgress] = useState({ patientId: '', date: '', rangeOfMotion: 0, strength: 0, painLevel: 0, flexibility: 0, notes: '' })
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

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

  const activePatients = useMemo(() => patients.filter(p => p.status === 'active').length, [patients])
  const todaySessions = useMemo(() => sessions.filter(s => {
    const today = new Date()
    return s.status === 'scheduled' && s.date.toDateString() === today.toDateString()
  }), [sessions])
  const totalSessions = useMemo(() => sessions.filter(s => s.status === 'completed').length, [sessions])

  const filteredPatients = useMemo(() => {
    let filtered = patients
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [patients, searchQuery])

  const filteredSessions = useMemo(() => {
    let filtered = sessions
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.therapist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [sessions, searchQuery])

  const filteredExercises = useMemo(() => {
    let filtered = exercises
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [exercises, searchQuery])

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.email && newPatient.phone && newPatient.condition && newPatient.treatmentStart) {
      const patient: Patient = {
        id: editingPatient?.id || Date.now().toString(),
        name: newPatient.name,
        email: newPatient.email,
        phone: newPatient.phone,
        dateOfBirth: new Date(newPatient.dateOfBirth),
        condition: newPatient.condition,
        injuryDate: newPatient.injuryDate ? new Date(newPatient.injuryDate) : undefined,
        treatmentStart: new Date(newPatient.treatmentStart),
        lastSession: editingPatient?.lastSession,
        totalSessions: editingPatient?.totalSessions || 0,
        status: newPatient.status,
        notes: newPatient.notes || undefined,
      }
      if (editingPatient) {
        setPatients(patients.map(p => p.id === editingPatient.id ? patient : p))
      } else {
        setPatients([...patients, patient])
      }
      setShowPatientModal(false)
      setEditingPatient(null)
      setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', condition: '', injuryDate: '', treatmentStart: '', status: 'active', notes: '' })
    }
  }

  const handleAddSession = () => {
    if (newSession.patientId && newSession.date && newSession.time && newSession.therapist) {
      const patient = patients.find(p => p.id === newSession.patientId)
      if (!patient) return
      
      const session: Session = {
        id: editingSession?.id || Date.now().toString(),
        patientId: newSession.patientId,
        patientName: patient.name,
        date: new Date(newSession.date),
        time: newSession.time,
        duration: newSession.duration,
        type: newSession.type,
        exercises: newSession.exercises,
        painLevel: newSession.painLevel > 0 ? newSession.painLevel : undefined,
        progress: newSession.progress || undefined,
        therapist: newSession.therapist,
        status: 'scheduled',
        notes: newSession.notes || undefined,
      }
      if (editingSession) {
        setSessions(sessions.map(s => s.id === editingSession.id ? session : s))
      } else {
        setSessions([...sessions, session])
        setPatients(patients.map(p => 
          p.id === patient.id 
            ? { ...p, lastSession: new Date(newSession.date), totalSessions: p.totalSessions + 1 }
            : p
        ))
      }
      setShowSessionModal(false)
      setEditingSession(null)
      setNewSession({ patientId: '', date: '', time: '', duration: 45, type: 'treatment', exercises: [], painLevel: 0, progress: '', therapist: '', notes: '' })
    }
  }

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.description && newExercise.instructions.length > 0) {
      const exercise: Exercise = {
        id: editingExercise?.id || Date.now().toString(),
        ...newExercise,
      }
      if (editingExercise) {
        setExercises(exercises.map(e => e.id === editingExercise.id ? exercise : e))
      } else {
        setExercises([...exercises, exercise])
      }
      setShowExerciseModal(false)
      setEditingExercise(null)
      setNewExercise({ name: '', description: '', category: 'strength', duration: 15, sets: 3, reps: 10, difficulty: 'beginner', instructions: [] })
      setNewInstruction('')
    }
  }

  const handleAddProgress = () => {
    if (newProgress.patientId && newProgress.date) {
      const patient = patients.find(p => p.id === newProgress.patientId)
      if (!patient) return
      
      const progressRecord: Progress = {
        id: editingProgress?.id || Date.now().toString(),
        patientId: newProgress.patientId,
        patientName: patient.name,
        date: new Date(newProgress.date),
        measurements: {
          rangeOfMotion: newProgress.rangeOfMotion > 0 ? newProgress.rangeOfMotion : undefined,
          strength: newProgress.strength > 0 ? newProgress.strength : undefined,
          painLevel: newProgress.painLevel > 0 ? newProgress.painLevel : undefined,
          flexibility: newProgress.flexibility > 0 ? newProgress.flexibility : undefined,
        },
        notes: newProgress.notes || undefined,
      }
      if (editingProgress) {
        setProgress(progress.map(p => p.id === editingProgress.id ? progressRecord : p))
      } else {
        setProgress([...progress, progressRecord])
      }
      setShowProgressModal(false)
      setEditingProgress(null)
      setNewProgress({ patientId: '', date: '', rangeOfMotion: 0, strength: 0, painLevel: 0, flexibility: 0, notes: '' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'patient') {
      setPatients(patients.filter(p => p.id !== id))
    } else if (type === 'session') {
      setSessions(sessions.filter(s => s.id !== id))
    } else if (type === 'exercise') {
      setExercises(exercises.filter(e => e.id !== id))
    } else if (type === 'progress') {
      setProgress(progress.filter(p => p.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setNewPatient({ 
      ...patient, 
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
      injuryDate: patient.injuryDate ? patient.injuryDate.toISOString().split('T')[0] : '',
      treatmentStart: patient.treatmentStart.toISOString().split('T')[0],
      notes: patient.notes || ''
    })
    setShowPatientModal(true)
  }

  const openEditSession = (session: Session) => {
    setEditingSession(session)
    setNewSession({ 
      ...session, 
      date: session.date.toISOString().split('T')[0],
      painLevel: session.painLevel || 0,
      progress: session.progress || '',
      notes: session.notes || ''
    })
    setShowSessionModal(true)
  }

  const openEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setNewExercise({ 
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      duration: exercise.duration,
      sets: exercise.sets || 0,
      reps: exercise.reps || 0,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions
    })
    setNewInstruction('')
    setShowExerciseModal(true)
  }

  const openEditProgress = (progressRecord: Progress) => {
    setEditingProgress(progressRecord)
    setNewProgress({ 
      rangeOfMotion: progressRecord.measurements?.rangeOfMotion ?? 0,
      strength: progressRecord.measurements?.strength ?? 0,
      painLevel: progressRecord.measurements?.painLevel ?? 0,
      flexibility: progressRecord.measurements?.flexibility ?? 0,
      patientId: progressRecord.patientId,
      date: progressRecord.date.toISOString().split('T')[0],
      notes: progressRecord.notes || ''
    })
    setShowProgressModal(true)
  }

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
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Patients</h2>
              <button 
                onClick={() => {
                  setEditingPatient(null)
                  setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', condition: '', injuryDate: '', treatmentStart: '', status: 'active', notes: '' })
                  setShowPatientModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Patient
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun patient trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPatients.map((patient) => {
                  const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  return (
                    <div key={patient.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg flex-1">{patient.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditPatient(patient)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'patient', id: patient.id })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' :
                        patient.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.status === 'active' ? 'Actif' :
                         patient.status === 'completed' ? 'Terminé' : 'En pause'}
                      </span>
                      <div className="space-y-2 mb-4 mt-3">
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
              <button 
                onClick={() => {
                  setEditingSession(null)
                  setNewSession({ patientId: '', date: '', time: '', duration: 45, type: 'treatment', exercises: [], painLevel: 0, progress: '', therapist: '', notes: '' })
                  setShowSessionModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Séance
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une séance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {filteredSessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune séance trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{session.patientName}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditSession(session)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'session', id: session.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {session.status === 'completed' ? 'Terminée' :
                           session.status === 'cancelled' ? 'Annulée' : 'Programmée'}
                        </span>
                        <div className="space-y-2 text-sm mt-3">
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
              <button 
                onClick={() => {
                  setEditingExercise(null)
                  setNewExercise({ name: '', description: '', category: 'strength', duration: 15, sets: 3, reps: 10, difficulty: 'beginner', instructions: [] })
                  setNewInstruction('')
                  setShowExerciseModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvel Exercice
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {filteredExercises.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun exercice trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg flex-1">{exercise.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditExercise(exercise)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'exercise', id: exercise.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Suivi des Progrès</h2>
              <button 
                onClick={() => {
                  setEditingProgress(null)
                  setNewProgress({ patientId: '', date: '', rangeOfMotion: 0, strength: 0, painLevel: 0, flexibility: 0, notes: '' })
                  setShowProgressModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
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
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{record.patientName}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          📅 {new Date(record.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditProgress(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'progress', id: record.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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

      {/* Patient Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => {
          setShowPatientModal(false)
          setEditingPatient(null)
          setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', condition: '', injuryDate: '', treatmentStart: '', status: 'active', notes: '' })
        }}
        title={editingPatient ? 'Modifier le patient' : 'Nouveau patient'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
              <input
                type="date"
                value={newPatient.dateOfBirth}
                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début traitement *</label>
              <input
                type="date"
                value={newPatient.treatmentStart}
                onChange={(e) => setNewPatient({ ...newPatient, treatmentStart: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
            <input
              type="text"
              value={newPatient.condition}
              onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Douleur lombaire chronique"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de blessure (optionnel)</label>
            <input
              type="date"
              value={newPatient.injuryDate}
              onChange={(e) => setNewPatient({ ...newPatient, injuryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={newPatient.status}
              onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value as Patient['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="on_hold">En pause</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newPatient.notes}
              onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowPatientModal(false)
                setEditingPatient(null)
                setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '', condition: '', injuryDate: '', treatmentStart: '', status: 'active', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddPatient}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {editingPatient ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Session Modal */}
      <Modal
        isOpen={showSessionModal}
        onClose={() => {
          setShowSessionModal(false)
          setEditingSession(null)
          setNewSession({ patientId: '', date: '', time: '', duration: 45, type: 'treatment', exercises: [], painLevel: 0, progress: '', therapist: '', notes: '' })
        }}
        title={editingSession ? 'Modifier la séance' : 'Nouvelle séance'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
            <select
              value={newSession.patientId}
              onChange={(e) => setNewSession({ ...newSession, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
              <input
                type="time"
                value={newSession.time}
                onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min) *</label>
              <input
                type="number"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) || 45 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="15"
                step="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={newSession.type}
                onChange={(e) => setNewSession({ ...newSession, type: e.target.value as Session['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="assessment">Évaluation</option>
                <option value="treatment">Traitement</option>
                <option value="followup">Suivi</option>
                <option value="exercise">Exercice</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thérapeute *</label>
            <input
              type="text"
              value={newSession.therapist}
              onChange={(e) => setNewSession({ ...newSession, therapist: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Dr. Omar Cherif"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercices</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSession.exercises.join(', ')}
                onChange={(e) => setNewSession({ ...newSession, exercises: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Séparer par des virgules"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau de douleur (0-10)</label>
              <input
                type="number"
                value={newSession.painLevel}
                onChange={(e) => setNewSession({ ...newSession, painLevel: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progrès</label>
              <input
                type="text"
                value={newSession.progress}
                onChange={(e) => setNewSession({ ...newSession, progress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newSession.notes}
              onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowSessionModal(false)
                setEditingSession(null)
                setNewSession({ patientId: '', date: '', time: '', duration: 45, type: 'treatment', exercises: [], painLevel: 0, progress: '', therapist: '', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddSession}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {editingSession ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Exercise Modal */}
      <Modal
        isOpen={showExerciseModal}
        onClose={() => {
          setShowExerciseModal(false)
          setEditingExercise(null)
          setNewExercise({ name: '', description: '', category: 'strength', duration: 15, sets: 3, reps: 10, difficulty: 'beginner', instructions: [] })
          setNewInstruction('')
        }}
        title={editingExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={newExercise.description}
              onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={newExercise.category}
                onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value as Exercise['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="strength">Force</option>
                <option value="flexibility">Flexibilité</option>
                <option value="balance">Équilibre</option>
                <option value="cardio">Cardio</option>
                <option value="rehabilitation">Rééducation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulté *</label>
              <select
                value={newExercise.difficulty}
                onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value as Exercise['difficulty'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min) *</label>
              <input
                type="number"
                value={newExercise.duration}
                onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Séries</label>
              <input
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Répétitions</label>
              <input
                type="number"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newInstruction.trim()) {
                    e.preventDefault()
                    setNewExercise({ ...newExercise, instructions: [...newExercise.instructions, newInstruction.trim()] })
                    setNewInstruction('')
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ajouter une instruction"
              />
              <button
                onClick={() => {
                  if (newInstruction.trim()) {
                    setNewExercise({ ...newExercise, instructions: [...newExercise.instructions, newInstruction.trim()] })
                    setNewInstruction('')
                  }
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {newExercise.instructions.map((instruction, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <span className="text-sm text-gray-700 flex-1">{idx + 1}. {instruction}</span>
                  <button
                    onClick={() => setNewExercise({ ...newExercise, instructions: newExercise.instructions.filter((_, i) => i !== idx) })}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowExerciseModal(false)
                setEditingExercise(null)
                setNewExercise({ name: '', description: '', category: 'strength', duration: 15, sets: 3, reps: 10, difficulty: 'beginner', instructions: [] })
                setNewInstruction('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddExercise}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {editingExercise ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Progress Modal */}
      <Modal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false)
          setEditingProgress(null)
          setNewProgress({ patientId: '', date: '', rangeOfMotion: 0, strength: 0, painLevel: 0, flexibility: 0, notes: '' })
        }}
        title={editingProgress ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
            <select
              value={newProgress.patientId}
              onChange={(e) => setNewProgress({ ...newProgress, patientId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={newProgress.date}
              onChange={(e) => setNewProgress({ ...newProgress, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amplitude (°)</label>
              <input
                type="number"
                value={newProgress.rangeOfMotion}
                onChange={(e) => setNewProgress({ ...newProgress, rangeOfMotion: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Force (0-10)</label>
              <input
                type="number"
                value={newProgress.strength}
                onChange={(e) => setNewProgress({ ...newProgress, strength: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
                max="10"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Douleur (0-10)</label>
              <input
                type="number"
                value={newProgress.painLevel}
                onChange={(e) => setNewProgress({ ...newProgress, painLevel: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flexibilité (%)</label>
              <input
                type="number"
                value={newProgress.flexibility}
                onChange={(e) => setNewProgress({ ...newProgress, flexibility: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newProgress.notes}
              onChange={(e) => setNewProgress({ ...newProgress, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowProgressModal(false)
                setEditingProgress(null)
                setNewProgress({ patientId: '', date: '', rangeOfMotion: 0, strength: 0, painLevel: 0, flexibility: 0, notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddProgress}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {editingProgress ? 'Modifier' : 'Ajouter'}
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
