'use client'

import { useState, useEffect } from 'react'
import { Laptop, BookOpen, Users, Award, BarChart3, Play, CheckCircle, Clock, FileText } from 'lucide-react'

type TabType = 'dashboard' | 'courses' | 'students' | 'quizzes' | 'certificates'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  lessons: number
  enrolled: number
  price: number
  rating: number
  status: 'published' | 'draft'
  modules: Module[]
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  order: number
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz'
  duration: number
  completed: boolean
}

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: string[]
  completedCourses: string[]
  certificates: string[]
  progress: Record<string, number>
  joinDate: Date
}

interface Quiz {
  id: string
  courseId: string
  courseName: string
  title: string
  questions: number
  passingScore: number
  attempts: number
  timeLimit?: number
}

interface Certificate {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  issueDate: Date
  certificateNumber: string
}

export default function OnlinePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    const savedCourses = localStorage.getItem('online-courses')
    const savedStudents = localStorage.getItem('online-students')
    const savedQuizzes = localStorage.getItem('online-quizzes')
    const savedCertificates = localStorage.getItem('online-certificates')

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    } else {
      const sample: Course[] = [
        {
          id: '1',
          title: 'Introduction à la Programmation',
          description: 'Apprenez les bases de la programmation avec des exemples pratiques',
          instructor: 'Dr. Mohamed Amrani',
          category: 'Informatique',
          level: 'beginner',
          duration: 20,
          lessons: 15,
          enrolled: 125,
          price: 49,
          rating: 4.7,
          status: 'published',
          modules: [
            {
              id: 'm1',
              title: 'Module 1: Les Bases',
              order: 1,
              lessons: [
                { id: 'l1', title: 'Introduction', type: 'video', duration: 10, completed: false },
                { id: 'l2', title: 'Variables et Types', type: 'video', duration: 15, completed: false },
              ],
            },
          ],
        },
        {
          id: '2',
          title: 'Développement Web Avancé',
          description: 'Maîtrisez les technologies web modernes',
          instructor: 'Sarah Benali',
          category: 'Développement Web',
          level: 'advanced',
          duration: 40,
          lessons: 30,
          enrolled: 89,
          price: 99,
          rating: 4.9,
          status: 'published',
          modules: [],
        },
      ]
      setCourses(sample)
      localStorage.setItem('online-courses', JSON.stringify(sample))
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
          enrolledCourses: ['1', '2'],
          completedCourses: [],
          certificates: [],
          progress: { '1': 25, '2': 10 },
          joinDate: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          enrolledCourses: ['1'],
          completedCourses: ['1'],
          certificates: ['1'],
          progress: { '1': 100 },
          joinDate: new Date('2023-12-15'),
        },
      ]
      setStudents(sample)
      localStorage.setItem('online-students', JSON.stringify(sample))
    }

    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes))
    } else {
      const sample: Quiz[] = [
        {
          id: '1',
          courseId: '1',
          courseName: 'Introduction à la Programmation',
          title: 'Quiz Module 1',
          questions: 10,
          passingScore: 70,
          attempts: 3,
          timeLimit: 30,
        },
      ]
      setQuizzes(sample)
      localStorage.setItem('online-quizzes', JSON.stringify(sample))
    }

    if (savedCertificates) {
      const parsed = JSON.parse(savedCertificates)
      setCertificates(parsed.map((c: any) => ({
        ...c,
        issueDate: new Date(c.issueDate),
      })))
    } else {
      const sample: Certificate[] = [
        {
          id: '1',
          studentId: '2',
          studentName: 'Fatima Kadri',
          courseId: '1',
          courseName: 'Introduction à la Programmation',
          issueDate: new Date('2024-01-20'),
          certificateNumber: 'CERT-2024-001',
        },
      ]
      setCertificates(sample)
      localStorage.setItem('online-certificates', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (courses.length > 0) localStorage.setItem('online-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('online-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (quizzes.length > 0) localStorage.setItem('online-quizzes', JSON.stringify(quizzes))
  }, [quizzes])

  useEffect(() => {
    if (certificates.length > 0) localStorage.setItem('online-certificates', JSON.stringify(certificates))
  }, [certificates])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'courses' as TabType, label: 'Cours', icon: BookOpen },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'quizzes' as TabType, label: 'Quiz', icon: FileText },
    { id: 'certificates' as TabType, label: 'Certificats', icon: Award },
  ]

  const totalEnrollments = students.reduce((sum, s) => sum + s.enrolledCourses.length, 0)
  const totalCompletions = students.reduce((sum, s) => sum + s.completedCourses.length, 0)
  const publishedCourses = courses.filter(c => c.status === 'published').length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Cours Publiés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{publishedCourses}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Inscriptions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Complétions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalCompletions}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Certificats</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{certificates.length}</p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours en Ligne</h3>
                  <p className="text-sm text-gray-600">Création et gestion de cours avec vidéos et contenu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Quiz & Évaluations</h3>
                  <p className="text-sm text-gray-600">Système de quiz interactifs et évaluations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Certificats</h3>
                  <p className="text-sm text-gray-600">Génération automatique de certificats</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Progrès</h3>
                  <p className="text-sm text-gray-600">Suivi détaillé de la progression des étudiants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Discussion</h3>
                  <p className="text-sm text-gray-600">Forums et discussions entre étudiants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouveau Cours
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => {
                const studentProgress = students.find(s => s.enrolledCourses.includes(course.id))
                const progress = studentProgress ? studentProgress.progress[course.id] || 0 : 0
                return (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg flex-1">{course.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">👤 {course.instructor}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📚 {course.lessons} leçons</span>
                        <span>⏱️ {course.duration}h</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👥 {course.enrolled} inscrits</span>
                        <span className={`px-2 py-0.5 rounded text-xs  DZD{
                          course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level === 'beginner' ? 'Débutant' :
                           course.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </span>
                      </div>
                    </div>
                    {studentProgress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progrès</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: ` DZD{progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-900">DZD{course.price}</span>
                      <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700">
                        {studentProgress ? 'Continuer' : 'S\'inscrire'}
                      </button>
                    </div>
                  </div>
                )
              })}
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
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{student.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{student.email}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Cours inscrits: {student.enrolledCourses.length}</p>
                        <p className="text-xs text-gray-500 mb-1">Cours complétés: {student.completedCourses.length}</p>
                        <p className="text-xs text-gray-500 mb-1">Certificats: {student.certificates.length}</p>
                      </div>
                      {Object.keys(student.progress).length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Progrès:</p>
                          {Object.entries(student.progress).map(([courseId, progress]) => {
                            const course = courses.find(c => c.id === courseId)
                            return (
                              <div key={courseId} className="mb-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-600">{course?.title || courseId}</span>
                                  <span className="font-medium">{progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{ width: ` DZD{progress}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quiz</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouveau Quiz
              </button>
            </div>
            {quizzes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun quiz créé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{quiz.courseName}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Questions:</span>
                        <span className="font-medium">{quiz.questions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Score de passage:</span>
                        <span className="font-medium">{quiz.passingScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tentatives:</span>
                        <span className="font-medium">{quiz.attempts}</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">⏱️ Durée:</span>
                          <span className="font-medium">{quiz.timeLimit} min</span>
                        </div>
                      )}
                    </div>
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Passer le Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Certificats</h2>
            </div>
            {certificates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun certificat délivré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {certificates.map((cert) => (
                  <div key={cert.id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border border-yellow-200 p-4 sm:p-6">
                    <div className="text-center mb-4">
                      <Award className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                      <h3 className="font-bold text-gray-900 text-lg">Certificat de Complétion</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-900">Étudiant: {cert.studentName}</p>
                      <p className="text-sm text-gray-700">Cours: {cert.courseName}</p>
                      <p className="text-xs text-gray-600">Numéro: {cert.certificateNumber}</p>
                      <p className="text-xs text-gray-600">
                        Délivré le: {new Date(cert.issueDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      Télécharger
                    </button>
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
