'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Activity, Users, Calendar, BookOpen, BarChart3, Clock, Award } from 'lucide-react'

type TabType = 'dashboard' | 'classes' | 'students' | 'schedule'

interface YogaClass {
  id: string
  name: string
  instructor: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  capacity: number
  enrolled: number
  schedule: string
  day: string
}

interface Student {
  id: string
  name: string
  email: string
  phone: string
  membershipType: 'drop-in' | 'monthly' | 'unlimited'
  enrolledClasses: string[]
  joinDate: Date
}

export default function YogaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [classes, setClasses] = useState<YogaClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showClassModal, setShowClassModal] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', instructor: '', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced', duration: 60, capacity: 20, schedule: '', day: '' })

  useEffect(() => {
    const savedClasses = localStorage.getItem('yoga-classes')
    const savedStudents = localStorage.getItem('yoga-students')

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    } else {
      const sample: YogaClass[] = [
        { id: '1', name: 'Yoga Hatha', instructor: 'Sarah', level: 'beginner', duration: 60, capacity: 20, enrolled: 15, schedule: '09:00', day: 'Lundi' },
        { id: '2', name: 'Yoga Vinyasa', instructor: 'Ali', level: 'intermediate', duration: 75, capacity: 15, enrolled: 12, schedule: '18:00', day: 'Mardi' },
        { id: '3', name: 'Yoga Ashtanga', instructor: 'Omar', level: 'advanced', duration: 90, capacity: 10, enrolled: 8, schedule: '19:00', day: 'Mercredi' },
      ]
      setClasses(sample)
      localStorage.setItem('yoga-classes', JSON.stringify(sample))
    }

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents)
      setStudents(parsed.map((s: any) => ({
        ...s,
        joinDate: new Date(s.joinDate),
      })))
    } else {
      const sample: Student[] = [
        { id: '1', name: 'Fatima Benali', email: 'fatima@email.com', phone: '+213 555 1234', membershipType: 'monthly', enrolledClasses: ['1'], joinDate: new Date('2024-01-01') },
        { id: '2', name: 'Ahmed Kadri', email: 'ahmed@email.com', phone: '+213 555 5678', membershipType: 'unlimited', enrolledClasses: ['1', '2'], joinDate: new Date('2024-01-15') },
      ]
      setStudents(sample)
      localStorage.setItem('yoga-students', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (classes.length > 0) localStorage.setItem('yoga-classes', JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('yoga-students', JSON.stringify(students))
  }, [students])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'classes' as TabType, label: 'Cours', icon: BookOpen },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'schedule' as TabType, label: 'Planning', icon: Calendar },
  ]

  const totalEnrollments = students.reduce((sum, s) => sum + s.enrolledClasses.length, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{classes.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Étudiants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Inscriptions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Instructeurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                      {new Set(classes.map(c => c.instructor)).size}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Cours</h3>
                  <p className="text-sm text-gray-600">Cours de yoga par niveau et style</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inscriptions</h3>
                  <p className="text-sm text-gray-600">Système d'inscription aux cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                  <p className="text-sm text-gray-600">Calendrier et horaires des cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Abonnements</h3>
                  <p className="text-sm text-gray-600">Gestion des forfaits étudiants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Instructeurs</h3>
                  <p className="text-sm text-gray-600">Gestion des professeurs de yoga</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button 
                onClick={() => setShowClassModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Nouveau Cours
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {classes.map((classItem) => (
                <div key={classItem.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Instructeur: {classItem.instructor}</p>
                  <p className="text-sm text-gray-600 mb-3">📅 {classItem.day} à {classItem.schedule}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Inscrits</p>
                      <p className="font-bold text-gray-900">{classItem.enrolled}/{classItem.capacity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{classItem.duration} min</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      classItem.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      classItem.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {classItem.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Étudiants</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouvel Étudiant
              </button>
            </div>
            {students.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun étudiant enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {students.map((student) => (
                  <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{student.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{student.phone}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Cours</p>
                        <p className="font-bold text-gray-900">{student.enrolledClasses.length}</p>
                      </div>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs capitalize">
                        {student.membershipType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning Hebdomadaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => {
                  const dayClasses = classes.filter(c => c.day === day)
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
                      {dayClasses.length > 0 ? (
                        <div className="space-y-2">
                          {dayClasses.map((c) => (
                            <div key={c.id} className="bg-white rounded p-2 text-sm">
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.schedule} - {c.instructor}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Aucun cours</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showClassModal}
        onClose={() => {
          setShowClassModal(false)
          setNewClass({ name: '', instructor: '', level: 'beginner', duration: 60, capacity: 20, schedule: '', day: '' })
        }}
        title="Nouveau Cours"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours</label>
            <input
              type="text"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Yoga Hatha"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructeur</label>
              <input
                type="text"
                value={newClass.instructor}
                onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Sarah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={newClass.level}
                onChange={(e) => setNewClass({ ...newClass, level: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={newClass.duration}
                onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={newClass.capacity}
                onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <input
                type="time"
                value={newClass.schedule}
                onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
            <select
              value={newClass.day}
              onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="Lundi">Lundi</option>
              <option value="Mardi">Mardi</option>
              <option value="Mercredi">Mercredi</option>
              <option value="Jeudi">Jeudi</option>
              <option value="Vendredi">Vendredi</option>
              <option value="Samedi">Samedi</option>
              <option value="Dimanche">Dimanche</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowClassModal(false)
                setNewClass({ name: '', instructor: '', level: 'beginner', duration: 60, capacity: 20, schedule: '', day: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newClass.name && newClass.instructor && newClass.schedule && newClass.day) {
                  const classItem: YogaClass = {
                    id: Date.now().toString(),
                    name: newClass.name,
                    instructor: newClass.instructor,
                    level: newClass.level,
                    duration: newClass.duration,
                    capacity: newClass.capacity,
                    enrolled: 0,
                    schedule: newClass.schedule,
                    day: newClass.day,
                  }
                  setClasses([...classes, classItem])
                  setShowClassModal(false)
                  setNewClass({ name: '', instructor: '', level: 'beginner', duration: 60, capacity: 20, schedule: '', day: '' })
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}