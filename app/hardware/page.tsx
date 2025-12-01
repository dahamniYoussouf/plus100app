'use client'

import { useState, useEffect, useMemo } from 'react'
import { Wrench, Package, ShoppingCart, BarChart3, TrendingUp, AlertTriangle, DollarSign, Users, Edit2, Trash2, Search, Filter, Plus, X } from 'lucide-react'
import { Product, Sale, SaleItem } from '@/types/hardware'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'products' | 'sales' | 'inventory'

export default function HardwarePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  
  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: 'tools' as Product['category'], price: 0, cost: 0, stock: 0, minStock: 0, supplier: '', available: true })
  const [newSale, setNewSale] = useState({ items: [] as { productId: string; quantity: number }[], paymentMethod: 'cash' as 'cash' | 'card' | 'check', customerName: '', date: new Date().toISOString().split('T')[0] })
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

  useEffect(() => {
    const savedProducts = localStorage.getItem('hardware-products')
    const savedSales = localStorage.getItem('hardware-sales')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Marteau Professionnel',
          description: 'Marteau robuste en acier inoxydable avec manche ergonomique',
          category: 'tools',
          price: 24.99,
          cost: 15.00,
          stock: 45,
          minStock: 10,
          supplier: 'Tools Inc',
          available: true,
        },
        {
          id: '2',
          name: 'Peinture Blanche 5L',
          description: 'Peinture acrylique blanche de qualité professionnelle',
          category: 'paint',
          price: 35.99,
          cost: 22.00,
          stock: 23,
          minStock: 15,
          supplier: 'Paint Co',
          available: true,
        },
        {
          id: '3',
          name: 'Vis à Tête Plate 50mm',
          description: 'Paquet de 100 vis en acier inoxydable',
          category: 'hardware',
          price: 8.99,
          cost: 4.50,
          stock: 156,
          minStock: 50,
          supplier: 'Hardware Pro',
          available: true,
        },
      ]
      setProducts(sample)
      localStorage.setItem('hardware-products', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('hardware-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('hardware-sales', JSON.stringify(sales))
  }, [sales])

  const lowStockProducts = useMemo(() => products.filter((p) => p.stock <= p.minStock), [products])
  const totalRevenue = useMemo(() => sales.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.total, 0), [sales])
  const categories = ['tools', 'paint', 'electrical', 'plumbing', 'hardware', 'outdoor', 'safety']
  const categoryNames: Record<string, string> = {
    tools: 'Outils',
    paint: 'Peinture',
    electrical: 'Électricité',
    plumbing: 'Plomberie',
    hardware: 'Quincaillerie',
    outdoor: 'Extérieur',
    safety: 'Sécurité'
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'inventory' as TabType, label: 'Inventaire', icon: TrendingUp },
  ]

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory)
    }
    return filtered
  }, [products, searchQuery, filterCategory])

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const product: Product = {
        id: editingProduct?.id || Date.now().toString(),
        ...newProduct,
        barcode: editingProduct?.barcode,
        image: editingProduct?.image,
      }
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? product : p))
      } else {
        setProducts([...products, product])
      }
      setShowProductModal(false)
      setEditingProduct(null)
      setNewProduct({ name: '', description: '', category: 'tools', price: 0, cost: 0, stock: 0, minStock: 0, supplier: '', available: true })
    }
  }

  const handleAddSale = () => {
    if (newSale.items.length > 0 && newSale.date) {
      const saleItems: SaleItem[] = newSale.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        if (!product) return null
        return {
          id: Date.now().toString() + Math.random(),
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        }
      }).filter(Boolean) as SaleItem[]
      
      const total = saleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      const sale: Sale = {
        id: editingSale?.id || Date.now().toString(),
        items: saleItems,
        total,
        paymentMethod: newSale.paymentMethod,
        customerName: newSale.customerName || undefined,
        date: new Date(newSale.date),
        status: 'completed',
      }
      
      if (editingSale) {
        setSales(sales.map(s => s.id === editingSale.id ? sale : s))
      } else {
        setSales([...sales, sale])
        // Update product stock
        saleItems.forEach(item => {
          const product = products.find(p => p.id === item.productId)
          if (product) {
            setProducts(products.map(p => 
              p.id === item.productId 
                ? { ...p, stock: Math.max(0, p.stock - item.quantity) }
                : p
            ))
          }
        })
      }
      
      setShowSaleModal(false)
      setEditingSale(null)
      setNewSale({ items: [], paymentMethod: 'cash', customerName: '', date: new Date().toISOString().split('T')[0] })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'product') {
      setProducts(products.filter(p => p.id !== id))
    } else if (type === 'sale') {
      setSales(sales.filter(s => s.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({ ...product })
    setShowProductModal(true)
  }

  const openEditSale = (sale: Sale) => {
    setEditingSale(sale)
    setNewSale({
      items: sale.items.map(item => ({ productId: item.productId, quantity: item.quantity })),
      paymentMethod: sale.paymentMethod,
      customerName: sale.customerName || '',
      date: sale.date.toISOString().split('T')[0],
    })
    setShowSaleModal(true)
  }

  const addSaleItem = () => {
    if (newSale.items.length === 0 || newSale.items[newSale.items.length - 1].productId) {
      setNewSale({ ...newSale, items: [...newSale.items, { productId: '', quantity: 1 }] })
    }
  }

  const updateSaleItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const updatedItems = [...newSale.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewSale({ ...newSale, items: updatedItems })
  }

  const removeSaleItem = (index: number) => {
    setNewSale({ ...newSale, items: newSale.items.filter((_, i) => i !== index) })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                Gestion Quincaillerie
              </h1>
              <p className="text-sm text-gray-500 mt-1">Gestion complète de quincaillerie avec inventaire et ventes</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-10">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{sales.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockProducts.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Alertes Stock Faible
                </h3>
                <div className="space-y-2">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">{p.name}</span>
                      <span className="font-semibold text-yellow-700 mt-1 sm:mt-0">
                        Stock: {p.stock} (Min: {p.minStock})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({ name: '', description: '', category: 'tools', price: 0, cost: 0, stock: 0, minStock: 0, supplier: '', available: true })
                  setShowProductModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter Produit
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{categoryNames[cat]}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg flex-1">{product.name}</h3>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => openEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap mb-2 inline-block">
                      {categoryNames[product.category] || product.category}
                    </span>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Fournisseur:</span>
                        <span className="font-medium">{product.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût:</span>
                        <span className="font-medium">DZD{product.cost.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">DZD{product.price.toFixed(2)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stock <= product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button 
                onClick={() => {
                  setEditingSale(null)
                  setNewSale({ items: [], paymentMethod: 'cash', customerName: '', date: new Date().toISOString().split('T')[0] })
                  setShowSaleModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Vente
              </button>
            </div>

            {sales.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">Vente #{sale.id}</h3>
                            {sale.customerName && (
                              <p className="text-sm text-gray-600 mt-1">Client: {sale.customerName}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(sale.date).toLocaleDateString('fr-FR')} - {sale.paymentMethod === 'cash' ? 'Espèces' : sale.paymentMethod === 'card' ? 'Carte' : 'Chèque'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditSale(sale)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'sale', id: sale.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1 mt-3">
                          {sale.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-gray-600">
                              {item.quantity}x {item.productName} - DZD{item.price.toFixed(2)}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold text-gray-900">DZD{sale.total.toFixed(2)}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.status === 'completed' ? 'Complétée' : 'Remboursée'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                  product.stock <= product.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{categoryNames[product.category]}</p>
                      <p className="text-sm text-gray-600 mt-1">Fournisseur: {product.supplier}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${
                        product.stock <= product.minStock ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {product.stock}
                      </p>
                      <p className="text-xs text-gray-500">Min: {product.minStock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setNewProduct({ name: '', description: '', category: 'tools', price: 0, cost: 0, stock: 0, minStock: 0, supplier: '', available: true })
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{categoryNames[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur *</label>
              <input
                type="text"
                value={newProduct.supplier}
                onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD) *</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD) *</label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum *</label>
              <input
                type="number"
                value={newProduct.minStock}
                onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.available}
              onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">Disponible</label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowProductModal(false)
                setEditingProduct(null)
                setNewProduct({ name: '', description: '', category: 'tools', price: 0, cost: 0, stock: 0, minStock: 0, supplier: '', available: true })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingProduct ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Sale Modal */}
      <Modal
        isOpen={showSaleModal}
        onClose={() => {
          setShowSaleModal(false)
          setEditingSale(null)
          setNewSale({ items: [], paymentMethod: 'cash', customerName: '', date: new Date().toISOString().split('T')[0] })
        }}
        title={editingSale ? 'Modifier la vente' : 'Nouvelle vente'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement *</label>
              <select
                value={newSale.paymentMethod}
                onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value as 'cash' | 'card' | 'check' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="cash">Espèces</option>
                <option value="card">Carte</option>
                <option value="check">Chèque</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client (optionnel)</label>
            <input
              type="text"
              value={newSale.customerName}
              onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produits *</label>
            <div className="space-y-2">
              {newSale.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <select
                    value={item.productId}
                    onChange={(e) => updateSaleItem(idx, 'productId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.filter(p => p.available).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - DZD{p.price.toFixed(2)} (Stock: {p.stock})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateSaleItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                  <button
                    onClick={() => removeSaleItem(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addSaleItem}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>
          </div>
          {newSale.items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total estimé:</p>
              <p className="text-2xl font-bold text-blue-600">
                DZD{newSale.items.reduce((sum, item) => {
                  const product = products.find(p => p.id === item.productId)
                  return sum + (product?.price || 0) * item.quantity
                }, 0).toFixed(2)}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowSaleModal(false)
                setEditingSale(null)
                setNewSale({ items: [], paymentMethod: 'cash', customerName: '', date: new Date().toISOString().split('T')[0] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddSale}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingSale ? 'Modifier' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
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
