'use client'

import { useState, useEffect } from 'react'
import { Factory, Package, Users, BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

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

  const activeWorkers = workers.filter(w => w.status === 'active').length
  const operationalMachines = machines.filter(m => m.status === 'operational').length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_production').length
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock).length

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouveau Produit
              </button>
            </div>
            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        product.status === 'completed' ? 'bg-green-100 text-green-800' :
                        product.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status === 'completed' ? 'Terminé' :
                         product.status === 'in_production' ? 'En production' : 'En pause'}
                      </span>
                    </div>
                    <div className="space-y-2">
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Ajouter Article
              </button>
            </div>
            {inventory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun article</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6  DZD{
                    item.quantity <= item.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {item.category === 'raw_material' ? 'Matière première' :
                           item.category === 'component' ? 'Composant' : 'Produit fini'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">📍 {item.location}</p>
                        {item.supplier && <p className="text-sm text-gray-500 mt-1">Fournisseur: {item.supplier}</p>}
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold  DZD{
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Ajouter Ouvrier
              </button>
            </div>
            {workers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun ouvrier</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {workers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{worker.role}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        worker.status === 'active' ? 'bg-green-100 text-green-800' :
                        worker.status === 'on_break' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {worker.status === 'active' ? 'Actif' :
                         worker.status === 'on_break' ? 'Pause' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2">
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Ajouter Machine
              </button>
            </div>
            {machines.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune machine</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {machines.map((machine) => (
                  <div key={machine.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{machine.name}</h3>
                        <p className="text-sm text-gray-500">{machine.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        machine.status === 'operational' ? 'bg-green-100 text-green-800' :
                        machine.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {machine.status === 'operational' ? 'Opérationnelle' :
                         machine.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">🏭 {machine.department}</p>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Efficacité</span>
                          <span className="font-medium">{machine.efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full  DZD{
                              machine.efficiency >= 80 ? 'bg-green-500' :
                              machine.efficiency >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: ` DZD{machine.efficiency}%` }}
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{order.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.productName} - {order.quantity} pièces</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs  DZD{
                          order.priority === 'high' ? 'bg-red-100 text-red-800' :
                          order.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.priority === 'high' ? 'Haute' :
                           order.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
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
    </div>
  )
}
