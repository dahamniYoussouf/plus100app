'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { Student, Class, Parent } from '@/types/school'

interface Props {
  students: Student[]
  setStudents: (students: Student[]) => void
  classes: Class[]
  parents: Parent[]
}

export default function StudentManagement({ students, setStudents }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Ajouter Étudiant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{student.email}</p>
            <p className="text-sm text-gray-500">{student.grade}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

