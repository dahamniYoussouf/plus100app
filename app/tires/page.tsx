'use client'

import { useState, useEffect } from 'react'
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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
    </div>
  )
}
