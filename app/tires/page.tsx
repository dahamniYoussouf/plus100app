'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Car, Package, Calendar, DollarSign, BarChart3, Users, AlertCircle, Settings } from 'lucide-react'

type TabType = 'dashboard' | 'tires' | 'services' | 'customers' | 'stock'

interface Tire {
  id: string
  brand: string
  model: string
  size: string
  type: 'summer' | 'winter' | 'all_season' | 'performance'
  price: number
  quantity: number
  minStock: number
  supplier: string
  warranty: number // months
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: 'mounting' | 'balancing' | 'rotation' | 'repair' | 'inspection'
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  vehiclePlate: string
  lastService?: Date
  totalPurchases: number
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  tireIds: string[]
  serviceIds: string[]
  total: number
  date: Date
  status: 'completed' | 'pending'
}

export default function TiresPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [tires, setTires] = useState<Tire[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [showTireModal, setShowTireModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [showSaleModal, setShowSaleModal] = useState(false)
  const [newTire, setNewTire] = useState({ brand: '', model: '', size: '', type: 'all_season' as 'summer' | 'winter' | 'all_season' | 'performance', price: 0, quantity: 0, minStock: 10, supplier: '', warranty: 24 })
  const [newService, setNewService] = useState({ name: '', description: '', price: 0, duration: 0, category: 'mounting' as 'mounting' | 'balancing' | 'rotation' | 'repair' | 'inspection' })
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', vehiclePlate: '' })
  const [newSale, setNewSale] = useState({ customerId: '', tireIds: [] as string[], serviceIds: [] as string[] })

  useEffect(() => {
    const savedTires = localStorage.getItem('tires-stock')
    const savedServices = localStorage.getItem('tires-services')
    const savedCustomers = localStorage.getItem('tires-customers')
    const savedSales = localStorage.getItem('tires-sales')

    if (savedTires) {
      setTires(JSON.parse(savedTires))
    } else {
      const sample: Tire[] = [
        {
          id: '1',
          brand: 'Michelin',
          model: 'Energy Saver',
          size: '195/65 R15',
          type: 'all_season',
          price: 85,
          quantity: 20,
          minStock: 10,
          supplier: 'Michelin Distribution',
          warranty: 24,
        },
        {
          id: '2',
          brand: 'Bridgestone',
          model: 'Blizzak',
          size: '205/55 R16',
          type: 'winter',
          price: 95,
          quantity: 15,
          minStock: 8,
          supplier: 'Bridgestone Algérie',
          warranty: 36,
        },
        {
          id: '3',
          brand: 'Continental',
          model: 'PremiumContact',
          size: '215/60 R17',
          type: 'summer',
          price: 110,
          quantity: 5,
          minStock: 10,
          supplier: 'Continental',
          warranty: 24,
        },
      ]
      setTires(sample)
      localStorage.setItem('tires-stock', JSON.stringify(sample))
    }

    if (savedServices) {
      setServices(JSON.parse(savedServices))
    } else {
      const sample: Service[] = [
        {
          id: '1',
          name: 'Montage Pneus',
          description: 'Montage de 4 pneus',
          price: 40,
          duration: 60,
          category: 'mounting',
        },
        {
          id: '2',
          name: 'Équilibrage',
          description: 'Équilibrage des 4 roues',
          price: 30,
          duration: 45,
          category: 'balancing',
        },
        {
          id: '3',
          name: 'Rotation Pneus',
          description: 'Rotation des pneus avant/arrière',
          price: 25,
          duration: 30,
          category: 'rotation',
        },
      ]
      setServices(sample)
      localStorage.setItem('tires-services', JSON.stringify(sample))
    }

    if (savedCustomers) {
      const parsed = JSON.parse(savedCustomers)
      setCustomers(parsed.map((c: any) => ({
        ...c,
        lastService: c.lastService ? new Date(c.lastService) : undefined,
      })))
    } else {
      const sample: Customer[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          vehiclePlate: '12345-A-16',
          lastService: new Date('2024-01-15'),
          totalPurchases: 2,
        },
      ]
      setCustomers(sample)
      localStorage.setItem('tires-customers', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({
        ...s,
        date: new Date(s.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (tires.length > 0) localStorage.setItem('tires-stock', JSON.stringify(tires))
  }, [tires])

  useEffect(() => {
    if (services.length > 0) localStorage.setItem('tires-services', JSON.stringify(services))
  }, [services])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('tires-customers', JSON.stringify(customers))
  }, [customers])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('tires-sales', JSON.stringify(sales))
  }, [sales])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'tires' as TabType, label: 'Pneus', icon: Car },
    { id: 'services' as TabType, label: 'Services', icon: Settings },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
  const lowStockTires = tires.filter(t => t.quantity <= t.minStock)
  const totalTires = tires.reduce((sum, t) => sum + t.quantity, 0)

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
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Pneus en Stock</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalTires}</p>
                  </div>
                  <Car className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStockTires.length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {lowStockTires.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3">⚠️ Stock Faible</h3>
                <div className="space-y-2">
                  {lowStockTires.map((tire) => (
                    <div key={tire.id} className="bg-white rounded-lg p-3 text-sm">
                      <span className="font-medium text-gray-900">{tire.brand} {tire.model}</span>
                      <span className="text-gray-500 ml-2">- Stock: {tire.quantity} (Min: {tire.minStock})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Stock Pneus</h3>
                  <p className="text-sm text-gray-600">Inventaire complet des pneus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Services</h3>
                  <p className="text-sm text-gray-600">Montage, équilibrage, rotation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ventes</h3>
                  <p className="text-sm text-gray-600">Gestion des ventes et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes Stock</h3>
                  <p className="text-sm text-gray-600">Notifications de stock faible</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tires' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pneus</h2>
              <button 
                onClick={() => setShowTireModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ajouter Pneu
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tires.map((tire) => (
                <div key={tire.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${
                  tire.quantity <= tire.minStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{tire.brand}</h3>
                      <p className="text-sm text-gray-600">{tire.model}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tire.type === 'winter' ? 'bg-blue-100 text-blue-800' :
                      tire.type === 'summer' ? 'bg-yellow-100 text-yellow-800' :
                      tire.type === 'all_season' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {tire.type === 'winter' ? 'Hiver' :
                       tire.type === 'summer' ? 'Été' :
                       tire.type === 'all_season' ? 'Toutes saisons' : 'Performance'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Taille: {tire.size}</p>
                    <p className="text-sm text-gray-600">Fournisseur: {tire.supplier}</p>
                    <p className="text-sm text-gray-600">Garantie: {tire.warranty} mois</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Stock</p>
                      <p className={`text-lg font-bold ${
                        tire.quantity <= tire.minStock ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {tire.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Prix</p>
                      <p className="text-lg font-bold text-gray-900">DZD{tire.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button 
                onClick={() => setShowServiceModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ajouter Service
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs capitalize">
                      {service.category}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{service.duration} min</p>
                      <p className="text-lg font-bold text-gray-900">DZD{service.price}</p>
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
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
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
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{customer.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                      {customer.email && <p className="text-sm text-gray-600">📧 {customer.email}</p>}
                      <p className="text-sm text-gray-600">🚗 {customer.vehiclePlate}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Achats:</span>
                        <span className="font-medium text-gray-900">{customer.totalPurchases}</span>
                      </div>
                      {customer.lastService && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernier service:</span>
                          <span className="text-gray-600">{new Date(customer.lastService).toLocaleDateString('fr-FR')}</span>
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Pneu</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Taille</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Min</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tires.map((tire) => (
                      <tr key={tire.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{tire.brand} {tire.model}</p>
                            <p className="text-xs text-gray-500">{tire.type}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{tire.size}</td>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${
                            tire.quantity <= tire.minStock ? 'text-orange-600' : 'text-gray-900'
                          }`}>
                            {tire.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{tire.minStock}</td>
                        <td className="py-3 px-4 font-medium text-gray-900">DZD{tire.price}</td>
                        <td className="py-3 px-4">
                          {tire.quantity <= tire.minStock ? (
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

      {/* Modals */}
      <Modal
        isOpen={showTireModal}
        onClose={() => {
          setShowTireModal(false)
          setNewTire({ brand: '', model: '', size: '', type: 'all_season', price: 0, quantity: 0, minStock: 10, supplier: '', warranty: 24 })
        }}
        title="Ajouter Pneu"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={newTire.brand}
                onChange={(e) => setNewTire({ ...newTire, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: Michelin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                value={newTire.model}
                onChange={(e) => setNewTire({ ...newTire, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: Energy Saver"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
              <input
                type="text"
                value={newTire.size}
                onChange={(e) => setNewTire({ ...newTire, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Ex: 195/65 R15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newTire.type}
                onChange={(e) => setNewTire({ ...newTire, type: e.target.value as 'summer' | 'winter' | 'all_season' | 'performance' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="summer">Été</option>
                <option value="winter">Hiver</option>
                <option value="all_season">Toutes saisons</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newTire.price}
                onChange={(e) => setNewTire({ ...newTire, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                value={newTire.quantity}
                onChange={(e) => setNewTire({ ...newTire, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock min</label>
              <input
                type="number"
                value={newTire.minStock}
                onChange={(e) => setNewTire({ ...newTire, minStock: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <input
                type="text"
                value={newTire.supplier}
                onChange={(e) => setNewTire({ ...newTire, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Nom du fournisseur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garantie (mois)</label>
              <input
                type="number"
                value={newTire.warranty}
                onChange={(e) => setNewTire({ ...newTire, warranty: parseInt(e.target.value) || 24 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTireModal(false)
                setNewTire({ brand: '', model: '', size: '', type: 'all_season', price: 0, quantity: 0, minStock: 10, supplier: '', warranty: 24 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newTire.brand && newTire.model && newTire.size && newTire.price > 0 && newTire.supplier) {
                  const tire: Tire = {
                    id: Date.now().toString(),
                    brand: newTire.brand,
                    model: newTire.model,
                    size: newTire.size,
                    type: newTire.type,
                    price: newTire.price,
                    quantity: newTire.quantity,
                    minStock: newTire.minStock,
                    supplier: newTire.supplier,
                    warranty: newTire.warranty,
                  }
                  setTires([...tires, tire])
                  setShowTireModal(false)
                  setNewTire({ brand: '', model: '', size: '', type: 'all_season', price: 0, quantity: 0, minStock: 10, supplier: '', warranty: 24 })
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false)
          setNewService({ name: '', description: '', price: 0, duration: 0, category: 'mounting' })
        }}
        title="Ajouter Service"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Nom du service"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              rows={3}
              placeholder="Description du service..."
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value as 'mounting' | 'balancing' | 'rotation' | 'repair' | 'inspection' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="mounting">Montage</option>
                <option value="balancing">Équilibrage</option>
                <option value="rotation">Rotation</option>
                <option value="repair">Réparation</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowServiceModal(false)
                setNewService({ name: '', description: '', price: 0, duration: 0, category: 'mounting' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newService.name && newService.description && newService.price > 0 && newService.duration > 0) {
                  const service: Service = {
                    id: Date.now().toString(),
                    name: newService.name,
                    description: newService.description,
                    price: newService.price,
                    duration: newService.duration,
                    category: newService.category,
                  }
                  setServices([...services, service])
                  setShowServiceModal(false)
                  setNewService({ name: '', description: '', price: 0, duration: 0, category: 'mounting' })
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
          setNewCustomer({ name: '', phone: '', email: '', vehiclePlate: '' })
        }}
        title="Nouveau Client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plaque d'immatriculation</label>
            <input
              type="text"
              value={newCustomer.vehiclePlate}
              onChange={(e) => setNewCustomer({ ...newCustomer, vehiclePlate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Ex: 123456-A-16"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCustomerModal(false)
                setNewCustomer({ name: '', phone: '', email: '', vehiclePlate: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newCustomer.name && newCustomer.phone && newCustomer.vehiclePlate) {
                  const customer: Customer = {
                    id: Date.now().toString(),
                    name: newCustomer.name,
                    phone: newCustomer.phone,
                    email: newCustomer.email || undefined,
                    vehiclePlate: newCustomer.vehiclePlate,
                    totalPurchases: 0,
                  }
                  setCustomers([...customers, customer])
                  setShowCustomerModal(false)
                  setNewCustomer({ name: '', phone: '', email: '', vehiclePlate: '' })
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
          setNewSale({ customerId: '', tireIds: [], serviceIds: [] })
        }}
        title="Nouvelle Vente"
        size="lg"
      >
        <div className="space-y-4">
          {customers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={newSale.customerId}
                onChange={(e) => setNewSale({ ...newSale, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Sélectionner un client</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name} - {customer.vehiclePlate}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pneus</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {tires.map(tire => (
                <label key={tire.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={newSale.tireIds.includes(tire.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewSale({ ...newSale, tireIds: [...newSale.tireIds, tire.id] })
                      } else {
                        setNewSale({ ...newSale, tireIds: newSale.tireIds.filter(id => id !== tire.id) })
                      }
                    }}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm">{tire.brand} {tire.model} - {tire.size} - DZD{tire.price}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {services.map(service => (
                <label key={service.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={newSale.serviceIds.includes(service.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewSale({ ...newSale, serviceIds: [...newSale.serviceIds, service.id] })
                      } else {
                        setNewSale({ ...newSale, serviceIds: newSale.serviceIds.filter(id => id !== service.id) })
                      }
                    }}
                    className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm">{service.name} - DZD{service.price}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowSaleModal(false)
                setNewSale({ customerId: '', tireIds: [], serviceIds: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newSale.customerId && (newSale.tireIds.length > 0 || newSale.serviceIds.length > 0)) {
                  const customer = customers.find(c => c.id === newSale.customerId)
                  if (customer) {
                    const tireTotal = newSale.tireIds.reduce((sum, id) => {
                      const tire = tires.find(t => t.id === id)
                      return sum + (tire?.price || 0)
                    }, 0)
                    const serviceTotal = newSale.serviceIds.reduce((sum, id) => {
                      const service = services.find(s => s.id === id)
                      return sum + (service?.price || 0)
                    }, 0)
                    const total = tireTotal + serviceTotal
                    const sale: Sale = {
                      id: Date.now().toString(),
                      customerId: newSale.customerId,
                      customerName: customer.name,
                      tireIds: newSale.tireIds,
                      serviceIds: newSale.serviceIds,
                      total,
                      date: new Date(),
                      status: 'completed',
                    }
                    setSales([...sales, sale])
                    // Update stock
                    newSale.tireIds.forEach(id => {
                      const tire = tires.find(t => t.id === id)
                      if (tire && tire.quantity > 0) {
                        setTires(tires.map(t => t.id === id ? { ...t, quantity: t.quantity - 1 } : t))
                      }
                    })
                    setShowSaleModal(false)
                    setNewSale({ customerId: '', tireIds: [], serviceIds: [] })
                  }
                }
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
