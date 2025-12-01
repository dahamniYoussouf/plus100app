'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Store, Package, ShoppingCart, Users, BarChart3, TrendingUp, DollarSign, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'orders' | 'customers'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  sku: string
  image?: string
  status: 'active' | 'inactive'
}

interface Order {
  id: string
  customerId: string
  customerName: string
  items: Array<{ productId: string; name: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  shippingAddress: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  joinDate: Date
}

export default function EcommercePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', stock: 0, sku: '' })
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' })
  const [newOrder, setNewOrder] = useState({ customerId: '', items: [] as Array<{ productId: string; quantity: number }>, shippingAddress: '' })

  useEffect(() => {
    const savedProducts = localStorage.getItem('ecommerce-products')
    const savedOrders = localStorage.getItem('ecommerce-orders')
    const savedCustomers = localStorage.getItem('ecommerce-customers')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Smartphone Pro Max',
          description: 'Smartphone haut de gamme avec écran 6.7"',
          price: 899.99,
          category: 'Électronique',
          stock: 25,
          sku: 'PHONE-001',
          status: 'active',
        },
        {
          id: '2',
          name: 'Casque Bluetooth Premium',
          description: 'Casque sans fil avec réduction de bruit active',
          price: 149.99,
          category: 'Audio',
          stock: 50,
          sku: 'AUDIO-001',
          status: 'active',
        },
        {
          id: '3',
          name: 'Montre Connectée',
          description: 'Montre intelligente avec suivi santé',
          price: 249.99,
          category: 'Wearables',
          stock: 30,
          sku: 'WATCH-001',
          status: 'active',
        },
      ]
      setProducts(sample)
      localStorage.setItem('ecommerce-products', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      })))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({
        ...c,
        joinDate: new Date(c.joinDate),
      })))
    } else {
      const sample: Customer[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          totalOrders: 5,
          totalSpent: 1250.50,
          joinDate: new Date('2024-01-01'),
        },
      ]
      setCustomers(sample)
      localStorage.setItem('ecommerce-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('ecommerce-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('ecommerce-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('ecommerce-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
  ]

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing')
  const activeProducts = products.filter(p => p.status === 'active').length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProducts}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
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
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
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
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Commandes en attente</h3>
                <div className="space-y-2">
                  {pendingOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700">Commande #{order.id.slice(0, 8)}</span>
                      <span className="font-semibold text-blue-700 mt-1 sm:mt-0">DZD{order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Catalogue Produits</h3>
                  <p className="text-sm text-gray-600">Gestion complète du catalogue avec images et variantes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Commandes</h3>
                  <p className="text-sm text-gray-600">Suivi complet du cycle de commande</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et historique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Intégration des méthodes de paiement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Livraison</h3>
                  <p className="text-sm text-gray-600">Gestion des expéditions et suivi</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600">Statistiques et rapports détaillés</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button 
                onClick={() => setShowProductModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-xs text-gray-500 mb-3">SKU: {product.sku} • Catégorie: {product.category}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">DZD{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
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
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
                        <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.length} article(s) • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{order.total.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livré' :
                           order.status === 'cancelled' ? 'Annulé' :
                           order.status === 'shipped' ? 'Expédié' :
                           order.status === 'processing' ? 'En traitement' : 'En attente'}
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
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
                    <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{customer.phone}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Commandes</p>
                        <p className="font-bold text-gray-900">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Dépensé</p>
                        <p className="font-bold text-yellow-600">DZD{customer.totalSpent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setNewProduct({ name: '', description: '', price: 0, category: '', stock: 0, sku: '' })
        }}
        title="Ajouter Produit"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: Smartphone Pro Max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={3}
              placeholder="Description du produit"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: Électronique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: PROD-001"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProductModal(false)
                setNewProduct({ name: '', description: '', price: 0, category: '', stock: 0, sku: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProduct.name && newProduct.description && newProduct.category && newProduct.sku) {
                  const product: Product = {
                    id: Date.now().toString(),
                    name: newProduct.name,
                    description: newProduct.description,
                    price: newProduct.price,
                    category: newProduct.category,
                    stock: newProduct.stock,
                    sku: newProduct.sku,
                    status: 'active',
                  }
                  setProducts([...products, product])
                  setShowProductModal(false)
                  setNewProduct({ name: '', description: '', price: 0, category: '', stock: 0, sku: '' })
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
        title="Nouveau Client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    totalOrders: 0,
                    totalSpent: 0,
                    joinDate: new Date(),
                  }
                  setCustomers([...customers, customer])
                  setShowCustomerModal(false)
                  setNewCustomer({ name: '', email: '', phone: '' })
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
          setNewOrder({ customerId: '', items: [], shippingAddress: '' })
        }}
        title="Nouvelle Commande"
        size="lg"
      >
        <div className="space-y-4">
          {customers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newOrder.customerId}
                onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
          )}
          {products.filter(p => p.status === 'active' && p.stock > 0).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Articles</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {products.filter(p => p.status === 'active' && p.stock > 0).map(product => {
                  const orderItem = newOrder.items.find(i => i.productId === product.id)
                  return (
                    <div key={product.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.price.toFixed(2)} DZD • Stock: {product.stock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (orderItem && orderItem.quantity > 0) {
                              setNewOrder({
                                ...newOrder,
                                items: newOrder.items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)
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
                              if (orderItem.quantity < product.stock) {
                                setNewOrder({
                                  ...newOrder,
                                  items: newOrder.items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
                                })
                              }
                            } else {
                              setNewOrder({
                                ...newOrder,
                                items: [...newOrder.items, { productId: product.id, quantity: 1 }]
                              })
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          disabled={orderItem ? orderItem.quantity >= product.stock : false}
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
                      const product = products.find(p => p.id === item.productId)
                      return sum + (product ? product.price * item.quantity : 0)
                    }, 0).toFixed(2)} DZD
                  </p>
                </div>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison</label>
            <textarea
              value={newOrder.shippingAddress}
              onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={2}
              placeholder="Adresse complète de livraison"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowOrderModal(false)
                setNewOrder({ customerId: '', items: [], shippingAddress: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newOrder.customerId && newOrder.items.length > 0 && newOrder.shippingAddress) {
                  const customer = customers.find(c => c.id === newOrder.customerId)
                  if (customer) {
                    const total = newOrder.items.reduce((sum, item) => {
                      const product = products.find(p => p.id === item.productId)
                      return sum + (product ? product.price * item.quantity : 0)
                    }, 0)
                    const order: Order = {
                      id: Date.now().toString(),
                      customerId: newOrder.customerId,
                      customerName: customer.name,
                      items: newOrder.items.map(item => {
                        const product = products.find(p => p.id === item.productId)
                        return {
                          productId: item.productId,
                          name: product ? product.name : '',
                          quantity: item.quantity,
                          price: product ? product.price : 0
                        }
                      }),
                      total,
                      status: 'pending',
                      createdAt: new Date(),
                      shippingAddress: newOrder.shippingAddress,
                    }
                    setOrders([...orders, order])
                    // Mettre à jour le stock
                    setProducts(products.map(product => {
                      const orderItem = newOrder.items.find(i => i.productId === product.id)
                      if (orderItem) {
                        return { ...product, stock: Math.max(0, product.stock - orderItem.quantity) }
                      }
                      return product
                    }))
                    setShowOrderModal(false)
                    setNewOrder({ customerId: '', items: [], shippingAddress: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}