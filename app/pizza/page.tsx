'use client'

import { useState, useEffect } from 'react'
import { Pizza, ShoppingCart, Package, BarChart3, TrendingUp, Users, Clock } from 'lucide-react'
import Modal from '@/components/Modal'

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
  const [showPizzaModal, setShowPizzaModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [newPizza, setNewPizza] = useState({ name: '', description: '', basePrice: 0, category: 'halal' as 'classic' | 'premium' | 'halal', sizes: [{ name: 'Petite', price: 0 }, { name: 'Moyenne', price: 0 }, { name: 'Grande', price: 0 }], toppings: [] as string[] })
  const [newOrder, setNewOrder] = useState({ items: [] as Array<{ pizzaId: string; size: string; quantity: number }>, customerName: '', customerPhone: '', type: 'dine-in' as 'dine-in' | 'delivery' | 'takeaway' })

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
              <button 
                onClick={() => setShowPizzaModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
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
                          {size.name}: DZD{size.price.toFixed(2)}
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
                      À partir de DZD{pizza.basePrice.toFixed(2)}
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

      {/* Modals */}
      <Modal
        isOpen={showPizzaModal}
        onClose={() => {
          setShowPizzaModal(false)
          setNewPizza({ name: '', description: '', basePrice: 0, category: 'halal', sizes: [{ name: 'Petite', price: 0 }, { name: 'Moyenne', price: 0 }, { name: 'Grande', price: 0 }], toppings: [] })
        }}
        title="Ajouter Pizza"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newPizza.name}
              onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Pizza Margherita Halal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newPizza.description}
              onChange={(e) => setNewPizza({ ...newPizza, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Description de la pizza"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newPizza.category}
                onChange={(e) => setNewPizza({ ...newPizza, category: e.target.value as 'classic' | 'premium' | 'halal' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="halal">Halal</option>
                <option value="classic">Classique</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (DZD)</label>
              <input
                type="number"
                value={newPizza.basePrice}
                onChange={(e) => setNewPizza({ ...newPizza, basePrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tailles et Prix</label>
            {newPizza.sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={size.name}
                  onChange={(e) => {
                    const updatedSizes = [...newPizza.sizes]
                    updatedSizes[index].name = e.target.value
                    setNewPizza({ ...newPizza, sizes: updatedSizes })
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Taille"
                />
                <input
                  type="number"
                  value={size.price}
                  onChange={(e) => {
                    const updatedSizes = [...newPizza.sizes]
                    updatedSizes[index].price = parseFloat(e.target.value) || 0
                    setNewPizza({ ...newPizza, sizes: updatedSizes })
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  placeholder="Prix"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Garnitures (séparées par virgule)</label>
            <input
              type="text"
              value={newPizza.toppings.join(', ')}
              onChange={(e) => setNewPizza({ ...newPizza, toppings: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Tomate, Mozzarella Halal, Basilic"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPizzaModal(false)
                setNewPizza({ name: '', description: '', basePrice: 0, category: 'halal', sizes: [{ name: 'Petite', price: 0 }, { name: 'Moyenne', price: 0 }, { name: 'Grande', price: 0 }], toppings: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newPizza.name && newPizza.description && newPizza.basePrice > 0) {
                  const pizza: PizzaItem = {
                    id: Date.now().toString(),
                    name: newPizza.name,
                    description: newPizza.description,
                    basePrice: newPizza.basePrice,
                    category: newPizza.category,
                    sizes: newPizza.sizes.filter(s => s.name && s.price > 0),
                    toppings: newPizza.toppings,
                    available: true,
                  }
                  setPizzas([...pizzas, pizza])
                  setShowPizzaModal(false)
                  setNewPizza({ name: '', description: '', basePrice: 0, category: 'halal', sizes: [{ name: 'Petite', price: 0 }, { name: 'Moyenne', price: 0 }, { name: 'Grande', price: 0 }], toppings: [] })
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          setNewOrder({ items: [], customerName: '', customerPhone: '', type: 'dine-in' })
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newOrder.customerPhone}
                onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newOrder.type}
              onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value as 'dine-in' | 'delivery' | 'takeaway' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="dine-in">Sur place</option>
              <option value="delivery">Livraison</option>
              <option value="takeaway">À emporter</option>
            </select>
          </div>
          {pizzas.filter(p => p.available).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pizzas</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pizzas.filter(p => p.available).map(pizza => {
                  const orderItem = newOrder.items.find(i => i.pizzaId === pizza.id)
                  return (
                    <div key={pizza.id} className="border border-gray-200 rounded-lg p-3">
                      <p className="font-medium text-gray-900 mb-2">{pizza.name}</p>
                      <div className="space-y-2">
                        {pizza.sizes.map((size, sizeIndex) => {
                          const itemKey = `${pizza.id}-${size.name}`
                          const item = newOrder.items.find(i => i.pizzaId === pizza.id && i.size === size.name)
                          return (
                            <div key={sizeIndex} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{size.name} - DZD{size.price.toFixed(2)}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    if (item && item.quantity > 0) {
                                      setNewOrder({
                                        ...newOrder,
                                        items: newOrder.items.map(i => i.pizzaId === pizza.id && i.size === size.name ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
                                      })
                                    }
                                  }}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{item?.quantity || 0}</span>
                                <button
                                  onClick={() => {
                                    if (item) {
                                      setNewOrder({
                                        ...newOrder,
                                        items: newOrder.items.map(i => i.pizzaId === pizza.id && i.size === size.name ? { ...i, quantity: i.quantity + 1 } : i)
                                      })
                                    } else {
                                      setNewOrder({
                                        ...newOrder,
                                        items: [...newOrder.items, { pizzaId: pizza.id, size: size.name, quantity: 1 }]
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
                    </div>
                  )
                })}
              </div>
              {newOrder.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-900">
                    Total: {newOrder.items.reduce((sum, item) => {
                      const pizza = pizzas.find(p => p.id === item.pizzaId)
                      const size = pizza?.sizes.find(s => s.name === item.size)
                      return sum + (size ? size.price * item.quantity : 0)
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
                setNewOrder({ items: [], customerName: '', customerPhone: '', type: 'dine-in' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newOrder.customerName && newOrder.customerPhone && newOrder.items.length > 0) {
                  const total = newOrder.items.reduce((sum, item) => {
                    const pizza = pizzas.find(p => p.id === item.pizzaId)
                    const size = pizza?.sizes.find(s => s.name === item.size)
                    return sum + (size ? size.price * item.quantity : 0)
                  }, 0)
                  const order = {
                    id: Date.now().toString(),
                    customerName: newOrder.customerName,
                    customerPhone: newOrder.customerPhone,
                    type: newOrder.type,
                    items: newOrder.items,
                    total,
                    status: 'pending',
                    createdAt: new Date(),
                  }
                  setOrders([...orders, order])
                  setShowOrderModal(false)
                  setNewOrder({ items: [], customerName: '', customerPhone: '', type: 'dine-in' })
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
