'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Home, Users, Calendar, DollarSign, BarChart3, MapPin, Bed, Bath, Square, TrendingUp, Key, FileText } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'properties' | 'tenants' | 'leases' | 'maintenance'

interface Property {
  id: string
  address: string
  type: 'apartment' | 'house' | 'commercial' | 'land'
  bedrooms?: number
  bathrooms?: number
  area: number
  price: number
  status: 'available' | 'rented' | 'sold' | 'maintenance'
  tenantId?: string
  tenantName?: string
  ownerId: string
  ownerName: string
  images: string[]
  description?: string
  features: string[]
  createdAt: Date
}

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  propertyId?: string
  propertyAddress?: string
  leaseId?: string
  status: 'active' | 'inactive' | 'pending'
  joinDate: Date
  monthlyRent?: number
}

interface Lease {
  id: string
  propertyId: string
  propertyAddress: string
  tenantId: string
  tenantName: string
  startDate: Date
  endDate: Date
  monthlyRent: number
  deposit: number
  status: 'active' | 'expired' | 'terminated'
  paymentStatus: 'paid' | 'pending' | 'overdue'
}

interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyAddress: string
  tenantId: string
  tenantName: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: Date
  completedAt?: Date
  cost?: number
}

export default function RealEstatePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [properties, setProperties] = useState<Property[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([])
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [showTenantModal, setShowTenantModal] = useState(false)
  const [showLeaseModal, setShowLeaseModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [newProperty, setNewProperty] = useState({ address: '', type: 'apartment' as 'apartment' | 'house' | 'commercial' | 'land', bedrooms: 0, bathrooms: 0, area: 0, price: 0, ownerName: '' })
  const [newTenant, setNewTenant] = useState({ name: '', email: '', phone: '' })
  const [newLease, setNewLease] = useState({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: 0, deposit: 0 })
  const [newMaintenance, setNewMaintenance] = useState({ propertyId: '', tenantId: '', description: '', priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent' })

  useEffect(() => {
    const savedProperties = localStorage.getItem('realestate-properties')
    const savedTenants = localStorage.getItem('realestate-tenants')
    const savedLeases = localStorage.getItem('realestate-leases')
    const savedMaintenance = localStorage.getItem('realestate-maintenance')

    if (savedProperties) {
      const parsed = JSON.parse(savedProperties)
      setProperties(parsed.map((p: any) => ({ ...p, createdAt: new Date(p.createdAt) })))
    } else {
      const today = new Date()
      const sample: Property[] = [
        { id: '1', address: '123 Rue de la République, Alger', type: 'apartment', bedrooms: 3, bathrooms: 2, area: 120, price: 50000, status: 'rented', tenantId: '1', tenantName: 'Ahmed Benali', ownerId: '1', ownerName: 'Propriétaire 1', images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80'], features: ['Balcon', 'Parking', 'Ascenseur'], createdAt: today },
        { id: '2', address: '456 Avenue Didouche Mourad, Oran', type: 'house', bedrooms: 4, bathrooms: 3, area: 200, price: 120000, status: 'available', ownerId: '1', ownerName: 'Propriétaire 1', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80'], features: ['Jardin', 'Garage', 'Terrasse'], createdAt: today },
        { id: '3', address: '789 Boulevard Zighout Youcef, Constantine', type: 'commercial', area: 300, price: 200000, status: 'available', ownerId: '2', ownerName: 'Propriétaire 2', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80'], features: ['Vitrine', 'Parking'], createdAt: today },
      ]
      setProperties(sample)
      localStorage.setItem('realestate-properties', JSON.stringify(sample))
    }

    if (savedTenants) {
      const parsed = JSON.parse(savedTenants)
      setTenants(parsed.map((t: any) => ({ ...t, joinDate: new Date(t.joinDate) })))
    } else {
      const sample: Tenant[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 1234', propertyId: '1', propertyAddress: '123 Rue de la République, Alger', leaseId: '1', status: 'active', joinDate: new Date('2023-01-15'), monthlyRent: 500 },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 5678', status: 'pending', joinDate: new Date('2024-01-20') },
      ]
      setTenants(sample)
      localStorage.setItem('realestate-tenants', JSON.stringify(sample))
    }

    if (savedLeases) {
      const parsed = JSON.parse(savedLeases)
      setLeases(parsed.map((l: any) => ({ ...l, startDate: new Date(l.startDate), endDate: new Date(l.endDate) })))
    } else {
      const today = new Date()
      const sample: Lease[] = [
        { id: '1', propertyId: '1', propertyAddress: '123 Rue de la République, Alger', tenantId: '1', tenantName: 'Ahmed Benali', startDate: new Date('2023-01-15'), endDate: new Date('2024-01-15'), monthlyRent: 500, deposit: 1000, status: 'active', paymentStatus: 'paid' },
      ]
      setLeases(sample)
      localStorage.setItem('realestate-leases', JSON.stringify(sample))
    }

    if (savedMaintenance) {
      const parsed = JSON.parse(savedMaintenance)
      setMaintenanceRequests(parsed.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt), completedAt: m.completedAt ? new Date(m.completedAt) : undefined })))
    } else {
      const today = new Date()
      const sample: MaintenanceRequest[] = [
        { id: '1', propertyId: '1', propertyAddress: '123 Rue de la République, Alger', tenantId: '1', tenantName: 'Ahmed Benali', description: 'Fuite d\'eau dans la salle de bain', priority: 'high', status: 'in_progress', createdAt: today },
        { id: '2', propertyId: '1', propertyAddress: '123 Rue de la République, Alger', tenantId: '1', tenantName: 'Ahmed Benali', description: 'Peinture à refaire', priority: 'low', status: 'pending', createdAt: today },
      ]
      setMaintenanceRequests(sample)
      localStorage.setItem('realestate-maintenance', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (properties.length > 0) localStorage.setItem('realestate-properties', JSON.stringify(properties))
  }, [properties])

  useEffect(() => {
    if (tenants.length > 0) localStorage.setItem('realestate-tenants', JSON.stringify(tenants))
  }, [tenants])

  useEffect(() => {
    if (leases.length > 0) localStorage.setItem('realestate-leases', JSON.stringify(leases))
  }, [leases])

  useEffect(() => {
    if (maintenanceRequests.length > 0) localStorage.setItem('realestate-maintenance', JSON.stringify(maintenanceRequests))
  }, [maintenanceRequests])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'properties' as TabType, label: 'Biens', icon: Home },
    { id: 'tenants' as TabType, label: 'Locataires', icon: Users },
    { id: 'leases' as TabType, label: 'Baux', icon: FileText },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Key },
  ]

  const totalProperties = useMemo(() => properties.length, [properties.length])
  const availableProperties = useMemo(() => properties.filter(p => p.status === 'available').length, [properties])
  const rentedProperties = useMemo(() => properties.filter(p => p.status === 'rented').length, [properties])
  const totalTenants = useMemo(() => tenants.filter(t => t.status === 'active').length, [tenants])
  const totalRevenue = useMemo(() => leases.filter(l => l.status === 'active').reduce((sum, l) => sum + l.monthlyRent, 0), [leases])
  const pendingMaintenance = useMemo(() => maintenanceRequests.filter(m => m.status === 'pending' || m.status === 'in_progress').length, [maintenanceRequests])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                      ? 'text-slate-600 border-b-2 border-slate-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Biens</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalProperties}</p>
                  </div>
                  <Home className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableProperties}</p>
                  </div>
                  <Key className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Locataires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalTenants}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus/mois</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString('fr-DZ')} د.ج</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Biens récents</h3>
                <div className="space-y-3">
                  {properties.slice(0, 5).map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{property.address}</p>
                        <p className="text-sm text-gray-500">{property.type === 'apartment' ? 'Appartement' : property.type === 'house' ? 'Maison' : property.type === 'commercial' ? 'Commercial' : 'Terrain'}</p>
                        {property.bedrooms && property.bathrooms && (
                          <p className="text-xs text-gray-400 mt-1">{property.bedrooms} ch. • {property.bathrooms} sdb • {property.area}m²</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-slate-600">{property.price.toLocaleString('fr-DZ')} د.ج</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                          property.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status === 'available' ? 'Disponible' : property.status === 'rented' ? 'Loué' : property.status === 'sold' ? 'Vendu' : 'Maintenance'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Demandes de maintenance</h3>
                <div className="space-y-3">
                  {maintenanceRequests.filter(m => m.status === 'pending' || m.status === 'in_progress').slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{request.propertyAddress}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{request.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{request.tenantName}</p>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs ${
                        request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.priority === 'urgent' ? 'Urgent' : request.priority === 'high' ? 'Élevée' : request.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                  ))}
                  {pendingMaintenance === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune demande en attente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Biens immobiliers</h2>
              <button 
                onClick={() => setShowPropertyModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouveau bien
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {properties.map((property, idx) => {
                const propertyImages: Record<string, string> = {
                  '1': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
                  '2': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
                  '3': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80',
                }
                return (
                  <div key={property.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={propertyImages[property.id] || property.images[0] || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=800&h=600&fit=crop&q=80`}
                        alt={property.address}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                    </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{property.address}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          {property.bathrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {property.area}m²
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {property.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{feature}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-xl font-bold text-slate-600">{property.price.toLocaleString('fr-DZ')} د.ج</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        property.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'available' ? 'Disponible' : property.status === 'rented' ? 'Loué' : property.status === 'sold' ? 'Vendu' : 'Maintenance'}
                      </span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Locataires</h2>
              <button 
                onClick={() => setShowTenantModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouveau locataire
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-500">{tenant.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium text-gray-900">{tenant.phone}</span>
                    </div>
                    {tenant.propertyAddress && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs truncate">{tenant.propertyAddress}</span>
                      </div>
                    )}
                    {tenant.monthlyRent && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loyer:</span>
                        <span className="font-medium text-slate-600">{tenant.monthlyRent?.toLocaleString('fr-DZ')} د.ج/شهر</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                        tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tenant.status === 'active' ? 'Actif' : tenant.status === 'pending' ? 'En attente' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Baux</h2>
              <button 
                onClick={() => setShowLeaseModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouveau bail
              </button>
            </div>
            <div className="space-y-4">
              {leases.map((lease) => (
                <div key={lease.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{lease.propertyAddress}</h3>
                      <p className="text-sm text-gray-600 mb-2">Locataire: {lease.tenantName}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Du {new Date(lease.startDate).toLocaleDateString('fr-FR')} au {new Date(lease.endDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-600">Loyer: </span>
                          <span className="font-medium text-slate-600">{lease.monthlyRent.toLocaleString('fr-DZ')} د.ج/شهر</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Caution: </span>
                          <span className="font-medium text-gray-900">{lease.deposit.toLocaleString('fr-DZ')} د.ج</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        lease.status === 'active' ? 'bg-green-100 text-green-800' :
                        lease.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lease.status === 'active' ? 'Actif' : lease.status === 'expired' ? 'Expiré' : 'Résilié'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        lease.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        lease.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lease.paymentStatus === 'paid' ? 'Payé' : lease.paymentStatus === 'overdue' ? 'En retard' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Maintenance</h2>
              <button 
                onClick={() => setShowMaintenanceModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouvelle demande
              </button>
            </div>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{request.propertyAddress}</h3>
                      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                      <p className="text-sm text-gray-500 mb-2">Locataire: {request.tenantName}</p>
                      {request.cost && (
                        <p className="text-sm text-gray-600">Coût: {request.cost?.toLocaleString('fr-DZ')} د.ج</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">Créé le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.priority === 'urgent' ? 'Urgent' : request.priority === 'high' ? 'Élevée' : request.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'completed' ? 'Terminé' : request.status === 'in_progress' ? 'En cours' : request.status === 'cancelled' ? 'Annulé' : 'En attente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showPropertyModal}
        onClose={() => {
          setShowPropertyModal(false)
          setNewProperty({ address: '', type: 'apartment', bedrooms: 0, bathrooms: 0, area: 0, price: 0, ownerName: '' })
        }}
        title="Nouveau bien"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newProperty.address}
              onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: 123 Rue Didouche Mourad, Alger"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newProperty.type}
                onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="commercial">Commercial</option>
                <option value="land">Terrain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Propriétaire</label>
              <input
                type="text"
                value={newProperty.ownerName}
                onChange={(e) => setNewProperty({ ...newProperty, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
          </div>
          {(newProperty.type === 'apartment' || newProperty.type === 'house') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                <input
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty({ ...newProperty, bedrooms: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                <input
                  type="number"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty({ ...newProperty, bathrooms: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
              <input
                type="number"
                value={newProperty.area}
                onChange={(e) => setNewProperty({ ...newProperty, area: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix/Mois (DZD)</label>
              <input
                type="number"
                value={newProperty.price}
                onChange={(e) => setNewProperty({ ...newProperty, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPropertyModal(false)
                setNewProperty({ address: '', type: 'apartment', bedrooms: 0, bathrooms: 0, area: 0, price: 0, ownerName: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProperty.address && newProperty.ownerName && newProperty.area > 0) {
                  const property: Property = {
                    id: Date.now().toString(),
                    address: newProperty.address,
                    type: newProperty.type,
                    bedrooms: newProperty.bedrooms || undefined,
                    bathrooms: newProperty.bathrooms || undefined,
                    area: newProperty.area,
                    price: newProperty.price,
                    status: 'available',
                    ownerId: Date.now().toString(),
                    ownerName: newProperty.ownerName,
                    images: [],
                    features: [],
                    createdAt: new Date(),
                  }
                  setProperties([...properties, property])
                  setShowPropertyModal(false)
                  setNewProperty({ address: '', type: 'apartment', bedrooms: 0, bathrooms: 0, area: 0, price: 0, ownerName: '' })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTenantModal}
        onClose={() => {
          setShowTenantModal(false)
          setNewTenant({ name: '', email: '', phone: '' })
        }}
        title="Nouveau locataire"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newTenant.email}
                onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newTenant.phone}
                onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowTenantModal(false)
                setNewTenant({ name: '', email: '', phone: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newTenant.name && newTenant.email && newTenant.phone) {
                  const tenant: Tenant = {
                    id: Date.now().toString(),
                    name: newTenant.name,
                    email: newTenant.email,
                    phone: newTenant.phone,
                    status: 'pending',
                    joinDate: new Date(),
                  }
                  setTenants([...tenants, tenant])
                  setShowTenantModal(false)
                  setNewTenant({ name: '', email: '', phone: '' })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLeaseModal}
        onClose={() => {
          setShowLeaseModal(false)
          setNewLease({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: 0, deposit: 0 })
        }}
        title="Nouveau bail"
        size="lg"
      >
        <div className="space-y-4">
          {properties.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bien</label>
              <select
                value={newLease.propertyId}
                onChange={(e) => setNewLease({ ...newLease, propertyId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un bien</option>
                {properties.filter(p => p.status === 'available').map(property => (
                  <option key={property.id} value={property.id}>{property.address}</option>
                ))}
              </select>
            </div>
          )}
          {tenants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locataire</label>
              <select
                value={newLease.tenantId}
                onChange={(e) => setNewLease({ ...newLease, tenantId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un locataire</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name} - {tenant.phone}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={newLease.startDate}
                onChange={(e) => setNewLease({ ...newLease, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={newLease.endDate}
                onChange={(e) => setNewLease({ ...newLease, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loyer mensuel (DZD)</label>
              <input
                type="number"
                value={newLease.monthlyRent}
                onChange={(e) => setNewLease({ ...newLease, monthlyRent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dépôt de garantie (DZD)</label>
              <input
                type="number"
                value={newLease.deposit}
                onChange={(e) => setNewLease({ ...newLease, deposit: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowLeaseModal(false)
                setNewLease({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: 0, deposit: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newLease.propertyId && newLease.tenantId && newLease.startDate && newLease.endDate) {
                  const property = properties.find(p => p.id === newLease.propertyId)
                  const tenant = tenants.find(t => t.id === newLease.tenantId)
                  if (property && tenant) {
                    const lease: Lease = {
                      id: Date.now().toString(),
                      propertyId: newLease.propertyId,
                      propertyAddress: property.address,
                      tenantId: newLease.tenantId,
                      tenantName: tenant.name,
                      startDate: new Date(newLease.startDate),
                      endDate: new Date(newLease.endDate),
                      monthlyRent: newLease.monthlyRent,
                      deposit: newLease.deposit,
                      status: 'active',
                      paymentStatus: 'pending',
                    }
                    setLeases([...leases, lease])
                    setShowLeaseModal(false)
                    setNewLease({ propertyId: '', tenantId: '', startDate: '', endDate: '', monthlyRent: 0, deposit: 0 })
                  }
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => {
          setShowMaintenanceModal(false)
          setNewMaintenance({ propertyId: '', tenantId: '', description: '', priority: 'medium' })
        }}
        title="Nouvelle demande de maintenance"
        size="lg"
      >
        <div className="space-y-4">
          {properties.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bien</label>
              <select
                value={newMaintenance.propertyId}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, propertyId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un bien</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>{property.address}</option>
                ))}
              </select>
            </div>
          )}
          {tenants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locataire</label>
              <select
                value={newMaintenance.tenantId}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, tenantId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Sélectionner un locataire</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name} - {tenant.phone}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newMaintenance.description}
              onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              rows={4}
              placeholder="Décrivez le problème..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
            <select
              value={newMaintenance.priority}
              onChange={(e) => setNewMaintenance({ ...newMaintenance, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMaintenanceModal(false)
                setNewMaintenance({ propertyId: '', tenantId: '', description: '', priority: 'medium' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMaintenance.propertyId && newMaintenance.tenantId && newMaintenance.description) {
                  const property = properties.find(p => p.id === newMaintenance.propertyId)
                  const tenant = tenants.find(t => t.id === newMaintenance.tenantId)
                  if (property && tenant) {
                    const maintenance: MaintenanceRequest = {
                      id: Date.now().toString(),
                      propertyId: newMaintenance.propertyId,
                      propertyAddress: property.address,
                      tenantId: newMaintenance.tenantId,
                      tenantName: tenant.name,
                      description: newMaintenance.description,
                      priority: newMaintenance.priority,
                      status: 'pending',
                      createdAt: new Date(),
                    }
                    setMaintenanceRequests([...maintenanceRequests, maintenance])
                    setShowMaintenanceModal(false)
                    setNewMaintenance({ propertyId: '', tenantId: '', description: '', priority: 'medium' })
                  }
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
