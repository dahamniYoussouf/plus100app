'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Store, Package, Users, ShoppingCart, BarChart3, TrendingUp, Star, Search, Plus, DollarSign, Tag } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'products' | 'sellers' | 'orders' | 'categories'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sellerId: string
  sellerName: string
  categoryId: string
  categoryName: string
  images: string[]
  stock: number
  sold: number
  rating: number
  reviews: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: Date
}

interface Seller {
  id: string
  name: string
  email: string
  phone: string
  shopName: string
  products: number
  totalSales: number
  rating: number
  joinDate: Date
  status: 'active' | 'suspended' | 'pending'
}

interface Order {
  id: string
  orderNumber: string
  productId: string
  productName: string
  sellerId: string
  sellerName: string
  buyerName: string
  buyerEmail: string
  quantity: number
  price: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
}

interface Category {
  id: string
  name: string
  description?: string
  products: number
  icon: string
}

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, sellerId: '', categoryId: '', stock: 0 })
  const [newSeller, setNewSeller] = useState({ name: '', email: '', phone: '', shopName: '' })

  useEffect(() => {
    const savedProducts = localStorage.getItem('marketplace-products')
    const savedSellers = localStorage.getItem('marketplace-sellers')
    const savedOrders = localStorage.getItem('marketplace-orders')
    const savedCategories = localStorage.getItem('marketplace-categories')

    if (savedProducts) {
      const parsed = JSON.parse(savedProducts)
      setProducts(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })))
    } else {
      const today = new Date()
      const sample: Product[] = [
        { id: '1', name: 'Smartphone Android', description: 'Smartphone dernière génération', price: 299, sellerId: '1', sellerName: 'TechStore', categoryId: '1', categoryName: 'Électronique', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&q=80'], stock: 15, sold: 45, rating: 4.5, reviews: 23, status: 'active', createdAt: today },
        { id: '2', name: 'Casque Bluetooth', description: 'Casque sans fil haute qualité', price: 79, sellerId: '1', sellerName: 'TechStore', categoryId: '1', categoryName: 'Électronique', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80'], stock: 30, sold: 120, rating: 4.7, reviews: 56, status: 'active', createdAt: today },
        { id: '3', name: 'Sac à dos', description: 'Sac à dos résistant', price: 45, sellerId: '2', sellerName: 'FashionShop', categoryId: '2', categoryName: 'Mode', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80'], stock: 0, sold: 85, rating: 4.3, reviews: 18, status: 'out_of_stock', createdAt: today },
      ]
      setProducts(sample)
      localStorage.setItem('marketplace-products', JSON.stringify(sample))
    }

    if (savedSellers) {
      const parsed = JSON.parse(savedSellers)
      setSellers(parsed.map((s: any) => ({ ...s, joinDate: new Date(s.joinDate) })))
    } else {
      const sample: Seller[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@techstore.com', phone: '+213 555 1234', shopName: 'TechStore', products: 25, totalSales: 12500, rating: 4.6, joinDate: new Date('2023-01-15'), status: 'active' },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@fashion.com', phone: '+213 555 5678', shopName: 'FashionShop', products: 18, totalSales: 8900, rating: 4.4, joinDate: new Date('2023-03-20'), status: 'active' },
      ]
      setSellers(sample)
      localStorage.setItem('marketplace-sellers', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({ ...o, createdAt: new Date(o.createdAt) })))
    } else {
      const today = new Date()
      const sample: Order[] = [
        { id: '1', orderNumber: 'ORD-001', productId: '1', productName: 'Smartphone Android', sellerId: '1', sellerName: 'TechStore', buyerName: 'Mohamed Tazi', buyerEmail: 'mohamed@email.com', quantity: 1, price: 299, total: 299, status: 'delivered', createdAt: today },
        { id: '2', orderNumber: 'ORD-002', productId: '2', productName: 'Casque Bluetooth', sellerId: '1', sellerName: 'TechStore', buyerName: 'Sara Benali', buyerEmail: 'sara@email.com', quantity: 2, price: 79, total: 158, status: 'shipped', createdAt: today },
      ]
      setOrders(sample)
      localStorage.setItem('marketplace-orders', JSON.stringify(sample))
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      const sample: Category[] = [
        { id: '1', name: 'Électronique', description: 'Appareils électroniques', products: 2, icon: '📱' },
        { id: '2', name: 'Mode', description: 'Vêtements et accessoires', products: 1, icon: '👕' },
        { id: '3', name: 'Maison', description: 'Articles pour la maison', products: 0, icon: '🏠' },
      ]
      setCategories(sample)
      localStorage.setItem('marketplace-categories', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('marketplace-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sellers.length > 0) localStorage.setItem('marketplace-sellers', JSON.stringify(sellers))
  }, [sellers])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('marketplace-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (categories.length > 0) localStorage.setItem('marketplace-categories', JSON.stringify(categories))
  }, [categories])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'sellers' as TabType, label: 'Vendeurs', icon: Store },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'categories' as TabType, label: 'Catégories', icon: Tag },
  ]

  const totalProducts = useMemo(() => products.length, [products.length])
  const totalSellers = useMemo(() => sellers.length, [sellers.length])
  const totalOrders = useMemo(() => orders.length, [orders.length])
  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0), [orders])
  const activeProducts = useMemo(() => products.filter(p => p.status === 'active').length, [products])

  const filteredProducts = useMemo(() => products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  ), [products, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Vendeurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalSellers}</p>
                  </div>
                  <Store className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits populaires</h3>
                <div className="space-y-3">
                  {products.sort((a, b) => b.sold - a.sold).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sellerName} • {product.categoryName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {product.rating}
                          </span>
                          <span>{product.sold} vendus</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">DZD{product.price}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'active' ? 'Actif' : product.status === 'out_of_stock' ? 'Rupture' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Commandes récentes</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{order.productName}</p>
                        <p className="text-sm text-gray-500">{order.buyerName} • {order.sellerName}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-green-600">DZD{order.total}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livré' : order.status === 'shipped' ? 'Expédié' : order.status === 'processing' ? 'En cours' : order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                        </span>
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
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={() => setShowProductModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau produit
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => {
                const productImages: Record<string, string> = {
                  '1': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&q=80',
                  '2': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
                  '3': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
                }
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-square relative">
                      <Image
                        src={product.images[0] || productImages[product.id] || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=600&h=600&fit=crop&q=80`}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">DZD{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{product.sellerName}</span>
                      <span>{product.categoryName}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Actif' : product.status === 'out_of_stock' ? 'Rupture' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'sellers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Vendeurs</h2>
              <button 
                onClick={() => setShowSellerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau vendeur
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sellers.map((seller) => (
                <div key={seller.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Store className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{seller.shopName}</h3>
                      <p className="text-sm text-gray-500">{seller.name}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Produits:</span>
                      <span className="font-medium text-gray-900">{seller.products}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ventes:</span>
                      <span className="font-medium text-green-600">DZD{seller.totalSales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Note:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {seller.rating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        seller.status === 'active' ? 'bg-green-100 text-green-800' :
                        seller.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.status === 'active' ? 'Actif' : seller.status === 'suspended' ? 'Suspendu' : 'En attente'}
                      </span>
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
            </div>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                        <span className="text-sm text-gray-500">#{order.orderNumber}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Acheteur: {order.buyerName} ({order.buyerEmail})</p>
                      <p className="text-sm text-gray-600 mb-1">Vendeur: {order.sellerName}</p>
                      <p className="text-sm text-gray-500">Quantité: {order.quantity} • Prix unitaire: DZD{order.price}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-green-600">DZD{order.total}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'delivered' ? 'Livré' : order.status === 'shipped' ? 'Expédié' : order.status === 'processing' ? 'En cours' : order.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Catégories</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle catégorie
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.products} produits</p>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setNewProduct({ name: '', description: '', price: 0, sellerId: '', categoryId: '', stock: 0 })
        }}
        title="Nouveau produit"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Smartphone Pro Max"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Description du produit"
            />
          </div>
          {sellers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendeur</label>
              <select
                value={newProduct.sellerId}
                onChange={(e) => setNewProduct({ ...newProduct, sellerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner un vendeur</option>
                {sellers.map(seller => (
                  <option key={seller.id} value={seller.id}>{seller.shopName} - {seller.name}</option>
                ))}
              </select>
            </div>
          )}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProductModal(false)
                setNewProduct({ name: '', description: '', price: 0, sellerId: '', categoryId: '', stock: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProduct.name && newProduct.description && newProduct.sellerId && newProduct.categoryId) {
                  const seller = sellers.find(s => s.id === newProduct.sellerId)
                  const category = categories.find(c => c.id === newProduct.categoryId)
                  if (seller && category) {
                    const product: Product = {
                      id: Date.now().toString(),
                      name: newProduct.name,
                      description: newProduct.description,
                      price: newProduct.price,
                      sellerId: newProduct.sellerId,
                      sellerName: seller.name,
                      categoryId: newProduct.categoryId,
                      categoryName: category.name,
                      images: [],
                      stock: newProduct.stock,
                      sold: 0,
                      rating: 0,
                      reviews: 0,
                      status: 'active',
                      createdAt: new Date(),
                    }
                    setProducts([...products, product])
                    setShowProductModal(false)
                    setNewProduct({ name: '', description: '', price: 0, sellerId: '', categoryId: '', stock: 0 })
                  }
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSellerModal}
        onClose={() => {
          setShowSellerModal(false)
          setNewSeller({ name: '', email: '', phone: '', shopName: '' })
        }}
        title="Nouveau vendeur"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newSeller.name}
              onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
            <input
              type="text"
              value={newSeller.shopName}
              onChange={(e) => setNewSeller({ ...newSeller, shopName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Tech Store"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newSeller.email}
                onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newSeller.phone}
                onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowSellerModal(false)
                setNewSeller({ name: '', email: '', phone: '', shopName: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newSeller.name && newSeller.email && newSeller.phone && newSeller.shopName) {
                  const seller: Seller = {
                    id: Date.now().toString(),
                    name: newSeller.name,
                    email: newSeller.email,
                    phone: newSeller.phone,
                    shopName: newSeller.shopName,
                    products: 0,
                    totalSales: 0,
                    rating: 5,
                    joinDate: new Date(),
                    status: 'active',
                  }
                  setSellers([...sellers, seller])
                  setShowSellerModal(false)
                  setNewSeller({ name: '', email: '', phone: '', shopName: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
