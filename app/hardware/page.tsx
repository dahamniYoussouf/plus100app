'use client'

import { useState, useEffect } from 'react'
import { Wrench, Package, ShoppingCart, BarChart3, TrendingUp, AlertTriangle, DollarSign, Users } from 'lucide-react'
import { Product, Sale } from '@/types/hardware'

type TabType = 'dashboard' | 'products' | 'sales' | 'inventory'

export default function HardwarePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])

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

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
  const totalRevenue = sales.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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

      {/* Main Content */}
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
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2"> DZD{totalRevenue.toFixed(0)}</p>
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

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Produits</h3>
                  <p className="text-sm text-gray-600">Ajout, modification et suppression de produits avec détails complets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inventaire</h3>
                  <p className="text-sm text-gray-600">Suivi des stocks avec alertes automatiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Point de Vente</h3>
                  <p className="text-sm text-gray-600">Système de vente avec facturation et reçus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Fournisseurs</h3>
                  <p className="text-sm text-gray-600">Gestion des fournisseurs et commandes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Catégories</h3>
                  <p className="text-sm text-gray-600">Organisation par catégories et sous-catégories</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de vente et analyses financières</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap">
                      {categoryNames[product.category] || product.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Fournisseur:</span>
                      <span className="font-medium">{product.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coût:</span>
                      <span className="font-medium"> DZD{product.cost}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900"> DZD{product.price}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                      product.stock <= product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ventes</h2>
            <p className="text-gray-600 mb-6">Système de point de vente et gestion des transactions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Vente</h3>
                <p className="text-sm text-gray-600">Créer une nouvelle transaction de vente</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique des ventes</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                <p className="text-sm text-gray-600">Analyses et statistiques de ventes</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Inventaire</h2>
            <p className="text-gray-600 mb-6">Gestion complète des stocks et réapprovisionnements</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Niveaux de Stock</h3>
                <p className="text-sm text-gray-600">Suivi en temps réel des niveaux de stock</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                <p className="text-sm text-gray-600">Gestion des commandes de réapprovisionnement</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Mouvements</h3>
                <p className="text-sm text-gray-600">Historique des entrées et sorties de stock</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
