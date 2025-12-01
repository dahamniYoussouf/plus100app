'use client'

import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { Class, Student } from '@/types/school'
import Modal from '@/components/Modal'

interface Props {
  classes: Class[]
  setClasses: (classes: Class[]) => void
  students: Student[]
}

export default function ClassManagement({ classes, setClasses, students }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newClass, setNewClass] = useState({
    name: '',
    grade: '',
    teacher: '',
    schedule: '',
    capacity: 30,
    subject: '',
  })

  const filtered = useMemo(() => classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.grade.toLowerCase().includes(searchTerm.toLowerCase())
  ), [classes, searchTerm])

  const handleAddClass = () => {
    if (newClass.name && newClass.grade && newClass.teacher) {
      const classItem: Class = {
        id: editingClass?.id || Date.now().toString(),
        name: newClass.name,
        grade: newClass.grade,
        teacher: newClass.teacher,
        schedule: newClass.schedule,
        capacity: newClass.capacity,
        currentStudents: editingClass?.currentStudents || students.filter(s => s.classId === editingClass?.id).length || 0,
        subject: newClass.subject || undefined,
      }
      if (editingClass) {
        setClasses(classes.map(c => c.id === editingClass.id ? classItem : c))
      } else {
        setClasses([...classes, classItem])
      }
      setShowModal(false)
      setEditingClass(null)
      setNewClass({ name: '', grade: '', teacher: '', schedule: '', capacity: 30, subject: '' })
    }
  }

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  const openEdit = (classItem: Class) => {
    setEditingClass(classItem)
    setNewClass({ ...classItem, subject: classItem.subject || '' })
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
        <button 
          onClick={() => {
            setEditingClass(null)
            setNewClass({ name: '', grade: '', teacher: '', schedule: '', capacity: 30, subject: '' })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Classe
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
          <p className="text-gray-600">Aucune classe trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cls) => {
            const classStudents = students.filter(s => s.classId === cls.id)
            return (
              <div key={cls.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Prof: {cls.teacher}</p>
                    <p className="text-sm text-gray-500">{cls.grade}</p>
                    <p className="text-sm text-gray-500">{cls.currentStudents}/{cls.capacity} étudiants</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(cls)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(cls.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📅 {cls.schedule}</p>
                  {cls.subject && <p>📚 {cls.subject}</p>}
                  {classStudents.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Étudiants:</p>
                      {classStudents.slice(0, 3).map(s => (
                        <p key={s.id} className="text-xs text-gray-600">{s.firstName} {s.lastName}</p>
                      ))}
                      {classStudents.length > 3 && (
                        <p className="text-xs text-gray-500">+{classStudents.length - 3} autres</p>
                      )}
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
          setEditingClass(null)
          setNewClass({ name: '', grade: '', teacher: '', schedule: '', capacity: 30, subject: '' })
        }}
        title={editingClass ? 'Modifier la classe' : 'Nouvelle classe'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 6ème A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
              <input
                type="text"
                value={newClass.grade}
                onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 6ème"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professeur *</label>
              <input
                type="text"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Mme. Sarah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité *</label>
              <input
                type="number"
                value={newClass.capacity}
                onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emploi du temps</label>
            <input
              type="text"
              value={newClass.schedule}
              onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Lundi-Vendredi 8h-16h"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
            <input
              type="text"
              value={newClass.subject}
              onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Mathématiques"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowModal(false)
                setEditingClass(null)
                setNewClass({ name: '', grade: '', teacher: '', schedule: '', capacity: 30, subject: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddClass}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingClass ? 'Modifier' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer cette classe ? Cette action est irréversible.
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
