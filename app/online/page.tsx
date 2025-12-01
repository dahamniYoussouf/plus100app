'use client'

import { useState, useEffect, useMemo } from 'react'
import { Laptop, BookOpen, Users, Award, BarChart3, Play, CheckCircle, Clock, FileText, Edit2, Trash2, Search, Filter, Plus } from 'lucide-react'
import Modal from '@/components/Modal'

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
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null)
  
  // Form states
  const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor: '', category: '', level: 'beginner' as Course['level'], duration: 0, lessons: 0, price: 0, rating: 0, status: 'draft' as Course['status'] })
  const [newStudent, setNewStudent] = useState({ name: '', email: '' })
  const [newQuiz, setNewQuiz] = useState({ courseId: '', title: '', questions: 0, passingScore: 70, attempts: 3, timeLimit: 0 })
  const [newCertificate, setNewCertificate] = useState({ studentId: '', courseId: '', issueDate: '' })
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

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

  const totalEnrollments = useMemo(() => students.reduce((sum, s) => sum + s.enrolledCourses.length, 0), [students])
  const totalCompletions = useMemo(() => students.reduce((sum, s) => sum + s.completedCourses.length, 0), [students])
  const publishedCourses = useMemo(() => courses.filter(c => c.status === 'published').length, [courses])

  const filteredCourses = useMemo(() => {
    let filtered = courses
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }
    if (filterLevel !== 'all') {
      filtered = filtered.filter(c => c.level === filterLevel)
    }
    return filtered
  }, [courses, searchQuery, filterStatus, filterLevel])

  const filteredStudents = useMemo(() => {
    let filtered = students
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [students, searchQuery])

  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [quizzes, searchQuery])

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.instructor) {
      const course: Course = {
        id: editingCourse?.id || Date.now().toString(),
        ...newCourse,
        modules: editingCourse?.modules || [],
        enrolled: editingCourse?.enrolled || 0,
      }
      if (editingCourse) {
        setCourses(courses.map(c => c.id === editingCourse.id ? course : c))
      } else {
        setCourses([...courses, course])
      }
      setShowCourseModal(false)
      setEditingCourse(null)
      setNewCourse({ title: '', description: '', instructor: '', category: '', level: 'beginner', duration: 0, lessons: 0, price: 0, rating: 0, status: 'draft' })
    }
  }

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email) {
      const student: Student = {
        id: editingStudent?.id || Date.now().toString(),
        name: newStudent.name,
        email: newStudent.email,
        enrolledCourses: editingStudent?.enrolledCourses || [],
        completedCourses: editingStudent?.completedCourses || [],
        certificates: editingStudent?.certificates || [],
        progress: editingStudent?.progress || {},
        joinDate: editingStudent?.joinDate || new Date(),
      }
      if (editingStudent) {
        setStudents(students.map(s => s.id === editingStudent.id ? student : s))
      } else {
        setStudents([...students, student])
      }
      setShowStudentModal(false)
      setEditingStudent(null)
      setNewStudent({ name: '', email: '' })
    }
  }

  const handleAddQuiz = () => {
    if (newQuiz.courseId && newQuiz.title && newQuiz.questions > 0) {
      const course = courses.find(c => c.id === newQuiz.courseId)
      if (!course) return
      
      const quiz: Quiz = {
        id: editingQuiz?.id || Date.now().toString(),
        courseId: newQuiz.courseId,
        courseName: course.title,
        title: newQuiz.title,
        questions: newQuiz.questions,
        passingScore: newQuiz.passingScore,
        attempts: newQuiz.attempts,
        timeLimit: newQuiz.timeLimit > 0 ? newQuiz.timeLimit : undefined,
      }
      if (editingQuiz) {
        setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? quiz : q))
      } else {
        setQuizzes([...quizzes, quiz])
      }
      setShowQuizModal(false)
      setEditingQuiz(null)
      setNewQuiz({ courseId: '', title: '', questions: 0, passingScore: 70, attempts: 3, timeLimit: 0 })
    }
  }

  const handleAddCertificate = () => {
    if (newCertificate.studentId && newCertificate.courseId && newCertificate.issueDate) {
      const student = students.find(s => s.id === newCertificate.studentId)
      const course = courses.find(c => c.id === newCertificate.courseId)
      if (!student || !course) return
      
      const certificate: Certificate = {
        id: editingCertificate?.id || Date.now().toString(),
        studentId: newCertificate.studentId,
        studentName: student.name,
        courseId: newCertificate.courseId,
        courseName: course.title,
        issueDate: new Date(newCertificate.issueDate),
        certificateNumber: editingCertificate?.certificateNumber || `CERT-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`,
      }
      if (editingCertificate) {
        setCertificates(certificates.map(c => c.id === editingCertificate.id ? certificate : c))
      } else {
        setCertificates([...certificates, certificate])
        // Update student certificates
        setStudents(students.map(s => 
          s.id === student.id 
            ? { ...s, certificates: [...s.certificates, certificate.id], completedCourses: s.completedCourses.includes(course.id) ? s.completedCourses : [...s.completedCourses, course.id] }
            : s
        ))
      }
      setShowCertificateModal(false)
      setEditingCertificate(null)
      setNewCertificate({ studentId: '', courseId: '', issueDate: '' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'course') {
      setCourses(courses.filter(c => c.id !== id))
    } else if (type === 'student') {
      setStudents(students.filter(s => s.id !== id))
    } else if (type === 'quiz') {
      setQuizzes(quizzes.filter(q => q.id !== id))
    } else if (type === 'certificate') {
      setCertificates(certificates.filter(c => c.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditCourse = (course: Course) => {
    setEditingCourse(course)
    setNewCourse({ ...course })
    setShowCourseModal(true)
  }

  const openEditStudent = (student: Student) => {
    setEditingStudent(student)
    setNewStudent({ name: student.name, email: student.email })
    setShowStudentModal(true)
  }

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setNewQuiz({ ...quiz, timeLimit: quiz.timeLimit || 0 })
    setShowQuizModal(true)
  }

  const openEditCertificate = (cert: Certificate) => {
    setEditingCertificate(cert)
    setNewCertificate({ ...cert, issueDate: cert.issueDate.toISOString().split('T')[0] })
    setShowCertificateModal(true)
  }

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
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button 
                onClick={() => {
                  setEditingCourse(null)
                  setNewCourse({ title: '', description: '', instructor: '', category: '', level: 'beginner', duration: 0, lessons: 0, price: 0, rating: 0, status: 'draft' })
                  setShowCourseModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Cours
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
              <div className="relative">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun cours trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCourses.map((course) => {
                  const studentProgress = students.find(s => s.enrolledCourses.includes(course.id))
                  const progress = studentProgress ? studentProgress.progress[course.id] || 0 : 0
                  return (
                    <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg flex-1">{course.title}</h3>
                        <div className="flex gap-2 ml-2">
                          <button
                            onClick={() => openEditCourse(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'course', id: course.id })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                      <p className="text-sm text-gray-600 mb-3 mt-2">{course.description}</p>
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
                          <span className={`px-2 py-0.5 rounded text-xs ${
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
                              style={{ width: `${progress}%` }}
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
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Étudiants</h2>
              <button 
                onClick={() => {
                  setEditingStudent(null)
                  setNewStudent({ name: '', email: '' })
                  setShowStudentModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvel Étudiant
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun étudiant trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditStudent(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'student', id: student.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
                                    style={{ width: `${progress}%` }}
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
              <button 
                onClick={() => {
                  setEditingQuiz(null)
                  setNewQuiz({ courseId: '', title: '', questions: 0, passingScore: 70, attempts: 3, timeLimit: 0 })
                  setShowQuizModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Quiz
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {filteredQuizzes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun quiz trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">{quiz.courseName}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditQuiz(quiz)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'quiz', id: quiz.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
              <button 
                onClick={() => {
                  setEditingCertificate(null)
                  setNewCertificate({ studentId: '', courseId: '', issueDate: '' })
                  setShowCertificateModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Certificat
              </button>
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-center flex-1">
                        <Award className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                        <h3 className="font-bold text-gray-900 text-lg">Certificat de Complétion</h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditCertificate(cert)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'certificate', id: cert.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false)
          setEditingCourse(null)
          setNewCourse({ title: '', description: '', instructor: '', category: '', level: 'beginner', duration: 0, lessons: 0, price: 0, rating: 0, status: 'draft' })
        }}
        title={editingCourse ? 'Modifier le cours' : 'Nouveau cours'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructeur *</label>
              <input
                type="text"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <input
                type="text"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
              <select
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value as Course['level'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (h) *</label>
              <input
                type="number"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leçons *</label>
              <input
                type="number"
                value={newCourse.lessons}
                onChange={(e) => setNewCourse({ ...newCourse, lessons: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD) *</label>
              <input
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (0-5)</label>
              <input
                type="number"
                value={newCourse.rating}
                onChange={(e) => setNewCourse({ ...newCourse, rating: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newCourse.status}
                onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value as Course['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowCourseModal(false)
                setEditingCourse(null)
                setNewCourse({ title: '', description: '', instructor: '', category: '', level: 'beginner', duration: 0, lessons: 0, price: 0, rating: 0, status: 'draft' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddCourse}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingCourse ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Student Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => {
          setShowStudentModal(false)
          setEditingStudent(null)
          setNewStudent({ name: '', email: '' })
        }}
        title={editingStudent ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowStudentModal(false)
                setEditingStudent(null)
                setNewStudent({ name: '', email: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingStudent ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        isOpen={showQuizModal}
        onClose={() => {
          setShowQuizModal(false)
          setEditingQuiz(null)
          setNewQuiz({ courseId: '', title: '', questions: 0, passingScore: 70, attempts: 3, timeLimit: 0 })
        }}
        title={editingQuiz ? 'Modifier le quiz' : 'Nouveau quiz'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cours *</label>
            <select
              value={newQuiz.courseId}
              onChange={(e) => setNewQuiz({ ...newQuiz, courseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sélectionner un cours</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de questions *</label>
              <input
                type="number"
                value={newQuiz.questions}
                onChange={(e) => setNewQuiz({ ...newQuiz, questions: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score de passage (%) *</label>
              <input
                type="number"
                value={newQuiz.passingScore}
                onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 70 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tentatives autorisées *</label>
              <input
                type="number"
                value={newQuiz.attempts}
                onChange={(e) => setNewQuiz({ ...newQuiz, attempts: parseInt(e.target.value) || 3 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée limite (min, optionnel)</label>
              <input
                type="number"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowQuizModal(false)
                setEditingQuiz(null)
                setNewQuiz({ courseId: '', title: '', questions: 0, passingScore: 70, attempts: 3, timeLimit: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddQuiz}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingQuiz ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Certificate Modal */}
      <Modal
        isOpen={showCertificateModal}
        onClose={() => {
          setShowCertificateModal(false)
          setEditingCertificate(null)
          setNewCertificate({ studentId: '', courseId: '', issueDate: '' })
        }}
        title={editingCertificate ? 'Modifier le certificat' : 'Nouveau certificat'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Étudiant *</label>
            <select
              value={newCertificate.studentId}
              onChange={(e) => setNewCertificate({ ...newCertificate, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cours *</label>
            <select
              value={newCertificate.courseId}
              onChange={(e) => setNewCertificate({ ...newCertificate, courseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sélectionner un cours</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de délivrance *</label>
            <input
              type="date"
              value={newCertificate.issueDate}
              onChange={(e) => setNewCertificate({ ...newCertificate, issueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowCertificateModal(false)
                setEditingCertificate(null)
                setNewCertificate({ studentId: '', courseId: '', issueDate: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddCertificate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingCertificate ? 'Modifier' : 'Ajouter'}
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
