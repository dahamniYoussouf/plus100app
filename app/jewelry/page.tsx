'use client'

import { useState, useEffect } from 'react'
import { Gem, ShoppingCart, Users, BarChart3, Package, Sparkles, Award, Tag, TrendingUp } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers' | 'appraisals'

interface Product {
  id: string
  name: string
  description: string
  category: 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'watch' | 'other'
  material: 'gold' | 'silver' | 'platinum' | 'diamond' | 'other'
  price: number
  cost: number
  stock: number
  sold: number
  karat?: number
  weight?: number
  certification?: string
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  date: Date
  items: { productId: string; productName: string; quantity: number; price: number }[]
  total: number
  discount?: number
  paymentMethod: 'cash' | 'card' | 'installment'
  status: 'completed' | 'pending' | 'cancelled'
  warranty?: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  totalPurchases: number
  totalSpent: number
  favoriteCategory?: string
  loyaltyPoints: number
  membershipLevel: 'regular' | 'silver' | 'gold' | 'platinum'
}

interface Appraisal {
  id: string
  customerId: string
  customerName: string
  item: string
  date: Date
  estimatedValue: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  notes?: string
  status: 'pending' | 'completed'
}

export default function JewelryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [appraisals, setAppraisals] = useState<Appraisal[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('jewelry-products')
    const savedSales = localStorage.getItem('jewelry-sales')
    const savedCustomers = localStorage.getItem('jewelry-customers')
    const savedAppraisals = localStorage.getItem('jewelry-appraisals')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Bague Or 18K', description: 'Bague en or jaune 18 carats avec diamant', category: 'ring', material: 'gold', price: 850, cost: 500, stock: 5, sold: 12, karat: 18, weight: 3.5, certification: 'GIA' },
        { id: '2', name: 'Collier Perles', description: 'Collier de perles naturelles', category: 'necklace', material: 'other', price: 450, cost: 280, stock: 8, sold: 6, weight: 25 },
        { id: '3', name: 'Boucles d\'Oreilles Diamant', description: 'Boucles d\'oreilles en platine avec diamants', category: 'earrings', material: 'diamond', price: 1200, cost: 750, stock: 3, sold: 4, certification: 'GIA' },
        { id: '4', name: 'Bracelet Argent 925', description: 'Bracelet en argent sterling', category: 'bracelet', material: 'silver', price: 180, cost: 100, stock: 15, sold: 20, weight: 12 },
        { id: '5', name: 'Montre Luxe', description: 'Montre de luxe automatique', category: 'watch', material: 'other', price: 2500, cost: 1500, stock: 2, sold: 3 },
      ]
      setProducts(sample)
      localStorage.setItem('jewelry-products', JSON.stringify(sample))
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
          customerName: 'Fatima Kadri',
          date: today,
          items: [{ productId: '1', productName: 'Bague Or 18K', quantity: 1, price: 850 }],
          total: 850,
          paymentMethod: 'card',
          status: 'completed',
          warranty: 24,
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ productId: '5', productName: 'Montre Luxe', quantity: 1, price: 2500 }],
          total: 2500,
          discount: 100,
          paymentMethod: 'installment',
          status: 'pending',
          warranty: 36,
        },
      ]
      setSales(sample)
      localStorage.setItem('jewelry-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 1234', totalPurchases: 3, totalSpent: 2500, favoriteCategory: 'ring', loyaltyPoints: 250, membershipLevel: 'silver' },
        { id: '2', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 5678', totalPurchases: 5, totalSpent: 8500, favoriteCategory: 'watch', loyaltyPoints: 850, membershipLevel: 'platinum' },
      ]
      setCustomers(sample)
      localStorage.setItem('jewelry-customers', JSON.stringify(sample))
    }

    if (savedAppraisals) {
      const parsed = JSON.parse(savedAppraisals)
      setAppraisals(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      const sample: Appraisal[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Fatima Kadri',
          item: 'Bague héritage',
          date: new Date(),
          estimatedValue: 1200,
          condition: 'good',
          notes: 'Bague en or avec pierre précieuse',
          status: 'completed',
        },
      ]
      setAppraisals(sample)
      localStorage.setItem('jewelry-appraisals', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('jewelry-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('jewelry-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('jewelry-customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (appraisals.length > 0) localStorage.setItem('jewelry-appraisals', JSON.stringify(appraisals))
  }, [appraisals])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Gem },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'appraisals' as TabType, label: 'Expertises', icon: Award },
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
  const totalProducts = products.length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingSales}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                  </div>
                  <Gem className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
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
                        <p className="text-xs text-gray-400 mt-1 capitalize">{sale.paymentMethod}</p>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits premium</h3>
                <div className="space-y-3">
                  {products.sort((a, b) => b.price - a.price).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{product.material} • {product.category}</p>
                        {product.karat && (
                          <p className="text-xs text-gray-400 mt-1">{product.karat}K • {product.weight}g</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-amber-600">DZD{product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs capitalize">{product.category}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">{product.material}</span>
                        {product.karat && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">{product.karat}K</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Poids:</span>
                        <span className="text-gray-900">{product.weight}g</span>
                      </div>
                    )}
                    {product.certification && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certification:</span>
                        <span className="text-gray-900">{product.certification}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold ${product.stock < 3 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendus:</span>
                      <span className="font-medium text-gray-900">{product.sold}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-amber-600">DZD{product.price.toFixed(2)}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
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
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {sale.paymentMethod === 'cash' ? 'Espèces' : sale.paymentMethod === 'card' ? 'Carte' : 'Tranches'}</p>
                      {sale.warranty && (
                        <p className="text-sm text-amber-600 mt-1">Garantie: {sale.warranty} mois</p>
                      )}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau client
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.membershipLevel === 'platinum' ? 'bg-purple-100 text-purple-800' :
                      customer.membershipLevel === 'gold' ? 'bg-amber-100 text-amber-800' :
                      customer.membershipLevel === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {customer.membershipLevel === 'platinum' ? 'Platine' : customer.membershipLevel === 'gold' ? 'Or' : customer.membershipLevel === 'silver' ? 'Argent' : 'Régulier'}
                    </span>
                  </div>
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
                      <span className="font-medium text-amber-600">{customer.loyaltyPoints}</span>
                    </div>
                    {customer.favoriteCategory && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Préférence:</span>
                        <span className="font-medium text-amber-600 capitalize">{customer.favoriteCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appraisals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expertises</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouvelle expertise
              </button>
            </div>
            <div className="space-y-4">
              {appraisals.map((appraisal) => (
                <div key={appraisal.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{appraisal.item}</h3>
                      <p className="text-sm text-gray-600 mt-1">{appraisal.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(appraisal.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">État: {appraisal.condition === 'excellent' ? 'Excellent' : appraisal.condition === 'good' ? 'Bon' : appraisal.condition === 'fair' ? 'Moyen' : 'Mauvais'}</p>
                      {appraisal.notes && (
                        <p className="text-sm text-gray-600 mt-2">{appraisal.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        appraisal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appraisal.status === 'completed' ? 'Complétée' : 'En attente'}
                      </span>
                      <span className="text-lg font-bold text-amber-600">DZD{appraisal.estimatedValue.toFixed(2)}</span>
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
