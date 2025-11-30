'use client'

import { useState, useEffect } from 'react'
import { Gift, ShoppingCart, Users, BarChart3, Package, Star, TrendingUp, Heart, Sparkles } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers' | 'occasions'

interface Product {
  id: string
  name: string
  description: string
  category: 'birthday' | 'wedding' | 'anniversary' | 'graduation' | 'holiday' | 'custom'
  price: number
  cost: number
  stock: number
  sold: number
  rating?: number
  giftWrap?: boolean
  personalization?: boolean
  occasion?: string[]
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  date: Date
  items: { productId: string; productName: string; quantity: number; price: number }[]
  total: number
  discount?: number
  paymentMethod: 'cash' | 'card'
  status: 'completed' | 'pending' | 'cancelled'
  giftWrap: boolean
  personalization?: string
  occasion?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  totalPurchases: number
  totalSpent: number
  favoriteOccasion?: string
  loyaltyPoints: number
}

export default function GiftPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('gift-products')
    const savedSales = localStorage.getItem('gift-sales')
    const savedCustomers = localStorage.getItem('gift-customers')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Bouquet Premium', description: 'Bouquet de fleurs de luxe', category: 'anniversary', price: 79, cost: 35, stock: 20, sold: 45, rating: 4.8, giftWrap: true, personalization: true, occasion: ['anniversary', 'wedding'] },
        { id: '2', name: 'Panier Gourmet', description: 'Panier avec produits gastronomiques', category: 'holiday', price: 59, cost: 25, stock: 15, sold: 32, rating: 4.6, giftWrap: true, personalization: false, occasion: ['holiday', 'birthday'] },
        { id: '3', name: 'Coffret Beauté', description: 'Coffret produits de beauté premium', category: 'birthday', price: 89, cost: 40, stock: 25, sold: 58, rating: 4.7, giftWrap: true, personalization: true, occasion: ['birthday', 'anniversary'] },
        { id: '4', name: 'Cadeau Personnalisé', description: 'Cadeau avec gravure personnalisée', category: 'custom', price: 49, cost: 20, stock: 30, sold: 42, rating: 4.9, giftWrap: true, personalization: true, occasion: ['custom'] },
        { id: '5', name: 'Coffret Chocolats', description: 'Assortiment de chocolats fins', category: 'holiday', price: 34.99, cost: 15, stock: 40, sold: 95, rating: 4.5, giftWrap: true, personalization: false, occasion: ['holiday', 'birthday'] },
      ]
      setProducts(sample)
      localStorage.setItem('gift-products', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const today = new Date()
      const sample: Sale[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Sarah Benali',
          date: today,
          items: [{ productId: '1', productName: 'Bouquet Premium', quantity: 1, price: 79 }],
          total: 79,
          paymentMethod: 'card',
          status: 'completed',
          giftWrap: true,
          occasion: 'anniversary',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Mohamed Kadri',
          date: today,
          items: [{ productId: '2', productName: 'Panier Gourmet', quantity: 1, price: 59 }],
          total: 59,
          paymentMethod: 'card',
          status: 'completed',
          giftWrap: true,
          occasion: 'holiday',
        },
      ]
      setSales(sample)
      localStorage.setItem('gift-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', totalPurchases: 8, totalSpent: 450, favoriteOccasion: 'anniversary', loyaltyPoints: 450 },
        { id: '2', name: 'Mohamed Kadri', email: 'mohamed@email.com', phone: '+213 555 5678', totalPurchases: 5, totalSpent: 280, favoriteOccasion: 'holiday', loyaltyPoints: 280 },
      ]
      setCustomers(sample)
      localStorage.setItem('gift-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('gift-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('gift-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('gift-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Gift },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'occasions' as TabType, label: 'Occasions', icon: Heart },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
  const totalProfit = sales.filter(s => s.status === 'completed').reduce((sum, s) => {
    const itemsProfit = s.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId)
      return itemSum + (item.price - (product?.cost || 0)) * item.quantity
    }, 0)
    return sum + itemsProfit - (s.discount || 0)
  }, 0)
  const pendingSales = sales.filter(s => s.status === 'pending').length
  const giftWrapped = sales.filter(s => s.giftWrap && s.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                      ? 'text-purple-600 border-b-2 border-purple-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingSales}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Emballés cadeau</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{giftWrapped}</p>
                  </div>
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ventes récentes</h3>
                <div className="space-y-3">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{sale.customerName}</p>
                        <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                        {sale.occasion && (
                          <p className="text-xs text-purple-600 mt-1">🎁 {sale.occasion}</p>
                        )}
                        {sale.giftWrap && (
                          <p className="text-xs text-purple-600 mt-1">✨ Emballage cadeau</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-900">DZD{sale.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sale.status === 'completed' ? 'Complétée' : sale.status === 'pending' ? 'En attente' : 'Annulée'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits populaires</h3>
                <div className="space-y-3">
                  {products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-purple-600">DZD{product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{product.sold} vendus</p>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs capitalize">{product.category === 'birthday' ? 'Anniversaire' : product.category === 'wedding' ? 'Mariage' : product.category === 'anniversary' ? 'Anniversaire' : product.category === 'graduation' ? 'Diplôme' : product.category === 'holiday' ? 'Fête' : 'Personnalisé'}</span>
                        {product.giftWrap && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">🎁 Emballage</span>
                        )}
                        {product.personalization && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">✨ Personnalisé</span>
                        )}
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendus:</span>
                      <span className="font-medium text-gray-900">{product.sold}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-purple-600">DZD{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle vente
              </button>
            </div>
            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">Vente #{sale.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sale.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                      {sale.occasion && (
                        <p className="text-sm text-purple-600 mt-1 font-medium">🎁 Occasion: {sale.occasion}</p>
                      )}
                      {sale.giftWrap && (
                        <p className="text-sm text-purple-600 mt-1">✨ Emballage cadeau inclus</p>
                      )}
                      {sale.personalization && (
                        <p className="text-sm text-blue-600 mt-1">✏️ Personnalisation: {sale.personalization}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {sale.paymentMethod === 'cash' ? 'Espèces' : 'Carte'}</p>
                      <div className="mt-3 space-y-1">
                        {sale.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.productName} - DZD{item.price.toFixed(2)}
                          </p>
                        ))}
                      </div>
                      {sale.discount && (
                        <p className="text-sm text-red-600 mt-2">Remise: -DZD{sale.discount.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status === 'completed' ? 'Complétée' : sale.status === 'pending' ? 'En attente' : 'Annulée'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{sale.total.toFixed(2)}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau client
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{customer.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{customer.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Achats:</span>
                      <span className="font-medium text-gray-900">{customer.totalPurchases}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Points fidélité:</span>
                      <span className="font-medium text-purple-600">{customer.loyaltyPoints}</span>
                    </div>
                    {customer.favoriteOccasion && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Occasion préférée:</span>
                        <span className="font-medium text-purple-600 capitalize">{customer.favoriteOccasion}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'occasions' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Occasions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {['birthday', 'wedding', 'anniversary', 'graduation', 'holiday', 'custom'].map((occasion) => {
                const occasionProducts = products.filter(p => p.category === occasion || p.occasion?.includes(occasion))
                const occasionSales = sales.filter(s => s.occasion === occasion && s.status === 'completed')
                const occasionRevenue = occasionSales.reduce((sum, s) => sum + s.total, 0)
                const occasionName = occasion === 'birthday' ? 'Anniversaire' : occasion === 'wedding' ? 'Mariage' : occasion === 'anniversary' ? 'Anniversaire' : occasion === 'graduation' ? 'Diplôme' : occasion === 'holiday' ? 'Fête' : 'Personnalisé'
                return (
                  <div key={occasion} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">{occasionName}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Produits:</span>
                        <span className="font-medium text-gray-900">{occasionProducts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ventes:</span>
                        <span className="font-medium text-gray-900">{occasionSales.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus:</span>
                        <span className="font-medium text-green-600">DZD{occasionRevenue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
      </div>
        )}
      </main>
    </div>
  )
}
