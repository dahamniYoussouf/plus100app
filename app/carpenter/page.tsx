'use client'

import { useState, useEffect } from 'react'
import { Wrench, Calendar, Users, FileText, BarChart3, DollarSign, Package } from 'lucide-react'

type TabType = 'dashboard' | 'orders' | 'clients' | 'projects' | 'inventory'

interface Order {
  id: string
  clientId: string
  clientName: string
  description: string
  items: Array<{ name: string; quantity: number; specifications: string }>
  status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  orderDate: Date
  deliveryDate?: Date
  price: number
  notes?: string
}

interface Client {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  totalOrders: number
  lastOrder?: Date
}

interface Project {
  id: string
  orderId: string
  clientName: string
  description: string
  startDate: Date
  endDate?: Date
  status: 'planned' | 'in_progress' | 'completed'
  craftsman: string
  materials: string[]
  notes?: string
}

interface InventoryItem {
  id: string
  name: string
  type: 'wood' | 'hardware' | 'finish' | 'tool' | 'other'
  quantity: number
  unit: string
  minStock: number
  supplier: string
}

export default function CarpenterPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem('carpenter-orders')
    const savedClients = localStorage.getItem('carpenter-clients')
    const savedProjects = localStorage.getItem('carpenter-projects')
    const savedInventory = localStorage.getItem('carpenter-inventory')

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        orderDate: new Date(o.orderDate),
        deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Order[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Ahmed Benali',
          description: 'Armoire sur mesure',
          items: [
            { name: 'Armoire', quantity: 1, specifications: '200x180x60 cm, Chêne' },
          ],
          status: 'in_progress',
          orderDate: today,
          price: 1200,
        },
      ]
      setOrders(sample)
      localStorage.setItem('carpenter-orders', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastOrder: c.lastOrder ? new Date(c.lastOrder) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          address: '123 Rue des Fleurs, Alger',
          totalOrders: 2,
        },
      ]
      setClients(sample)
      localStorage.setItem('carpenter-clients', JSON.stringify(sample))
    }

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Project[] = [
        {
          id: '1',
          orderId: '1',
          clientName: 'Ahmed Benali',
          description: 'Fabrication armoire sur mesure',
          startDate: today,
          status: 'in_progress',
          craftsman: 'Omar Amrani',
          materials: ['Bois chêne', 'Quincaillerie', 'Vernis'],
        },
      ]
      setProjects(sample)
      localStorage.setItem('carpenter-projects', JSON.stringify(sample))
    }

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    } else {
      const sample: InventoryItem[] = [
        {
          id: '1',
          name: 'Planche Chêne',
          type: 'wood',
          quantity: 50,
          unit: 'm²',
          minStock: 20,
          supplier: 'Scierie ABC',
        },
        {
          id: '2',
          name: 'Vis à bois',
          type: 'hardware',
          quantity: 500,
          unit: 'pièces',
          minStock: 200,
          supplier: 'Quincaillerie XYZ',
        },
      ]
      setInventory(sample)
      localStorage.setItem('carpenter-inventory', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('carpenter-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('carpenter-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('carpenter-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (inventory.length > 0) localStorage.setItem('carpenter-inventory', JSON.stringify(inventory))
  }, [inventory])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'orders' as TabType, label: 'Commandes', icon: FileText },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'projects' as TabType, label: 'Projets', icon: Wrench },
    { id: 'inventory' as TabType, label: 'Stock', icon: Package },
  ]

  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'pending').length
  const totalRevenue = orders.filter(o => o.status === 'completed' || o.status === 'delivered').reduce((sum, o) => sum + o.price, 0)
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock)

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
                    <p className="text-xs sm:text-sm text-gray-600">Commandes Actives</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeOrders}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
                  </div>
                  <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockItems.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Commandes</h3>
                  <p className="text-sm text-gray-600">Suivi des commandes sur mesure</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Projets</h3>
                  <p className="text-sm text-gray-600">Suivi des projets de fabrication</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Stock</h3>
                  <p className="text-sm text-gray-600">Gestion des matériaux</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commandes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{order.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'completed' ? 'Terminée' :
                         order.status === 'delivered' ? 'Livrée' :
                         order.status === 'in_progress' ? 'En cours' :
                         order.status === 'cancelled' ? 'Annulée' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <p className="text-gray-600">
                        📅 Commande: {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                      </p>
                      {order.deliveryDate && (
                        <p className="text-gray-600">
                          📦 Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                      <p className="text-gray-700 font-medium">💰 Prix: DZD{order.price}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Articles:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded mb-1">
                          <span className="font-medium">{item.name}</span> - {item.quantity}x - {item.specifications}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{client.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      {client.email && <p className="text-sm text-gray-600">📧 {client.email}</p>}
                      <p className="text-sm text-gray-600">📍 {client.address}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Commandes:</span>
                        <span className="font-medium text-amber-600">{client.totalOrders}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{project.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'in_progress' ? 'En cours' : 'Planifié'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">👤 Artisan: {project.craftsman}</p>
                      <p className="text-gray-600">
                        📅 Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}
                        {project.endDate && ` - Fin: ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                      </p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Matériaux:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.materials.map((material, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                              {material}
                            </span>
                          ))}
                        </div>
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Stock</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Nouvel Article
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {inventory.map((item) => (
                <div key={item.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                  item.quantity <= item.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 capitalize">Type: {item.type}</p>
                    <p className="text-sm text-gray-600">Fournisseur: {item.supplier}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Stock:</span>
                      <span className={`font-medium ${
                        item.quantity <= item.minStock ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Min:</span>
                      <span className="text-gray-700">{item.minStock} {item.unit}</span>
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
