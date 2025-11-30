'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Package, ShoppingCart, Users, BarChart3, TrendingUp, DollarSign } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers'

interface Product {
  id: string
  name: string
  description: string
  price: number
  cost: number
  category: string
  stock: number
  sku: string
  status: 'active' | 'inactive'
}

interface Sale {
  id: string
  items: Array<{ productId: string; name: string; quantity: number; price: number }>
  total: number
  customerName?: string
  date: Date
  paymentMethod: 'cash' | 'card' | 'mobile'
}

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  totalPurchases: number
  lastPurchase?: Date
}

export default function RetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('retail-products')
    const savedSales = localStorage.getItem('retail-sales')
    const savedCustomers = localStorage.getItem('retail-customers')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'T-Shirt Basic', description: 'T-shirt coton basique', price: 15.99, cost: 8.00, category: 'Vêtements', stock: 50, sku: 'TSH-001', status: 'active' },
        { id: '2', name: 'Jean Slim', description: 'Jean slim fit', price: 49.99, cost: 25.00, category: 'Vêtements', stock: 30, sku: 'JEA-001', status: 'active' },
        { id: '3', name: 'Chaussures Sport', description: 'Chaussures de sport confortables', price: 79.99, cost: 40.00, category: 'Chaussures', stock: 25, sku: 'SHO-001', status: 'active' },
      ]
      setProducts(sample)
      localStorage.setItem('retail-products', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date),
        lastPurchase: s.lastPurchase ? new Date(s.lastPurchase) : undefined,
      })))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({
        ...c,
        lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : undefined,
      })))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('retail-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('retail-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('retail-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
  ]

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
  const totalProfit = sales.reduce((sum, s) => {
    const saleProfit = s.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        return itemSum + (item.price - product.cost) * item.quantity
      }
      return itemSum
    }, 0)
    return sum + saleProfit
  }, 0)
  const lowStock = products.filter(p => p.stock < 10)

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
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{sales.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Profit</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {lowStock.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {lowStock.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{product.name}</span>
                      <span className="font-semibold text-yellow-700 mt-1 sm:mt-0">Stock: {product.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Point de Vente</h3>
                  <p className="text-sm text-gray-600">Système de caisse enregistreuse</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Stock</h3>
                  <p className="text-sm text-gray-600">Suivi des stocks en temps réel</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Analyses de ventes et profits</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Gestion des modes de paiement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Inventaire</h3>
                  <p className="text-sm text-gray-600">Inventaire et réapprovisionnement</p>
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
                Ajouter Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-xs text-gray-500 mb-3">SKU: {product.sku} • {product.category}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">DZD{product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock < 10 ? 'Stock faible' : 'En stock'}
                    </span>
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
                Nouvelle Vente
              </button>
            </div>
            {sales.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Vente #{sale.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {sale.items.length} article(s) • {new Date(sale.date).toLocaleDateString('fr-FR')}
                        </p>
                        {sale.customerName && (
                          <p className="text-sm text-gray-500 mt-1">Client: {sale.customerName}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">DZD{sale.total.toFixed(2)}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs capitalize">
                          {sale.paymentMethod}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                    {customer.email && <p className="text-sm text-gray-600 mb-1">{customer.email}</p>}
                    {customer.phone && <p className="text-sm text-gray-600 mb-3">{customer.phone}</p>}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Achats</p>
                        <p className="font-bold text-gray-900">{customer.totalPurchases}</p>
                      </div>
                      {customer.lastPurchase && (
                        <p className="text-xs text-gray-500">Dernier: {new Date(customer.lastPurchase).toLocaleDateString('fr-FR')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}