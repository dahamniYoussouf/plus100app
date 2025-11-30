'use client'

import { useState, useEffect } from 'react'
import { Book, Users, Calendar, Award, BarChart3, Clock, CheckCircle, FileText } from 'lucide-react'

type TabType = 'dashboard' | 'students' | 'hifz' | 'courses' | 'attendance' | 'events'

interface Student {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phone: string
  guardianName: string
  guardianPhone: string
  joinDate: Date
  level: 'beginner' | 'intermediate' | 'advanced'
  enrolledCourses: string[]
  hifzProgress?: {
    surah: string
    verses: number
    totalVerses: number
    status: 'memorizing' | 'review' | 'completed'
  }
  attendanceRate: number
  lastAttendance?: Date
}

interface Course {
  id: string
  name: string
  type: 'quran' | 'tajwid' | 'tafsir' | 'islamic_sciences'
  instructor: string
  schedule: string
  day: string
  duration: number
  level: 'beginner' | 'intermediate' | 'advanced'
  enrolled: number
  capacity: number
  status: 'active' | 'completed'
}

interface HifzRecord {
  id: string
  studentId: string
  studentName: string
  surah: string
  verses: string
  status: 'memorizing' | 'review' | 'completed'
  progress: number
  lastReview?: Date
  notes?: string
}

interface Attendance {
  id: string
  studentId: string
  studentName: string
  date: Date
  status: 'present' | 'absent' | 'late'
  courseId: string
}

interface Event {
  id: string
  name: string
  type: 'religious' | 'educational' | 'community'
  date: Date
  description: string
  participants: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export default function QuranPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [hifzRecords, setHifzRecords] = useState<HifzRecord[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const savedStudents = localStorage.getItem('quran-students')
    const savedCourses = localStorage.getItem('quran-courses')
    const savedHifz = localStorage.getItem('quran-hifz')
    const savedAttendance = localStorage.getItem('quran-attendance')
    const savedEvents = localStorage.getItem('quran-events')

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents)
      setStudents(parsed.map((s: any) => ({
        ...s,
        joinDate: new Date(s.joinDate),
        lastAttendance: s.lastAttendance ? new Date(s.lastAttendance) : undefined,
      })))
    } else {
      const sample: Student[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          age: 12,
          gender: 'male',
          phone: '+213 555 1234',
          guardianName: 'Mohamed Benali',
          guardianPhone: '+213 555 5678',
          joinDate: new Date('2023-09-01'),
          level: 'intermediate',
          enrolledCourses: ['1', '2'],
          hifzProgress: { surah: 'Al-Baqarah', verses: 50, totalVerses: 286, status: 'memorizing' },
          attendanceRate: 95,
          lastAttendance: new Date('2024-01-20'),
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          age: 10,
          gender: 'female',
          phone: '+213 555 9012',
          guardianName: 'Ali Kadri',
          guardianPhone: '+213 555 3456',
          joinDate: new Date('2023-10-15'),
          level: 'beginner',
          enrolledCourses: ['1'],
          hifzProgress: { surah: 'Al-Fatiha', verses: 7, totalVerses: 7, status: 'completed' },
          attendanceRate: 98,
          lastAttendance: new Date('2024-01-20'),
        },
        {
          id: '3',
          name: 'Omar Touati',
          age: 15,
          gender: 'male',
          phone: '+213 555 7890',
          guardianName: 'Hassan Touati',
          guardianPhone: '+213 555 2468',
          joinDate: new Date('2022-01-01'),
          level: 'advanced',
          enrolledCourses: ['2', '3', '4'],
          hifzProgress: { surah: 'An-Nisa', verses: 100, totalVerses: 176, status: 'review' },
          attendanceRate: 92,
          lastAttendance: new Date('2024-01-19'),
        },
      ]
      setStudents(sample)
      localStorage.setItem('quran-students', JSON.stringify(sample))
    }

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      const sample: Course[] = [
        { id: '1', name: 'Récitation Coranique', type: 'quran', instructor: 'Cheikh Mohamed', schedule: '17:00', day: 'Lundi', duration: 60, level: 'beginner', enrolled: 25, capacity: 30, status: 'active' },
        { id: '2', name: 'Tajwid', type: 'tajwid', instructor: 'Cheikh Ali', schedule: '18:00', day: 'Mardi', duration: 60, level: 'intermediate', enrolled: 20, capacity: 25, status: 'active' },
        { id: '3', name: 'Tafsir', type: 'tafsir', instructor: 'Cheikh Omar', schedule: '19:00', day: 'Mercredi', duration: 90, level: 'advanced', enrolled: 15, capacity: 20, status: 'active' },
        { id: '4', name: 'Sciences Islamiques', type: 'islamic_sciences', instructor: 'Cheikh Hassan', schedule: '17:00', day: 'Samedi', duration: 120, level: 'intermediate', enrolled: 18, capacity: 25, status: 'active' },
      ]
      setCourses(sample)
      localStorage.setItem('quran-courses', JSON.stringify(sample))
    }

    if (savedHifz) {
      const parsed = JSON.parse(savedHifz)
      setHifzRecords(parsed.map((h: any) => ({
        ...h,
        lastReview: h.lastReview ? new Date(h.lastReview) : undefined,
      })))
    } else {
      const sample: HifzRecord[] = [
        { id: '1', studentId: '1', studentName: 'Ahmed Benali', surah: 'Al-Baqarah', verses: '1-50', status: 'memorizing', progress: 17, lastReview: new Date('2024-01-18') },
        { id: '2', studentId: '2', studentName: 'Fatima Kadri', surah: 'Al-Fatiha', verses: '1-7', status: 'completed', progress: 100, lastReview: new Date('2024-01-15') },
        { id: '3', studentId: '3', studentName: 'Omar Touati', surah: 'An-Nisa', verses: '1-100', status: 'review', progress: 57, lastReview: new Date('2024-01-19') },
      ]
      setHifzRecords(sample)
      localStorage.setItem('quran-hifz', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      })))
    } else {
      const sample: Event[] = [
        { id: '1', name: 'Concours de Mémorisation', type: 'religious', date: new Date('2024-02-15'), description: 'Concours annuel de mémorisation du Coran', participants: 50, status: 'upcoming' },
        { id: '2', name: 'Conférence Tafsir', type: 'educational', date: new Date('2024-01-25'), description: 'Conférence sur le Tafsir', participants: 30, status: 'upcoming' },
      ]
      setEvents(sample)
      localStorage.setItem('quran-events', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('quran-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (courses.length > 0) localStorage.setItem('quran-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    if (hifzRecords.length > 0) localStorage.setItem('quran-hifz', JSON.stringify(hifzRecords))
  }, [hifzRecords])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('quran-events', JSON.stringify(events))
  }, [events])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'hifz' as TabType, label: 'Hifz (Mémorisation)', icon: Book },
    { id: 'courses' as TabType, label: 'Cours', icon: FileText },
    { id: 'attendance' as TabType, label: 'Présence', icon: CheckCircle },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
  ]

  const totalEnrollments = students.reduce((sum, s) => sum + s.enrolledCourses.length, 0)
  const studentsWithHifz = students.filter(s => s.hifzProgress).length
  const averageAttendance = students.length > 0 
    ? students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length 
    : 0

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
                    <p className="text-xs sm:text-sm text-gray-600">Étudiants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                  </div>
                  <Book className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Hifz</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{studentsWithHifz}</p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Présence Moy.</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{averageAttendance.toFixed(0)}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Étudiants</h3>
                  <p className="text-sm text-gray-600">Suivi complet des étudiants avec informations personnelles et progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Mémorisation (Hifz)</h3>
                  <p className="text-sm text-gray-600">Suivi de la mémorisation du Coran avec révision et progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours Religieux</h3>
                  <p className="text-sm text-gray-600">Gestion des cours de Tajwid, Tafsir et sciences islamiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Présence</h3>
                  <p className="text-sm text-gray-600">Suivi de la présence des étudiants aux cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Événements Religieux</h3>
                  <p className="text-sm text-gray-600">Organisation d'événements et activités religieuses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Génération de rapports de progression et statistiques</p>
                </div>
              </div>
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
                {students.map((student) => (
                  <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        student.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        student.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.level === 'beginner' ? 'Débutant' :
                         student.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Âge: {student.age} ans</p>
                    <p className="text-sm text-gray-600 mb-2">Tuteur: {student.guardianName}</p>
                    {student.hifzProgress && (
                      <div className="mb-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Hifz: {student.hifzProgress.surah}</p>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Versets: {student.hifzProgress.verses}/{student.hifzProgress.totalVerses}</span>
                          <span className="font-medium text-emerald-600">
                            {Math.round((student.hifzProgress.verses / student.hifzProgress.totalVerses) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${(student.hifzProgress.verses / student.hifzProgress.totalVerses) * 100}%` }}></div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Présence</p>
                        <p className="font-bold text-green-600">{student.attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Cours</p>
                        <p className="font-bold text-gray-900">{student.enrolledCourses.length}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hifz' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mémorisation (Hifz)</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Nouveau Suivi
              </button>
            </div>
            {hifzRecords.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun suivi de mémorisation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hifzRecords.map((record) => (
                  <div key={record.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.studentName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Sourate: {record.surah}</p>
                        <p className="text-sm text-gray-500 mt-1">Versets: {record.verses}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status === 'completed' ? 'Terminé' :
                         record.status === 'review' ? 'Révision' : 'En cours'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium text-emerald-600">{record.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${record.progress}%` }}></div>
                      </div>
                    </div>
                    {record.lastReview && (
                      <p className="text-xs text-gray-500">Dernière révision: {new Date(record.lastReview).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{course.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      course.type === 'quran' ? 'bg-green-100 text-green-800' :
                      course.type === 'tajwid' ? 'bg-blue-100 text-blue-800' :
                      course.type === 'tafsir' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {course.type === 'quran' ? 'Coran' :
                       course.type === 'tajwid' ? 'Tajwid' :
                       course.type === 'tafsir' ? 'Tafsir' : 'Sciences'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Instructeur: {course.instructor}</p>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Présence</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Prendre la Présence
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{averageAttendance.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">Taux de présence moyen</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                  <p className="text-sm text-gray-600">Total étudiants</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  <p className="text-sm text-gray-600">Cours actifs</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">Système de prise de présence avec suivi automatique des taux de participation</p>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements Religieux</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement programmé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{event.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        event.type === 'religious' ? 'bg-green-100 text-green-800' :
                        event.type === 'educational' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {event.type === 'religious' ? 'Religieux' :
                         event.type === 'educational' ? 'Éducatif' : 'Communauté'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <p className="text-sm text-gray-500 mb-3">📅 {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Participants</p>
                        <p className="font-bold text-gray-900">{event.participants}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'completed' ? 'Terminé' :
                         event.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </span>
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
