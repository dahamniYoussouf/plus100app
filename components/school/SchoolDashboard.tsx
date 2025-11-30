'use client'

import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react'
import { Student, Parent, Class, Grade } from '@/types/school'

interface Props {
  students: Student[]
  parents: Parent[]
  classes: Class[]
  grades: Grade[]
}

export default function SchoolDashboard({ students, parents, classes, grades }: Props) {
  const stats = {
    totalStudents: students.length,
    totalParents: parents.length,
    totalClasses: classes.length,
    totalGrades: grades.length,
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Étudiants</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Parents</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalParents}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalClasses}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Notes</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalGrades}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

