'use client'

import { useState, useEffect, useMemo } from 'react'
import { Gamepad2, ShoppingCart, Users, BarChart3, Package, Star, TrendingUp, Baby, Edit2, Trash2, Search, Filter, X, Plus } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'products' | 'sales' | 'customers' | 'categories'

interface Product {
  id: string
  name: string
  description: string
  category: 'educational' | 'outdoor' | 'electronic' | 'board_game' | 'plush' | 'other'
  ageRange: string
  price: number
  cost: number
  stock: number
  sold: number
  rating?: number
  brand?: string
  safety?: string[]
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
  giftWrap?: boolean
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
  childAge?: string
}

interface SaleItem {
  productId: string
  quantity: number
}

export default function ToysPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  
  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: 'educational' as Product['category'], ageRange: '', price: 0, cost: 0, stock: 0, rating: 0, brand: '', safety: [] as string[] })
  const [newSafety, setNewSafety] = useState('')
  const [newSale, setNewSale] = useState({ customerId: '', date: '', items: [] as SaleItem[], discount: 0, paymentMethod: 'card' as 'cash' | 'card', status: 'completed' as 'completed' | 'pending' | 'cancelled', giftWrap: false })
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '', favoriteCategory: '' as Product['category'] | '', childAge: '' })
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

  useEffect(() => {
    const savedProducts = localStorage.getItem('toys-products')
    const savedSales = localStorage.getItem('toys-sales')
    const savedCustomers = localStorage.getItem('toys-customers')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        { id: '1', name: 'Lego Classic', description: 'Boîte de briques créatives', category: 'educational', ageRange: '4-99 ans', price: 29.99, cost: 15, stock: 45, sold: 120, rating: 4.8, brand: 'Lego', safety: ['CE', 'Non-toxique'] },
        { id: '2', name: 'Vélo Enfant', description: 'Vélo 16 pouces avec roues stabilisatrices', category: 'outdoor', ageRange: '4-7 ans', price: 89, cost: 50, stock: 12, sold: 35, rating: 4.6, brand: 'BikeKids', safety: ['Norme CE'] },
        { id: '3', name: 'Tablette Éducative', description: 'Tablette interactive pour apprendre', category: 'electronic', ageRange: '3-8 ans', price: 79, cost: 40, stock: 20, sold: 58, rating: 4.5, brand: 'EduTech', safety: ['Protection écran'] },
        { id: '4', name: 'Monopoly Junior', description: 'Jeu de société adapté aux enfants', category: 'board_game', ageRange: '5-8 ans', price: 24.99, cost: 12, stock: 30, sold: 42, rating: 4.7, brand: 'Hasbro', safety: ['Petites pièces'] },
        { id: '5', name: 'Peluche Ours', description: 'Ours en peluche doux et câlin', category: 'plush', ageRange: '0+ ans', price: 19.99, cost: 8, stock: 50, sold: 95, rating: 4.9, brand: 'SoftToys', safety: ['Lavable', 'Hypoallergénique'] },
      ]
      setProducts(sample)
      localStorage.setItem('toys-products', JSON.stringify(sample))
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
          items: [{ productId: '1', productName: 'Lego Classic', quantity: 1, price: 29.99 }],
          total: 29.99,
          paymentMethod: 'card',
          status: 'completed',
          giftWrap: true,
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ productId: '2', productName: 'Vélo Enfant', quantity: 1, price: 89 }],
          total: 89,
          paymentMethod: 'card',
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('toys-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 1234', totalPurchases: 5, totalSpent: 150, favoriteCategory: 'educational', childAge: '6 ans' },
        { id: '2', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 5678', totalPurchases: 3, totalSpent: 200, favoriteCategory: 'outdoor', childAge: '5 ans' },
      ]
      setCustomers(sample)
      localStorage.setItem('toys-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('toys-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('toys-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('toys-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Gamepad2 },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'categories' as TabType, label: 'Catégories', icon: Package },
  ]

  const totalRevenue = useMemo(() => sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0), [sales])
  const totalProfit = useMemo(() => sales.filter(s => s.status === 'completed').reduce((sum, s) => {
    const itemsProfit = s.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId)
      return itemSum + (item.price - (product?.cost || 0)) * item.quantity
    }, 0)
    return sum + itemsProfit - (s.discount || 0)
  }, 0), [sales, products])
  const pendingSales = useMemo(() => sales.filter(s => s.status === 'pending').length, [sales])
  const lowStock = useMemo(() => products.filter(p => p.stock < 10).length, [products])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(p => p.category === filterCategory)
    }
    return filtered
  }, [products, searchQuery, filterCategory])

  const filteredSales = useMemo(() => {
    let filtered = sales
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus)
    }
    return filtered
  }, [sales, searchQuery, filterStatus])

  const filteredCustomers = useMemo(() => {
    let filtered = customers
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [customers, searchQuery])

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      const product: Product = {
        id: editingProduct?.id || Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        ageRange: newProduct.ageRange,
        price: newProduct.price,
        cost: newProduct.cost,
        stock: newProduct.stock,
        sold: editingProduct?.sold || 0,
        rating: newProduct.rating || undefined,
        brand: newProduct.brand || undefined,
        safety: newProduct.safety.length > 0 ? newProduct.safety : undefined,
      }
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? product : p))
      } else {
        setProducts([...products, product])
      }
      setShowProductModal(false)
      setEditingProduct(null)
      setNewProduct({ name: '', description: '', category: 'educational', ageRange: '', price: 0, cost: 0, stock: 0, rating: 0, brand: '', safety: [] })
      setNewSafety('')
    }
  }

  const handleAddSale = () => {
    if (newSale.customerId && newSale.items.length > 0 && newSale.date) {
      const customer = customers.find(c => c.id === newSale.customerId)
      if (!customer) return
      
      const saleItems = newSale.items.map(item => {
        const product = products.find(p => p.id === item.productId)
        if (!product) return null
        return {
          productId: item.productId,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        }
      }).filter(Boolean) as { productId: string; productName: string; quantity: number; price: number }[]
      
      const subtotal = saleItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const total = subtotal - (newSale.discount || 0)
      
      const sale: Sale = {
        id: editingSale?.id || Date.now().toString(),
        customerId: newSale.customerId,
        customerName: customer.name,
        date: new Date(newSale.date),
        items: saleItems,
        total,
        discount: newSale.discount || undefined,
        paymentMethod: newSale.paymentMethod,
        status: newSale.status,
        giftWrap: newSale.giftWrap || undefined,
      }
      
      if (editingSale) {
        setSales(sales.map(s => s.id === editingSale.id ? sale : s))
      } else {
        setSales([...sales, sale])
        // Update customer stats
        setCustomers(customers.map(c => 
          c.id === customer.id 
            ? { ...c, totalPurchases: c.totalPurchases + 1, totalSpent: c.totalSpent + total }
            : c
        ))
        // Update product stock and sold
        saleItems.forEach(item => {
          const product = products.find(p => p.id === item.productId)
          if (product) {
            setProducts(products.map(p => 
              p.id === item.productId 
                ? { ...p, stock: Math.max(0, p.stock - item.quantity), sold: p.sold + item.quantity }
                : p
            ))
          }
        })
      }
      
      setShowSaleModal(false)
      setEditingSale(null)
      setNewSale({ customerId: '', date: '', items: [], discount: 0, paymentMethod: 'card', status: 'completed', giftWrap: false })
    }
  }

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer: Customer = {
        id: editingCustomer?.id || Date.now().toString(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address || undefined,
        totalPurchases: editingCustomer?.totalPurchases || 0,
        totalSpent: editingCustomer?.totalSpent || 0,
        favoriteCategory: newCustomer.favoriteCategory || undefined,
        childAge: newCustomer.childAge || undefined,
      }
      if (editingCustomer) {
        setCustomers(customers.map(c => c.id === editingCustomer.id ? customer : c))
      } else {
        setCustomers([...customers, customer])
      }
      setShowCustomerModal(false)
      setEditingCustomer(null)
      setNewCustomer({ name: '', email: '', phone: '', address: '', favoriteCategory: '', childAge: '' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'product') {
      setProducts(products.filter(p => p.id !== id))
    } else if (type === 'sale') {
      setSales(sales.filter(s => s.id !== id))
    } else if (type === 'customer') {
      setCustomers(customers.filter(c => c.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      description: product.description,
      category: product.category,
      ageRange: product.ageRange,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      rating: product.rating || 0,
      brand: product.brand || '',
      safety: product.safety || [],
    })
    setShowProductModal(true)
  }

  const openEditSale = (sale: Sale) => {
    setEditingSale(sale)
    setNewSale({
      customerId: sale.customerId,
      date: sale.date.toISOString().split('T')[0],
      items: sale.items.map(item => ({ productId: item.productId, quantity: item.quantity })),
      discount: sale.discount || 0,
      paymentMethod: sale.paymentMethod,
      status: sale.status,
      giftWrap: sale.giftWrap || false,
    })
    setShowSaleModal(true)
  }

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
      favoriteCategory: (customer.favoriteCategory || '') as Product['category'] | '',
      childAge: customer.childAge || '',
    })
    setShowCustomerModal(true)
  }

  const addSaleItem = () => {
    if (newSale.items.length === 0 || newSale.items[newSale.items.length - 1].productId) {
      setNewSale({ ...newSale, items: [...newSale.items, { productId: '', quantity: 1 }] })
    }
  }

  const updateSaleItem = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const updatedItems = [...newSale.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewSale({ ...newSale, items: updatedItems })
  }

  const removeSaleItem = (index: number) => {
    setNewSale({ ...newSale, items: newSale.items.filter((_, i) => i !== index) })
  }

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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalProfit.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ventes en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingSales}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                  </div>
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
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
                        {sale.giftWrap && (
                          <p className="text-xs text-yellow-600 mt-1">🎁 Emballage cadeau</p>
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
                        <p className="text-sm text-gray-500">{product.ageRange} • {product.category}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-yellow-600">DZD{product.price.toFixed(2)}</p>
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
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({ name: '', description: '', category: 'educational', ageRange: '', price: 0, cost: 0, stock: 0, rating: 0, brand: '', safety: [] })
                  setNewSafety('')
                  setShowProductModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="educational">Éducatif</option>
                  <option value="outdoor">Extérieur</option>
                  <option value="electronic">Électronique</option>
                  <option value="board_game">Jeux de société</option>
                  <option value="plush">Peluches</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs capitalize">{product.category}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{product.ageRange}</span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => openEditProduct(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'product', id: product.id })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {product.brand && (
                    <p className="text-xs text-gray-500 mb-2">Marque: {product.brand}</p>
                  )}
                  {product.safety && product.safety.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Sécurité:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.safety.map((s, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
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
                      <span className="font-bold text-yellow-600">DZD{product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button 
                onClick={() => {
                  setEditingSale(null)
                  setNewSale({ customerId: '', date: new Date().toISOString().split('T')[0], items: [], discount: 0, paymentMethod: 'card', status: 'completed', giftWrap: false })
                  setShowSaleModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle vente
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une vente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="completed">Complétée</option>
                  <option value="pending">En attente</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredSales.map((sale) => (
                <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">Vente #{sale.id}</h3>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openEditSale(sale)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'sale', id: sale.id })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{sale.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">Paiement: {sale.paymentMethod === 'cash' ? 'Espèces' : 'Carte'}</p>
                      {sale.giftWrap && (
                        <p className="text-sm text-yellow-600 mt-1 font-medium">🎁 Emballage cadeau inclus</p>
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
            {filteredSales.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente trouvée</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button 
                onClick={() => {
                  setEditingCustomer(null)
                  setNewCustomer({ name: '', email: '', phone: '', address: '', favoriteCategory: '', childAge: '' })
                  setShowCustomerModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau client
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditCustomer(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'customer', id: customer.id })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{customer.phone}</p>
                  {customer.address && (
                    <p className="text-sm text-gray-600 mb-4">{customer.address}</p>
                  )}
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Achats:</span>
                      <span className="font-medium text-gray-900">{customer.totalPurchases}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    {customer.childAge && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Âge enfant:</span>
                        <span className="font-medium text-gray-900">{customer.childAge}</span>
                      </div>
                    )}
                    {customer.favoriteCategory && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Préférence:</span>
                        <span className="font-medium text-yellow-600 capitalize">{customer.favoriteCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {filteredCustomers.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client trouvé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Catégories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {['educational', 'outdoor', 'electronic', 'board_game', 'plush', 'other'].map((category) => {
                const categoryProducts = products.filter(p => p.category === category)
                const categoryRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => {
                  const categoryItems = s.items.filter(item => {
                    const product = products.find(p => p.id === item.productId)
                    return product?.category === category
                  })
                  return sum + categoryItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
                }, 0)
                return (
                  <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">{category === 'board_game' ? 'Jeux de société' : category === 'educational' ? 'Éducatif' : category === 'outdoor' ? 'Extérieur' : category === 'electronic' ? 'Électronique' : category === 'plush' ? 'Peluches' : 'Autre'}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Produits:</span>
                        <span className="font-medium text-gray-900">{categoryProducts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus:</span>
                        <span className="font-medium text-green-600">DZD{categoryRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total vendu:</span>
                        <span className="font-medium text-gray-900">{categoryProducts.reduce((sum, p) => sum + p.sold, 0)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setNewProduct({ name: '', description: '', category: 'educational', ageRange: '', price: 0, cost: 0, stock: 0, rating: 0, brand: '', safety: [] })
          setNewSafety('')
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Nom du produit"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="educational">Éducatif</option>
                <option value="outdoor">Extérieur</option>
                <option value="electronic">Électronique</option>
                <option value="board_game">Jeux de société</option>
                <option value="plush">Peluches</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tranche d'âge *</label>
              <input
                type="text"
                value={newProduct.ageRange}
                onChange={(e) => setNewProduct({ ...newProduct, ageRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 4-8 ans"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (DZD) *</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD)</label>
              <input
                type="number"
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (0-5)</label>
              <input
                type="number"
                value={newProduct.rating}
                onChange={(e) => setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Marque"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sécurité</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSafety}
                onChange={(e) => setNewSafety(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newSafety.trim()) {
                    e.preventDefault()
                    setNewProduct({ ...newProduct, safety: [...newProduct.safety, newSafety.trim()] })
                    setNewSafety('')
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ajouter une norme de sécurité"
              />
              <button
                onClick={() => {
                  if (newSafety.trim()) {
                    setNewProduct({ ...newProduct, safety: [...newProduct.safety, newSafety.trim()] })
                    setNewSafety('')
                  }
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newProduct.safety.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                  {s}
                  <button
                    onClick={() => setNewProduct({ ...newProduct, safety: newProduct.safety.filter((_, i) => i !== idx) })}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowProductModal(false)
                setEditingProduct(null)
                setNewProduct({ name: '', description: '', category: 'educational', ageRange: '', price: 0, cost: 0, stock: 0, rating: 0, brand: '', safety: [] })
                setNewSafety('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {editingProduct ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Sale Modal */}
      <Modal
        isOpen={showSaleModal}
        onClose={() => {
          setShowSaleModal(false)
          setEditingSale(null)
          setNewSale({ customerId: '', date: '', items: [], discount: 0, paymentMethod: 'card', status: 'completed', giftWrap: false })
        }}
        title={editingSale ? 'Modifier la vente' : 'Nouvelle vente'}
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
              <select
                value={newSale.customerId}
                onChange={(e) => setNewSale({ ...newSale, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={newSale.date}
                onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produits *</label>
            <div className="space-y-2">
              {newSale.items.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <select
                    value={item.productId}
                    onChange={(e) => updateSaleItem(idx, 'productId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - DZD{p.price.toFixed(2)}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateSaleItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    min="1"
                  />
                  <button
                    onClick={() => removeSaleItem(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addSaleItem}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-yellow-500 hover:text-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remise (DZD)</label>
              <input
                type="number"
                value={newSale.discount}
                onChange={(e) => setNewSale({ ...newSale, discount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
              <select
                value={newSale.paymentMethod}
                onChange={(e) => setNewSale({ ...newSale, paymentMethod: e.target.value as 'cash' | 'card' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="card">Carte</option>
                <option value="cash">Espèces</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newSale.status}
                onChange={(e) => setNewSale({ ...newSale, status: e.target.value as 'completed' | 'pending' | 'cancelled' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="completed">Complétée</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSale.giftWrap}
                  onChange={(e) => setNewSale({ ...newSale, giftWrap: e.target.checked })}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">Emballage cadeau</span>
              </label>
            </div>
          </div>
          {newSale.items.length > 0 && newSale.customerId && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total estimé:</p>
              <p className="text-2xl font-bold text-yellow-600">
                DZD{newSale.items.reduce((sum, item) => {
                  const product = products.find(p => p.id === item.productId)
                  return sum + (product?.price || 0) * item.quantity
                }, 0) - (newSale.discount || 0)}
              </p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowSaleModal(false)
                setEditingSale(null)
                setNewSale({ customerId: '', date: '', items: [], discount: 0, paymentMethod: 'card', status: 'completed', giftWrap: false })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddSale}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {editingSale ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Customer Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => {
          setShowCustomerModal(false)
          setEditingCustomer(null)
          setNewCustomer({ name: '', email: '', phone: '', address: '', favoriteCategory: '', childAge: '' })
        }}
        title={editingCustomer ? 'Modifier le client' : 'Nouveau client'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="+213 555 1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Adresse complète"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie préférée</label>
              <select
                value={newCustomer.favoriteCategory}
                onChange={(e) => setNewCustomer({ ...newCustomer, favoriteCategory: e.target.value as Product['category'] | '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Aucune</option>
                <option value="educational">Éducatif</option>
                <option value="outdoor">Extérieur</option>
                <option value="electronic">Électronique</option>
                <option value="board_game">Jeux de société</option>
                <option value="plush">Peluches</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Âge de l'enfant</label>
              <input
                type="text"
                value={newCustomer.childAge}
                onChange={(e) => setNewCustomer({ ...newCustomer, childAge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: 6 ans"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowCustomerModal(false)
                setEditingCustomer(null)
                setNewCustomer({ name: '', email: '', phone: '', address: '', favoriteCategory: '', childAge: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {editingCustomer ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Confirmer la suppression"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.type, deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
