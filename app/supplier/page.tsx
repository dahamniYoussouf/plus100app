'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
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
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', phone: '', email: '', address: '', category: '', status: 'active' as 'active' | 'inactive' | 'suspended' })
  const [newOrder, setNewOrder] = useState({ supplierId: '', items: [{ name: '', quantity: 1, unitPrice: 0 }], expectedDelivery: '' })
  const [newProduct, setNewProduct] = useState({ supplierId: '', name: '', category: '', unitPrice: 0, minOrderQuantity: 1, leadTime: 1, status: 'available' as 'available' | 'out_of_stock' | 'discontinued' })
  const [newContract, setNewContract] = useState({ supplierId: '', type: 'purchase' as 'purchase' | 'service' | 'maintenance', startDate: '', endDate: '', value: 0 })

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
              <button 
                onClick={() => setShowSupplierModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
                        <span className={`px-2 py-1 rounded text-xs  DZD{
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
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
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
              <button 
                onClick={() => setShowProductModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
                      <span className={`px-2 py-1 rounded text-xs  DZD{
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
              <button 
                onClick={() => setShowContractModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
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

      {/* Modals */}
      <Modal
        isOpen={showSupplierModal}
        onClose={() => {
          setShowSupplierModal(false)
          setNewSupplier({ name: '', contact: '', phone: '', email: '', address: '', category: '', status: 'active' })
        }}
        title="Nouveau Fournisseur"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom du fournisseur"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nom du contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Adresse complète"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newSupplier.category}
                onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Électronique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newSupplier.status}
                onChange={(e) => setNewSupplier({ ...newSupplier, status: e.target.value as 'active' | 'inactive' | 'suspended' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowSupplierModal(false)
                setNewSupplier({ name: '', contact: '', phone: '', email: '', address: '', category: '', status: 'active' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newSupplier.name && newSupplier.contact && newSupplier.phone && newSupplier.email && newSupplier.address && newSupplier.category) {
                  const supplier: Supplier = {
                    id: Date.now().toString(),
                    name: newSupplier.name,
                    contact: newSupplier.contact,
                    phone: newSupplier.phone,
                    email: newSupplier.email,
                    address: newSupplier.address,
                    category: newSupplier.category,
                    rating: 0,
                    totalOrders: 0,
                    totalSpent: 0,
                    status: newSupplier.status,
                  }
                  setSuppliers([...suppliers, supplier])
                  setShowSupplierModal(false)
                  setNewSupplier({ name: '', contact: '', phone: '', email: '', address: '', category: '', status: 'active' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showOrderModal}
        onClose={() => {
          setShowOrderModal(false)
          setNewOrder({ supplierId: '', items: [{ name: '', quantity: 1, unitPrice: 0 }], expectedDelivery: '' })
        }}
        title="Nouvelle Commande"
        size="lg"
      >
        <div className="space-y-4">
          {suppliers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={newOrder.supplierId}
                onChange={(e) => setNewOrder({ ...newOrder, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Articles</label>
            {newOrder.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updatedItems = [...newOrder.items]
                    updatedItems[idx].name = e.target.value
                    setNewOrder({ ...newOrder, items: updatedItems })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...newOrder.items]
                    updatedItems[idx].quantity = parseInt(e.target.value) || 1
                    setNewOrder({ ...newOrder, items: updatedItems })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                  placeholder="Qté"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const updatedItems = [...newOrder.items]
                      updatedItems[idx].unitPrice = parseFloat(e.target.value) || 0
                      setNewOrder({ ...newOrder, items: updatedItems })
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    placeholder="Prix"
                  />
                  {newOrder.items.length > 1 && (
                    <button
                      onClick={() => {
                        setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) })
                      }}
                      className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setNewOrder({ ...newOrder, items: [...newOrder.items, { name: '', quantity: 1, unitPrice: 0 }] })
              }}
              className="text-sm text-green-600 hover:text-green-700"
            >
              + Ajouter un article
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison prévue</label>
            <input
              type="date"
              value={newOrder.expectedDelivery}
              onChange={(e) => setNewOrder({ ...newOrder, expectedDelivery: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowOrderModal(false)
                setNewOrder({ supplierId: '', items: [{ name: '', quantity: 1, unitPrice: 0 }], expectedDelivery: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newOrder.supplierId && newOrder.items.every(item => item.name && item.quantity > 0 && item.unitPrice > 0)) {
                  const supplier = suppliers.find(s => s.id === newOrder.supplierId)
                  if (supplier) {
                    const total = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
                    const order: Order = {
                      id: Date.now().toString(),
                      supplierId: newOrder.supplierId,
                      supplierName: supplier.name,
                      orderNumber: `ORD- DZD{Date.now()}`,
                      items: newOrder.items,
                      total,
                      orderDate: new Date(),
                      expectedDelivery: newOrder.expectedDelivery ? new Date(newOrder.expectedDelivery) : undefined,
                      status: 'pending',
                    }
                    setOrders([...orders, order])
                    setShowOrderModal(false)
                    setNewOrder({ supplierId: '', items: [{ name: '', quantity: 1, unitPrice: 0 }], expectedDelivery: '' })
                  }
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false)
          setNewProduct({ supplierId: '', name: '', category: '', unitPrice: 0, minOrderQuantity: 1, leadTime: 1, status: 'available' })
        }}
        title="Ajouter Produit"
        size="lg"
      >
        <div className="space-y-4">
          {suppliers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={newProduct.supplierId}
                onChange={(e) => setNewProduct({ ...newProduct, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nom du produit"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Catégorie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (DZD)</label>
              <input
                type="number"
                value={newProduct.unitPrice}
                onChange={(e) => setNewProduct({ ...newProduct, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commande min</label>
              <input
                type="number"
                value={newProduct.minOrderQuantity}
                onChange={(e) => setNewProduct({ ...newProduct, minOrderQuantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Délai (jours)</label>
              <input
                type="number"
                value={newProduct.leadTime}
                onChange={(e) => setNewProduct({ ...newProduct, leadTime: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'available' | 'out_of_stock' | 'discontinued' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="available">Disponible</option>
                <option value="out_of_stock">Rupture de stock</option>
                <option value="discontinued">Discontinué</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProductModal(false)
                setNewProduct({ supplierId: '', name: '', category: '', unitPrice: 0, minOrderQuantity: 1, leadTime: 1, status: 'available' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProduct.supplierId && newProduct.name && newProduct.category && newProduct.unitPrice > 0) {
                  const supplier = suppliers.find(s => s.id === newProduct.supplierId)
                  if (supplier) {
                    const product: Product = {
                      id: Date.now().toString(),
                      supplierId: newProduct.supplierId,
                      supplierName: supplier.name,
                      name: newProduct.name,
                      category: newProduct.category,
                      unitPrice: newProduct.unitPrice,
                      minOrderQuantity: newProduct.minOrderQuantity,
                      leadTime: newProduct.leadTime,
                      status: newProduct.status,
                    }
                    setProducts([...products, product])
                    setShowProductModal(false)
                    setNewProduct({ supplierId: '', name: '', category: '', unitPrice: 0, minOrderQuantity: 1, leadTime: 1, status: 'available' })
                  }
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showContractModal}
        onClose={() => {
          setShowContractModal(false)
          setNewContract({ supplierId: '', type: 'purchase', startDate: '', endDate: '', value: 0 })
        }}
        title="Nouveau Contrat"
        size="lg"
      >
        <div className="space-y-4">
          {suppliers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select
                value={newContract.supplierId}
                onChange={(e) => setNewContract({ ...newContract, supplierId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newContract.type}
              onChange={(e) => setNewContract({ ...newContract, type: e.target.value as 'purchase' | 'service' | 'maintenance' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="purchase">Achat</option>
              <option value="service">Service</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={newContract.startDate}
                onChange={(e) => setNewContract({ ...newContract, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={newContract.endDate}
                onChange={(e) => setNewContract({ ...newContract, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (DZD)</label>
            <input
              type="number"
              value={newContract.value}
              onChange={(e) => setNewContract({ ...newContract, value: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowContractModal(false)
                setNewContract({ supplierId: '', type: 'purchase', startDate: '', endDate: '', value: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newContract.supplierId && newContract.startDate && newContract.endDate && newContract.value > 0) {
                  const supplier = suppliers.find(s => s.id === newContract.supplierId)
                  if (supplier) {
                    const contract: Contract = {
                      id: Date.now().toString(),
                      supplierId: newContract.supplierId,
                      supplierName: supplier.name,
                      type: newContract.type,
                      startDate: new Date(newContract.startDate),
                      endDate: new Date(newContract.endDate),
                      value: newContract.value,
                      status: 'active',
                    }
                    setContracts([...contracts, contract])
                    setShowContractModal(false)
                    setNewContract({ supplierId: '', type: 'purchase', startDate: '', endDate: '', value: 0 })
                  }
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
