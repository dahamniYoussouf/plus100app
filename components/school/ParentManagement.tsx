'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Parent, Student } from '@/types/school'

interface Props {
  parents: Parent[]
  setParents: (parents: Parent[]) => void
  students: Student[]
}

export default function ParentManagement({ parents }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Parents</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Ajouter Parent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parents.map((parent) => (
          <div key={parent.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {parent.firstName} {parent.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{parent.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}


