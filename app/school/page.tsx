'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, Users, BookOpen, Calendar, Settings, LogOut, BarChart3 } from 'lucide-react'
import SchoolDashboard from '@/components/school/SchoolDashboard'
import StudentManagement from '@/components/school/StudentManagement'
import ParentManagement from '@/components/school/ParentManagement'
import ClassManagement from '@/components/school/ClassManagement'
import { Student, Parent, Class, Grade } from '@/types/school'

type TabType = 'dashboard' | 'students' | 'parents' | 'classes'

export default function SchoolPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [students, setStudents] = useState<Student[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [grades, setGrades] = useState<Grade[]>([])

  useEffect(() => {
    const savedStudents = localStorage.getItem('school-students')
    const savedParents = localStorage.getItem('school-parents')
    const savedClasses = localStorage.getItem('school-classes')
    const savedGrades = localStorage.getItem('school-grades')

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents))
    } else {
      const sample: Student[] = [
        {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Benali',
          email: 'ahmed@school.com',
          phone: '+213 555 1234',
          dateOfBirth: new Date('2010-05-15'),
          grade: '6ème',
          classId: '1',
          parentIds: ['1'],
          address: 'Alger',
        },
        {
          id: '2',
          firstName: 'Fatima',
          lastName: 'Kadri',
          email: 'fatima@school.com',
          phone: '+213 555 5678',
          dateOfBirth: new Date('2011-03-20'),
          grade: '5ème',
          classId: '2',
          parentIds: ['2'],
          address: 'Oran',
        },
      ]
      setStudents(sample)
      localStorage.setItem('school-students', JSON.stringify(sample))
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
          phone: '+213 555 1111',
          relationship: 'father',
          studentIds: ['1'],
        },
        {
          id: '2',
          firstName: 'Aicha',
          lastName: 'Kadri',
          email: 'aicha@email.com',
          phone: '+213 555 2222',
          relationship: 'mother',
          studentIds: ['2'],
        },
      ]
      setParents(sample)
      localStorage.setItem('school-parents', JSON.stringify(sample))
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    } else {
      const sample: Class[] = [
        {
          id: '1',
          name: '6ème A',
          grade: '6ème',
          teacher: 'Mme. Sarah',
          schedule: 'Lundi-Vendredi 8h-16h',
          capacity: 30,
          currentStudents: 1,
        },
        {
          id: '2',
          name: '5ème B',
          grade: '5ème',
          teacher: 'Mr. Ali',
          schedule: 'Lundi-Vendredi 8h-16h',
          capacity: 30,
          currentStudents: 1,
        },
      ]
      setClasses(sample)
      localStorage.setItem('school-classes', JSON.stringify(sample))
    }

    if (savedGrades) {
      setGrades(JSON.parse(savedGrades))
    }
  }, [])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('school-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (parents.length > 0) localStorage.setItem('school-parents', JSON.stringify(parents))
  }, [parents])

  useEffect(() => {
    if (classes.length > 0) localStorage.setItem('school-classes', JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    if (grades.length > 0) localStorage.setItem('school-grades', JSON.stringify(grades))
  }, [grades])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students' as TabType, label: 'Étudiants', icon: Users },
    { id: 'parents' as TabType, label: 'Parents', icon: Users },
    { id: 'classes' as TabType, label: 'Classes', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative  DZD{
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="p-6">
        {activeTab === 'dashboard' && (
          <SchoolDashboard
            students={students}
            parents={parents}
            classes={classes}
            grades={grades}
          />
        )}
        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            setStudents={setStudents}
            classes={classes}
            parents={parents}
          />
        )}
        {activeTab === 'parents' && (
          <ParentManagement
            parents={parents}
            setParents={setParents}
            students={students}
          />
        )}
        {activeTab === 'classes' && (
          <ClassManagement
            classes={classes}
            setClasses={setClasses}
            students={students}
          />
        )}
      </main>
    </div>
  )
}

