'use client'

import { useState, useEffect } from 'react'
import { Truck, Users, Package, MapPin, BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react'

type TabType = 'dashboard' | 'deliveries' | 'drivers' | 'orders'

interface Delivery {
  id: string
  orderId: string
  orderNumber: string
  driverId: string
  driverName: string
  customerName: string
  customerPhone: string
  customerAddress: string
  restaurantName: string
  restaurantAddress: string
  items: string[]
  total: number
  distance: number
  estimatedTime: number
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
  pickupTime?: Date
  deliveryTime?: Date
  createdAt: Date
  notes?: string
}

interface Driver {
  id: string
  name: string
  phone: string
  email: string
  vehicleType: 'bike' | 'motorcycle' | 'car' | 'van'
  vehiclePlate: string
  licenseNumber: string
  status: 'available' | 'busy' | 'offline'
  currentLocation?: string
  totalDeliveries: number
  rating: number
  joinDate: Date
  totalEarnings: number
}

interface Order {
  id: string
  orderNumber: string
  restaurantId: string
  restaurantName: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'assigned' | 'delivered' | 'cancelled'
  createdAt: Date
  estimatedDeliveryTime?: Date
}

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedDeliveries = localStorage.getItem('delivery-deliveries')
    const savedDrivers = localStorage.getItem('delivery-drivers')
    const savedOrders = localStorage.getItem('delivery-orders')

    if (savedDrivers) {
      const parsed = JSON.parse(savedDrivers)
      setDrivers(parsed.map((d: any) => ({
        ...d,
        joinDate: new Date(d.joinDate),
      })))
    } else {
      const sample: Driver[] = [
        {
          id: '1',
          name: 'Karim Benali',
          phone: '+213 555 1111',
          email: 'karim@delivery.com',
          vehicleType: 'motorcycle',
          vehiclePlate: 'MC-1234',
          licenseNumber: 'DL-12345',
          status: 'available',
          currentLocation: 'Centre-ville',
          totalDeliveries: 245,
          rating: 4.8,
          joinDate: new Date('2023-03-15'),
          totalEarnings: 12500,
        },
        {
          id: '2',
          name: 'Mohamed Amrani',
          phone: '+213 555 2222',
          email: 'mohamed@delivery.com',
          vehicleType: 'bike',
          vehiclePlate: 'BK-5678',
          licenseNumber: 'DL-67890',
          status: 'busy',
          currentLocation: 'Quartier Nord',
          totalDeliveries: 189,
          rating: 4.9,
          joinDate: new Date('2023-05-20'),
          totalEarnings: 9800,
        },
        {
          id: '3',
          name: 'Ali Kadri',
          phone: '+213 555 3333',
          email: 'ali@delivery.com',
          vehicleType: 'car',
          vehiclePlate: 'CR-9012',
          licenseNumber: 'DL-90123',
          status: 'available',
          currentLocation: 'Quartier Sud',
          totalDeliveries: 156,
          rating: 4.7,
          joinDate: new Date('2023-07-10'),
          totalEarnings: 11200,
        },
      ]
      setDrivers(sample)
      localStorage.setItem('delivery-drivers', JSON.stringify(sample))
    }

    if (savedDeliveries) {
      const parsed = JSON.parse(savedDeliveries)
      setDeliveries(parsed.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        pickupTime: d.pickupTime ? new Date(d.pickupTime) : undefined,
        deliveryTime: d.deliveryTime ? new Date(d.deliveryTime) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Delivery[] = [
        {
          id: '1',
          orderId: 'ORD-001',
          orderNumber: 'ORD-001',
          driverId: '2',
          driverName: 'Mohamed Amrani',
          customerName: 'Ahmed Benali',
          customerPhone: '+213 555 1234',
          customerAddress: '123 Rue Didouche Mourad, Alger',
          restaurantName: 'Pizzeria Italia',
          restaurantAddress: '45 Boulevard Zirout Youcef, Alger',
          items: ['Pizza Margherita x2', 'Coca Cola x2'],
          total: 28.50,
          distance: 3.5,
          estimatedTime: 25,
          status: 'in_transit',
          pickupTime: new Date(today.getTime() - 15 * 60 * 1000),
          createdAt: new Date(today.getTime() - 45 * 60 * 1000),
        },
        {
          id: '2',
          orderId: 'ORD-002',
          orderNumber: 'ORD-002',
          driverId: '1',
          driverName: 'Karim Benali',
          customerName: 'Fatima Kadri',
          customerPhone: '+213 555 5678',
          customerAddress: '78 Avenue de la Liberté, Oran',
          restaurantName: 'Fast Food Halal',
          restaurantAddress: '12 Rue des Martyrs, Oran',
          items: ['Burger Halal x2', 'Frites x2'],
          total: 22.00,
          distance: 2.8,
          estimatedTime: 20,
          status: 'delivered',
          pickupTime: new Date(today.getTime() - 60 * 60 * 1000),
          deliveryTime: new Date(today.getTime() - 30 * 60 * 1000),
          createdAt: new Date(today.getTime() - 90 * 60 * 1000),
        },
      ]
      setDeliveries(sample)
      localStorage.setItem('delivery-deliveries', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        estimatedDeliveryTime: o.estimatedDeliveryTime ? new Date(o.estimatedDeliveryTime) : undefined,
      })))
    }
  }, [])

  useEffect(() => {
    if (deliveries.length > 0) localStorage.setItem('delivery-deliveries', JSON.stringify(deliveries))
  }, [deliveries])

  useEffect(() => {
    if (drivers.length > 0) localStorage.setItem('delivery-drivers', JSON.stringify(drivers))
  }, [drivers])

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('delivery-orders', JSON.stringify(orders))
  }, [orders])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'deliveries' as TabType, label: 'Livraisons', icon: Truck },
    { id: 'drivers' as TabType, label: 'Livreurs', icon: Users },
    { id: 'orders' as TabType, label: 'Commandes', icon: Package },
  ]

  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'assigned' || d.status === 'picked_up')
  const completedToday = deliveries.filter(d => {
    if (d.deliveryTime) {
      const today = new Date()
      return d.deliveryTime.toDateString() === today.toDateString() && d.status === 'delivered'
    }
    return false
  }).length
  const totalRevenue = deliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.total, 0)
  const availableDrivers = drivers.filter(d => d.status === 'available').length
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready')

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
                    <p className="text-xs sm:text-sm text-gray-600">Livreurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{drivers.length}</p>
                    <p className="text-xs text-green-600 mt-1">{availableDrivers} disponibles</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeDeliveries.length}</p>
                  </div>
                  <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Livrées Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{completedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {pendingOrders.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Commandes en attente d'assignation ({pendingOrders.length})
                </h3>
                <div className="space-y-2">
                  {pendingOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{order.orderNumber} - {order.restaurantName}</span>
                      <span className="text-gray-500 mt-1 sm:mt-0">📍 {order.customerAddress}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi en Temps Réel</h3>
                  <p className="text-sm text-gray-600">Géolocalisation GPS des livreurs et commandes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Livreurs</h3>
                  <p className="text-sm text-gray-600">Statuts, disponibilité et performances</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Optimisation Itinéraires</h3>
                  <p className="text-sm text-gray-600">Calcul automatique des meilleurs trajets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-600">Alertes SMS et push pour clients et livreurs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Multi-Restaurants</h3>
                  <p className="text-sm text-gray-600">Gestion de plusieurs restaurants partenaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques de livraison et performances</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Livraisons</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle Livraison
              </button>
            </div>
            {deliveries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune livraison</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <div key={delivery.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{delivery.orderNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            delivery.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                            delivery.status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                            delivery.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                            delivery.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {delivery.status === 'delivered' ? 'Livrée' :
                             delivery.status === 'in_transit' ? 'En cours' :
                             delivery.status === 'picked_up' ? 'Récupérée' :
                             delivery.status === 'assigned' ? 'Assignée' :
                             delivery.status === 'cancelled' ? 'Annulée' : 'En attente'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">👤 Client: <span className="font-medium">{delivery.customerName}</span></span>
                            <span className="text-gray-600">📞 {delivery.customerPhone}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-xs font-medium text-blue-900 mb-1">📍 Restaurant</p>
                              <p className="text-sm text-blue-800">{delivery.restaurantName}</p>
                              <p className="text-xs text-blue-600">{delivery.restaurantAddress}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-xs font-medium text-green-900 mb-1">📍 Livraison</p>
                              <p className="text-sm text-green-800">{delivery.customerAddress}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>🚚 {delivery.driverName}</span>
                            <span>📦 {delivery.items.length} article(s)</span>
                            <span>📏 {delivery.distance} km</span>
                            <span>⏱️ ~{delivery.estimatedTime} min</span>
                          </div>

                          {delivery.items.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Articles:</p>
                              <div className="flex flex-wrap gap-1">
                                {delivery.items.map((item, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <span className="text-lg font-bold text-gray-900">€{delivery.total.toFixed(2)}</span>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              {delivery.pickupTime && (
                                <span>Récupéré: {new Date(delivery.pickupTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                              )}
                              {delivery.deliveryTime && (
                                <span>Livré: {new Date(delivery.deliveryTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Livreurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Livreur
              </button>
            </div>
            {drivers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun livreur enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{driver.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        driver.status === 'available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status === 'available' ? 'Disponible' :
                         driver.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {driver.phone}</p>
                      <p className="text-sm text-gray-600">📧 {driver.email}</p>
                      {driver.currentLocation && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {driver.currentLocation}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {driver.vehicleType === 'bike' ? '🚲' :
                           driver.vehicleType === 'motorcycle' ? '🏍️' :
                           driver.vehicleType === 'car' ? '🚗' : '🚐'} {driver.vehiclePlate}
                        </span>
                        <span className="text-gray-500">Permis: {driver.licenseNumber}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Livraisons</span>
                        <span className="font-bold text-gray-900">{driver.totalDeliveries}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Note moyenne</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">{driver.rating.toFixed(1)}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Gains totaux</span>
                        <span className="font-bold text-green-600">€{driver.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Membre depuis</span>
                        <span>{new Date(driver.joinDate).toLocaleDateString('fr-FR')}</span>
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
            </div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune commande en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.restaurantName}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.customerName} - {order.customerPhone}</p>
                        <p className="text-sm text-gray-500 mt-1">📍 {order.customerAddress}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.length} article(s) • {new Date(order.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Livrée' :
                           order.status === 'ready' ? 'Prête' :
                           order.status === 'preparing' ? 'En préparation' :
                           order.status === 'cancelled' ? 'Annulée' : 'En attente'}
                        </span>
                      </div>
                    </div>
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