'use client'

import { useState, useEffect } from 'react'
import { Baby, Users, Calendar, Activity, BarChart3, Clock, Heart, MapPin } from 'lucide-react'

type TabType = 'dashboard' | 'children' | 'planning' | 'activities' | 'parents'

interface Child {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  parentIds: string[]
  group: 'infants' | 'toddlers' | 'preschool'
  allergies?: string[]
  medicalNotes?: string
  emergencyContact: string
  emergencyPhone: string
  enrollmentDate: Date
  schedule: 'full_time' | 'part_time'
  attendanceRate: number
}

interface Planning {
  id: string
  childId: string
  childName: string
  date: Date
  activities: string[]
  meals: string[]
  naps: { start: string; end: string; duration: number }[]
  notes?: string
}

interface Activity {
  id: string
  name: string
  description: string
  type: 'play' | 'learning' | 'outdoor' | 'nap' | 'meal'
  duration: number
  group: 'infants' | 'toddlers' | 'preschool' | 'all'
  schedule: string
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

export default function DaycarePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [children, setChildren] = useState<Child[]>([])
  const [planning, setPlanning] = useState<Planning[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [parents, setParents] = useState<Parent[]>([])

  useEffect(() => {
    const savedChildren = localStorage.getItem('daycare-children')
    const savedPlanning = localStorage.getItem('daycare-planning')
    const savedActivities = localStorage.getItem('daycare-activities')
    const savedParents = localStorage.getItem('daycare-parents')

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
          firstName: 'Lina',
          lastName: 'Benali',
          dateOfBirth: new Date('2022-05-10'),
          gender: 'female',
          parentIds: ['1'],
          group: 'toddlers',
          allergies: [],
          emergencyContact: 'Mohamed Benali',
          emergencyPhone: '+213 555 1234',
          enrollmentDate: new Date('2023-09-01'),
          schedule: 'full_time',
          attendanceRate: 92,
        },
        {
          id: '2',
          firstName: 'Karim',
          lastName: 'Amrani',
          dateOfBirth: new Date('2021-11-20'),
          gender: 'male',
          parentIds: ['2'],
          group: 'preschool',
          allergies: ['Œufs'],
          emergencyContact: 'Sarah Amrani',
          emergencyPhone: '+213 555 5678',
          enrollmentDate: new Date('2023-08-15'),
          schedule: 'part_time',
          attendanceRate: 85,
        },
      ]
      setChildren(sample)
      localStorage.setItem('daycare-children', JSON.stringify(sample))
    }

    if (savedPlanning) {
      const parsed = JSON.parse(savedPlanning)
      setPlanning(parsed.map((p: any) => ({
        ...p,
        date: new Date(p.date),
      })))
    } else {
      const today = new Date()
      const sample: Planning[] = [
        {
          id: '1',
          childId: '1',
          childName: 'Lina Benali',
          date: today,
          activities: ['Jeux libres', 'Chansons', 'Lecture'],
          meals: ['Petit-déjeuner', 'Déjeuner', 'Goûter'],
          naps: [{ start: '13:00', end: '15:00', duration: 120 }],
        },
      ]
      setPlanning(sample)
      localStorage.setItem('daycare-planning', JSON.stringify(sample))
    }

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    } else {
      const sample: Activity[] = [
        {
          id: '1',
          name: 'Jeux Libres',
          description: 'Temps de jeu libre supervisé',
          type: 'play',
          duration: 60,
          group: 'all',
          schedule: '09:00',
        },
        {
          id: '2',
          name: 'Activité Motricité',
          description: 'Développement de la motricité fine',
          type: 'learning',
          duration: 30,
          group: 'toddlers',
          schedule: '10:30',
        },
        {
          id: '3',
          name: 'Sortie Extérieure',
          description: 'Jeux en plein air',
          type: 'outdoor',
          duration: 45,
          group: 'preschool',
          schedule: '15:30',
        },
      ]
      setActivities(sample)
      localStorage.setItem('daycare-activities', JSON.stringify(sample))
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
          firstName: 'Sarah',
          lastName: 'Amrani',
          email: 'sarah@email.com',
          phone: '+213 555 5678',
          relationship: 'mother',
          childIds: ['2'],
        },
      ]
      setParents(sample)
      localStorage.setItem('daycare-parents', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (children.length > 0) localStorage.setItem('daycare-children', JSON.stringify(children))
  }, [children])

  useEffect(() => {
    if (planning.length > 0) localStorage.setItem('daycare-planning', JSON.stringify(planning))
  }, [planning])

  useEffect(() => {
    if (activities.length > 0) localStorage.setItem('daycare-activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    if (parents.length > 0) localStorage.setItem('daycare-parents', JSON.stringify(parents))
  }, [parents])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'children' as TabType, label: 'Enfants', icon: Baby },
    { id: 'planning' as TabType, label: 'Planning', icon: Calendar },
    { id: 'activities' as TabType, label: 'Activités', icon: Activity },
    { id: 'parents' as TabType, label: 'Parents', icon: Users },
  ]

  const todayPlanning = planning.filter(p => {
    const today = new Date()
    return p.date.toDateString() === today.toDateString()
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
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
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Enfants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{children.length}</p>
                  </div>
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Planning Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayPlanning.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Activités</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activities.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
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
                  <p className="text-sm text-gray-600">Dossiers complets avec horaires et besoins</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planning Quotidien</h3>
                  <p className="text-sm text-gray-600">Organisation des activités et repas</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Activités</h3>
                  <p className="text-sm text-gray-600">Programme d'activités adapté par âge</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Repas & Siestes</h3>
                  <p className="text-sm text-gray-600">Suivi des repas et temps de repos</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                  <p className="text-sm text-gray-600">Messagerie avec les parents</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Rapports quotidiens et statistiques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enfants</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
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
                        <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs capitalize">
                          {child.group === 'infants' ? 'Bébés' :
                           child.group === 'toddlers' ? 'Tout-petits' : 'Préscolaire'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">🎂 {age} ans</p>
                        <p className="text-sm text-gray-600">📞 {child.emergencyPhone}</p>
                        <p className="text-sm text-gray-600">👤 Contact: {child.emergencyContact}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {child.schedule === 'full_time' ? 'Temps plein' : 'Temps partiel'}
                        </p>
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
                          <span className="font-medium text-cyan-600">{child.attendanceRate}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning Quotidien</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Nouveau Planning
              </button>
            </div>
            {planning.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun planning enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {planning.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{plan.childName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(plan.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {plan.activities.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-900 mb-2">🎨 Activités:</p>
                          <div className="flex flex-wrap gap-1">
                            {plan.activities.map((activity, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {plan.meals.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-900 mb-2">🍽️ Repas:</p>
                          <div className="flex flex-wrap gap-1">
                            {plan.meals.map((meal, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                {meal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {plan.naps.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-900 mb-2">😴 Siestes:</p>
                          <div className="space-y-1">
                            {plan.naps.map((nap, idx) => (
                              <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                <p className="text-xs text-gray-700">
                                  {nap.start} - {nap.end} ({nap.duration} min)
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {plan.notes && (
                        <div className="bg-gray-50 border border-gray-200 rounded p-2">
                          <p className="text-xs text-gray-700">{plan.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Activités</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Nouvelle Activité
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{activity.duration} minutes</span>
                      <span className="text-gray-500">à {activity.schedule}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        activity.type === 'play' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'learning' ? 'bg-purple-100 text-purple-800' :
                        activity.type === 'outdoor' ? 'bg-green-100 text-green-800' :
                        activity.type === 'meal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type === 'play' ? 'Jeu' :
                         activity.type === 'learning' ? 'Apprentissage' :
                         activity.type === 'outdoor' ? 'Extérieur' :
                         activity.type === 'meal' ? 'Repas' : 'Sieste'}
                      </span>
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded text-xs capitalize">
                        {activity.group === 'all' ? 'Tous' :
                         activity.group === 'infants' ? 'Bébés' :
                         activity.group === 'toddlers' ? 'Tout-petits' : 'Préscolaire'}
                      </span>
                    </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
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
      </main>
    </div>
  )
}
