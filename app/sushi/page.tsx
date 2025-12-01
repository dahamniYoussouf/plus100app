'use client'

import { useState, useEffect } from 'react'
import { Fish, ShoppingCart, Package, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'
import Modal from '@/components/Modal'

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
  const [showDishModal, setShowDishModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [newDish, setNewDish] = useState({ name: '', description: '', price: 0, category: 'halal' as 'sushi' | 'sashimi' | 'rolls' | 'halal', ingredients: [] as string[] })
  const [newOrder, setNewOrder] = useState({ items: [] as Array<{ dishId: string; quantity: number }>, customerName: '', customerPhone: '' })
  const [newReservation, setNewReservation] = useState({ customerName: '', customerPhone: '', date: '', time: '', guests: 2, notes: '' })

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
              <button 
                onClick={() => setShowDishModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
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
                    <span className="text-lg sm:text-xl font-bold text-gray-900">DZD{dish.price.toFixed(2)}</span>
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
              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left w-full"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Commande</h3>
                <p className="text-sm text-gray-600">Créer une nouvelle commande</p>
              </button>
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
              <button
                onClick={() => setShowReservationModal(true)}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left w-full"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Réservation</h3>
                <p className="text-sm text-gray-600">Réserver une table</p>
              </button>
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

      {/* Modals */}
      <Modal
        isOpen={showDishModal}
        onClose={() => {
          setShowDishModal(false)
          setNewDish({ name: '', description: '', price: 0, category: 'halal', ingredients: [] })
        }}
        title="Ajouter Plat"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newDish.name}
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Maki Saumon Halal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newDish.description}
              onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={3}
              placeholder="Description du plat"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value as 'sushi' | 'sashimi' | 'rolls' | 'halal' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="halal">Halal</option>
                <option value="sushi">Sushi</option>
                <option value="sashimi">Sashimi</option>
                <option value="rolls">Rolls</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingrédients (séparés par virgule)</label>
            <input
              type="text"
              value={newDish.ingredients.join(', ')}
              onChange={(e) => setNewDish({ ...newDish, ingredients: e.target.value.split(',').map(i => i.trim()).filter(i => i) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Saumon halal, Riz, Algues"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDishModal(false)
                setNewDish({ name: '', description: '', price: 0, category: 'halal', ingredients: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDish.name && newDish.description && newDish.price > 0) {
                  const dish: Dish = {
                    id: Date.now().toString(),
                    name: newDish.name,
                    description: newDish.description,
                    price: newDish.price,
                    category: newDish.category,
                    available: true,
                    ingredients: newDish.ingredients,
                  }
                  setDishes([...dishes, dish])
                  setShowDishModal(false)
                  setNewDish({ name: '', description: '', price: 0, category: 'halal', ingredients: [] })
                }
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setNewOrder({ items: [], customerName: '', customerPhone: '' })
        }}
        title="Nouvelle Commande"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
              <input
                type="text"
                value={newOrder.customerName}
                onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          {dishes.filter(d => d.available).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plats</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {dishes.filter(d => d.available).map(dish => {
                  const orderItem = newOrder.items.find(i => i.dishId === dish.id)
                  return (
                    <div key={dish.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{dish.name}</p>
                        <p className="text-sm text-gray-500">{dish.price.toFixed(2)} DZD</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (orderItem && orderItem.quantity > 0) {
                              setNewOrder({
                                ...newOrder,
                                items: newOrder.items.map(i => i.dishId === dish.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
                              })
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{orderItem?.quantity || 0}</span>
                        <button
                          onClick={() => {
                            if (orderItem) {
                              setNewOrder({
                                ...newOrder,
                                items: newOrder.items.map(i => i.dishId === dish.id ? { ...i, quantity: i.quantity + 1 } : i)
                              })
                            } else {
                              setNewOrder({
                                ...newOrder,
                                items: [...newOrder.items, { dishId: dish.id, quantity: 1 }]
                              })
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              {newOrder.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">
                    Total: {newOrder.items.reduce((sum, item) => {
                      const dish = dishes.find(d => d.id === item.dishId)
                      return sum + (dish ? dish.price * item.quantity : 0)
                    }, 0).toFixed(2)} DZD
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowOrderModal(false)
                setNewOrder({ items: [], customerName: '', customerPhone: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newOrder.customerName && newOrder.customerPhone && newOrder.items.length > 0) {
                  const total = newOrder.items.reduce((sum, item) => {
                    const dish = dishes.find(d => d.id === item.dishId)
                    return sum + (dish ? dish.price * item.quantity : 0)
                  }, 0)
                  const order = {
                    id: Date.now().toString(),
                    customerName: newOrder.customerName,
                    customerPhone: newOrder.customerPhone,
                    items: newOrder.items.map(item => {
                      const dish = dishes.find(d => d.id === item.dishId)
                      return {
                        dishId: item.dishId,
                        dishName: dish ? dish.name : '',
                        quantity: item.quantity,
                        price: dish ? dish.price : 0
                      }
                    }),
                    total,
                    status: 'pending',
                    createdAt: new Date(),
                  }
                  setOrders([...orders, order])
                  setShowOrderModal(false)
                  setNewOrder({ items: [], customerName: '', customerPhone: '' })
                }
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReservationModal}
        onClose={() => {
          setShowReservationModal(false)
          setNewReservation({ customerName: '', customerPhone: '', date: '', time: '', guests: 2, notes: '' })
        }}
        title="Nouvelle Réservation"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
              <input
                type="text"
                value={newReservation.customerName}
                onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newReservation.customerPhone}
                onChange={(e) => setNewReservation({ ...newReservation, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newReservation.date}
                onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newReservation.time}
                onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de convives</label>
            <input
              type="number"
              value={newReservation.guests}
              onChange={(e) => setNewReservation({ ...newReservation, guests: parseInt(e.target.value) || 2 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newReservation.notes}
              onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowReservationModal(false)
                setNewReservation({ customerName: '', customerPhone: '', date: '', time: '', guests: 2, notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newReservation.customerName && newReservation.customerPhone && newReservation.date && newReservation.time) {
                  const reservation = {
                    id: Date.now().toString(),
                    customerName: newReservation.customerName,
                    customerPhone: newReservation.customerPhone,
                    date: newReservation.date,
                    time: newReservation.time,
                    guests: newReservation.guests,
                    notes: newReservation.notes || undefined,
                    status: 'pending',
                    createdAt: new Date(),
                  }
                  setReservations([...reservations, reservation])
                  setShowReservationModal(false)
                  setNewReservation({ customerName: '', customerPhone: '', date: '', time: '', guests: 2, notes: '' })
                }
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
