'use client'

import { useState, useEffect } from 'react'
import { School, Users, BookOpen, Calendar, BarChart3, GraduationCap, Award, FileText } from 'lucide-react'

type TabType = 'dashboard' | 'students' | 'courses' | 'exams' | 'faculty'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  studentId: string
  program: string
  year: number
  enrollmentDate: Date
  gpa?: number
  status: 'active' | 'graduated' | 'suspended'
  courses: string[]
}

interface Course {
  id: string
  code: string
  name: string
  credits: number
  professor: string
  schedule: string
  room: string
  enrolled: number
  capacity: number
  department: string
  semester: 'fall' | 'spring' | 'summer'
}

interface Exam {
  id: string
  courseId: string
  courseName: string
  type: 'midterm' | 'final' | 'quiz' | 'assignment'
  date: Date
  time: string
  duration: number
  room: string
  students: string[]
}

interface Faculty {
  id: string
  name: string
  email: string
  phone: string
  department: string
  title: string
  courses: string[]
  office: string
}

export default function UniversityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])

  useEffect(() => {
    const savedStudents = localStorage.getItem('university-students')
    const savedCourses = localStorage.getItem('university-courses')
    const savedExams = localStorage.getItem('university-exams')
    const savedFaculty = localStorage.getItem('university-faculty')

    if (savedStudents) {
      const parsed = JSON.parse(savedStudents)
      setStudents(parsed.map((s: any) => ({
        ...s,
        enrollmentDate: new Date(s.enrollmentDate),
      })))
    } else {
      const sample: Student[] = [
        {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Benali',
          email: 'ahmed@univ.edu',
          phone: '+213 555 1234',
          studentId: 'STU-2024-001',
          program: 'Informatique',
          year: 3,
          enrollmentDate: new Date('2022-09-01'),
          gpa: 3.7,
          status: 'active',
          courses: ['CS301', 'CS302', 'MATH301'],
        },
        {
          id: '2',
          firstName: 'Fatima',
          lastName: 'Kadri',
          email: 'fatima@univ.edu',
          phone: '+213 555 5678',
          studentId: 'STU-2024-002',
          program: 'Médecine',
          year: 4,
          enrollmentDate: new Date('2021-09-01'),
          gpa: 3.9,
          status: 'active',
          courses: ['MED401', 'MED402'],
        },
      ]
      setStudents(sample)
      localStorage.setItem('university-students', JSON.stringify(sample))
    }

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      const sample: Course[] = [
        {
          id: '1',
          code: 'CS301',
          name: 'Algorithmes Avancés',
          credits: 4,
          professor: 'Dr. Mohamed Amrani',
          schedule: 'Lundi, Mercredi 10h-12h',
          room: 'Salle A-101',
          enrolled: 35,
          capacity: 40,
          department: 'Informatique',
          semester: 'spring',
        },
        {
          id: '2',
          code: 'MED401',
          name: 'Médecine Interne',
          credits: 6,
          professor: 'Dr. Sarah Benali',
          schedule: 'Mardi, Jeudi 14h-16h',
          room: 'Amphithéâtre B',
          enrolled: 28,
          capacity: 30,
          department: 'Médecine',
          semester: 'spring',
        },
      ]
      setCourses(sample)
      localStorage.setItem('university-courses', JSON.stringify(sample))
    }

    if (savedExams) {
      const parsed = JSON.parse(savedExams)
      setExams(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      })))
    } else {
      const today = new Date()
      const sample: Exam[] = [
        {
          id: '1',
          courseId: '1',
          courseName: 'Algorithmes Avancés',
          type: 'midterm',
          date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          time: '10:00',
          duration: 120,
          room: 'Salle A-101',
          students: ['STU-2024-001'],
        },
      ]
      setExams(sample)
      localStorage.setItem('university-exams', JSON.stringify(sample))
    }

    if (savedFaculty) {
      setFaculty(JSON.parse(savedFaculty))
    } else {
      const sample: Faculty[] = [
        {
          id: '1',
          name: 'Dr. Mohamed Amrani',
          email: 'm.amrani@univ.edu',
          phone: '+213 555 1111',
          department: 'Informatique',
          title: 'Professeur',
          courses: ['CS301', 'CS302'],
          office: 'Bâtiment A, Bureau 205',
        },
        {
          id: '2',
          name: 'Dr. Sarah Benali',
          email: 's.benali@univ.edu',
          phone: '+213 555 2222',
          department: 'Médecine',
          title: 'Professeur Associé',
          courses: ['MED401'],
          office: 'Bâtiment B, Bureau 310',
        },
      ]
      setFaculty(sample)
      localStorage.setItem('university-faculty', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('university-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (courses.length > 0) localStorage.setItem('university-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    if (exams.length > 0) localStorage.setItem('university-exams', JSON.stringify(exams))
  }, [exams])

  useEffect(() => {
    if (faculty.length > 0) localStorage.setItem('university-faculty', JSON.stringify(faculty))
  }, [faculty])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'courses' as TabType, label: 'Cours', icon: BookOpen },
    { id: 'exams' as TabType, label: 'Examens', icon: FileText },
    { id: 'faculty' as TabType, label: 'Corps Enseignant', icon: GraduationCap },
  ]

  const activeStudents = students.filter(s => s.status === 'active').length
  const upcomingExams = exams.filter(e => e.date > new Date())
  const totalCourses = courses.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Étudiants Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeStudents}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalCourses}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Examens</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingExams.length}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Enseignants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{faculty.length}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {upcomingExams.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3">Examens à venir</h3>
                <div className="space-y-2">
                  {upcomingExams.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <div>
                        <span className="text-gray-700 font-medium">{exam.courseName}</span>
                        <span className="text-gray-500 ml-2">- {exam.type === 'midterm' ? 'Partiel' : exam.type === 'final' ? 'Final' : 'Quiz'}</span>
                      </div>
                      <div className="mt-1 sm:mt-0 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{new Date(exam.date).toLocaleDateString('fr-FR')} à {exam.time}</span>
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
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Étudiants</h3>
                  <p className="text-sm text-gray-600">Inscription, dossiers et suivi académique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours & Programmes</h3>
                  <p className="text-sm text-gray-600">Gestion des cours et programmes d'études</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Examens</h3>
                  <p className="text-sm text-gray-600">Planification et gestion des examens</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes & Évaluations</h3>
                  <p className="text-sm text-gray-600">Système de notation et bulletins</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Corps Enseignant</h3>
                  <p className="text-sm text-gray-600">Gestion des professeurs et départements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses académiques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Étudiants</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                      <h3 className="font-semibold text-gray-900 text-lg">{student.firstName} {student.lastName}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        student.status === 'active' ? 'bg-green-100 text-green-800' :
                        student.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status === 'active' ? 'Actif' :
                         student.status === 'graduated' ? 'Diplômé' : 'Suspendu'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📧 {student.email}</p>
                      <p className="text-sm text-gray-600">🆔 {student.studentId}</p>
                      <p className="text-sm text-gray-600">🎓 {student.program} - Année {student.year}</p>
                      {student.gpa && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Moyenne:</span>
                          <span className="font-bold text-blue-600">{student.gpa.toFixed(2)}/4.0</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Cours inscrits: {student.courses.length}</p>
                      <div className="flex flex-wrap gap-1">
                        {student.courses.slice(0, 3).map((course, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {course}
                          </span>
                        ))}
                        {student.courses.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            +{student.courses.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau Cours
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => {
                const occupancyRate = (course.enrolled / course.capacity) * 100
                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{course.code} - {course.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👤 {course.professor}</p>
                      <p className="text-sm text-gray-600">📅 {course.schedule}</p>
                      <p className="text-sm text-gray-600">🚪 {course.room}</p>
                      <p className="text-sm text-gray-600">📚 {course.credits} crédits</p>
                      <p className="text-sm text-gray-600">🏛️ {course.department}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Inscrits: {course.enrolled}/{course.capacity}</span>
                        <span className="text-sm font-bold text-blue-600">{occupancyRate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            occupancyRate >= 90 ? 'bg-red-500' :
                            occupancyRate >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Examens</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvel Examen
              </button>
            </div>
            {exams.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun examen programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{exam.courseName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {exam.type === 'midterm' ? 'Partiel' :
                           exam.type === 'final' ? 'Examen Final' :
                           exam.type === 'quiz' ? 'Quiz' : 'Devoir'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {exam.students.length} étudiants
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(exam.date).toLocaleDateString('fr-FR')} à {exam.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">⏱️ Durée: {exam.duration} minutes</span>
                        <span className="text-gray-600">🚪 Salle: {exam.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Corps Enseignant</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau Membre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {faculty.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{member.title}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">📧 {member.email}</p>
                    <p className="text-sm text-gray-600">📞 {member.phone}</p>
                    <p className="text-sm text-gray-600">🏛️ {member.department}</p>
                    <p className="text-sm text-gray-600">🚪 {member.office}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Cours: {member.courses.length}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.courses.map((course, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
      </div>
        )}
      </main>
    </div>
  )
}
