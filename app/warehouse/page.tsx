'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Warehouse, Package, BarChart3, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'inventory' | 'movements' | 'locations' | 'reports'

interface Item {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  unit: string
  minStock: number
  maxStock: number
  location: string
  cost: number
  supplier?: string
}

interface Movement {
  id: string
  itemId: string
  itemName: string
  type: 'in' | 'out' | 'transfer'
  quantity: number
  fromLocation?: string
  toLocation?: string
  reason: string
  date: Date
  operator: string
}

interface Location {
  id: string
  name: string
  type: 'shelf' | 'rack' | 'zone' | 'room'
  capacity: number
  currentOccupancy: number
  status: 'available' | 'full' | 'maintenance'
}

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [items, setItems] = useState<Item[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [showItemModal, setShowItemModal] = useState(false)
  const [showMovementModal, setShowMovementModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', sku: '', category: '', quantity: 0, unit: '', minStock: 10, maxStock: 1000, location: '', cost: 0, supplier: '' })
  const [newMovement, setNewMovement] = useState({ itemId: '', type: 'in' as 'in' | 'out' | 'transfer', quantity: 0, fromLocation: '', toLocation: '', reason: '', operator: '' })
  const [newLocation, setNewLocation] = useState({ name: '', type: 'shelf' as 'shelf' | 'rack' | 'zone' | 'room', capacity: 0 })

  useEffect(() => {
    const savedItems = localStorage.getItem('warehouse-items')
    const savedMovements = localStorage.getItem('warehouse-movements')
    const savedLocations = localStorage.getItem('warehouse-locations')

    if (savedItems) {
      setItems(JSON.parse(savedItems))
    } else {
      const sample: Item[] = [
        {
          id: '1',
          name: 'Produit A',
          sku: 'SKU-001',
          category: 'Électronique',
          quantity: 500,
          unit: 'pièce',
          minStock: 100,
          maxStock: 1000,
          location: 'A-12-05',
          cost: 25,
          supplier: 'Fournisseur ABC',
        },
        {
          id: '2',
          name: 'Produit B',
          sku: 'SKU-002',
          category: 'Mécanique',
          quantity: 50,
          unit: 'pièce',
          minStock: 100,
          maxStock: 500,
          location: 'B-08-12',
          cost: 150,
        },
      ]
      setItems(sample)
      localStorage.setItem('warehouse-items', JSON.stringify(sample))
    }

    if (savedMovements) {
      const parsed = JSON.parse(savedMovements)
      setMovements(parsed.map((m: any) => ({ ...m, date: new Date(m.date) })))
    } else {
      const sample: Movement[] = [
        {
          id: '1',
          itemId: '1',
          itemName: 'Produit A',
          type: 'in',
          quantity: 100,
          toLocation: 'A-12-05',
          reason: 'Réception stock',
          date: new Date(),
          operator: 'Omar Amrani',
        },
      ]
      setMovements(sample)
      localStorage.setItem('warehouse-movements', JSON.stringify(sample))
    }

    if (savedLocations) {
      setLocations(JSON.parse(savedLocations))
    } else {
      const sample: Location[] = [
        {
          id: '1',
          name: 'Zone A',
          type: 'zone',
          capacity: 10000,
          currentOccupancy: 7500,
          status: 'available',
        },
        {
          id: '2',
          name: 'Étagère B-08',
          type: 'shelf',
          capacity: 500,
          currentOccupancy: 450,
          status: 'available',
        },
      ]
      setLocations(sample)
      localStorage.setItem('warehouse-locations', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) localStorage.setItem('warehouse-items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (movements.length > 0) localStorage.setItem('warehouse-movements', JSON.stringify(movements))
  }, [movements])

  useEffect(() => {
    if (locations.length > 0) localStorage.setItem('warehouse-locations', JSON.stringify(locations))
  }, [locations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'inventory' as TabType, label: 'Inventaire', icon: Package },
    { id: 'movements' as TabType, label: 'Mouvements', icon: TrendingUp },
    { id: 'locations' as TabType, label: 'Emplacements', icon: Warehouse },
    { id: 'reports' as TabType, label: 'Rapports', icon: BarChart3 },
  ]

  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
  const lowStockItems = items.filter(item => item.quantity <= item.minStock).length
  const todayMovements = movements.filter(m => {
    const today = new Date()
    return m.date.toDateString() === today.toDateString()
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                      ? 'text-slate-600 border-b-2 border-slate-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Articles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Valeur Totale</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalValue.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockItems}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Mouvements Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayMovements}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {lowStockItems > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {items
                    .filter(item => item.quantity <= item.minStock)
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-3 text-sm">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-500 ml-2">- Stock: {item.quantity} (Min: {item.minStock})</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
              <button 
                onClick={() => setShowItemModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Ajouter Article
              </button>
            </div>
            {items.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun article</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                    item.quantity <= item.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">SKU: {item.sku} • {item.category}</p>
                        <p className="text-sm text-gray-600 mt-1">📍 {item.location}</p>
                        {item.supplier && <p className="text-sm text-gray-500 mt-1">Fournisseur: {item.supplier}</p>}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          item.quantity <= item.minStock ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-xs text-gray-500">Min: {item.minStock} / Max: {item.maxStock}</p>
                        <p className="text-sm text-gray-600 mt-1">DZD{item.cost}/unité</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mouvements</h2>
              <button 
                onClick={() => setShowMovementModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouveau Mouvement
              </button>
            </div>
            {movements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun mouvement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movements.map((movement) => (
                  <div key={movement.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{movement.itemName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{movement.reason}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        movement.type === 'in' ? 'bg-green-100 text-green-800' :
                        movement.type === 'out' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {movement.type === 'in' ? 'Entrée' :
                         movement.type === 'out' ? 'Sortie' : 'Transfert'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">📦 Quantité: {movement.quantity}</p>
                      {movement.toLocation && (
                        <p className="text-gray-600">📍 Vers: {movement.toLocation}</p>
                      )}
                      {movement.fromLocation && (
                        <p className="text-gray-600">📍 De: {movement.fromLocation}</p>
                      )}
                      <p className="text-gray-600">👤 {movement.operator}</p>
                      <p className="text-gray-500 text-xs">
                        📅 {new Date(movement.date).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Emplacements</h2>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Ajouter Emplacement
              </button>
            </div>
            {locations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Warehouse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun emplacement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {locations.map((location) => {
                  const occupancyPercent = (location.currentOccupancy / location.capacity) * 100
                  return (
                    <div key={location.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{location.name}</h3>
                          <p className="text-sm text-gray-500 capitalize mt-1">
                            {location.type === 'shelf' ? 'Étagère' :
                             location.type === 'rack' ? 'Rack' :
                             location.type === 'zone' ? 'Zone' : 'Salle'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          location.status === 'available' ? 'bg-green-100 text-green-800' :
                          location.status === 'full' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {location.status === 'available' ? 'Disponible' :
                           location.status === 'full' ? 'Plein' : 'Maintenance'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">Occupation</span>
                            <span className="font-medium">{occupancyPercent.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                occupancyPercent >= 90 ? 'bg-red-500' :
                                occupancyPercent >= 70 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${occupancyPercent}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {location.currentOccupancy} / {location.capacity}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Rapports d'inventaire et d'activité</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false)
          setNewItem({ name: '', sku: '', category: '', quantity: 0, unit: '', minStock: 10, maxStock: 1000, location: '', cost: 0, supplier: '' })
        }}
        title="Ajouter Article"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Produit A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: SKU-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Électronique"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: pièce, kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: A-12-05"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock min</label>
              <input
                type="number"
                value={newItem.minStock}
                onChange={(e) => setNewItem({ ...newItem, minStock: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock max</label>
              <input
                type="number"
                value={newItem.maxStock}
                onChange={(e) => setNewItem({ ...newItem, maxStock: parseInt(e.target.value) || 1000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD)</label>
              <input
                type="number"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur (optionnel)</label>
            <input
              type="text"
              value={newItem.supplier}
              onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Fournisseur ABC"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowItemModal(false)
                setNewItem({ name: '', sku: '', category: '', quantity: 0, unit: '', minStock: 10, maxStock: 1000, location: '', cost: 0, supplier: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newItem.name && newItem.sku && newItem.category && newItem.unit && newItem.location) {
                  const item: Item = {
                    id: Date.now().toString(),
                    name: newItem.name,
                    sku: newItem.sku,
                    category: newItem.category,
                    quantity: newItem.quantity,
                    unit: newItem.unit,
                    minStock: newItem.minStock,
                    maxStock: newItem.maxStock,
                    location: newItem.location,
                    cost: newItem.cost,
                    supplier: newItem.supplier || undefined,
                  }
                  setItems([...items, item])
                  setShowItemModal(false)
                  setNewItem({ name: '', sku: '', category: '', quantity: 0, unit: '', minStock: 10, maxStock: 1000, location: '', cost: 0, supplier: '' })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showMovementModal}
        onClose={() => {
          setShowMovementModal(false)
          setNewMovement({ itemId: '', type: 'in', quantity: 0, fromLocation: '', toLocation: '', reason: '', operator: '' })
        }}
        title="Nouveau Mouvement"
        size="lg"
      >
        <div className="space-y-4">
          {items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
              <select
                value={newMovement.itemId}
                onChange={(e) => setNewMovement({ ...newMovement, itemId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un article</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newMovement.type}
              onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="in">Entrée</option>
              <option value="out">Sortie</option>
              <option value="transfer">Transfert</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opérateur</label>
              <input
                type="text"
                value={newMovement.operator}
                onChange={(e) => setNewMovement({ ...newMovement, operator: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
          </div>
          {newMovement.type === 'transfer' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
                <input
                  type="text"
                  value={newMovement.fromLocation}
                  onChange={(e) => setNewMovement({ ...newMovement, fromLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Ex: A-12-05"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vers</label>
                <input
                  type="text"
                  value={newMovement.toLocation}
                  onChange={(e) => setNewMovement({ ...newMovement, toLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Ex: B-15-10"
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
            <input
              type="text"
              value={newMovement.reason}
              onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Réception commande"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMovementModal(false)
                setNewMovement({ itemId: '', type: 'in', quantity: 0, fromLocation: '', toLocation: '', reason: '', operator: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMovement.itemId && newMovement.quantity > 0 && newMovement.reason && newMovement.operator) {
                  const item = items.find(i => i.id === newMovement.itemId)
                  if (item) {
                    const movement: Movement = {
                      id: Date.now().toString(),
                      itemId: newMovement.itemId,
                      itemName: item.name,
                      type: newMovement.type,
                      quantity: newMovement.quantity,
                      fromLocation: newMovement.fromLocation || undefined,
                      toLocation: newMovement.toLocation || undefined,
                      reason: newMovement.reason,
                      date: new Date(),
                      operator: newMovement.operator,
                    }
                    setMovements([...movements, movement])
                    setShowMovementModal(false)
                    setNewMovement({ itemId: '', type: 'in', quantity: 0, fromLocation: '', toLocation: '', reason: '', operator: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false)
          setNewLocation({ name: '', type: 'shelf', capacity: 0 })
        }}
        title="Ajouter Emplacement"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newLocation.name}
              onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: A-12-05"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newLocation.type}
                onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="shelf">Étagère</option>
                <option value="rack">Rack</option>
                <option value="zone">Zone</option>
                <option value="room">Salle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={newLocation.capacity}
                onChange={(e) => setNewLocation({ ...newLocation, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowLocationModal(false)
                setNewLocation({ name: '', type: 'shelf', capacity: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newLocation.name && newLocation.capacity > 0) {
                  const location: Location = {
                    id: Date.now().toString(),
                    name: newLocation.name,
                    type: newLocation.type,
                    capacity: newLocation.capacity,
                    currentOccupancy: 0,
                    status: 'available',
                  }
                  setLocations([...locations, location])
                  setShowLocationModal(false)
                  setNewLocation({ name: '', type: 'shelf', capacity: 0 })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
