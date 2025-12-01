'use client'

import { useState, useEffect } from 'react'
import { Baby, Users, Calendar, Activity, BarChart3, Clock, Heart, BookOpen } from 'lucide-react'

type TabType = 'dashboard' | 'children' | 'activities' | 'parents' | 'attendance'

interface Child {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  parentIds: string[]
  group: 'petite' | 'moyenne' | 'grande'
  allergies?: string[]
  medicalNotes?: string
  emergencyContact: string
  emergencyPhone: string
  enrollmentDate: Date
  attendanceRate: number
}

interface Activity {
  id: string
  name: string
  description: string
  type: 'educational' | 'recreational' | 'artistic' | 'physical'
  duration: number
  group: 'petite' | 'moyenne' | 'grande' | 'all'
  schedule: string
  day: string
}

interface Parent {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: 'mother' | 'father' | 'guardian'
  childIds: string[]
  address?: string
}

interface Attendance {
  id: string
  childId: string
  childName: string
  date: Date
  status: 'present' | 'absent' | 'late'
  checkIn?: string
  checkOut?: string
  notes?: string
}

export default function KindergartenPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [children, setChildren] = useState<Child[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [showChildForm, setShowChildForm] = useState(false)
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [showParentForm, setShowParentForm] = useState(false)
  const [showAttendanceForm, setShowAttendanceForm] = useState(false)

  useEffect(() => {
    const savedChildren = localStorage.getItem('kindergarten-children')
    const savedActivities = localStorage.getItem('kindergarten-activities')
    const savedParents = localStorage.getItem('kindergarten-parents')
    const savedAttendances = localStorage.getItem('kindergarten-attendances')

    if (savedChildren) {
      const parsed = JSON.parse(savedChildren)
      setChildren(parsed.map((c: any) => ({
        ...c,
        dateOfBirth: new Date(c.dateOfBirth),
        enrollmentDate: new Date(c.enrollmentDate),
      })))
    } else {
      const sample: Child[] = [
        {
          id: '1',
          firstName: 'Emma',
          lastName: 'Benali',
          dateOfBirth: new Date('2020-03-15'),
          gender: 'female',
          parentIds: ['1'],
          group: 'moyenne',
          allergies: [],
          emergencyContact: 'Mohamed Benali',
          emergencyPhone: '+213 555 1234',
          enrollmentDate: new Date('2023-09-01'),
          attendanceRate: 95,
        },
        {
          id: '2',
          firstName: 'Yacine',
          lastName: 'Kadri',
          dateOfBirth: new Date('2019-08-22'),
          gender: 'male',
          parentIds: ['2'],
          group: 'grande',
          allergies: ['Lactose'],
          emergencyContact: 'Fatima Kadri',
          emergencyPhone: '+213 555 5678',
          enrollmentDate: new Date('2023-09-01'),
          attendanceRate: 88,
        },
      ]
      setChildren(sample)
      localStorage.setItem('kindergarten-children', JSON.stringify(sample))
    }

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    } else {
      const sample: Activity[] = [
        {
          id: '1',
          name: 'Apprentissage des Lettres',
          description: 'Activité d\'apprentissage de l\'alphabet',
          type: 'educational',
          duration: 30,
          group: 'moyenne',
          schedule: '09:00',
          day: 'Lundi',
        },
        {
          id: '2',
          name: 'Peinture et Dessin',
          description: 'Expression artistique libre',
          type: 'artistic',
          duration: 45,
          group: 'all',
          schedule: '10:30',
          day: 'Mardi',
        },
        {
          id: '3',
          name: 'Jeux de Motricité',
          description: 'Développement de la motricité',
          type: 'physical',
          duration: 30,
          group: 'petite',
          schedule: '14:00',
          day: 'Mercredi',
        },
      ]
      setActivities(sample)
      localStorage.setItem('kindergarten-activities', JSON.stringify(sample))
    }

    if (savedParents) {
      setParents(JSON.parse(savedParents))
    } else {
      const sample: Parent[] = [
        {
          id: '1',
          firstName: 'Mohamed',
          lastName: 'Benali',
          email: 'mohamed@email.com',
          phone: '+213 555 1234',
          relationship: 'father',
          childIds: ['1'],
        },
        {
          id: '2',
          firstName: 'Fatima',
          lastName: 'Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          relationship: 'mother',
          childIds: ['2'],
        },
      ]
      setParents(sample)
      localStorage.setItem('kindergarten-parents', JSON.stringify(sample))
    }

    if (savedAttendances) {
      const parsed = JSON.parse(savedAttendances)
      setAttendances(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (children.length > 0) localStorage.setItem('kindergarten-children', JSON.stringify(children))
  }, [children])

  useEffect(() => {
    if (activities.length > 0) localStorage.setItem('kindergarten-activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    if (parents.length > 0) localStorage.setItem('kindergarten-parents', JSON.stringify(parents))
  }, [parents])

  useEffect(() => {
    if (attendances.length > 0) localStorage.setItem('kindergarten-attendances', JSON.stringify(attendances))
  }, [attendances])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'children' as TabType, label: 'Enfants', icon: Baby },
    { id: 'activities' as TabType, label: 'Activités', icon: Activity },
    { id: 'parents' as TabType, label: 'Parents', icon: Users },
    { id: 'attendance' as TabType, label: 'Présence', icon: Calendar },
  ]

  const todayAttendance = attendances.filter(a => {
    const today = new Date()
    return a.date.toDateString() === today.toDateString()
  })
  const presentToday = todayAttendance.filter(a => a.status === 'present').length

  const handleAddChild = () => setShowChildForm(true)
  const handleAddActivity = () => setShowActivityForm(true)
  const handleAddParent = () => setShowParentForm(true)
  const handleAddAttendance = () => setShowAttendanceForm(true)

  const handleSubmitChild = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newChild: Child = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      gender: formData.get('gender') as 'male' | 'female',
      parentIds: [],
      group: formData.get('group') as Child['group'],
      allergies: (formData.get('allergies') as string)?.split(',').map(a => a.trim()).filter(a => a) || [],
      medicalNotes: formData.get('medicalNotes') as string || undefined,
      emergencyContact: formData.get('emergencyContact') as string,
      emergencyPhone: formData.get('emergencyPhone') as string,
      enrollmentDate: new Date(),
      attendanceRate: 100,
    }
    setChildren([...children, newChild])
    setShowChildForm(false)
    e.currentTarget.reset()
  }

  const handleSubmitActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as Activity['type'],
      duration: parseInt(formData.get('duration') as string),
      group: formData.get('group') as Activity['group'],
      schedule: formData.get('schedule') as string,
      day: formData.get('day') as string,
    }
    setActivities([...activities, newActivity])
    setShowActivityForm(false)
    e.currentTarget.reset()
  }

  const handleSubmitParent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newParent: Parent = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      relationship: formData.get('relationship') as Parent['relationship'],
      childIds: [],
      address: formData.get('address') as string || undefined,
    }
    setParents([...parents, newParent])
    setShowParentForm(false)
    e.currentTarget.reset()
  }

  const handleSubmitAttendance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const childId = formData.get('childId') as string
    const child = children.find(c => c.id === childId)
    if (!child) {
      alert('Enfant introuvable')
      return
    }
    const newAttendance: Attendance = {
      id: Date.now().toString(),
      childId,
      childName: `${child.firstName} ${child.lastName}`,
      date: new Date(formData.get('date') as string),
      status: formData.get('status') as Attendance['status'],
      checkIn: formData.get('checkIn') as string || undefined,
      checkOut: formData.get('checkOut') as string || undefined,
      notes: formData.get('notes') as string || undefined,
    }
    setAttendances([...attendances, newAttendance])
    setShowAttendanceForm(false)
    e.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
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
                      ? 'text-yellow-600 border-b-2 border-yellow-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Enfants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{children.length}</p>
                  </div>
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Présents Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{presentToday}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Activités</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activities.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Parents</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{parents.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Enfants</h3>
                  <p className="text-sm text-gray-600">Dossiers complets avec informations médicales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Activités</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des activités éducatives</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Présence</h3>
                  <p className="text-sm text-gray-600">Suivi quotidien de la présence</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication Parents</h3>
                  <p className="text-sm text-gray-600">Messagerie et notifications aux parents</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Groupes</h3>
                  <p className="text-sm text-gray-600">Organisation par groupes d'âge</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et rapports détaillés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enfants</h2>
              <button 
                onClick={handleAddChild}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Nouvel Enfant
              </button>
            </div>
            {children.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun enfant enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {children.map((child) => {
                  const age = new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear()
                  return (
                    <div key={child.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{child.firstName} {child.lastName}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs capitalize">
                          {child.group}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">🎂 {age} ans</p>
                        <p className="text-sm text-gray-600">📞 {child.emergencyPhone}</p>
                        <p className="text-sm text-gray-600">👤 Contact: {child.emergencyContact}</p>
                        {child.allergies && child.allergies.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-xs font-medium text-red-900">⚠️ Allergies:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {child.allergies.map((allergy, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Taux de présence:</span>
                          <span className="font-medium text-yellow-600">{child.attendanceRate}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-gray-500">Inscrit depuis:</span>
                          <span className="text-gray-600">{new Date(child.enrollmentDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Activités</h2>
              <button 
                onClick={handleAddActivity}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Nouvelle Activité
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{activity.day} à {activity.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{activity.duration} minutes</span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      activity.type === 'educational' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'artistic' ? 'bg-purple-100 text-purple-800' :
                      activity.type === 'physical' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.type === 'educational' ? 'Éducatif' :
                       activity.type === 'artistic' ? 'Artistique' :
                       activity.type === 'physical' ? 'Physique' : 'Récréatif'}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs capitalize">
                      {activity.group === 'all' ? 'Tous' : activity.group}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'parents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Parents</h2>
              <button 
                onClick={handleAddParent}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Nouveau Parent
              </button>
            </div>
            {parents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun parent enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {parents.map((parent) => (
                  <div key={parent.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{parent.firstName} {parent.lastName}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📧 {parent.email}</p>
                      <p className="text-sm text-gray-600">📞 {parent.phone}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {parent.relationship === 'mother' ? 'Mère' :
                         parent.relationship === 'father' ? 'Père' : 'Tuteur'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Enfants: {parent.childIds.length}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Présence</h2>
              <button 
                onClick={handleAddAttendance}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Enregistrer Présence
              </button>
            </div>
            {todayAttendance.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune présence enregistrée aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAttendance.map((attendance) => (
                  <div key={attendance.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{attendance.childName}</h3>
                        {attendance.checkIn && (
                          <p className="text-sm text-gray-600 mt-1">
                            Arrivée: {attendance.checkIn}
                            {attendance.checkOut && ` - Départ: ${attendance.checkOut}`}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                        attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {attendance.status === 'present' ? 'Présent' :
                         attendance.status === 'late' ? 'En retard' : 'Absent'}
                      </span>
                    </div>
                    {attendance.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Notes: {attendance.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Nouvel Enfant */}
        {showChildForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nouvel Enfant</h3>
                  <button onClick={() => setShowChildForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitChild} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input type="text" name="firstName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input type="text" name="lastName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input type="date" name="dateOfBirth" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                    <select name="gender" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="male">Garçon</option>
                      <option value="female">Fille</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                    <select name="group" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="petite">Petite section</option>
                      <option value="moyenne">Moyenne section</option>
                      <option value="grande">Grande section</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence</label>
                    <input type="text" name="emergencyContact" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
                    <input type="tel" name="emergencyPhone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (séparées par des virgules)</label>
                    <input type="text" name="allergies" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes médicales</label>
                    <textarea name="medicalNotes" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowChildForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nouvelle Activité */}
        {showActivityForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nouvelle Activité</h3>
                  <button onClick={() => setShowActivityForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitActivity} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="educational">Éducatif</option>
                      <option value="recreational">Récréatif</option>
                      <option value="artistic">Artistique</option>
                      <option value="physical">Physique</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groupe</label>
                    <select name="group" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="petite">Petite section</option>
                      <option value="moyenne">Moyenne section</option>
                      <option value="grande">Grande section</option>
                      <option value="all">Tous</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
                      <input type="number" name="duration" required min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
                      <input type="time" name="schedule" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                    <select name="day" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="Lundi">Lundi</option>
                      <option value="Mardi">Mardi</option>
                      <option value="Mercredi">Mercredi</option>
                      <option value="Jeudi">Jeudi</option>
                      <option value="Vendredi">Vendredi</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowActivityForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Nouveau Parent */}
        {showParentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nouveau Parent</h3>
                  <button onClick={() => setShowParentForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitParent} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input type="text" name="firstName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input type="text" name="lastName" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input type="tel" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
                    <select name="relationship" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="mother">Mère</option>
                      <option value="father">Père</option>
                      <option value="guardian">Tuteur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse (optionnel)</label>
                    <input type="text" name="address" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowParentForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Enregistrer Présence */}
        {showAttendanceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Enregistrer Présence</h3>
                  <button onClick={() => setShowAttendanceForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <form onSubmit={handleSubmitAttendance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enfant</label>
                    <select name="childId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Sélectionner un enfant</option>
                      {children.map(c => (
                        <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select name="status" required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="present">Présent</option>
                      <option value="absent">Absent</option>
                      <option value="late">En retard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure d'arrivée</label>
                    <input type="time" name="checkIn" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure de départ</label>
                    <input type="time" name="checkOut" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea name="notes" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowAttendanceForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Annuler</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Enregistrer</button>
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
