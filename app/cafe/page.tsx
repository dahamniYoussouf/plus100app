'use client'

import { Coffee, Package, Users, DollarSign, TrendingUp, Calendar, ShoppingCart, BarChart3, Award, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'menu' | 'orders' | 'customers' | 'loyalty'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'coffee' | 'tea' | 'juice' | 'pastry'
  halal: boolean
  available: boolean
}

interface Order {
  id: string
  customerId: string
  items: Array<{ menuItemId: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  createdAt: Date
  completedAt?: Date
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  loyaltyPoints: number
  totalOrders: number
  createdAt: Date
}

export default function CafePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: 0, category: 'coffee' as 'coffee' | 'tea' | 'juice' | 'pastry', halal: true })
  const [newOrder, setNewOrder] = useState({ customerId: '', items: [] as Array<{ menuItemId: string; quantity: number }> })
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    const savedMenu = localStorage.getItem('cafe-menu')
    const savedOrders = localStorage.getItem('cafe-orders')
    const savedCustomers = localStorage.getItem('cafe-customers')

    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu))
    } else {
      const sample: MenuItem[] = [
        { id: '1', name: 'Café Turc', description: 'Café turc authentique halal', price: 2.50, category: 'coffee', halal: true, available: true },
        { id: '2', name: 'Café Espresso Halal', description: 'Espresso certifié halal', price: 3.00, category: 'coffee', halal: true, available: true },
        { id: '3', name: 'Thé à la Menthe', description: 'Thé vert à la menthe traditionnel', price: 2.99, category: 'tea', halal: true, available: true },
        { id: '4', name: 'Jus d\'Orange Frais', description: 'Jus d\'orange pressé 100% naturel', price: 3.99, category: 'juice', halal: true, available: true },
        { id: '5', name: 'Croissant Halal', description: 'Croissant beurre halal', price: 1.50, category: 'pastry', halal: true, available: true },
        { id: '6', name: 'Gâteau au Chocolat', description: 'Gâteau au chocolat halal', price: 4.50, category: 'pastry', halal: true, available: true },
      ]
      setMenuItems(sample)
      localStorage.setItem('cafe-menu', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        completedAt: o.completedAt ? new Date(o.completedAt) : undefined,
      })))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      })))
    }
  }, [])

  useEffect(() => {
    if (menuItems.length > 0) localStorage.setItem('cafe-menu', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    if (orders.length > 0 || localStorage.getItem('cafe-orders')) {
      localStorage.setItem('cafe-orders', JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    if (customers.length > 0 || localStorage.getItem('cafe-customers')) {
      localStorage.setItem('cafe-customers', JSON.stringify(customers))
    }
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'menu' as TabType, label: 'Menu', icon: Coffee },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'loyalty' as TabType, label: 'Fidélité', icon: Award },
  ]

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing')
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
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
                      ? 'text-amber-600 border-b-2 border-amber-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{menuItems.length}</p>
                  </div>
                  <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {pendingOrders.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Commandes en attente</h3>
                <div className="space-y-2">
                  {pendingOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700">Commande #{order.id.slice(0, 8)}</span>
                      <span className="font-semibold text-yellow-700">DZD{order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-semibold text-green-900 mb-2">Certification Halal</h3>
              <p className="text-sm text-green-800">
                Tous nos produits sont certifiés halal et respectent les standards islamiques. 
                Traçabilité complète garantie pour chaque boisson et produit.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Menu Halal</h3>
                  <p className="text-sm text-gray-600">Gestion complète du menu avec produits certifiés halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Système de prise de commande rapide</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Fidélité</h3>
                  <p className="text-sm text-gray-600">Programme de points et récompenses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients avec historique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Gestion des réservations de tables</p>
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
                onClick={() => setShowMenuModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.name}</h3>
                    {item.halal && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs whitespace-nowrap">
                        Halal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">DZD{item.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commandes</h2>
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Commande #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.items.length} article(s) • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">DZD{order.total.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'completed' ? 'Terminée' :
                           order.status === 'preparing' ? 'En préparation' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button 
                onClick={() => setShowCustomerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Nouveau Client
              </button>
            </div>
            {customers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{customer.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{customer.email}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Points</p>
                        <p className="font-bold text-amber-600">{customer.loyaltyPoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Commandes</p>
                        <p className="font-bold text-gray-900">{customer.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Programme de Fidélité</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{totalLoyaltyPoints}</p>
                  <p className="text-sm text-gray-600">Points totaux</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                  <p className="text-sm text-gray-600">Membres actifs</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.length > 0 ? (totalLoyaltyPoints / customers.length).toFixed(0) : 0}
                  </p>
                  <p className="text-sm text-gray-600">Moyenne points</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-3">Récompenses</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">100 points</span>
                    <span className="font-semibold text-amber-700">10% de réduction</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">500 points</span>
                    <span className="font-semibold text-amber-700">Boisson gratuite</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">1000 points</span>
                    <span className="font-semibold text-amber-700">Cadeau surprise</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showMenuModal}
        onClose={() => {
          setShowMenuModal(false)
          setNewMenuItem({ name: '', description: '', price: 0, category: 'coffee', halal: true })
        }}
        title="Ajouter un produit"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newMenuItem.name}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Café Turc"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newMenuItem.description}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={3}
              placeholder="Description du produit"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value as 'coffee' | 'tea' | 'juice' | 'pastry' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="coffee">Café</option>
                <option value="tea">Thé</option>
                <option value="juice">Jus</option>
                <option value="pastry">Pâtisserie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newMenuItem.halal}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, halal: e.target.checked })}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Halal</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMenuModal(false)
                setNewMenuItem({ name: '', description: '', price: 0, category: 'coffee', halal: true })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMenuItem.name && newMenuItem.description && newMenuItem.price > 0) {
                  const menuItem: MenuItem = {
                    id: Date.now().toString(),
                    name: newMenuItem.name,
                    description: newMenuItem.description,
                    price: newMenuItem.price,
                    category: newMenuItem.category,
                    halal: newMenuItem.halal,
                    available: true,
                  }
                  setMenuItems([...menuItems, menuItem])
                  setShowMenuModal(false)
                  setNewMenuItem({ name: '', description: '', price: 0, category: 'coffee', halal: true })
                }
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
          setNewOrder({ customerId: '', items: [] })
        }}
        title="Nouvelle commande"
        size="lg"
      >
        <div className="space-y-4">
          {customers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newOrder.customerId}
                onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name} - {customer.phone}</option>
                ))}
              </select>
            </div>
          )}
          {menuItems.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Articles</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {menuItems.filter(item => item.available).map(item => {
                  const orderItem = newOrder.items.find(i => i.menuItemId === item.id)
                  return (
                    <div key={item.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price.toFixed(2)} DZD</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (orderItem && orderItem.quantity > 0) {
                              setNewOrder({
                                ...newOrder,
                                items: newOrder.items.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
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
                                items: newOrder.items.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i)
                              })
                            } else {
                              setNewOrder({
                                ...newOrder,
                                items: [...newOrder.items, { menuItemId: item.id, quantity: 1 }]
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
                      const menuItem = menuItems.find(m => m.id === item.menuItemId)
                      return sum + (menuItem ? menuItem.price * item.quantity : 0)
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
                setNewOrder({ customerId: '', items: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newOrder.customerId && newOrder.items.length > 0) {
                  const customer = customers.find(c => c.id === newOrder.customerId)
                  if (customer) {
                    const total = newOrder.items.reduce((sum, item) => {
                      const menuItem = menuItems.find(m => m.id === item.menuItemId)
                      return sum + (menuItem ? menuItem.price * item.quantity : 0)
                    }, 0)
                    const order: Order = {
                      id: Date.now().toString(),
                      customerId: newOrder.customerId,
                      items: newOrder.items.map(item => {
                        const menuItem = menuItems.find(m => m.id === item.menuItemId)
                        return {
                          menuItemId: item.menuItemId,
                          quantity: item.quantity,
                          price: menuItem ? menuItem.price : 0
                        }
                      }),
                      total,
                      status: 'pending',
                      createdAt: new Date(),
                    }
                    setOrders([...orders, order])
                    setShowOrderModal(false)
                    setNewOrder({ customerId: '', items: [] })
                  }
                }
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false)
          setNewCustomer({ name: '', email: '', phone: '' })
        }}
        title="Nouveau client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCustomerModal(false)
                setNewCustomer({ name: '', email: '', phone: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newCustomer.name && newCustomer.email && newCustomer.phone) {
                  const customer: Customer = {
                    id: Date.now().toString(),
                    name: newCustomer.name,
                    email: newCustomer.email,
                    phone: newCustomer.phone,
                    loyaltyPoints: 0,
                    totalOrders: 0,
                    createdAt: new Date(),
                  }
                  setCustomers([...customers, customer])
                  setShowCustomerModal(false)
                  setNewCustomer({ name: '', email: '', phone: '' })
                }
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
