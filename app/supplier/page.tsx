'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Package, Users, DollarSign, BarChart3, TrendingUp, CheckCircle } from 'lucide-react'

type TabType = 'dashboard' | 'suppliers' | 'orders' | 'products' | 'contracts' | 'payments'

interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  category: string
  rating: number
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive' | 'suspended'
}

interface Order {
  id: string
  supplierId: string
  supplierName: string
  orderNumber: string
  items: Array<{ name: string; quantity: number; unitPrice: number }>
  total: number
  orderDate: Date
  expectedDelivery?: Date
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'
}

interface Product {
  id: string
  name: string
  category: string
  supplierId: string
  supplierName: string
  unitPrice: number
  minOrderQuantity: number
  leadTime: number
  status: 'available' | 'out_of_stock' | 'discontinued'
}

interface Contract {
  id: string
  supplierId: string
  supplierName: string
  type: 'purchase' | 'service' | 'maintenance'
  startDate: Date
  endDate: Date
  value: number
  status: 'active' | 'expired' | 'terminated'
}

export default function SupplierPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])

  useEffect(() => {
    const savedSuppliers = localStorage.getItem('supplier-suppliers')
    const savedOrders = localStorage.getItem('supplier-orders')
    const savedProducts = localStorage.getItem('supplier-products')
    const savedContracts = localStorage.getItem('supplier-contracts')

    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers))
    } else {
      const sample: Supplier[] = [
        {
          id: '1',
          name: 'Fournisseur ABC',
          contact: 'Mohamed Amrani',
          phone: '+213 555 1111',
          email: 'contact@abc.dz',
          address: 'Zone Industrielle, Alger',
          category: 'Électronique',
          rating: 4.5,
          totalOrders: 25,
          totalSpent: 500000,
          status: 'active',
        },
        {
          id: '2',
          name: 'Fournisseur XYZ',
          contact: 'Fatima Kadri',
          phone: '+213 555 2222',
          email: 'info@xyz.dz',
          address: 'Boulevard des Martyrs, Oran',
          category: 'Mécanique',
          rating: 4.8,
          totalOrders: 18,
          totalSpent: 350000,
          status: 'active',
        },
      ]
      setSuppliers(sample)
      localStorage.setItem('supplier-suppliers', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        orderDate: new Date(o.orderDate),
        expectedDelivery: o.expectedDelivery ? new Date(o.expectedDelivery) : undefined,
      })))
    } else {
      const sample: Order[] = [
        {
          id: '1',
          supplierId: '1',
          supplierName: 'Fournisseur ABC',
          orderNumber: 'PO-001',
          items: [
            { name: 'Composant X', quantity: 100, unitPrice: 50 },
            { name: 'Composant Y', quantity: 50, unitPrice: 75 },
          ],
          total: 8750,
          orderDate: new Date(),
          expectedDelivery: new Date('2024-02-15'),
          status: 'confirmed',
        },
      ]
      setOrders(sample)
      localStorage.setItem('supplier-orders', JSON.stringify(sample))
    }

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Composant X',
          category: 'Électronique',
          supplierId: '1',
          supplierName: 'Fournisseur ABC',
          unitPrice: 50,
          minOrderQuantity: 10,
          leadTime: 7,
          status: 'available',
        },
      ]
      setProducts(sample)
      localStorage.setItem('supplier-products', JSON.stringify(sample))
    }

    if (savedContracts) {
      const parsed = JSON.parse(savedContracts)
      setContracts(parsed.map((c: any) => ({
        ...c,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
      })))
    } else {
      const sample: Contract[] = [
        {
          id: '1',
          supplierId: '1',
          supplierName: 'Fournisseur ABC',
          type: 'purchase',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          value: 500000,
          status: 'active',
        },
      ]
      setContracts(sample)
      localStorage.setItem('supplier-contracts', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (suppliers.length > 0) localStorage.setItem('supplier-suppliers', JSON.stringify(suppliers))
  }, [suppliers])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('supplier-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('supplier-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (contracts.length > 0) localStorage.setItem('supplier-contracts', JSON.stringify(contracts))
  }, [contracts])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'suppliers' as TabType, label: 'Fournisseurs', icon: Users },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingBag },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'contracts' as TabType, label: 'Contrats', icon: DollarSign },
    { id: 'payments' as TabType, label: 'Paiements', icon: DollarSign },
  ]

  const activeSuppliers = suppliers.filter(s => s.status === 'active').length
  const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length
  const activeContracts = contracts.filter(c => c.status === 'active').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Fournisseurs Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeSuppliers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Dépensé</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalSpent.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes en Attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Contrats Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeContracts}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fournisseurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Fournisseur
              </button>
            </div>
            {suppliers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun fournisseur</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                        <p className="text-sm text-gray-500">{supplier.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                          {supplier.rating} ⭐
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                          supplier.status === 'suspended' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {supplier.status === 'active' ? 'Actif' :
                           supplier.status === 'suspended' ? 'Suspendu' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👤 {supplier.contact}</p>
                      <p className="text-sm text-gray-600">📞 {supplier.phone}</p>
                      <p className="text-sm text-gray-600">📧 {supplier.email}</p>
                      <p className="text-sm text-gray-600">📍 {supplier.address}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Commandes:</span>
                        <span className="font-medium text-green-600">{supplier.totalOrders}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Total dépensé:</span>
                        <span className="font-medium text-gray-900">DZD{supplier.totalSpent.toLocaleString()}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle Commande
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">#{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.supplierName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'delivered' ? 'Livrée' :
                         order.status === 'in_transit' ? 'En transit' :
                         order.status === 'confirmed' ? 'Confirmée' :
                         order.status === 'cancelled' ? 'Annulée' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-700">{item.name} - {item.quantity}x</span>
                          <span className="font-medium text-gray-900">DZD{(item.quantity * item.unitPrice).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-lg font-bold text-gray-900">Total: DZD{order.total.toLocaleString()}</p>
                      {order.expectedDelivery && (
                        <p className="text-sm text-gray-600 mt-1">
                          📦 Livraison prévue: {new Date(order.expectedDelivery).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ajouter Produit
              </button>
            </div>
            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                        <p className="text-sm text-gray-600 mt-1">Fournisseur: {product.supplierName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'available' ? 'bg-green-100 text-green-800' :
                        product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'available' ? 'Disponible' :
                         product.status === 'out_of_stock' ? 'Rupture' : 'Discontinué'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">💰 Prix: DZD{product.unitPrice}/unité</p>
                      <p className="text-sm text-gray-600">📦 Commande min: {product.minOrderQuantity}</p>
                      <p className="text-sm text-gray-600">⏰ Délai: {product.leadTime} jours</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contrats</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Contrat
              </button>
            </div>
            {contracts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun contrat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <div key={contract.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{contract.supplierName}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {contract.type === 'purchase' ? 'Achat' :
                           contract.type === 'service' ? 'Service' : 'Maintenance'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        contract.status === 'active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status === 'active' ? 'Actif' :
                         contract.status === 'expired' ? 'Expiré' : 'Résilié'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(contract.startDate).toLocaleDateString('fr-FR')} - {new Date(contract.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-lg font-bold text-gray-900">Valeur: DZD{contract.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Paiements</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des paiements aux fournisseurs</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
