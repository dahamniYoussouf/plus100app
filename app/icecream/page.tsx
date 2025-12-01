'use client'

import { useState, useEffect } from 'react'
import { IceCream, Package, ShoppingCart, BarChart3, TrendingUp, Calendar } from 'lucide-react'

type TabType = 'dashboard' | 'flavors' | 'orders' | 'stock'

interface Flavor {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: 'classic' | 'premium' | 'sorbet' | 'halal'
  available: boolean
}

export default function IcecreamPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('icecream-flavors')
    if (saved) {
      setFlavors(JSON.parse(saved))
    } else {
      const sample: Flavor[] = [
        { id: '1', name: 'Vanille Halal', description: 'Crème glacée vanille certifiée halal', price: 3.50, stock: 50, category: 'halal', available: true },
        { id: '2', name: 'Chocolat Halal', description: 'Crème glacée chocolat certifiée halal', price: 3.50, stock: 45, category: 'halal', available: true },
        { id: '3', name: 'Fraise', description: 'Sorbet fraise naturel', price: 3.00, stock: 40, category: 'sorbet', available: true },
        { id: '4', name: 'Menthe', description: 'Sorbet menthe rafraîchissant', price: 3.00, stock: 35, category: 'sorbet', available: true },
        { id: '5', name: 'Pistache Premium', description: 'Crème glacée pistache premium halal', price: 4.50, stock: 30, category: 'premium', available: true },
        { id: '6', name: 'Dates', description: 'Crème glacée aux dattes halal', price: 4.00, stock: 25, category: 'halal', available: true },
      ]
      setFlavors(sample)
      localStorage.setItem('icecream-flavors', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (flavors.length > 0) {
      localStorage.setItem('icecream-flavors', JSON.stringify(flavors))
    }
  }, [flavors])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'flavors' as TabType, label: 'Parfums', icon: IceCream },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const lowStock = flavors.filter((f) => f.stock < 20)

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Parfums</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{flavors.length}</p>
                  </div>
                  <IceCream className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2"> DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-cyan-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {lowStock.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Alertes Stock Faible</h3>
                <div className="space-y-2">
                  {lowStock.map((f) => (
                    <div key={f.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">{f.name}</span>
                      <span className="font-semibold text-yellow-700 mt-1 sm:mt-0">Stock: {f.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-green-900 mb-2">Certification Halal</h3>
              <p className="text-sm text-green-800">
                Tous nos parfums sont certifiés halal et respectent les standards islamiques. 
                Utilisation exclusive d'ingrédients halal.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Parfums</h3>
                  <p className="text-sm text-gray-600">Catalogue complet avec catégories et prix</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Système de commande et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Stock</h3>
                  <p className="text-sm text-gray-600">Suivi des stocks avec alertes automatiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Catégories Halal</h3>
                  <p className="text-sm text-gray-600">Organisation par catégories halal et premium</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de vente et analyses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et historique</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flavors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Parfums</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Ajouter Parfum
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {flavors.map((flavor) => (
                <div key={flavor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{flavor.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs whitespace-nowrap  DZD{
                      flavor.category === 'halal' ? 'bg-green-100 text-green-800' :
                      flavor.category === 'premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {flavor.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{flavor.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">DZD{flavor.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                      flavor.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Stock: {flavor.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Commandes</h2>
            <p className="text-gray-600 mb-6">Gestion des commandes de glace</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Commande</h3>
                <p className="text-sm text-gray-600">Créer une nouvelle commande client</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique des commandes</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
                <p className="text-sm text-gray-600">Analyses et rapports de ventes</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Gestion Stock</h2>
            <p className="text-gray-600 mb-6">Suivi des niveaux de stock par parfum</p>
            <div className="space-y-4">
              {flavors.map((flavor) => (
                <div key={flavor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <span className="font-medium text-gray-900">{flavor.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({flavor.category})</span>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className={`font-semibold  DZD{
                      flavor.stock < 20 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      Stock: {flavor.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
