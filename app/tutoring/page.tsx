'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, Calendar, DollarSign, BarChart3, Star, Clock, Award } from 'lucide-react'

type TabType = 'dashboard' | 'teachers' | 'students' | 'lessons' | 'schedules'

interface Teacher {
  id: string
  name: string
  email: string
  phone: string
  subjects: string[]
  hourlyRate: number
  rating: number
  totalLessons: number
  availability: string[]
  bio?: string
  experience: number
}

interface Student {
  id: string
  name: string
  email: string
  phone: string
  guardianName?: string
  guardianPhone?: string
  subjects: string[]
  level: 'elementary' | 'middle' | 'high' | 'university'
  enrolledLessons: string[]
  totalLessons: number
  joinDate: Date
}

interface Lesson {
  id: string
  teacherId: string
  teacherName: string
  studentId: string
  studentName: string
  subject: string
  date: Date
  time: string
  duration: number
  price: number
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function TutoringPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    const savedTeachers = localStorage.getItem('tutoring-teachers')
    const savedStudents = localStorage.getItem('tutoring-students')
    const savedLessons = localStorage.getItem('tutoring-lessons')

    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers))
    } else {
      const sample: Teacher[] = [
        {
          id: '1',
          name: 'Omar Cherif',
          email: 'omar@tutoring.com',
          phone: '+213 555 1111',
          subjects: ['Mathématiques', 'Physique'],
          hourlyRate: 25,
          rating: 4.8,
          totalLessons: 120,
          availability: ['Lundi', 'Mercredi', 'Vendredi'],
          bio: 'Professeur expérimenté en mathématiques et physique',
          experience: 5,
        },
        {
          id: '2',
          name: 'Nadia Amrani',
          email: 'nadia@tutoring.com',
          phone: '+213 555 2222',
          subjects: ['Français', 'Anglais'],
          hourlyRate: 20,
          rating: 4.9,
          totalLessons: 95,
          availability: ['Mardi', 'Jeudi', 'Samedi'],
          experience: 3,
        },
      ]
      setTeachers(sample)
      localStorage.setItem('tutoring-teachers', JSON.stringify(sample))
    }

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents)
      setStudents(parsed.map((s: any) => ({
        ...s,
        joinDate: new Date(s.joinDate),
      })))
    } else {
      const sample: Student[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          guardianName: 'Mohamed Benali',
          guardianPhone: '+213 555 1235',
          subjects: ['Mathématiques', 'Physique'],
          level: 'high',
          enrolledLessons: ['1'],
          totalLessons: 10,
          joinDate: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          subjects: ['Français'],
          level: 'middle',
          enrolledLessons: ['2'],
          totalLessons: 5,
          joinDate: new Date('2024-01-15'),
        },
      ]
      setStudents(sample)
      localStorage.setItem('tutoring-students', JSON.stringify(sample))
    }

    if (savedLessons) {
      const parsed = JSON.parse(savedLessons)
      setLessons(parsed.map((l: any) => ({
        ...l,
        date: new Date(l.date),
      })))
    } else {
      const today = new Date()
      const sample: Lesson[] = [
        {
          id: '1',
          teacherId: '1',
          teacherName: 'Omar Cherif',
          studentId: '1',
          studentName: 'Ahmed Benali',
          subject: 'Mathématiques',
          date: today,
          time: '16:00',
          duration: 60,
          price: 25,
          status: 'scheduled',
        },
        {
          id: '2',
          teacherId: '2',
          teacherName: 'Nadia Amrani',
          studentId: '2',
          studentName: 'Fatima Kadri',
          subject: 'Français',
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          time: '15:00',
          duration: 60,
          price: 20,
          status: 'scheduled',
        },
      ]
      setLessons(sample)
      localStorage.setItem('tutoring-lessons', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (teachers.length > 0) localStorage.setItem('tutoring-teachers', JSON.stringify(teachers))
  }, [teachers])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('tutoring-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (lessons.length > 0) localStorage.setItem('tutoring-lessons', JSON.stringify(lessons))
  }, [lessons])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'teachers' as TabType, label: 'Professeurs', icon: Users },
    { id: 'students' as TabType, label: 'Élèves', icon: Users },
    { id: 'lessons' as TabType, label: 'Cours', icon: BookOpen },
    { id: 'schedules' as TabType, label: 'Planning', icon: Calendar },
  ]

  const todayLessons = lessons.filter(l => {
    const today = new Date()
    return l.status === 'scheduled' && l.date.toDateString() === today.toDateString()
  })
  const totalRevenue = lessons.filter(l => l.status === 'completed').reduce((sum, l) => sum + l.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
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
                      ? 'text-violet-600 border-b-2 border-violet-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Professeurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{teachers.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Élèves</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayLessons.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-violet-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {todayLessons.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Cours d'aujourd'hui</h3>
                <div className="space-y-2">
                  {todayLessons.map((lesson) => (
                    <div key={lesson.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{lesson.studentName}</span>
                        <span className="text-gray-500 ml-2">avec {lesson.teacherName}</span>
                        <span className="text-gray-500 ml-2">- {lesson.subject}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{lesson.time}</span>
                        <span className="text-gray-500">({lesson.duration} min)</span>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Professeurs</h3>
                  <p className="text-sm text-gray-600">Inscription et profil des professeurs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Élèves</h3>
                  <p className="text-sm text-gray-600">Inscription et suivi des élèves</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planification Cours</h3>
                  <p className="text-sm text-gray-600">Réservation et gestion des cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Évaluations</h3>
                  <p className="text-sm text-gray-600">Système de notation et avis</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Professeurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Nouveau Professeur
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-900">{teacher.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">📧 {teacher.email}</p>
                    <p className="text-sm text-gray-600">📞 {teacher.phone}</p>
                    <p className="text-sm text-gray-600">💰 DZD{teacher.hourlyRate}/heure</p>
                    <p className="text-sm text-gray-600">📚 {teacher.experience} ans d'expérience</p>
                    {teacher.bio && (
                      <p className="text-xs text-gray-500">{teacher.bio}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Matières:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-violet-100 text-violet-800 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Cours donnés:</span>
                      <span className="font-medium text-violet-600">{teacher.totalLessons}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Élèves</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Nouvel Élève
              </button>
            </div>
            {students.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun élève enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {students.map((student) => (
                  <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{student.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📧 {student.email}</p>
                      <p className="text-sm text-gray-600">📞 {student.phone}</p>
                      <p className="text-sm text-gray-600">🎓 Niveau: {
                        student.level === 'elementary' ? 'Primaire' :
                        student.level === 'middle' ? 'Collège' :
                        student.level === 'high' ? 'Lycée' : 'Université'
                      }</p>
                      {student.guardianName && (
                        <p className="text-xs text-gray-500">Tuteur: {student.guardianName}</p>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Matières:</p>
                      <div className="flex flex-wrap gap-1">
                        {student.subjects.map((subject, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Cours suivis:</span>
                        <span className="font-medium text-violet-600">{student.totalLessons}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                Nouveau Cours
              </button>
            </div>
            {lessons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun cours programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{lesson.studentName} - {lesson.subject}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                            lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                            lesson.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lesson.status === 'completed' ? 'Terminé' :
                             lesson.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">👤 Professeur: {lesson.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(lesson.date).toLocaleDateString('fr-FR')} à {lesson.time}
                            </span>
                            <span className="text-gray-500">({lesson.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">DZD{lesson.price}</span>
                          </div>
                          {lesson.notes && (
                            <div className="bg-gray-50 border border-gray-200 rounded p-2">
                              <p className="text-xs text-gray-700">{lesson.notes}</p>
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

        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning Hebdomadaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day) => {
                  const dayLessons = lessons.filter(l => {
                    const lessonDay = new Date(l.date).toLocaleDateString('fr-FR', { weekday: 'long' })
                    return lessonDay.toLowerCase() === day.toLowerCase() && l.status === 'scheduled'
                  })
                  return (
                    <div key={day} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
                      {dayLessons.length > 0 ? (
                        <div className="space-y-2">
                          {dayLessons.map((l) => (
                            <div key={l.id} className="bg-white rounded p-2 text-sm">
                              <p className="font-medium">{l.studentName}</p>
                              <p className="text-xs text-gray-500">{l.time} - {l.subject}</p>
                              <p className="text-xs text-gray-500">avec {l.teacherName}</p>
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
    </div>
  )
}
