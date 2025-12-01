'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { ShoppingBag, ShoppingCart, Users, BarChart3, Package, Tag, Star, TrendingUp } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers' | 'inventory'

interface Product {
  id: string
  name: string
  description: string
  category: 'men' | 'women' | 'kids' | 'accessories' | 'shoes'
  brand: string
  price: number
  cost: number
  stock: number
  sold: number
  sizes?: string[]
  colors: string[]
  rating?: number
  season: 'all' | 'spring' | 'summer' | 'autumn' | 'winter'
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  date: Date
  items: { productId: string; productName: string; quantity: number; price: number; size?: string; color?: string }[]
  total: number
  discount?: number
  paymentMethod: 'cash' | 'card' | 'installment'
  status: 'completed' | 'pending' | 'cancelled'
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
  size?: string
  loyaltyPoints: number
}

export default function FashionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: 'women' as 'men' | 'women' | 'kids' | 'accessories' | 'shoes', brand: '', price: 0, cost: 0, stock: 0, sold: 0, sizes: [] as string[], colors: [] as string[], season: 'all' as 'all' | 'spring' | 'summer' | 'autumn' | 'winter' })
  const [newSale, setNewSale] = useState({ customerId: '', items: [{ productId: '', quantity: 1, size: '', color: '' }], paymentMethod: 'cash' as 'cash' | 'card' | 'installment', discount: 0 })
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' })

  useEffect(() => {
    const savedProducts = localStorage.getItem('fashion-products')
    const savedSales = localStorage.getItem('fashion-sales')
    const savedCustomers = localStorage.getItem('fashion-customers')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Robe Élégante', description: 'Robe longue élégante pour soirée', category: 'women', brand: 'Fashion Brand', price: 89, cost: 45, stock: 15, sold: 32, sizes: ['S', 'M', 'L', 'XL'], colors: ['Noir', 'Rouge', 'Bleu'], rating: 4.7, season: 'all' },
        { id: '2', name: 'Costume Classique', description: 'Costume deux pièces homme', category: 'men', brand: 'Premium Suit', price: 299, cost: 150, stock: 8, sold: 18, sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Noir', 'Bleu marine', 'Gris'], rating: 4.8, season: 'all' },
        { id: '3', name: 'Sneakers Sport', description: 'Chaussures de sport confortables', category: 'shoes', brand: 'SportMax', price: 79, cost: 40, stock: 25, sold: 45, sizes: ['38', '39', '40', '41', '42', '43'], colors: ['Blanc', 'Noir', 'Rouge'], rating: 4.6, season: 'all' },
        { id: '4', name: 'Sac à Main Cuir', description: 'Sac en cuir véritable', category: 'accessories', brand: 'Leather Lux', price: 149, cost: 75, stock: 12, sold: 28, colors: ['Marron', 'Noir', 'Beige'], rating: 4.9, season: 'all' },
        { id: '5', name: 'Ensemble Enfant', description: 'Ensemble complet garçon/fille', category: 'kids', brand: 'Kids Fashion', price: 45, cost: 22, stock: 30, sold: 55, sizes: ['4 ans', '6 ans', '8 ans', '10 ans'], colors: ['Bleu', 'Rose', 'Vert'], rating: 4.5, season: 'all' },
      ]
      setProducts(sample)
      localStorage.setItem('fashion-products', JSON.stringify(sample))
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
          items: [{ productId: '1', productName: 'Robe Élégante', quantity: 1, price: 89, size: 'M', color: 'Noir' }],
          total: 89,
          paymentMethod: 'card',
          status: 'completed',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ productId: '2', productName: 'Costume Classique', quantity: 1, price: 299, size: 'L', color: 'Bleu marine' }],
          total: 299,
          paymentMethod: 'card',
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('fashion-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 1234', totalPurchases: 6, totalSpent: 450, favoriteCategory: 'women', size: 'M', loyaltyPoints: 45 },
        { id: '2', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 5678', totalPurchases: 4, totalSpent: 800, favoriteCategory: 'men', size: 'L', loyaltyPoints: 80 },
      ]
      setCustomers(sample)
      localStorage.setItem('fashion-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('fashion-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('fashion-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('fashion-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: ShoppingBag },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'inventory' as TabType, label: 'Inventaire', icon: Package },
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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
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
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingSales}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                  </div>
                  <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Produits populaires</h3>
                <div className="space-y-3">
                  {products.sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{product.category} • {product.brand}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-pink-600">DZD{product.price.toFixed(2)}</p>
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
              <button 
                onClick={() => setShowProductModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
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
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{product.brand}</span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    {product.sizes && (
                      <p className="text-xs text-gray-500 mb-1">Tailles: {product.sizes.join(', ')}</p>
                    )}
                    <p className="text-xs text-gray-500">Couleurs: {product.colors.join(', ')}</p>
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
                      <span className="font-bold text-pink-600">DZD{product.price.toFixed(2)}</span>
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
              <button 
                onClick={() => setShowSaleModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
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
                      <div className="mt-3 space-y-1">
                        {sale.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.productName}
                            {item.size && ` (Taille: ${item.size})`}
                            {item.color && ` (Couleur: ${item.color})`}
                            {' - DZD'}{item.price.toFixed(2)}
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
              <button 
                onClick={() => setShowCustomerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
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
                    {customer.size && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taille:</span>
                        <span className="font-medium text-gray-900">{customer.size}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Points fidélité:</span>
                      <span className="font-medium text-pink-600">{customer.loyaltyPoints}</span>
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

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marque</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vendus</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">{product.category}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.brand}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{product.stock}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{product.sold}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">DZD{product.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock < 5 ? 'bg-red-100 text-red-800' :
                            product.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stock < 5 ? 'Stock très faible' : product.stock < 10 ? 'Stock faible' : 'En stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
      </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setNewProduct({ name: '', description: '', category: 'women', brand: '', price: 0, cost: 0, stock: 0, sold: 0, sizes: [], colors: [], season: 'all' })
        }}
        title="Ajouter un produit"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Nom du produit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'men' | 'women' | 'kids' | 'accessories' | 'shoes' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="men">Homme</option>
                <option value="women">Femme</option>
                <option value="kids">Enfant</option>
                <option value="accessories">Accessoires</option>
                <option value="shoes">Chaussures</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Marque"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD)</label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tailles (séparées par des virgules)</label>
            <input
              type="text"
              value={newProduct.sizes.join(', ')}
              onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: S, M, L, XL"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleurs (séparées par des virgules)</label>
            <input
              type="text"
              value={newProduct.colors.join(', ')}
              onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Noir, Rouge, Bleu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saison</label>
            <select
              value={newProduct.season}
              onChange={(e) => setNewProduct({ ...newProduct, season: e.target.value as 'all' | 'spring' | 'summer' | 'autumn' | 'winter' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">Toutes saisons</option>
              <option value="spring">Printemps</option>
              <option value="summer">Été</option>
              <option value="autumn">Automne</option>
              <option value="winter">Hiver</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProductModal(false)
                setNewProduct({ name: '', description: '', category: 'women', brand: '', price: 0, cost: 0, stock: 0, sold: 0, sizes: [], colors: [], season: 'all' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProduct.name && newProduct.brand && newProduct.price > 0 && newProduct.colors.length > 0) {
                  const product: Product = {
                    id: Date.now().toString(),
                    name: newProduct.name,
                    description: newProduct.description,
                    category: newProduct.category,
                    brand: newProduct.brand,
                    price: newProduct.price,
                    cost: newProduct.cost,
                    stock: newProduct.stock,
                    sold: newProduct.sold,
                    sizes: newProduct.sizes.length > 0 ? newProduct.sizes : undefined,
                    colors: newProduct.colors,
                    season: newProduct.season,
                  }
                  setProducts([...products, product])
                  setShowProductModal(false)
                  setNewProduct({ name: '', description: '', category: 'women', brand: '', price: 0, cost: 0, stock: 0, sold: 0, sizes: [], colors: [], season: 'all' })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSaleModal}
        onClose={() => {
          setShowSaleModal(false)
          setNewSale({ customerId: '', items: [{ productId: '', quantity: 1, size: '', color: '' }], paymentMethod: 'cash', discount: 0 })
        }}
        title="Nouvelle vente"
        size="lg"
      >
        <div className="space-y-4">
          {customers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newSale.customerId}
                onChange={(e) => setNewSale({ ...newSale, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Client anonyme</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Articles</label>
            {newSale.items.map((item, idx) => (
              <div key={idx} className="space-y-2 mb-4 p-3 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={item.productId}
                    onChange={(e) => {
                      const updatedItems = [...newSale.items]
                      updatedItems[idx].productId = e.target.value
                      setNewSale({ ...newSale, items: updatedItems })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Produit</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...newSale.items]
                      updatedItems[idx].quantity = parseInt(e.target.value) || 1
                      setNewSale({ ...newSale, items: updatedItems })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="1"
                    placeholder="Qté"
                  />
                </div>
                {products.find(p => p.id === item.productId)?.sizes && (
                  <select
                    value={item.size}
                    onChange={(e) => {
                      const updatedItems = [...newSale.items]
                      updatedItems[idx].size = e.target.value
                      setNewSale({ ...newSale, items: updatedItems })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Taille</option>
                    {products.find(p => p.id === item.productId)?.sizes?.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={item.color}
                    onChange={(e) => {
                      const updatedItems = [...newSale.items]
                      updatedItems[idx].color = e.target.value
                      setNewSale({ ...newSale, items: updatedItems })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Couleur</option>
                    {products.find(p => p.id === item.productId)?.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  {newSale.items.length > 1 && (
                    <button
                      onClick={() => {
                        setNewSale({ ...newSale, items: newSale.items.filter((_, i) => i !== idx) })
                      }}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setNewSale({ ...newSale, items: [...newSale.items, { productId: '', quantity: 1, size: '', color: '' }] })
              }}
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              + Ajouter un article
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
              <select
                value={newSale.paymentMethod}
                onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value as 'cash' | 'card' | 'installment' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="cash">Espèces</option>
                <option value="card">Carte</option>
                <option value="installment">Tranches</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remise (DZD)</label>
              <input
                type="number"
                value={newSale.discount}
                onChange={(e) => setNewSale({ ...newSale, discount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowSaleModal(false)
                setNewSale({ customerId: '', items: [{ productId: '', quantity: 1, size: '', color: '' }], paymentMethod: 'cash', discount: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newSale.items.every(item => item.productId && item.quantity > 0)) {
                  const customer = newSale.customerId ? customers.find(c => c.id === newSale.customerId) : null
                  const saleItems = newSale.items.map(item => {
                    const product = products.find(p => p.id === item.productId)
                    return {
                      productId: item.productId,
                      productName: product?.name || '',
                      quantity: item.quantity,
                      price: product?.price || 0,
                      size: item.size || undefined,
                      color: item.color || undefined,
                    }
                  })
                  const subtotal = saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  const total = subtotal - newSale.discount
                  const sale: Sale = {
                    id: Date.now().toString(),
                    customerId: newSale.customerId || '',
                    customerName: customer?.name || 'Client anonyme',
                    date: new Date(),
                    items: saleItems,
                    total,
                    discount: newSale.discount > 0 ? newSale.discount : undefined,
                    paymentMethod: newSale.paymentMethod,
                    status: 'completed',
                  }
                  setSales([...sales, sale])
                  setShowSaleModal(false)
                  setNewSale({ customerId: '', items: [{ productId: '', quantity: 1, size: '', color: '' }], paymentMethod: 'cash', discount: 0 })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
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
          setNewCustomer({ name: '', email: '', phone: '', address: '' })
        }}
        title="Nouveau client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse (optionnel)</label>
            <input
              type="text"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Adresse"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCustomerModal(false)
                setNewCustomer({ name: '', email: '', phone: '', address: '' })
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
                    address: newCustomer.address || undefined,
                    totalPurchases: 0,
                    totalSpent: 0,
                    loyaltyPoints: 0,
                  }
                  setCustomers([...customers, customer])
                  setShowCustomerModal(false)
                  setNewCustomer({ name: '', email: '', phone: '', address: '' })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
