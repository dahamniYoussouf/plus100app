'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Save, Plane, Calendar, Users, DollarSign } from 'lucide-react'
import { Circuit, Destination } from '@/types/travel'

interface CircuitManagementProps {
  circuits: Circuit[]
  setCircuits: (circuits: Circuit[]) => void
  destinations: Destination[]
}

export default function CircuitManagement({
  circuits,
  setCircuits,
  destinations,
}: CircuitManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCircuit, setEditingCircuit] = useState<Circuit | null>(null)

  const filteredCircuits = circuits.filter((circuit) =>
    circuit.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce circuit ?')) {
      setCircuits(circuits.filter((c) => c.id !== id))
    }
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    full: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Circuits</h2>
          <p className="text-gray-500">Créez et gérez vos circuits de voyage</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau Circuit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un circuit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCircuits.map((circuit) => (
          <div key={circuit.id} className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{circuit.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[circuit.status]}`}>
                  {circuit.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCircuit(circuit)
                    setIsModalOpen(true)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(circuit.id)} className="p-2 hover:bg-red-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{circuit.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{circuit.duration} jours</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>${circuit.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{circuit.currentParticipants}/{circuit.maxParticipants} participants</span>
              </div>
              {circuit.startDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Plane className="w-4 h-4" />
                  <span>{new Date(circuit.startDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Destinations: </span>
              <span className="font-medium text-gray-900">{circuit.destinations.length}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredCircuits.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucun circuit trouvé</p>
        </div>
      )}
    </div>
  )
}


