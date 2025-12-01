'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { Parent, Student } from '@/types/school'
import Modal from '@/components/Modal'

interface Props {
  parents: Parent[]
  setParents: (parents: Parent[]) => void
  students: Student[]
}

export default function ParentManagement({ parents, setParents, students }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingParent, setEditingParent] = useState<Parent | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newParent, setNewParent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: 'father' as 'father' | 'mother' | 'guardian',
    studentIds: [] as string[],
    address: '',
  })

  const filtered = useMemo(() => parents.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [parents, searchTerm])

  const handleAddParent = () => {
    if (newParent.firstName && newParent.lastName && newParent.email && newParent.phone) {
      const parent: Parent = {
        id: editingParent?.id || Date.now().toString(),
        firstName: newParent.firstName,
        lastName: newParent.lastName,
        email: newParent.email,
        phone: newParent.phone,
        relationship: newParent.relationship,
        studentIds: newParent.studentIds,
        address: newParent.address || undefined,
      }
      if (editingParent) {
        setParents(parents.map(p => p.id === editingParent.id ? parent : p))
      } else {
        setParents([...parents, parent])
      }
      setShowModal(false)
      setEditingParent(null)
      setNewParent({ firstName: '', lastName: '', email: '', phone: '', relationship: 'father', studentIds: [], address: '' })
    }
  }

  const handleDelete = (id: string) => {
    setParents(parents.filter(p => p.id !== id))
    setDeleteConfirm(null)
  }

  const openEdit = (parent: Parent) => {
    setEditingParent(parent)
    setNewParent({ ...parent, address: parent.address || '' })
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Parents</h2>
        <button 
          onClick={() => {
            setEditingParent(null)
            setNewParent({ firstName: '', lastName: '', email: '', phone: '', relationship: 'father', studentIds: [], address: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter Parent
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Aucun parent trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((parent) => {
            const parentStudents = students.filter(s => parent.studentIds.includes(s.id))
            return (
              <div key={parent.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {parent.firstName} {parent.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{parent.email}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {parent.relationship === 'father' ? 'Père' :
                       parent.relationship === 'mother' ? 'Mère' : 'Tuteur'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(parent)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(parent.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📞 {parent.phone}</p>
                  {parent.address && <p>📍 {parent.address}</p>}
                  {parentStudents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Enfants:</p>
                      {parentStudents.map(s => (
                        <p key={s.id} className="text-xs text-gray-600">{s.firstName} {s.lastName}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingParent(null)
          setNewParent({ firstName: '', lastName: '', email: '', phone: '', relationship: 'father', studentIds: [], address: '' })
        }}
        title={editingParent ? 'Modifier le parent' : 'Nouveau parent'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                value={newParent.firstName}
                onChange={(e) => setNewParent({ ...newParent, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                value={newParent.lastName}
                onChange={(e) => setNewParent({ ...newParent, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={newParent.email}
                onChange={(e) => setNewParent({ ...newParent, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                value={newParent.phone}
                onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
            <select
              value={newParent.relationship}
              onChange={(e) => setNewParent({ ...newParent, relationship: e.target.value as 'father' | 'mother' | 'guardian' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="father">Père</option>
              <option value="mother">Mère</option>
              <option value="guardian">Tuteur</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newParent.address}
              onChange={(e) => setNewParent({ ...newParent, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enfants</label>
            <select
              multiple
              value={newParent.studentIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setNewParent({ ...newParent, studentIds: selected })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={3}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Maintenez Ctrl/Cmd pour sélectionner plusieurs</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowModal(false)
                setEditingParent(null)
                setNewParent({ firstName: '', lastName: '', email: '', phone: '', relationship: 'father', studentIds: [], address: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddParent}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingParent ? 'Modifier' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer ce parent ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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
