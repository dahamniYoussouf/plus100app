'use client'

import { useState, useEffect, useMemo } from 'react'
import { Factory, Package, Users, BarChart3, TrendingUp, AlertCircle, CheckCircle, Edit2, Trash2, Search, Filter, Plus, X } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'production' | 'inventory' | 'workers' | 'machines' | 'orders'

interface Product {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  productionCost: number
  sellingPrice: number
  status: 'in_production' | 'completed' | 'on_hold'
}

interface Inventory {
  id: string
  name: string
  category: 'raw_material' | 'component' | 'finished_good'
  quantity: number
  unit: string
  minStock: number
  location: string
  supplier?: string
}

interface Worker {
  id: string
  name: string
  role: 'operator' | 'supervisor' | 'technician' | 'quality_control'
  department: string
  shift: 'morning' | 'afternoon' | 'night'
  status: 'active' | 'on_break' | 'off'
}

interface Machine {
  id: string
  name: string
  type: string
  status: 'operational' | 'maintenance' | 'idle'
  lastMaintenance?: Date
  efficiency: number
  department: string
}

interface Order {
  id: string
  clientName: string
  productId: string
  productName: string
  quantity: number
  dueDate: Date
  status: 'pending' | 'in_production' | 'completed' | 'delivered'
  priority: 'low' | 'medium' | 'high'
}

export default function FactoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [machines, setMachines] = useState<Machine[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showWorkerModal, setShowWorkerModal] = useState(false)
  const [showMachineModal, setShowMachineModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(null)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  
  // Form states
  const [newProduct, setNewProduct] = useState({ name: '', category: '', quantity: 0, unit: '', productionCost: 0, sellingPrice: 0, status: 'in_production' as Product['status'] })
  const [newInventory, setNewInventory] = useState({ name: '', category: 'raw_material' as Inventory['category'], quantity: 0, unit: '', minStock: 0, location: '', supplier: '' })
  const [newWorker, setNewWorker] = useState({ name: '', role: 'operator' as Worker['role'], department: '', shift: 'morning' as Worker['shift'], status: 'active' as Worker['status'] })
  const [newMachine, setNewMachine] = useState({ name: '', type: '', status: 'operational' as Machine['status'], efficiency: 100, department: '', lastMaintenance: '' })
  const [newOrder, setNewOrder] = useState({ clientName: '', productId: '', quantity: 0, dueDate: '', status: 'pending' as Order['status'], priority: 'medium' as Order['priority'] })
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string, id: string } | null>(null)

  useEffect(() => {
    const savedProducts = localStorage.getItem('factory-products')
    const savedInventory = localStorage.getItem('factory-inventory')
    const savedWorkers = localStorage.getItem('factory-workers')
    const savedMachines = localStorage.getItem('factory-machines')
    const savedOrders = localStorage.getItem('factory-orders')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Produit A',
          category: 'Électronique',
          quantity: 500,
          unit: 'pièce',
          productionCost: 50,
          sellingPrice: 100,
          status: 'in_production',
        },
      ]
      setProducts(sample)
      localStorage.setItem('factory-products', JSON.stringify(sample))
    }

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      const sample: Inventory[] = [
        {
          id: '1',
          name: 'Composant X',
          category: 'component',
          quantity: 1000,
          unit: 'pièce',
          minStock: 200,
          location: 'Entrepôt A',
          supplier: 'Fournisseur ABC',
        },
      ]
      setInventory(sample)
      localStorage.setItem('factory-inventory', JSON.stringify(sample))
    }

    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers))
    } else {
      const sample: Worker[] = [
        {
          id: '1',
          name: 'Omar Amrani',
          role: 'operator',
          department: 'Production',
          shift: 'morning',
          status: 'active',
        },
      ]
      setWorkers(sample)
      localStorage.setItem('factory-workers', JSON.stringify(sample))
    }

    if (savedMachines) {
      const parsed = JSON.parse(savedMachines)
      setMachines(parsed.map((m: any) => ({
        ...m,
        lastMaintenance: m.lastMaintenance ? new Date(m.lastMaintenance) : undefined,
      })))
    } else {
      const sample: Machine[] = [
        {
          id: '1',
          name: 'Machine de Production 1',
          type: 'Assemblage',
          status: 'operational',
          efficiency: 85,
          department: 'Production',
        },
      ]
      setMachines(sample)
      localStorage.setItem('factory-machines', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({ ...o, dueDate: new Date(o.dueDate) })))
    } else {
      const sample: Order[] = [
        {
          id: '1',
          clientName: 'Client XYZ',
          productId: '1',
          productName: 'Produit A',
          quantity: 100,
          dueDate: new Date('2024-02-28'),
          status: 'in_production',
          priority: 'high',
        },
      ]
      setOrders(sample)
      localStorage.setItem('factory-orders', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('factory-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (inventory.length > 0) localStorage.setItem('factory-inventory', JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => {
    if (workers.length > 0) localStorage.setItem('factory-workers', JSON.stringify(workers))
  }, [workers])

  useEffect(() => {
    if (machines.length > 0) localStorage.setItem('factory-machines', JSON.stringify(machines))
  }, [machines])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('factory-orders', JSON.stringify(orders))
  }, [orders])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'production' as TabType, label: 'Production', icon: Factory },
    { id: 'inventory' as TabType, label: 'Inventaire', icon: Package },
    { id: 'workers' as TabType, label: 'Ouvriers', icon: Users },
    { id: 'machines' as TabType, label: 'Machines', icon: Factory },
    { id: 'orders' as TabType, label: 'Commandes', icon: Package },
  ]

  const activeWorkers = useMemo(() => workers.filter(w => w.status === 'active').length, [workers])
  const operationalMachines = useMemo(() => machines.filter(m => m.status === 'operational').length, [machines])
  const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending' || o.status === 'in_production').length, [orders])
  const lowStockItems = useMemo(() => inventory.filter(i => i.quantity <= i.minStock).length, [inventory])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus)
    }
    return filtered
  }, [products, searchQuery, filterStatus])

  const filteredInventory = useMemo(() => {
    let filtered = inventory
    if (searchQuery) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [inventory, searchQuery])

  const filteredWorkers = useMemo(() => {
    let filtered = workers
    if (searchQuery) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [workers, searchQuery])

  const filteredMachines = useMemo(() => {
    let filtered = machines
    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [machines, searchQuery])

  const filteredOrders = useMemo(() => {
    let filtered = orders
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus)
    }
    return filtered
  }, [orders, searchQuery, filterStatus])

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      const product: Product = {
        id: editingProduct?.id || Date.now().toString(),
        ...newProduct,
      }
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? product : p))
      } else {
        setProducts([...products, product])
      }
      setShowProductModal(false)
      setEditingProduct(null)
      setNewProduct({ name: '', category: '', quantity: 0, unit: '', productionCost: 0, sellingPrice: 0, status: 'in_production' })
    }
  }

  const handleAddInventory = () => {
    if (newInventory.name && newInventory.location) {
      const item: Inventory = {
        id: editingInventory?.id || Date.now().toString(),
        ...newInventory,
        supplier: newInventory.supplier || undefined,
      }
      if (editingInventory) {
        setInventory(inventory.map(i => i.id === editingInventory.id ? item : i))
      } else {
        setInventory([...inventory, item])
      }
      setShowInventoryModal(false)
      setEditingInventory(null)
      setNewInventory({ name: '', category: 'raw_material', quantity: 0, unit: '', minStock: 0, location: '', supplier: '' })
    }
  }

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.department) {
      const worker: Worker = {
        id: editingWorker?.id || Date.now().toString(),
        ...newWorker,
      }
      if (editingWorker) {
        setWorkers(workers.map(w => w.id === editingWorker.id ? worker : w))
      } else {
        setWorkers([...workers, worker])
      }
      setShowWorkerModal(false)
      setEditingWorker(null)
      setNewWorker({ name: '', role: 'operator', department: '', shift: 'morning', status: 'active' })
    }
  }

  const handleAddMachine = () => {
    if (newMachine.name && newMachine.department) {
      const machine: Machine = {
        id: editingMachine?.id || Date.now().toString(),
        ...newMachine,
        lastMaintenance: newMachine.lastMaintenance ? new Date(newMachine.lastMaintenance) : undefined,
      }
      if (editingMachine) {
        setMachines(machines.map(m => m.id === editingMachine.id ? machine : m))
      } else {
        setMachines([...machines, machine])
      }
      setShowMachineModal(false)
      setEditingMachine(null)
      setNewMachine({ name: '', type: '', status: 'operational', efficiency: 100, department: '', lastMaintenance: '' })
    }
  }

  const handleAddOrder = () => {
    if (newOrder.clientName && newOrder.productId && newOrder.quantity && newOrder.dueDate) {
      const product = products.find(p => p.id === newOrder.productId)
      if (!product) return
      
      const order: Order = {
        id: editingOrder?.id || Date.now().toString(),
        clientName: newOrder.clientName,
        productId: newOrder.productId,
        productName: product.name,
        quantity: newOrder.quantity,
        dueDate: new Date(newOrder.dueDate),
        status: newOrder.status,
        priority: newOrder.priority,
      }
      if (editingOrder) {
        setOrders(orders.map(o => o.id === editingOrder.id ? order : o))
      } else {
        setOrders([...orders, order])
      }
      setShowOrderModal(false)
      setEditingOrder(null)
      setNewOrder({ clientName: '', productId: '', quantity: 0, dueDate: '', status: 'pending', priority: 'medium' })
    }
  }

  const handleDelete = (type: string, id: string) => {
    if (type === 'product') {
      setProducts(products.filter(p => p.id !== id))
    } else if (type === 'inventory') {
      setInventory(inventory.filter(i => i.id !== id))
    } else if (type === 'worker') {
      setWorkers(workers.filter(w => w.id !== id))
    } else if (type === 'machine') {
      setMachines(machines.filter(m => m.id !== id))
    } else if (type === 'order') {
      setOrders(orders.filter(o => o.id !== id))
    }
    setDeleteConfirm(null)
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({ ...product })
    setShowProductModal(true)
  }

  const openEditInventory = (item: Inventory) => {
    setEditingInventory(item)
    setNewInventory({ ...item, supplier: item.supplier || '' })
    setShowInventoryModal(true)
  }

  const openEditWorker = (worker: Worker) => {
    setEditingWorker(worker)
    setNewWorker({ ...worker })
    setShowWorkerModal(true)
  }

  const openEditMachine = (machine: Machine) => {
    setEditingMachine(machine)
    setNewMachine({ ...machine, lastMaintenance: machine.lastMaintenance ? machine.lastMaintenance.toISOString().split('T')[0] : '' })
    setShowMachineModal(true)
  }

  const openEditOrder = (order: Order) => {
    setEditingOrder(order)
    setNewOrder({ ...order, dueDate: order.dueDate.toISOString().split('T')[0] })
    setShowOrderModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                      ? 'text-gray-600 border-b-2 border-gray-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ouvriers Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeWorkers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Machines Opérationnelles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{operationalMachines}</p>
                  </div>
                  <Factory className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockItems}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Production</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null)
                  setNewProduct({ name: '', category: '', quantity: 0, unit: '', productionCost: 0, sellingPrice: 0, status: 'in_production' })
                  setShowProductModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Produit
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="in_production">En production</option>
                  <option value="completed">Terminé</option>
                  <option value="on_hold">En pause</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="flex gap-2">
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
                    <div className="space-y-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'completed' ? 'bg-green-100 text-green-800' :
                        product.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status === 'completed' ? 'Terminé' :
                         product.status === 'in_production' ? 'En production' : 'En pause'}
                      </span>
                      <p className="text-sm text-gray-600">📦 Quantité: {product.quantity} {product.unit}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Coût: DZD{product.productionCost}</span>
                        <span className="text-gray-900 font-medium">Prix: DZD{product.sellingPrice}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
              <button 
                onClick={() => {
                  setEditingInventory(null)
                  setNewInventory({ name: '', category: 'raw_material', quantity: 0, unit: '', minStock: 0, location: '', supplier: '' })
                  setShowInventoryModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter Article
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher dans l'inventaire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {filteredInventory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun article trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInventory.map((item) => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                    item.quantity <= item.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditInventory(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'inventory', id: item.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {item.category === 'raw_material' ? 'Matière première' :
                           item.category === 'component' ? 'Composant' : 'Produit fini'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">📍 {item.location}</p>
                        {item.supplier && <p className="text-sm text-gray-500 mt-1">Fournisseur: {item.supplier}</p>}
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-lg font-bold ${
                          item.quantity <= item.minStock ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {item.quantity} {item.unit}
                        </p>
                        <p className="text-xs text-gray-500">Min: {item.minStock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ouvriers</h2>
              <button 
                onClick={() => {
                  setEditingWorker(null)
                  setNewWorker({ name: '', role: 'operator', department: '', shift: 'morning', status: 'active' })
                  setShowWorkerModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter Ouvrier
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un ouvrier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {filteredWorkers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun ouvrier trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{worker.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditWorker(worker)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'worker', id: worker.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        worker.status === 'active' ? 'bg-green-100 text-green-800' :
                        worker.status === 'on_break' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {worker.status === 'active' ? 'Actif' :
                         worker.status === 'on_break' ? 'Pause' : 'Hors service'}
                      </span>
                      <p className="text-sm text-gray-600">🏭 {worker.department}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {worker.shift === 'morning' ? 'Matin' :
                         worker.shift === 'afternoon' ? 'Après-midi' : 'Nuit'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'machines' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Machines</h2>
              <button 
                onClick={() => {
                  setEditingMachine(null)
                  setNewMachine({ name: '', type: '', status: 'operational', efficiency: 100, department: '', lastMaintenance: '' })
                  setShowMachineModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter Machine
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une machine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {filteredMachines.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune machine trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredMachines.map((machine) => (
                  <div key={machine.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{machine.name}</h3>
                        <p className="text-sm text-gray-500">{machine.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditMachine(machine)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ type: 'machine', id: machine.id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        machine.status === 'operational' ? 'bg-green-100 text-green-800' :
                        machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {machine.status === 'operational' ? 'Opérationnelle' :
                         machine.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                      </span>
                      <p className="text-sm text-gray-600">🏭 {machine.department}</p>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Efficacité</span>
                          <span className="font-medium">{machine.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              machine.efficiency >= 80 ? 'bg-green-500' :
                              machine.efficiency >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${machine.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commandes</h2>
              <button 
                onClick={() => {
                  setEditingOrder(null)
                  setNewOrder({ clientName: '', productId: '', quantity: 0, dueDate: '', status: 'pending', priority: 'medium' })
                  setShowOrderModal(true)
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle Commande
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="in_production">En production</option>
                  <option value="completed">Terminée</option>
                  <option value="delivered">Livrée</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande trouvée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{order.clientName}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditOrder(order)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'order', id: order.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{order.productName} - {order.quantity} pièces</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.priority === 'high' ? 'bg-red-100 text-red-800' :
                          order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.priority === 'high' ? 'Haute' :
                           order.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'in_production' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'completed' ? 'Terminée' :
                           order.status === 'delivered' ? 'Livrée' :
                           order.status === 'in_production' ? 'En production' : 'En attente'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      📅 Échéance: {new Date(order.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Modal */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setEditingProduct(null)
          setNewProduct({ name: '', category: '', quantity: 0, unit: '', productionCost: 0, sellingPrice: 0, status: 'in_production' })
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <input
              type="text"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité *</label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: pièce, kg, m"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût de production (DZD) *</label>
              <input
                type="number"
                value={newProduct.productionCost}
                onChange={(e) => setNewProduct({ ...newProduct, productionCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente (DZD) *</label>
              <input
                type="number"
                value={newProduct.sellingPrice}
                onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={newProduct.status}
              onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as Product['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="in_production">En production</option>
              <option value="completed">Terminé</option>
              <option value="on_hold">En pause</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowProductModal(false)
                setEditingProduct(null)
                setNewProduct({ name: '', category: '', quantity: 0, unit: '', productionCost: 0, sellingPrice: 0, status: 'in_production' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingProduct ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Inventory Modal */}
      <Modal
        isOpen={showInventoryModal}
        onClose={() => {
          setShowInventoryModal(false)
          setEditingInventory(null)
          setNewInventory({ name: '', category: 'raw_material', quantity: 0, unit: '', minStock: 0, location: '', supplier: '' })
        }}
        title={editingInventory ? 'Modifier l\'article' : 'Nouvel article'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newInventory.name}
              onChange={(e) => setNewInventory({ ...newInventory, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={newInventory.category}
                onChange={(e) => setNewInventory({ ...newInventory, category: e.target.value as Inventory['category'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="raw_material">Matière première</option>
                <option value="component">Composant</option>
                <option value="finished_good">Produit fini</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unité *</label>
              <input
                type="text"
                value={newInventory.unit}
                onChange={(e) => setNewInventory({ ...newInventory, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input
                type="number"
                value={newInventory.quantity}
                onChange={(e) => setNewInventory({ ...newInventory, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock minimum *</label>
              <input
                type="number"
                value={newInventory.minStock}
                onChange={(e) => setNewInventory({ ...newInventory, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emplacement *</label>
            <input
              type="text"
              value={newInventory.location}
              onChange={(e) => setNewInventory({ ...newInventory, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <input
              type="text"
              value={newInventory.supplier}
              onChange={(e) => setNewInventory({ ...newInventory, supplier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowInventoryModal(false)
                setEditingInventory(null)
                setNewInventory({ name: '', category: 'raw_material', quantity: 0, unit: '', minStock: 0, location: '', supplier: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddInventory}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingInventory ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Worker Modal */}
      <Modal
        isOpen={showWorkerModal}
        onClose={() => {
          setShowWorkerModal(false)
          setEditingWorker(null)
          setNewWorker({ name: '', role: 'operator', department: '', shift: 'morning', status: 'active' })
        }}
        title={editingWorker ? 'Modifier l\'ouvrier' : 'Nouvel ouvrier'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newWorker.name}
              onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle *</label>
              <select
                value={newWorker.role}
                onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value as Worker['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="operator">Opérateur</option>
                <option value="supervisor">Superviseur</option>
                <option value="technician">Technicien</option>
                <option value="quality_control">Contrôle qualité</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
              <input
                type="text"
                value={newWorker.department}
                onChange={(e) => setNewWorker({ ...newWorker, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
              <select
                value={newWorker.shift}
                onChange={(e) => setNewWorker({ ...newWorker, shift: e.target.value as Worker['shift'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="morning">Matin</option>
                <option value="afternoon">Après-midi</option>
                <option value="night">Nuit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select
                value={newWorker.status}
                onChange={(e) => setNewWorker({ ...newWorker, status: e.target.value as Worker['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="on_break">Pause</option>
                <option value="off">Hors service</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowWorkerModal(false)
                setEditingWorker(null)
                setNewWorker({ name: '', role: 'operator', department: '', shift: 'morning', status: 'active' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddWorker}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingWorker ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Machine Modal */}
      <Modal
        isOpen={showMachineModal}
        onClose={() => {
          setShowMachineModal(false)
          setEditingMachine(null)
          setNewMachine({ name: '', type: '', status: 'operational', efficiency: 100, department: '', lastMaintenance: '' })
        }}
        title={editingMachine ? 'Modifier la machine' : 'Nouvelle machine'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={newMachine.name}
              onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <input
                type="text"
                value={newMachine.type}
                onChange={(e) => setNewMachine({ ...newMachine, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département *</label>
              <input
                type="text"
                value={newMachine.department}
                onChange={(e) => setNewMachine({ ...newMachine, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select
                value={newMachine.status}
                onChange={(e) => setNewMachine({ ...newMachine, status: e.target.value as Machine['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="operational">Opérationnelle</option>
                <option value="maintenance">Maintenance</option>
                <option value="idle">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Efficacité (%) *</label>
              <input
                type="number"
                value={newMachine.efficiency}
                onChange={(e) => setNewMachine({ ...newMachine, efficiency: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dernière maintenance</label>
            <input
              type="date"
              value={newMachine.lastMaintenance}
              onChange={(e) => setNewMachine({ ...newMachine, lastMaintenance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowMachineModal(false)
                setEditingMachine(null)
                setNewMachine({ name: '', type: '', status: 'operational', efficiency: 100, department: '', lastMaintenance: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddMachine}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingMachine ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setEditingOrder(null)
          setNewOrder({ clientName: '', productId: '', quantity: 0, dueDate: '', status: 'pending', priority: 'medium' })
        }}
        title={editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <input
              type="text"
              value={newOrder.clientName}
              onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit *</label>
            <select
              value={newOrder.productId}
              onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Sélectionner un produit</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
              <input
                type="number"
                value={newOrder.quantity}
                onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance *</label>
              <input
                type="date"
                value={newOrder.dueDate}
                onChange={(e) => setNewOrder({ ...newOrder, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
              <select
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as Order['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="pending">En attente</option>
                <option value="in_production">En production</option>
                <option value="completed">Terminée</option>
                <option value="delivered">Livrée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité *</label>
              <select
                value={newOrder.priority}
                onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value as Order['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => {
                setShowOrderModal(false)
                setEditingOrder(null)
                setNewOrder({ clientName: '', productId: '', quantity: 0, dueDate: '', status: 'pending', priority: 'medium' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddOrder}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {editingOrder ? 'Modifier' : 'Ajouter'}
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
