'use client'

import { useState, useEffect } from 'react'
import { Pizza, ShoppingCart, Package, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'menu' | 'orders' | 'customization'

interface PizzaItem {
  id: string
  name: string
  description: string
  basePrice: number
  category: 'classic' | 'premium' | 'halal'
  sizes: { name: string; price: number }[]
  toppings: string[]
  available: boolean
}

export default function PizzaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [pizzas, setPizzas] = useState<PizzaItem[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('pizza-menu')
    if (saved) {
      setPizzas(JSON.parse(saved))
    } else {
      const sample: PizzaItem[] = [
        {
          id: '1',
          name: 'Pizza Margherita Halal',
          description: 'Tomate, mozzarella halal et basilic',
          basePrice: 8.99,
          category: 'halal',
          sizes: [
            { name: 'Petite', price: 8.99 },
            { name: 'Moyenne', price: 12.99 },
            { name: 'Grande', price: 16.99 }
          ],
          toppings: ['Tomate', 'Mozzarella Halal', 'Basilic'],
          available: true
        },
        {
          id: '2',
          name: 'Pizza Poulet Halal',
          description: 'Poulet halal, poivrons et oignons',
          basePrice: 11.99,
          category: 'halal',
          sizes: [
            { name: 'Petite', price: 11.99 },
            { name: 'Moyenne', price: 15.99 },
            { name: 'Grande', price: 19.99 }
          ],
          toppings: ['Poulet Halal', 'Poivrons', 'Oignons', 'Mozzarella Halal'],
          available: true
        },
        {
          id: '3',
          name: 'Pizza Végétarienne',
          description: 'Légumes frais et fromage halal',
          basePrice: 9.99,
          category: 'halal',
          sizes: [
            { name: 'Petite', price: 9.99 },
            { name: 'Moyenne', price: 13.99 },
            { name: 'Grande', price: 17.99 }
          ],
          toppings: ['Légumes', 'Fromage Halal', 'Olives'],
          available: true
        },
      ]
      setPizzas(sample)
      localStorage.setItem('pizza-menu', JSON.stringify(sample))
    }
  }, [])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'menu' as TabType, label: 'Menu', icon: Pizza },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'customization' as TabType, label: 'Personnalisation', icon: Package },
  ]

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
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
                      ? 'text-red-600 border-b-2 border-red-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pizzas</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pizzas.length}</p>
                  </div>
                  <Pizza className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Préparation</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                      {orders.filter((o) => o.status === 'preparing').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-green-900 mb-2">Certification Halal</h3>
              <p className="text-sm text-green-800">
                Toutes nos pizzas sont préparées avec des ingrédients halal certifiés. 
                Fromages, viandes et sauces tous conformes aux standards islamiques.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Menu Pizzas</h3>
                  <p className="text-sm text-gray-600">Catalogue complet avec tailles et prix</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Personnalisation</h3>
                  <p className="text-sm text-gray-600">Choix de taille, garnitures et options</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Livraison</h3>
                  <p className="text-sm text-gray-600">Gestion des livraisons et suivi</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Système de commande en ligne</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Statut</h3>
                  <p className="text-sm text-gray-600">Suivi en temps réel des commandes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Pizzas</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ajouter Pizza
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pizzas.map((pizza) => (
                <div key={pizza.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{pizza.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs whitespace-nowrap">
                      Halal
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{pizza.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Tailles disponibles:</p>
                    <div className="flex flex-wrap gap-1">
                      {pizza.sizes.map((size, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {size.name}: €{size.price.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Garnitures:</p>
                    <div className="flex flex-wrap gap-1">
                      {pizza.toppings.map((topping, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {topping}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      À partir de €{pizza.basePrice.toFixed(2)}
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
            <p className="text-gray-600 mb-6">Gestion des commandes de pizzas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Commande</h3>
                <p className="text-sm text-gray-600">Créer une nouvelle commande</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">En Cours</h3>
                <p className="text-sm text-gray-600">Suivre les commandes en préparation</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Livraisons</h3>
                <p className="text-sm text-gray-600">Gérer les livraisons</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customization' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Personnalisation</h2>
            <p className="text-gray-600 mb-6">Options de personnalisation des pizzas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Tailles</h3>
                <p className="text-sm text-gray-600">Petite, Moyenne, Grande, Familiale</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Garnitures Halal</h3>
                <p className="text-sm text-gray-600">Poulet, Boeuf, Légumes halal</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Fromages</h3>
                <p className="text-sm text-gray-600">Mozzarella halal, Fromage végétarien</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
