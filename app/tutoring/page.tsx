'use client'

import { useState, useEffect, useMemo } from 'react'
import { BookOpen, Users, Calendar, DollarSign, BarChart3, Star, Clock, Award, Edit2, Trash2, Search, Plus } from 'lucide-react'
import Modal from '@/components/Modal'

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
  
  // Modal states
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  
  // Form states
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', phone: '', subjects: [] as string[], hourlyRate: 0, rating: 0, availability: [] as string[], bio: '', experience: 0 })
  const [newSubject, setNewSubject] = useState('')
  const [newAvailability, setNewAvailability] = useState('')
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', guardianName: '', guardianPhone: '', subjects: [] as string[], level: 'elementary' as Student['level'] })
  const [newStudentSubject, setNewStudentSubject] = useState('')
  const [newLesson, setNewLesson] = useState({ teacherId: '', studentId: '', subject: '', date: '', time: '', duration: 60, notes: '' })
  
  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

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

  const todayLessons = useMemo(() => lessons.filter(l => {
    const today = new Date()
    return l.status === 'scheduled' && l.date.toDateString() === today.toDateString()
  }), [lessons])
  const totalRevenue = useMemo(() => lessons.filter(l => l.status === 'completed').reduce((sum, l) => sum + l.price, 0), [lessons])

  const filteredTeachers = useMemo(() => {
    let filtered = teachers
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return filtered
  }, [teachers, searchQuery])

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

  const filteredLessons = useMemo(() => {
    let filtered = lessons
    if (searchQuery) {
      filtered = filtered.filter(l => 
        l.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [lessons, searchQuery])

  const handleAddTeacher = () => {
    if (newTeacher.name && newTeacher.email && newTeacher.phone && newTeacher.subjects.length > 0) {
      const teacher: Teacher = {
        id: editingTeacher?.id || Date.now().toString(),
        name: newTeacher.name,
        email: newTeacher.email,
        phone: newTeacher.phone,
        subjects: newTeacher.subjects,
        hourlyRate: newTeacher.hourlyRate,
        rating: newTeacher.rating || 0,
        totalLessons: editingTeacher?.totalLessons || 0,
        availability: newTeacher.availability,
        bio: newTeacher.bio || undefined,
        experience: newTeacher.experience,
      }
      if (editingTeacher) {
        setTeachers(teachers.map(t => t.id === editingTeacher.id ? teacher : t))
      } else {
        setTeachers([...teachers, teacher])
      }
      setShowTeacherModal(false)
      setEditingTeacher(null)
      setNewTeacher({ name: '', email: '', phone: '', subjects: [], hourlyRate: 0, rating: 0, availability: [], bio: '', experience: 0 })
      setNewSubject('')
      setNewAvailability('')
    }
  }

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.phone && newStudent.subjects.length > 0) {
      const student: Student = {
        id: editingStudent?.id || Date.now().toString(),
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        guardianName: newStudent.guardianName || undefined,
        guardianPhone: newStudent.guardianPhone || undefined,
        subjects: newStudent.subjects,
        level: newStudent.level,
        enrolledLessons: editingStudent?.enrolledLessons || [],
        totalLessons: editingStudent?.totalLessons || 0,
        joinDate: editingStudent?.joinDate || new Date(),
      }
      if (editingStudent) {
        setStudents(students.map(s => s.id === editingStudent.id ? student : s))
      } else {
        setStudents([...students, student])
      }
      setShowStudentModal(false)
      setEditingStudent(null)
      setNewStudent({ name: '', email: '', phone: '', guardianName: '', guardianPhone: '', subjects: [], level: 'elementary' })
      setNewStudentSubject('')
    }
  }

  const handleAddLesson = () => {
    if (newLesson.teacherId && newLesson.studentId && newLesson.subject && newLesson.date && newLesson.time) {
      const teacher = teachers.find(t => t.id === newLesson.teacherId)
      const student = students.find(s => s.id === newLesson.studentId)
      if (!teacher || !student) return
      
      const lesson: Lesson = {
        id: editingLesson?.id || Date.now().toString(),
        teacherId: newLesson.teacherId,
        teacherName: teacher.name,
        studentId: newLesson.studentId,
        studentName: student.name,
        subject: newLesson.subject,
        date: new Date(newLesson.date),
        time: newLesson.time,
        duration: newLesson.duration,
        price: teacher.hourlyRate * (newLesson.duration / 60),
        status: 'scheduled',
        notes: newLesson.notes || undefined,
      }
      if (editingLesson) {
        setLessons(lessons.map(l => l.id === editingLesson.id ? lesson : l))
      } else {
        setLessons([...lessons, lesson])
        // Update student enrolled lessons
        setStudents(students.map(s => 
          s.id === student.id 
            ? { ...s, enrolledLessons: [...s.enrolledLessons, lesson.id], totalLessons: s.totalLessons + 1 }
            : s
        ))
        // Update teacher total lessons
        setTeachers(teachers.map(t => 
          t.id === teacher.id 
            ? { ...t, totalLessons: t.totalLessons + 1 }
            : t
        ))
      }
      setShowLessonModal(false)
      setEditingLesson(null)
      setNewLesson({ teacherId: '', studentId: '', subject: '', date: '', time: '', duration: 60, notes: '' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'teacher') {
      setTeachers(teachers.filter(t => t.id !== id))
    } else if (type === 'student') {
      setStudents(students.filter(s => s.id !== id))
    } else if (type === 'lesson') {
      setLessons(lessons.filter(l => l.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setNewTeacher({ ...teacher, bio: teacher.bio || '' })
    setShowTeacherModal(true)
  }

  const openEditStudent = (student: Student) => {
    setEditingStudent(student)
    setNewStudent({ ...student, guardianName: student.guardianName || '', guardianPhone: student.guardianPhone || '' })
    setShowStudentModal(true)
  }

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setNewLesson({ ...lesson, date: lesson.date.toISOString().split('T')[0], notes: lesson.notes || '' })
    setShowLessonModal(true)
  }

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
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
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Professeurs</h2>
              <button 
                onClick={() => {
                  setEditingTeacher(null)
                  setNewTeacher({ name: '', email: '', phone: '', subjects: [], hourlyRate: 0, rating: 0, availability: [], bio: '', experience: 0 })
                  setNewSubject('')
                  setNewAvailability('')
                  setShowTeacherModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Professeur
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un professeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {filteredTeachers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun professeur trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold text-gray-900">{teacher.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditTeacher(teacher)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'teacher', id: teacher.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Élèves</h2>
              <button 
                onClick={() => {
                  setEditingStudent(null)
                  setNewStudent({ name: '', email: '', phone: '', guardianName: '', guardianPhone: '', subjects: [], level: 'elementary' })
                  setNewStudentSubject('')
                  setShowStudentModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvel Élève
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un élève..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun élève trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
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
              <button 
                onClick={() => {
                  setEditingLesson(null)
                  setNewLesson({ teacherId: '', studentId: '', subject: '', date: '', time: '', duration: 60, notes: '' })
                  setShowLessonModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Cours
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {filteredLessons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun cours trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLessons.map((lesson) => (
                  <div key={lesson.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{lesson.studentName} - {lesson.subject}</h3>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => openEditLesson(lesson)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'lesson', id: lesson.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                          lesson.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lesson.status === 'completed' ? 'Terminé' :
                           lesson.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                        </span>
                        <div className="space-y-2 text-sm mt-3">
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

      {/* Teacher Modal */}
      <Modal
        isOpen={showTeacherModal}
        onClose={() => {
          setShowTeacherModal(false)
          setEditingTeacher(null)
          setNewTeacher({ name: '', email: '', phone: '', subjects: [], hourlyRate: 0, rating: 0, availability: [], bio: '', experience: 0 })
          setNewSubject('')
          setNewAvailability('')
        }}
        title={editingTeacher ? 'Modifier le professeur' : 'Nouveau professeur'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (DZD) *</label>
              <input
                type="number"
                value={newTeacher.hourlyRate}
                onChange={(e) => setNewTeacher({ ...newTeacher, hourlyRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expérience (ans) *</label>
              <input
                type="number"
                value={newTeacher.experience}
                onChange={(e) => setNewTeacher({ ...newTeacher, experience: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matières *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newSubject.trim()) {
                    e.preventDefault()
                    setNewTeacher({ ...newTeacher, subjects: [...newTeacher.subjects, newSubject.trim()] })
                    setNewSubject('')
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ajouter une matière"
              />
              <button
                onClick={() => {
                  if (newSubject.trim()) {
                    setNewTeacher({ ...newTeacher, subjects: [...newTeacher.subjects, newSubject.trim()] })
                    setNewSubject('')
                  }
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newTeacher.subjects.map((subject, idx) => (
                <span key={idx} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm flex items-center gap-2">
                  {subject}
                  <button
                    onClick={() => setNewTeacher({ ...newTeacher, subjects: newTeacher.subjects.filter((_, i) => i !== idx) })}
                    className="text-violet-800 hover:text-violet-900"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
            <div className="flex gap-2 mb-2">
              <select
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Sélectionner un jour</option>
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (newAvailability && !newTeacher.availability.includes(newAvailability)) {
                    setNewTeacher({ ...newTeacher, availability: [...newTeacher.availability, newAvailability] })
                    setNewAvailability('')
                  }
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newTeacher.availability.map((day, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {day}
                  <button
                    onClick={() => setNewTeacher({ ...newTeacher, availability: newTeacher.availability.filter((_, i) => i !== idx) })}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
            <textarea
              value={newTeacher.bio}
              onChange={(e) => setNewTeacher({ ...newTeacher, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowTeacherModal(false)
                setEditingTeacher(null)
                setNewTeacher({ name: '', email: '', phone: '', subjects: [], hourlyRate: 0, rating: 0, availability: [], bio: '', experience: 0 })
                setNewSubject('')
                setNewAvailability('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddTeacher}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              {editingTeacher ? 'Modifier' : 'Ajouter'}
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
          setNewStudent({ name: '', email: '', phone: '', guardianName: '', guardianPhone: '', subjects: [], level: 'elementary' })
          setNewStudentSubject('')
        }}
        title={editingStudent ? 'Modifier l\'élève' : 'Nouvel élève'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du tuteur</label>
              <input
                type="text"
                value={newStudent.guardianName}
                onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone tuteur</label>
              <input
                type="tel"
                value={newStudent.guardianPhone}
                onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
            <select
              value={newStudent.level}
              onChange={(e) => setNewStudent({ ...newStudent, level: e.target.value as Student['level'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="elementary">Primaire</option>
              <option value="middle">Collège</option>
              <option value="high">Lycée</option>
              <option value="university">Université</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matières *</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStudentSubject}
                onChange={(e) => setNewStudentSubject(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newStudentSubject.trim()) {
                    e.preventDefault()
                    setNewStudent({ ...newStudent, subjects: [...newStudent.subjects, newStudentSubject.trim()] })
                    setNewStudentSubject('')
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ajouter une matière"
              />
              <button
                onClick={() => {
                  if (newStudentSubject.trim()) {
                    setNewStudent({ ...newStudent, subjects: [...newStudent.subjects, newStudentSubject.trim()] })
                    setNewStudentSubject('')
                  }
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newStudent.subjects.map((subject, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {subject}
                  <button
                    onClick={() => setNewStudent({ ...newStudent, subjects: newStudent.subjects.filter((_, i) => i !== idx) })}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowStudentModal(false)
                setEditingStudent(null)
                setNewStudent({ name: '', email: '', phone: '', guardianName: '', guardianPhone: '', subjects: [], level: 'elementary' })
                setNewStudentSubject('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              {editingStudent ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => {
          setShowLessonModal(false)
          setEditingLesson(null)
          setNewLesson({ teacherId: '', studentId: '', subject: '', date: '', time: '', duration: 60, notes: '' })
        }}
        title={editingLesson ? 'Modifier le cours' : 'Nouveau cours'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professeur *</label>
            <select
              value={newLesson.teacherId}
              onChange={(e) => {
                setNewLesson({ ...newLesson, teacherId: e.target.value })
                const teacher = teachers.find(t => t.id === e.target.value)
                if (teacher && teacher.subjects.length > 0) {
                  setNewLesson({ ...newLesson, teacherId: e.target.value, subject: teacher.subjects[0] })
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Sélectionner un professeur</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} - DZD{t.hourlyRate}/h</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Élève *</label>
            <select
              value={newLesson.studentId}
              onChange={(e) => setNewLesson({ ...newLesson, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Sélectionner un élève</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
            <select
              value={newLesson.subject}
              onChange={(e) => setNewLesson({ ...newLesson, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">Sélectionner une matière</option>
              {newLesson.teacherId && teachers.find(t => t.id === newLesson.teacherId)?.subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newLesson.date}
                onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
              <input
                type="time"
                value={newLesson.time}
                onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes) *</label>
            <input
              type="number"
              value={newLesson.duration}
              onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 60 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              min="15"
              step="15"
            />
          </div>
          {newLesson.teacherId && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Prix estimé:</p>
              <p className="text-lg font-bold text-violet-600">
                DZD{teachers.find(t => t.id === newLesson.teacherId)?.hourlyRate || 0 * (newLesson.duration / 60)}
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newLesson.notes}
              onChange={(e) => setNewLesson({ ...newLesson, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowLessonModal(false)
                setEditingLesson(null)
                setNewLesson({ teacherId: '', studentId: '', subject: '', date: '', time: '', duration: 60, notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddLesson}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              {editingLesson ? 'Modifier' : 'Ajouter'}
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
