'use client'

import { useState, useEffect } from 'react'
import { Flower, ShoppingCart, Users, Calendar, BarChart3, Package, Heart, Sparkles } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'orders' | 'customers' | 'events'

interface Product {
  id: string
  name: string
  description: string
  category: 'bouquet' | 'plante' | 'decoration' | 'accessory'
  price: number
  stock: number
  image?: string
  season: 'all' | 'spring' | 'summer' | 'autumn' | 'winter'
  popularity: number
}

interface Order {
  id: string
  customerId: string
  customerName: string
  date: Date
  deliveryDate?: Date
  items: { productId: string; productName: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  deliveryAddress?: string
  occasion?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  totalOrders: number
  totalSpent: number
  favoriteCategory?: string
  lastOrder?: Date
}

interface Event {
  id: string
  name: string
  date: Date
  type: 'wedding' | 'funeral' | 'birthday' | 'anniversary' | 'corporate'
  customerId: string
  customerName: string
  budget: number
  status: 'planned' | 'in_progress' | 'completed'
}

export default function FlowersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('flowers-products')
    const savedOrders = localStorage.getItem('flowers-orders')
    const savedCustomers = localStorage.getItem('flowers-customers')
    const savedEvents = localStorage.getItem('flowers-events')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Bouquet de Roses Rouges', description: '12 roses rouges avec feuillage', category: 'bouquet', price: 45, stock: 25, season: 'all', popularity: 95 },
        { id: '2', name: 'Bouquet Mixte Printemps', description: 'Fleurs de saison variées', category: 'bouquet', price: 35, stock: 18, season: 'spring', popularity: 88 },
        { id: '3', name: 'Orchidée Phalaenopsis', description: 'Plante d\'intérieur élégante', category: 'plante', price: 28, stock: 12, season: 'all', popularity: 82 },
        { id: '4', name: 'Vase en Céramique', description: 'Vase décoratif moderne', category: 'decoration', price: 22, stock: 30, season: 'all', popularity: 75 },
        { id: '5', name: 'Bouquet Mariage Blanc', description: 'Composition élégante pour mariage', category: 'bouquet', price: 120, stock: 8, season: 'all', popularity: 90 },
      ]
      setProducts(sample)
      localStorage.setItem('flowers-products', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({ ...o, date: new Date(o.date), deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : undefined })))
    } else {
      const today = new Date()
      const sample: Order[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Fatima Kadri',
          date: today,
          deliveryDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          items: [{ productId: '1', productName: 'Bouquet de Roses Rouges', quantity: 1, price: 45 }],
          total: 45,
          status: 'preparing',
          deliveryAddress: '123 Rue Principale, Alger',
          occasion: 'Anniversaire',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ productId: '5', productName: 'Bouquet Mariage Blanc', quantity: 10, price: 120 }],
          total: 1200,
          status: 'pending',
          occasion: 'Mariage',
        },
      ]
      setOrders(sample)
      localStorage.setItem('flowers-orders', JSON.stringify(sample))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({ ...c, lastOrder: c.lastOrder ? new Date(c.lastOrder) : undefined })))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 1234', address: '123 Rue Principale', totalOrders: 8, totalSpent: 360, favoriteCategory: 'bouquet', lastOrder: new Date() },
        { id: '2', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 5678', totalOrders: 3, totalSpent: 1500, favoriteCategory: 'bouquet', lastOrder: new Date() },
      ]
      setCustomers(sample)
      localStorage.setItem('flowers-customers', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      const sample: Event[] = [
        {
          id: '1',
          name: 'Mariage Benali',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          type: 'wedding',
          customerId: '2',
          customerName: 'Ahmed Benali',
          budget: 2000,
          status: 'planned',
        },
      ]
      setEvents(sample)
      localStorage.setItem('flowers-events', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('flowers-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('flowers-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('flowers-customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('flowers-events', JSON.stringify(events))
  }, [events])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Flower },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
  ]

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length
  const totalProducts = products.length
  const lowStock = products.filter(p => p.stock < 10).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
                      ? 'text-pink-600 border-b-2 border-pink-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                  </div>
                  <Flower className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Commandes récentes</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                        {order.occasion && (
                          <p className="text-xs text-pink-600 mt-1">{order.occasion}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-900">DZD{order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full  DZD{
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livrée' :
                           order.status === 'ready' ? 'Prête' :
                           order.status === 'preparing' ? 'En préparation' :
                           order.status === 'pending' ? 'En attente' :
                           'Annulée'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits populaires</h3>
                <div className="space-y-3">
                  {products.sort((a, b) => b.popularity - a.popularity).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-pink-600">DZD{product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Sparkles className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{product.popularity}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Ajouter un produit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs capitalize">{product.category}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">{product.season}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold  DZD{product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Popularité:</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium text-gray-900">{product.popularity}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-pink-600">DZD{product.price.toFixed(2)}</span>
                    </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouvelle commande
              </button>
            </div>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Commande #{order.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                      {order.occasion && (
                        <p className="text-sm text-pink-600 mt-1 font-medium">Occasion: {order.occasion}</p>
                      )}
                      {order.deliveryAddress && (
                        <p className="text-sm text-gray-500 mt-1">📍 {order.deliveryAddress}</p>
                      )}
                      {order.deliveryDate && (
                        <p className="text-sm text-gray-500 mt-1">Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}</p>
                      )}
                      <div className="mt-3 space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.productName} - DZD{item.price.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'delivered' ? 'Livrée' :
                         order.status === 'ready' ? 'Prête' :
                         order.status === 'preparing' ? 'En préparation' :
                         order.status === 'pending' ? 'En attente' :
                         'Annulée'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouveau client
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{customer.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                  <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
                  {customer.address && (
                    <p className="text-sm text-gray-500 mb-4">{customer.address}</p>
                  )}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Commandes:</span>
                      <span className="font-medium text-gray-900">{customer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    {customer.favoriteCategory && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Préférence:</span>
                        <span className="font-medium text-pink-600 capitalize">{customer.favoriteCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouvel événement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.customerName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                      event.status === 'completed' ? 'bg-green-100 text-green-800' :
                      event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status === 'completed' ? 'Terminé' : event.status === 'in_progress' ? 'En cours' : 'Planifié'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900 capitalize">{event.type === 'wedding' ? 'Mariage' : event.type === 'funeral' ? 'Funérailles' : event.type === 'birthday' ? 'Anniversaire' : event.type === 'anniversary' ? 'Anniversaire de mariage' : 'Entreprise'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Budget:</span>
                      <span className="font-bold text-pink-600">DZD{event.budget.toFixed(2)}</span>
                    </div>
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
