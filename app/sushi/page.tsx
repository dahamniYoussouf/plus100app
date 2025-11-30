'use client'

import { useState, useEffect } from 'react'
import { Fish, ShoppingCart, Package, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'

type TabType = 'dashboard' | 'menu' | 'orders' | 'reservations'

interface Dish {
  id: string
  name: string
  description: string
  price: number
  category: 'sushi' | 'sashimi' | 'rolls' | 'halal'
  available: boolean
  ingredients: string[]
}

export default function SushiPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('sushi-dishes')
    if (saved) {
      setDishes(JSON.parse(saved))
    } else {
      const sample: Dish[] = [
        { id: '1', name: 'Maki Saumon Halal', description: 'Maki avec saumon halal et riz', price: 8.50, category: 'halal', available: true, ingredients: ['Saumon halal', 'Riz', 'Algues'] },
        { id: '2', name: 'California Roll', description: 'Roll au crabe et avocat', price: 7.50, category: 'rolls', available: true, ingredients: ['Crabe', 'Avocat', 'Concombre'] },
        { id: '3', name: 'Sashimi Thon', description: 'Sashimi de thon frais', price: 12.00, category: 'sashimi', available: true, ingredients: ['Thon halal'] },
        { id: '4', name: 'Tempura Légumes', description: 'Légumes en tempura croustillant', price: 6.50, category: 'halal', available: true, ingredients: ['Légumes', 'Pâte tempura'] },
        { id: '5', name: 'Miso Soup', description: 'Soupe miso traditionnelle', price: 4.00, category: 'halal', available: true, ingredients: ['Miso', 'Tofu', 'Algues'] },
        { id: '6', name: 'Edamame', description: 'Fèves de soja salées', price: 3.50, category: 'halal', available: true, ingredients: ['Fèves de soja'] },
      ]
      setDishes(sample)
      localStorage.setItem('sushi-dishes', JSON.stringify(sample))
    }
  }, [])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'menu' as TabType, label: 'Menu', icon: Fish },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'reservations' as TabType, label: 'Réservations', icon: Calendar },
  ]

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
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
                      ? 'text-teal-600 border-b-2 border-teal-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Plats</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{dishes.length}</p>
                  </div>
                  <Fish className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{reservations.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-green-900 mb-2">Options Halal Disponibles</h3>
              <p className="text-sm text-green-800">
                Nous proposons une large sélection de plats halal certifiés. 
                Tous nos poissons sont certifiés halal et nos plats végétariens sont également disponibles.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Menu Complet</h3>
                  <p className="text-sm text-gray-600">Catalogue de plats avec catégories et prix</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Système de réservation de tables</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Gestion des commandes en ligne</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Plats Halal</h3>
                  <p className="text-sm text-gray-600">Sélection spéciale de plats halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Ajouter Plat
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {dishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{dish.name}</h3>
                    {dish.category === 'halal' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs whitespace-nowrap">
                        Halal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Ingrédients:</p>
                    <div className="flex flex-wrap gap-1">
                      {dish.ingredients.map((ing, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">€{dish.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Commandes</h2>
            <p className="text-gray-600 mb-6">Gestion des commandes de sushis</p>
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
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Réservations</h2>
            <p className="text-gray-600 mb-6">Gestion des réservations de tables</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Réservation</h3>
                <p className="text-sm text-gray-600">Réserver une table</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                <p className="text-sm text-gray-600">Voir le planning des réservations</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Confirmations</h3>
                <p className="text-sm text-gray-600">Gérer les confirmations</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
