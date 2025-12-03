'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, Save, MapPin } from 'lucide-react'
import { Destination } from '@/types/travel'

interface DestinationManagementProps {
  destinations: Destination[]
  setDestinations: (destinations: Destination[]) => void
}

const categories = [
  { value: 'culture', label: 'Culture' },
  { value: 'nature', label: 'Nature' },
  { value: 'beach', label: 'Plage' },
  { value: 'adventure', label: 'Aventure' },
  { value: 'city', label: 'Ville' },
  { value: 'romantic', label: 'Romantique' },
]

export default function DestinationManagement({
  destinations,
  setDestinations,
}: DestinationManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    country: '',
    city: '',
    description: '',
    price: 0,
    duration: 1,
    category: 'city',
    highlights: [],
    included: [],
    notIncluded: [],
  })

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenModal = (dest?: Destination) => {
    if (dest) {
      setEditingDestination(dest)
      setFormData(dest)
    } else {
      setEditingDestination(null)
      setFormData({
        name: '',
        country: '',
        city: '',
        description: '',
        price: 0,
        duration: 1,
        category: 'city',
        highlights: [],
        included: [],
        notIncluded: [],
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingDestination(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.country || !formData.price) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    if (editingDestination) {
      setDestinations(
        destinations.map((dest) =>
          dest.id === editingDestination.id
            ? { ...formData, id: editingDestination.id, image: formData.image || editingDestination.image } as Destination
            : dest
        )
      )
    } else {
      const newDestination: Destination = {
        id: Date.now().toString(),
        name: formData.name!,
        country: formData.country!,
        city: formData.city || '',
        description: formData.description || '',
        image: formData.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        price: formData.price!,
        duration: formData.duration || 1,
        category: formData.category || 'city',
        highlights: formData.highlights || [],
        included: formData.included || [],
        notIncluded: formData.notIncluded || [],
      }
      setDestinations([...destinations, newDestination])
    }
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette destination ?')) {
      setDestinations(destinations.filter((dest) => dest.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Destinations</h2>
          <p className="text-gray-500">Gérez vos destinations de voyage</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter Destination
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div key={dest.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                  {categories.find((c) => c.value === dest.category)?.label}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{dest.city}, {dest.country}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(dest)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dest.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-blue-600"> DZD{dest.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {dest.duration} jours</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune destination trouvée</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingDestination ? 'Modifier Destination' : 'Nouvelle Destination'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Paris - Ville Lumière"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: France"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Description de la destination..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="URL de l'image"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




