'use client'

import { useState, useEffect } from 'react'
import { Car, Package, Users, DollarSign, BarChart3, AlertCircle, Search } from 'lucide-react'

type TabType = 'dashboard' | 'parts' | 'sales' | 'suppliers' | 'customers' | 'stock'

interface Part {
  id: string
  name: string
  partNumber: string
  category: string
  brand: string
  compatibleVehicles: string[]
  price: number
  cost: number
  quantity: number
  minStock: number
  location: string
  supplierId: string
  supplierName: string
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  parts: Array<{ partId: string; name: string; quantity: number; price: number }>
  total: number
  date: Date
  status: 'completed' | 'pending' | 'cancelled'
}

interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  email: string
  address: string
  totalOrders: number
  rating: number
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  vehicleInfo?: string
  totalPurchases: number
  lastPurchase?: Date
}

export default function CarpartsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [parts, setParts] = useState<Part[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedParts = localStorage.getItem('carparts-parts')
    const savedSales = localStorage.getItem('carparts-sales')
    const savedSuppliers = localStorage.getItem('carparts-suppliers')
    const savedCustomers = localStorage.getItem('carparts-customers')

    if (savedParts) {
      setParts(JSON.parse(savedParts))
    } else {
      const sample: Part[] = [
        {
          id: '1',
          name: 'Filtre à Huile',
          partNumber: 'FIL-001',
          category: 'Filtres',
          brand: 'Mann Filter',
          compatibleVehicles: ['Renault Clio', 'Peugeot 208'],
          price: 15,
          cost: 8,
          quantity: 45,
          minStock: 20,
          location: 'A-12',
          supplierId: '1',
          supplierName: 'Auto Parts Algérie',
        },
        {
          id: '2',
          name: 'Plaquettes de Frein',
          partNumber: 'FR-205',
          category: 'Freinage',
          brand: 'Bosch',
          compatibleVehicles: ['Renault Clio', 'Dacia Sandero'],
          price: 45,
          cost: 25,
          quantity: 8,
          minStock: 15,
          location: 'B-05',
          supplierId: '1',
          supplierName: 'Auto Parts Algérie',
        },
        {
          id: '3',
          name: 'Bougie d\'Allumage',
          partNumber: 'BOU-301',
          category: 'Moteur',
          brand: 'NGK',
          compatibleVehicles: ['Peugeot 208', 'Renault Clio'],
          price: 12,
          cost: 6,
          quantity: 120,
          minStock: 50,
          location: 'C-18',
          supplierId: '2',
          supplierName: 'Moteur Pro',
        },
      ]
      setParts(sample)
      localStorage.setItem('carparts-parts', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const sample: Sale[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Ahmed Benali',
          parts: [
            { partId: '1', name: 'Filtre à Huile', quantity: 2, price: 15 },
          ],
          total: 30,
          date: new Date(),
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('carparts-sales', JSON.stringify(sample))
    }

    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers))
    } else {
      const sample: Supplier[] = [
        {
          id: '1',
          name: 'Auto Parts Algérie',
          contact: 'Mohamed Amrani',
          phone: '+213 555 1111',
          email: 'contact@autoparts.dz',
          address: 'Zone Industrielle, Alger',
          totalOrders: 25,
          rating: 4.5,
        },
        {
          id: '2',
          name: 'Moteur Pro',
          contact: 'Fatima Kadri',
          phone: '+213 555 2222',
          email: 'info@moteurpro.dz',
          address: 'Boulevard des Martyrs, Oran',
          totalOrders: 18,
          rating: 4.8,
        },
      ]
      setSuppliers(sample)
      localStorage.setItem('carparts-suppliers', JSON.stringify(sample))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({
        ...c,
        lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : undefined,
      })))
    } else {
      const sample: Customer[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          vehicleInfo: 'Renault Clio 2018',
          totalPurchases: 3,
          lastPurchase: new Date(),
        },
      ]
      setCustomers(sample)
      localStorage.setItem('carparts-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (parts.length > 0) localStorage.setItem('carparts-parts', JSON.stringify(parts))
  }, [parts])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('carparts-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (suppliers.length > 0) localStorage.setItem('carparts-suppliers', JSON.stringify(suppliers))
  }, [suppliers])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('carparts-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'parts' as TabType, label: 'Pièces', icon: Package },
    { id: 'sales' as TabType, label: 'Ventes', icon: DollarSign },
    { id: 'suppliers' as TabType, label: 'Fournisseurs', icon: Users },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
  const lowStockParts = parts.filter(p => p.quantity <= p.minStock)
  const totalParts = parts.length
  const totalValue = parts.reduce((sum, p) => sum + (p.price * p.quantity), 0)

  const filteredParts = searchQuery
    ? parts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : parts

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
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
                    <p className="text-xs sm:text-sm text-gray-600">Pièces</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalParts}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Valeur Stock</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalValue.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockParts.length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {lowStockParts.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {lowStockParts.slice(0, 5).map((part) => (
                    <div key={part.id} className="bg-white rounded-lg p-3 text-sm">
                      <span className="font-medium text-gray-900">{part.name}</span>
                      <span className="text-gray-500 ml-2">- Stock: {part.quantity} (Min: {part.minStock})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Pièces</h3>
                  <p className="text-sm text-gray-600">Inventaire complet des pièces détachées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ventes</h3>
                  <p className="text-sm text-gray-600">Gestion des ventes et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Fournisseurs</h3>
                  <p className="text-sm text-gray-600">Gestion des relations fournisseurs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Compatibilité</h3>
                  <p className="text-sm text-gray-600">Recherche par véhicule compatible</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes Stock</h3>
                  <p className="text-sm text-gray-600">Notifications de stock faible</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pièces Détachées</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ajouter Pièce
                </button>
              </div>
            </div>
            {filteredParts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune pièce trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredParts.map((part) => (
                  <div key={part.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                    part.quantity <= part.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{part.name}</h3>
                        <p className="text-sm text-gray-500">Ref: {part.partNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">Marque: {part.brand}</p>
                      <p className="text-sm text-gray-600">Catégorie: {part.category}</p>
                      <p className="text-sm text-gray-600">📍 Emplacement: {part.location}</p>
                      <p className="text-sm text-gray-600">Fournisseur: {part.supplierName}</p>
                      {part.compatibleVehicles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Compatible avec:</p>
                          <div className="flex flex-wrap gap-1">
                            {part.compatibleVehicles.map((vehicle, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                {vehicle}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className={`text-lg font-bold ${
                          part.quantity <= part.minStock ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {part.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Prix</p>
                        <p className="text-lg font-bold text-gray-900">DZD{part.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle Vente
              </button>
            </div>
            {sales.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune vente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{sale.customerName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(sale.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sale.status === 'completed' ? 'Terminée' :
                         sale.status === 'cancelled' ? 'Annulée' : 'En attente'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Articles:</p>
                      {sale.parts.map((item, idx) => (
                        <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                          {item.name} - {item.quantity}x - DZD{item.price} = DZD{(item.quantity * item.price).toFixed(2)}
                        </div>
                      ))}
                      <p className="text-lg font-bold text-gray-900 mt-2">Total: DZD{sale.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fournisseurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                      <h3 className="font-semibold text-gray-900 text-lg">{supplier.name}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {supplier.rating} ⭐
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👤 {supplier.contact}</p>
                      <p className="text-sm text-gray-600">📞 {supplier.phone}</p>
                      <p className="text-sm text-gray-600">📧 {supplier.email}</p>
                      <p className="text-sm text-gray-600">📍 {supplier.address}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Commandes:</span>
                        <span className="font-medium text-blue-600">{supplier.totalOrders}</span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {customers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{customer.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                      {customer.email && <p className="text-sm text-gray-600">📧 {customer.email}</p>}
                      {customer.vehicleInfo && <p className="text-sm text-gray-600">🚗 {customer.vehicleInfo}</p>}
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Achats:</span>
                        <span className="font-medium text-blue-600">{customer.totalPurchases}</span>
                      </div>
                      {customer.lastPurchase && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernier achat:</span>
                          <span className="text-gray-600">{new Date(customer.lastPurchase).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion Stock</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Pièce</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Ref</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Min</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{part.name}</p>
                            <p className="text-xs text-gray-500">{part.brand} - {part.category}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{part.partNumber}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            part.quantity <= part.minStock ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {part.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{part.minStock}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">DZD{part.price}</td>
                        <td className="py-3 px-4">
                          {part.quantity <= part.minStock ? (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Faible</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">OK</span>
                          )}
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
    </div>
  )
}
