'use client'

import { useState, useEffect } from 'react'
import { Building, Users, DollarSign, BarChart3, Home, Key, Calendar } from 'lucide-react'

type TabType = 'dashboard' | 'properties' | 'tenants' | 'leases' | 'maintenance' | 'payments'

interface Property {
  id: string
  address: string
  type: 'apartment' | 'house' | 'commercial' | 'office'
  bedrooms?: number
  bathrooms?: number
  area: number
  rent: number
  status: 'available' | 'rented' | 'maintenance'
  tenantId?: string
  tenantName?: string
  features: string[]
}

interface Tenant {
  id: string
  name: string
  phone: string
  email?: string
  idNumber: string
  propertyId: string
  propertyAddress: string
  leaseStart: Date
  leaseEnd: Date
  monthlyRent: number
  status: 'active' | 'expired' | 'terminated'
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
}

interface Payment {
  id: string
  leaseId: string
  tenantName: string
  propertyAddress: string
  amount: number
  date: Date
  type: 'rent' | 'deposit' | 'maintenance'
  status: 'paid' | 'pending' | 'overdue'
}

export default function PropertyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [properties, setProperties] = useState<Property[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    const savedProperties = localStorage.getItem('property-properties')
    const savedTenants = localStorage.getItem('property-tenants')
    const savedLeases = localStorage.getItem('property-leases')
    const savedPayments = localStorage.getItem('property-payments')

    if (savedProperties) {
      setProperties(JSON.parse(savedProperties))
    } else {
      const sample: Property[] = [
        {
          id: '1',
          address: '123 Rue Didouche Mourad, Alger',
          type: 'apartment',
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          rent: 50000,
          status: 'rented',
          tenantId: '1',
          tenantName: 'Ahmed Benali',
          features: ['Balcon', 'Parking', 'Ascenseur'],
        },
        {
          id: '2',
          address: '45 Avenue des Martyrs, Oran',
          type: 'house',
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          rent: 80000,
          status: 'available',
          features: ['Jardin', 'Garage', 'Terrasse'],
        },
      ]
      setProperties(sample)
      localStorage.setItem('property-properties', JSON.stringify(sample))
    }

    if (savedTenants) {
      const parsed = JSON.parse(savedTenants)
      setTenants(parsed.map((t: any) => ({
        ...t,
        leaseStart: new Date(t.leaseStart),
        leaseEnd: new Date(t.leaseEnd),
      })))
    } else {
      const sample: Tenant[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'ahmed@email.com',
          idNumber: '123456789012',
          propertyId: '1',
          propertyAddress: '123 Rue Didouche Mourad, Alger',
          leaseStart: new Date('2024-01-01'),
          leaseEnd: new Date('2024-12-31'),
          monthlyRent: 50000,
          status: 'active',
        },
      ]
      setTenants(sample)
      localStorage.setItem('property-tenants', JSON.stringify(sample))
    }

    if (savedLeases) {
      const parsed = JSON.parse(savedLeases)
      setLeases(parsed.map((l: any) => ({
        ...l,
        startDate: new Date(l.startDate),
        endDate: new Date(l.endDate),
      })))
    } else {
      const sample: Lease[] = [
        {
          id: '1',
          propertyId: '1',
          propertyAddress: '123 Rue Didouche Mourad, Alger',
          tenantId: '1',
          tenantName: 'Ahmed Benali',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          monthlyRent: 50000,
          deposit: 100000,
          status: 'active',
        },
      ]
      setLeases(sample)
      localStorage.setItem('property-leases', JSON.stringify(sample))
    }

    if (savedPayments) {
      const parsed = JSON.parse(savedPayments)
      setPayments(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })))
    } else {
      const sample: Payment[] = [
        {
          id: '1',
          leaseId: '1',
          tenantName: 'Ahmed Benali',
          propertyAddress: '123 Rue Didouche Mourad, Alger',
          amount: 50000,
          date: new Date(),
          type: 'rent',
          status: 'paid',
        },
      ]
      setPayments(sample)
      localStorage.setItem('property-payments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (properties.length > 0) localStorage.setItem('property-properties', JSON.stringify(properties))
  }, [properties])

  useEffect(() => {
    if (tenants.length > 0) localStorage.setItem('property-tenants', JSON.stringify(tenants))
  }, [tenants])

  useEffect(() => {
    if (leases.length > 0) localStorage.setItem('property-leases', JSON.stringify(leases))
  }, [leases])

  useEffect(() => {
    if (payments.length > 0) localStorage.setItem('property-payments', JSON.stringify(payments))
  }, [payments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'properties' as TabType, label: 'Propriétés', icon: Building },
    { id: 'tenants' as TabType, label: 'Locataires', icon: Users },
    { id: 'leases' as TabType, label: 'Baux', icon: Key },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Home },
    { id: 'payments' as TabType, label: 'Paiements', icon: DollarSign },
  ]

  const availableProperties = properties.filter(p => p.status === 'available').length
  const totalRevenue = payments.filter(p => p.status === 'paid' && p.type === 'rent').reduce((sum, p) => sum + p.amount, 0)
  const activeTenants = tenants.filter(t => t.status === 'active').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Propriétés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{properties.length}</p>
                  </div>
                  <Building className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableProperties}</p>
                  </div>
                  <Key className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Locataires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeTenants}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Propriétés</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Ajouter Propriété
              </button>
            </div>
            {properties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune propriété</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{property.address}</h3>
                        <p className="text-sm text-gray-500 capitalize mt-1">
                          {property.type === 'apartment' ? 'Appartement' :
                           property.type === 'house' ? 'Maison' :
                           property.type === 'commercial' ? 'Commercial' : 'Bureau'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'available' ? 'Disponible' :
                         property.status === 'rented' ? 'Loué' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {property.bedrooms && <p className="text-sm text-gray-600">🛏️ {property.bedrooms} chambres</p>}
                      {property.bathrooms && <p className="text-sm text-gray-600">🚿 {property.bathrooms} salles de bain</p>}
                      <p className="text-sm text-gray-600">📐 {property.area} m²</p>
                      {property.tenantName && (
                        <p className="text-sm text-gray-600">👤 Locataire: {property.tenantName}</p>
                      )}
                      {property.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {property.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xl font-bold text-gray-900">DZD{property.rent.toLocaleString()}/mois</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Locataires</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouveau Locataire
              </button>
            </div>
            {tenants.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun locataire</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{tenant.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {tenant.phone}</p>
                      {tenant.email && <p className="text-sm text-gray-600">📧 {tenant.email}</p>}
                      <p className="text-sm text-gray-600">📍 {tenant.propertyAddress}</p>
                      <p className="text-sm text-gray-600">💰 DZD{tenant.monthlyRent.toLocaleString()}/mois</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Bail:</span>
                        <span className="text-gray-600">
                          {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')} - {new Date(tenant.leaseEnd).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs  DZD{
                        tenant.status === 'active' ? 'bg-green-100 text-green-800' :
                        tenant.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tenant.status === 'active' ? 'Actif' :
                         tenant.status === 'expired' ? 'Expiré' : 'Résilié'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Baux</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouveau Bail
              </button>
            </div>
            {leases.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun bail</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leases.map((lease) => (
                  <div key={lease.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{lease.tenantName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{lease.propertyAddress}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        lease.status === 'active' ? 'bg-green-100 text-green-800' :
                        lease.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lease.status === 'active' ? 'Actif' :
                         lease.status === 'expired' ? 'Expiré' : 'Résilié'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        📅 {new Date(lease.startDate).toLocaleDateString('fr-FR')} - {new Date(lease.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-gray-700">💰 Loyer: DZD{lease.monthlyRent.toLocaleString()}/mois</p>
                        <p className="text-gray-700">💵 Dépôt: DZD{lease.deposit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Maintenance</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des demandes de maintenance</p>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Paiements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Nouveau Paiement
              </button>
            </div>
            {payments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun paiement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{payment.tenantName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{payment.propertyAddress}</p>
                        <p className="text-sm text-gray-500 mt-1 capitalize">
                          {payment.type === 'rent' ? 'Loyer' :
                           payment.type === 'deposit' ? 'Dépôt' : 'Maintenance'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">DZD{payment.amount.toLocaleString()}</p>
                        <span className={`px-2 py-1 rounded text-xs mt-1 inline-block  DZD{
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status === 'paid' ? 'Payé' :
                           payment.status === 'overdue' ? 'En retard' : 'En attente'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      📅 {new Date(payment.date).toLocaleDateString('fr-FR')}
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
