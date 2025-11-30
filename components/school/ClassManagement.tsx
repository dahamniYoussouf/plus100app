'use client'

import { Plus } from 'lucide-react'
import { Class, Student } from '@/types/school'

interface Props {
  classes: Class[]
  setClasses: (classes: Class[]) => void
  students: Student[]
}

export default function ClassManagement({ classes }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Nouvelle Classe
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Prof: {cls.teacher}</p>
            <p className="text-sm text-gray-500">{cls.currentStudents}/{cls.capacity} étudiants</p>
          </div>
        ))}
      </div>
    </div>
  )
}

