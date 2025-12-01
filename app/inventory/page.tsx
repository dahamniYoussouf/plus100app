'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Package, TrendingDown, TrendingUp, AlertTriangle, BarChart3, ShoppingCart, Box } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'movements' | 'alerts'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  unit: string
  location: string
  lastMovement?: Date
}

interface Movement {
  id: string
  productId: string
  productName: string
  type: 'in' | 'out' | 'transfer' | 'adjustment'
  quantity: number
  reason: string
  date: Date
  user: string
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showMovementModal, setShowMovementModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', category: '', quantity: 0, minQuantity: 10, maxQuantity: 1000, unit: '', location: '' })
  const [newMovement, setNewMovement] = useState({ productId: '', type: 'in' as 'in' | 'out' | 'transfer' | 'adjustment', quantity: 0, reason: '', user: '' })

  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory-products')
    const savedMovements = localStorage.getItem('inventory-movements')

    if (savedProducts) {
      const parsed = JSON.parse(savedProducts)
      setProducts(parsed.map((p: any) => ({
        ...p,
        lastMovement: p.lastMovement ? new Date(p.lastMovement) : undefined,
      })))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Produit A', sku: 'PROD-001', category: 'Électronique', quantity: 150, minQuantity: 20, maxQuantity: 500, unit: 'pièces', location: 'Entrepôt A' },
        { id: '2', name: 'Produit B', sku: 'PROD-002', category: 'Mécanique', quantity: 45, minQuantity: 30, maxQuantity: 200, unit: 'pièces', location: 'Entrepôt B' },
        { id: '3', name: 'Produit C', sku: 'PROD-003', category: 'Électronique', quantity: 12, minQuantity: 25, maxQuantity: 100, unit: 'pièces', location: 'Entrepôt A' },
      ]
      setProducts(sample)
      localStorage.setItem('inventory-products', JSON.stringify(sample))
    }

    if (savedMovements) {
      const parsed = JSON.parse(savedMovements)
      setMovements(parsed.map((m: any) => ({
        ...m,
        date: new Date(m.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('inventory-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (movements.length > 0) localStorage.setItem('inventory-movements', JSON.stringify(movements))
  }, [movements])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'movements' as TabType, label: 'Mouvements', icon: ShoppingCart },
    { id: 'alerts' as TabType, label: 'Alertes', icon: AlertTriangle },
  ]

  const lowStock = products.filter(p => p.quantity < p.minQuantity)
  const outOfStock = products.filter(p => p.quantity === 0)
  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
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
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalValue}</p>
                  </div>
                  <Box className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rupture</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{outOfStock.length}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {(lowStock.length > 0 || outOfStock.length > 0) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3">⚠️ Alertes Stock</h3>
                <div className="space-y-2">
                  {outOfStock.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{p.name}</span>
                      <span className="font-semibold text-red-700 mt-1 sm:mt-0">Rupture de stock</span>
                    </div>
                  ))}
                  {lowStock.slice(0, 3).map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{p.name}</span>
                      <span className="font-semibold text-yellow-700 mt-1 sm:mt-0">Stock: {p.quantity} (min: {p.minQuantity})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Produits</h3>
                  <p className="text-sm text-gray-600">Suivi complet des produits et quantités</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Mouvements Stock</h3>
                  <p className="text-sm text-gray-600">Historique des entrées, sorties et transferts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes Automatiques</h3>
                  <p className="text-sm text-gray-600">Notifications stock faible et ruptures</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Emplacements</h3>
                  <p className="text-sm text-gray-600">Gestion multi-emplacements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Analyses et statistiques détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inventaire</h3>
                  <p className="text-sm text-gray-600">Inventaire physique et ajustements</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button 
                onClick={() => setShowProductModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => {
                const isLow = product.quantity < product.minQuantity
                const isOut = product.quantity === 0
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isOut ? 'bg-red-100 text-red-800' :
                        isLow ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {isOut ? 'Rupture' : isLow ? 'Faible' : 'Normal'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">SKU: {product.sku} • {product.category}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantité</span>
                        <span className="font-bold text-gray-900">{product.quantity} {product.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Min/Max</span>
                        <span className="text-sm text-gray-500">{product.minQuantity} / {product.maxQuantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Emplacement</span>
                        <span className="text-sm text-gray-500">{product.location}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'movements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mouvements</h2>
              <button 
                onClick={() => setShowMovementModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Nouveau Mouvement
              </button>
            </div>
            {movements.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun mouvement enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {movements.map((movement) => (
                  <div key={movement.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{movement.productName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{movement.reason}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(movement.date).toLocaleDateString('fr-FR')} - {movement.user}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {movement.type === 'in' ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`text-lg font-bold ${
                          movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Alertes Stock</h2>
            <div className="space-y-4">
              {outOfStock.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-red-900 mb-3">Rupture de Stock</h3>
                  <div className="space-y-2">
                    {outOfStock.map((p) => (
                      <div key={p.id} className="bg-white rounded-lg p-3">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <span className="text-sm text-red-700 ml-2">(Quantité: 0)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {lowStock.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">Stock Faible</h3>
                  <div className="space-y-2">
                    {lowStock.map((p) => (
                      <div key={p.id} className="bg-white rounded-lg p-3">
                        <span className="font-medium text-gray-900">{p.name}</span>
                        <span className="text-sm text-yellow-700 ml-2">
                          (Quantité: {p.quantity}, Minimum: {p.minQuantity})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {outOfStock.length === 0 && lowStock.length === 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune alerte pour le moment</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setNewProduct({ name: '', sku: '', category: '', quantity: 0, minQuantity: 10, maxQuantity: 1000, unit: '', location: '' })
        }}
        title="Ajouter Produit"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ex: Produit A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={newProduct.sku}
                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ex: PROD-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ex: Électronique"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ex: pièces"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement</label>
              <input
                type="text"
                value={newProduct.location}
                onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ex: Entrepôt A"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité min</label>
              <input
                type="number"
                value={newProduct.minQuantity}
                onChange={(e) => setNewProduct({ ...newProduct, minQuantity: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité max</label>
              <input
                type="number"
                value={newProduct.maxQuantity}
                onChange={(e) => setNewProduct({ ...newProduct, maxQuantity: parseInt(e.target.value) || 1000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProductModal(false)
                setNewProduct({ name: '', sku: '', category: '', quantity: 0, minQuantity: 10, maxQuantity: 1000, unit: '', location: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProduct.name && newProduct.sku && newProduct.category && newProduct.unit && newProduct.location) {
                  const product: Product = {
                    id: Date.now().toString(),
                    name: newProduct.name,
                    sku: newProduct.sku,
                    category: newProduct.category,
                    quantity: newProduct.quantity,
                    minQuantity: newProduct.minQuantity,
                    maxQuantity: newProduct.maxQuantity,
                    unit: newProduct.unit,
                    location: newProduct.location,
                  }
                  setProducts([...products, product])
                  setShowProductModal(false)
                  setNewProduct({ name: '', sku: '', category: '', quantity: 0, minQuantity: 10, maxQuantity: 1000, unit: '', location: '' })
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
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
          setNewMovement({ productId: '', type: 'in', quantity: 0, reason: '', user: '' })
        }}
        title="Nouveau Mouvement"
        size="lg"
      >
        <div className="space-y-4">
          {products.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
              <select
                value={newMovement.productId}
                onChange={(e) => setNewMovement({ ...newMovement, productId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Sélectionner un produit</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name} ({product.sku})</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newMovement.type}
              onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="in">Entrée</option>
              <option value="out">Sortie</option>
              <option value="transfer">Transfert</option>
              <option value="adjustment">Ajustement</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={newMovement.quantity}
                onChange={(e) => setNewMovement({ ...newMovement, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
              <input
                type="text"
                value={newMovement.user}
                onChange={(e) => setNewMovement({ ...newMovement, user: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
            <input
              type="text"
              value={newMovement.reason}
              onChange={(e) => setNewMovement({ ...newMovement, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Ex: Réception commande"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMovementModal(false)
                setNewMovement({ productId: '', type: 'in', quantity: 0, reason: '', user: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMovement.productId && newMovement.quantity > 0 && newMovement.reason && newMovement.user) {
                  const product = products.find(p => p.id === newMovement.productId)
                  if (product) {
                    const movement: Movement = {
                      id: Date.now().toString(),
                      productId: newMovement.productId,
                      productName: product.name,
                      type: newMovement.type,
                      quantity: newMovement.quantity,
                      reason: newMovement.reason,
                      date: new Date(),
                      user: newMovement.user,
                    }
                    setMovements([...movements, movement])
                    setShowMovementModal(false)
                    setNewMovement({ productId: '', type: 'in', quantity: 0, reason: '', user: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}