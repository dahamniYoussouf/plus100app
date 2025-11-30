'use client'

import { useState, useEffect } from 'react'
import { Globe, Users, BookOpen, Calendar, BarChart3, Award, Clock, GraduationCap } from 'lucide-react'

type TabType = 'dashboard' | 'courses' | 'students' | 'instructors' | 'schedule' | 'levels'

interface Course {
  id: string
  name: string
  language: string
  level: 'beginner' | 'intermediate' | 'advanced'
  instructorId: string
  instructorName: string
  schedule: string
  day: string
  duration: number
  capacity: number
  enrolled: number
  price: number
  status: 'active' | 'completed' | 'upcoming'
}

interface Student {
  id: string
  name: string
  email: string
  phone: string
  enrolledCourses: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  joinDate: Date
  totalLessons: number
  completedLessons: number
  lastVisit?: Date
}

interface Instructor {
  id: string
  name: string
  email: string
  phone: string
  languages: string[]
  experience: number
  rating: number
  activeCourses: number
}

export default function LanguagePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])

  useEffect(() => {
    const savedCourses = localStorage.getItem('language-courses')
    const savedStudents = localStorage.getItem('language-students')
    const savedInstructors = localStorage.getItem('language-instructors')

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      const sample: Course[] = [
        { id: '1', name: 'Anglais Débutant', language: 'Anglais', level: 'beginner', instructorId: '1', instructorName: 'Sarah Johnson', schedule: '09:00', day: 'Lundi', duration: 90, capacity: 15, enrolled: 12, price: 500, status: 'active' },
        { id: '2', name: 'Français Intermédiaire', language: 'Français', level: 'intermediate', instructorId: '2', instructorName: 'Marie Dubois', schedule: '18:00', day: 'Mardi', duration: 90, capacity: 12, enrolled: 10, price: 600, status: 'active' },
        { id: '3', name: 'Espagnol Avancé', language: 'Espagnol', level: 'advanced', instructorId: '3', instructorName: 'Carlos Mendez', schedule: '19:00', day: 'Mercredi', duration: 120, capacity: 10, enrolled: 8, price: 700, status: 'active' },
        { id: '4', name: 'Arabe Débutant', language: 'Arabe', level: 'beginner', instructorId: '4', instructorName: 'Ahmed Benali', schedule: '14:00', day: 'Samedi', duration: 90, capacity: 20, enrolled: 18, price: 450, status: 'active' },
        { id: '5', name: 'Allemand Intermédiaire', language: 'Allemand', level: 'intermediate', instructorId: '5', instructorName: 'Hans Mueller', schedule: '17:00', day: 'Jeudi', duration: 90, capacity: 10, enrolled: 7, price: 650, status: 'active' },
      ]
      setCourses(sample)
      localStorage.setItem('language-courses', JSON.stringify(sample))
    }

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents)
      setStudents(parsed.map((s: any) => ({
        ...s,
        joinDate: new Date(s.joinDate),
        lastVisit: s.lastVisit ? new Date(s.lastVisit) : undefined,
      })))
    } else {
      const sample: Student[] = [
        { id: '1', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 1234', enrolledCourses: ['1', '4'], level: 'beginner', joinDate: new Date('2024-01-01'), totalLessons: 20, completedLessons: 8, lastVisit: new Date('2024-01-20') },
        { id: '2', name: 'Omar Benali', email: 'omar@email.com', phone: '+213 555 5678', enrolledCourses: ['2'], level: 'intermediate', joinDate: new Date('2023-12-15'), totalLessons: 30, completedLessons: 25, lastVisit: new Date('2024-01-18') },
        { id: '3', name: 'Amel Touati', email: 'amel@email.com', phone: '+213 555 9012', enrolledCourses: ['3'], level: 'advanced', joinDate: new Date('2023-11-01'), totalLessons: 40, completedLessons: 35, lastVisit: new Date('2024-01-19') },
      ]
      setStudents(sample)
      localStorage.setItem('language-students', JSON.stringify(sample))
    }

    if (savedInstructors) {
      setInstructors(JSON.parse(savedInstructors))
    } else {
      const sample: Instructor[] = [
        { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+213 555 1111', languages: ['Anglais'], experience: 8, rating: 4.8, activeCourses: 2 },
        { id: '2', name: 'Marie Dubois', email: 'marie@email.com', phone: '+213 555 2222', languages: ['Français'], experience: 10, rating: 4.9, activeCourses: 3 },
        { id: '3', name: 'Carlos Mendez', email: 'carlos@email.com', phone: '+213 555 3333', languages: ['Espagnol'], experience: 6, rating: 4.7, activeCourses: 1 },
        { id: '4', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 4444', languages: ['Arabe'], experience: 12, rating: 5.0, activeCourses: 4 },
        { id: '5', name: 'Hans Mueller', email: 'hans@email.com', phone: '+213 555 5555', languages: ['Allemand'], experience: 7, rating: 4.6, activeCourses: 1 },
      ]
      setInstructors(sample)
      localStorage.setItem('language-instructors', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (courses.length > 0) localStorage.setItem('language-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('language-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (instructors.length > 0) localStorage.setItem('language-instructors', JSON.stringify(instructors))
  }, [instructors])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'courses' as TabType, label: 'Cours', icon: BookOpen },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'instructors' as TabType, label: 'Instructeurs', icon: GraduationCap },
    { id: 'schedule' as TabType, label: 'Planning', icon: Calendar },
    { id: 'levels' as TabType, label: 'Niveaux', icon: Award },
  ]

  const totalEnrollments = students.reduce((sum, s) => sum + s.enrolledCourses.length, 0)
  const languages = Array.from(new Set(courses.map(c => c.language)))
  const totalRevenue = courses.reduce((sum, c) => sum + (c.enrolled * c.price), 0)

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
                    <p className="text-xs sm:text-sm text-gray-600">Langues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{languages.length}</p>
                  </div>
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Étudiants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Inscriptions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Cours</h3>
                  <p className="text-sm text-gray-600">Cours par langue et niveau avec horaires flexibles</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inscriptions</h3>
                  <p className="text-sm text-gray-600">Système d'inscription et suivi de progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Niveaux</h3>
                  <p className="text-sm text-gray-600">Débutant, Intermédiaire, Avancé avec évaluations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Instructeurs</h3>
                  <p className="text-sm text-gray-600">Gestion des professeurs natifs et qualifiés</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                  <p className="text-sm text-gray-600">Calendrier des cours et horaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses de performance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Nouveau Cours
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.language}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs capitalize whitespace-nowrap ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level === 'beginner' ? 'Débutant' :
                       course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Instructeur: {course.instructorName}</p>
                  <p className="text-sm text-gray-500 mb-3">📅 {course.day} à {course.schedule}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Inscrits</p>
                      <p className="font-bold text-gray-900">{course.enrolled}/{course.capacity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{course.duration} min</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-emerald-600">DZD{course.price}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
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
                {students.map((student) => {
                  const progress = student.totalLessons > 0 ? (student.completedLessons / student.totalLessons) * 100 : 0
                  return (
                    <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{student.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                      <p className="text-sm text-gray-600 mb-3">{student.phone}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Progression</span>
                          <span className="font-medium text-gray-700">{student.completedLessons}/{student.totalLessons}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500">Cours</p>
                          <p className="font-bold text-gray-900">{student.enrolledCourses.length}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          student.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          student.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.level === 'beginner' ? 'Débutant' :
                           student.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Instructeurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Nouvel Instructeur
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {instructors.map((instructor) => (
                <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{instructor.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{instructor.email}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Langues:</p>
                    <div className="flex flex-wrap gap-1">
                      {instructor.languages.map((lang, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Expérience</p>
                      <p className="font-bold text-gray-900">{instructor.experience} ans</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Note</p>
                      <p className="font-bold text-emerald-600">{instructor.rating}/5.0</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cours</p>
                      <p className="font-bold text-gray-900">{instructor.activeCourses}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning Hebdomadaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => {
                  const dayCourses = courses.filter(c => c.day === day)
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
                      {dayCourses.length > 0 ? (
                        <div className="space-y-2">
                          {dayCourses.map((c) => (
                            <div key={c.id} className="bg-white rounded p-2 text-sm">
                              <p className="font-medium">{c.name}</p>
                              <p className="text-xs text-gray-500">{c.schedule} - {c.instructorName}</p>
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

        {activeTab === 'levels' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Niveaux de Langue</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-green-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Débutant
                </h3>
                <p className="text-sm text-gray-600 mb-4">Pour les personnes qui découvrent la langue</p>
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(c => c.level === 'beginner').length} cours
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {students.filter(s => s.level === 'beginner').length} étudiants
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Intermédiaire
                </h3>
                <p className="text-sm text-gray-600 mb-4">Pour ceux qui ont déjà des bases</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {courses.filter(c => c.level === 'intermediate').length} cours
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {students.filter(s => s.level === 'intermediate').length} étudiants
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  Avancé
                </h3>
                <p className="text-sm text-gray-600 mb-4">Pour perfectionner et maîtriser</p>
                <p className="text-2xl font-bold text-red-600">
                  {courses.filter(c => c.level === 'advanced').length} cours
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {students.filter(s => s.level === 'advanced').length} étudiants
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
