'use client'

import { useState, useEffect } from 'react'
import { Laptop, ShoppingCart, Users, BarChart3, Package, Wrench, TrendingUp, Smartphone } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers' | 'repairs'

interface Product {
  id: string
  name: string
  description: string
  category: 'laptop' | 'phone' | 'tablet' | 'accessory' | 'component' | 'other'
  brand: string
  price: number
  cost: number
  stock: number
  sold: number
  warranty: number
  specifications?: string[]
  rating?: number
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
  lastPurchase?: Date
}

interface Repair {
  id: string
  customerId: string
  customerName: string
  device: string
  issue: string
  date: Date
  estimatedCost: number
  status: 'diagnosis' | 'repairing' | 'completed' | 'ready'
  technician?: string
  notes?: string
}

export default function ElectronicsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [repairs, setRepairs] = useState<Repair[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('electronics-products')
    const savedSales = localStorage.getItem('electronics-sales')
    const savedCustomers = localStorage.getItem('electronics-customers')
    const savedRepairs = localStorage.getItem('electronics-repairs')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Laptop Dell XPS 15', description: 'Ordinateur portable 15 pouces, Intel i7, 16GB RAM, 512GB SSD', category: 'laptop', brand: 'Dell', price: 1299, cost: 900, stock: 8, sold: 15, warranty: 24, specifications: ['Intel i7', '16GB RAM', '512GB SSD', '15" FHD'], rating: 4.7 },
        { id: '2', name: 'iPhone 15 Pro', description: 'Smartphone Apple dernière génération', category: 'phone', brand: 'Apple', price: 1199, cost: 850, stock: 12, sold: 28, warranty: 12, specifications: ['128GB', 'A17 Pro', '48MP Camera'], rating: 4.9 },
        { id: '3', name: 'iPad Air', description: 'Tablette Apple 10.9 pouces', category: 'tablet', brand: 'Apple', price: 599, cost: 450, stock: 15, sold: 22, warranty: 12, specifications: ['10.9"', 'M1 Chip', '64GB'], rating: 4.8 },
        { id: '4', name: 'Casque Sony WH-1000XM5', description: 'Casque audio sans fil avec réduction de bruit', category: 'accessory', brand: 'Sony', price: 399, cost: 280, stock: 20, sold: 35, warranty: 12, rating: 4.6 },
        { id: '5', name: 'SSD Samsung 1TB', description: 'Disque dur SSD interne 1TB', category: 'component', brand: 'Samsung', price: 89, cost: 60, stock: 45, sold: 120, warranty: 60, rating: 4.5 },
      ]
      setProducts(sample)
      localStorage.setItem('electronics-products', JSON.stringify(sample))
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
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ productId: '1', productName: 'Laptop Dell XPS 15', quantity: 1, price: 1299 }],
          total: 1299,
          paymentMethod: 'card',
          status: 'completed',
          warranty: 24,
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Fatima Kadri',
          date: today,
          items: [{ productId: '2', productName: 'iPhone 15 Pro', quantity: 1, price: 1199 }],
          total: 1199,
          discount: 50,
          paymentMethod: 'installment',
          status: 'pending',
          warranty: 12,
        },
      ]
      setSales(sample)
      localStorage.setItem('electronics-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({ ...c, lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : undefined })))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 1234', totalPurchases: 5, totalSpent: 3500, favoriteCategory: 'laptop', lastPurchase: new Date() },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 5678', totalPurchases: 3, totalSpent: 2500, favoriteCategory: 'phone', lastPurchase: new Date() },
      ]
      setCustomers(sample)
      localStorage.setItem('electronics-customers', JSON.stringify(sample))
    }

    if (savedRepairs) {
      const parsed = JSON.parse(savedRepairs)
      setRepairs(parsed.map((r: any) => ({ ...r, date: new Date(r.date) })))
    } else {
      const sample: Repair[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Ahmed Benali',
          device: 'MacBook Pro 2020',
          issue: 'Écran cassé',
          date: new Date(),
          estimatedCost: 350,
          status: 'repairing',
          technician: 'Mohamed',
          notes: 'Remplacement écran Retina',
        },
      ]
      setRepairs(sample)
      localStorage.setItem('electronics-repairs', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('electronics-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('electronics-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('electronics-customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (repairs.length > 0) localStorage.setItem('electronics-repairs', JSON.stringify(repairs))
  }, [repairs])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Laptop },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'repairs' as TabType, label: 'Réparations', icon: Wrench },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
  const totalProfit = sales.filter(s => s.status === 'completed').reduce((sum, s) => {
    const itemsProfit = s.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId)
      return itemSum + (item.price - (product?.cost || 0)) * item.quantity
    }, 0)
    return sum + itemsProfit - (s.discount || 0)
  }, 0)
  const pendingRepairs = repairs.filter(r => r.status === 'diagnosis' || r.status === 'repairing').length
  const lowStock = products.filter(p => p.stock < 10).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réparations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingRepairs}</p>
                  </div>
                  <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
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
                        <span className={`text-xs px-2 py-1 rounded-full  DZD{
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
                        <p className="text-sm text-gray-500">{product.brand} • {product.category}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-yellow-500">★</span>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-blue-600">DZD{product.price.toFixed(2)}</p>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs capitalize">{product.category}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">{product.brand}</span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-yellow-500">★</span>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Spécifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.specifications.slice(0, 3).map((spec, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{spec}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold  DZD{product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendus:</span>
                      <span className="font-medium text-gray-900">{product.sold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Garantie:</span>
                      <span className="font-medium text-gray-900">{product.warranty} mois</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-blue-600">DZD{product.price.toFixed(2)}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                        <p className="text-sm text-blue-600 mt-1">Garantie: {sale.warranty} mois</p>
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
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
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                    {customer.favoriteCategory && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Préférence:</span>
                        <span className="font-medium text-blue-600 capitalize">{customer.favoriteCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'repairs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réparations</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle réparation
              </button>
            </div>
            <div className="space-y-4">
              {repairs.map((repair) => (
                <div key={repair.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{repair.device}</h3>
                      <p className="text-sm text-gray-600 mt-1">{repair.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(repair.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-700 mt-2 font-medium">Problème: {repair.issue}</p>
                      {repair.technician && (
                        <p className="text-sm text-gray-500 mt-1">Technicien: {repair.technician}</p>
                      )}
                      {repair.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">{repair.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        repair.status === 'completed' ? 'bg-green-100 text-green-800' :
                        repair.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                        repair.status === 'repairing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {repair.status === 'completed' ? 'Terminée' :
                         repair.status === 'ready' ? 'Prête' :
                         repair.status === 'repairing' ? 'En réparation' :
                         'Diagnostic'}
                      </span>
                      <span className="text-lg font-bold text-blue-600">DZD{repair.estimatedCost.toFixed(2)}</span>
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
