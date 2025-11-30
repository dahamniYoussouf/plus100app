'use client'

import { useState, useEffect } from 'react'
import { Truck, UtensilsCrossed, MapPin, Calendar, BarChart3, TrendingUp, ShoppingCart, Package } from 'lucide-react'

type TabType = 'dashboard' | 'menu' | 'orders' | 'locations' | 'stock'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  halal: boolean
  available: boolean
  stock: number
}

interface Order {
  id: string
  items: Array<{ menuItemId: string; quantity: number; price: number }>
  total: number
  customerName: string
  customerPhone: string
  location: string
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  createdAt: Date
}

interface Location {
  id: string
  name: string
  address: string
  date: Date
  startTime: string
  endTime: string
  status: 'active' | 'completed'
}

export default function FoodtruckPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const savedMenu = localStorage.getItem('foodtruck-menu')
    const savedOrders = localStorage.getItem('foodtruck-orders')
    const savedLocations = localStorage.getItem('foodtruck-locations')

    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu))
    } else {
      const sample: MenuItem[] = [
        { id: '1', name: 'Burger Halal', description: 'Burger avec viande halal', price: 8.99, category: 'Burgers', halal: true, available: true, stock: 50 },
        { id: '2', name: 'Tacos Halal', description: 'Tacos poulet ou viande halal', price: 7.50, category: 'Tacos', halal: true, available: true, stock: 40 },
        { id: '3', name: 'Frites Maison', description: 'Frites fraîches', price: 3.99, category: 'Accompagnements', halal: true, available: true, stock: 100 },
      ]
      setMenuItems(sample)
      localStorage.setItem('foodtruck-menu', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })))
    }

    if (savedLocations) {
      const parsed = JSON.parse(savedLocations)
      setLocations(parsed.map((l: any) => ({
        ...l,
        date: new Date(l.date),
      })))
    } else {
      const today = new Date()
      const sample: Location[] = [
        { id: '1', name: 'Centre-ville', address: 'Place du Marché', date: today, startTime: '11:00', endTime: '14:00', status: 'active' },
        { id: '2', name: 'Quartier Nord', address: 'Rue Principale', date: new Date(today.getTime() + 24 * 60 * 60 * 1000), startTime: '17:00', endTime: '20:00', status: 'active' },
      ]
      setLocations(sample)
      localStorage.setItem('foodtruck-locations', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (menuItems.length > 0) localStorage.setItem('foodtruck-menu', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('foodtruck-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (locations.length > 0) localStorage.setItem('foodtruck-locations', JSON.stringify(locations))
  }, [locations])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'menu' as TabType, label: 'Menu', icon: UtensilsCrossed },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'locations' as TabType, label: 'Emplacements', icon: MapPin },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing')
  const activeLocation = locations.find(l => l.status === 'active')
  const lowStock = menuItems.filter(m => m.stock < 20)

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
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
                      ? 'text-yellow-600 border-b-2 border-yellow-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{menuItems.length}</p>
                  </div>
                  <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Emplacements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{locations.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {activeLocation && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-2">📍 Emplacement Actuel</h3>
                <p className="text-lg font-bold text-blue-700">{activeLocation.name}</p>
                <p className="text-sm text-blue-600">{activeLocation.address}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {new Date(activeLocation.date).toLocaleDateString('fr-FR')} • {activeLocation.startTime} - {activeLocation.endTime}
                </p>
              </div>
            )}

            {lowStock.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {lowStock.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{item.name}</span>
                      <span className="font-semibold text-yellow-700 mt-1 sm:mt-0">Stock: {item.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Mobile</h3>
                  <p className="text-sm text-gray-600">Système adapté au mobile et terrain</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Emplacements</h3>
                  <p className="text-sm text-gray-600">Planification des emplacements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Prise de commandes sur place</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Produits Halal</h3>
                  <p className="text-sm text-gray-600">Tous produits certifiés halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Stock</h3>
                  <p className="text-sm text-gray-600">Suivi des stocks en temps réel</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de ventes par emplacement</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Menu</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.name}</h3>
                    {item.halal && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Halal</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">DZD{item.price.toFixed(2)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Stock: {item.stock}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Commande #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.customerName} - {order.customerPhone}</p>
                        <p className="text-sm text-gray-500 mt-1">📍 {order.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.length} article(s) • {new Date(order.createdAt).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">DZD{order.total.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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

        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Emplacements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                Nouvel Emplacement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {locations.map((location) => (
                <div key={location.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{location.address}</p>
                  <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-600">
                      📅 {new Date(location.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      🕐 {location.startTime} - {location.endTime}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    location.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {location.status === 'active' ? 'Actif' : 'Terminé'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion Stock</h2>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.category})</span>
                  </div>
                  <span className={`font-semibold ${
                    item.stock < 20 ? 'text-red-700' : 'text-green-700'
                  }`}>
                    Stock: {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}