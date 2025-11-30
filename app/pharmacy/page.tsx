'use client'

import { useState, useEffect } from 'react'
import { Pill, Package, FileText, AlertTriangle, BarChart3, Calendar, Users, TrendingUp } from 'lucide-react'
import { Medication, Prescription } from '@/types/pharmacy'

type TabType = 'dashboard' | 'medications' | 'prescriptions' | 'expiry'

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [medications, setMedications] = useState<Medication[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])

  useEffect(() => {
    const savedMeds = localStorage.getItem('pharmacy-medications')
    const savedPrescriptions = localStorage.getItem('pharmacy-prescriptions')

    if (savedMeds) {
      const parsed = JSON.parse(savedMeds)
      setMedications(parsed.map((m: any) => ({ ...m, expiryDate: new Date(m.expiryDate) })))
    } else {
      const sample: Medication[] = [
        {
          id: '1',
          name: 'Paracétamol 500mg',
          genericName: 'Acetaminophen',
          category: 'otc',
          dosage: '500mg',
          form: 'tablet',
          stock: 150,
          expiryDate: new Date('2026-12-31'),
          price: 5.99,
          cost: 2.50,
          prescriptionRequired: false,
          manufacturer: 'Pharma Corp',
        },
        {
          id: '2',
          name: 'Amoxicilline 500mg',
          category: 'prescription',
          dosage: '500mg',
          form: 'capsule',
          stock: 75,
          expiryDate: new Date('2025-06-30'),
          price: 12.99,
          cost: 6.00,
          prescriptionRequired: true,
        },
      ]
      setMedications(sample)
      localStorage.setItem('pharmacy-medications', JSON.stringify(sample))
    }

    if (savedPrescriptions) {
      const parsed = JSON.parse(savedPrescriptions)
      setPrescriptions(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })))
    }
  }, [])

  const expiringSoon = medications.filter((m) => {
    const expiry = new Date(m.expiryDate)
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)
    return expiry <= in30Days && expiry > new Date()
  })

  const lowStock = medications.filter((m) => m.stock < 20)

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'medications' as TabType, label: 'Médicaments', icon: Pill },
    { id: 'prescriptions' as TabType, label: 'Ordonnances', icon: FileText },
    { id: 'expiry' as TabType, label: 'Expiration', icon: AlertTriangle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation Tabs */}
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Médicaments</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{medications.length}</p>
                  </div>
                  <Pill className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ordonnances</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{prescriptions.length}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock Faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock.length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Expire Bientôt</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{expiringSoon.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {expiringSoon.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Médicaments Expirant Bientôt (30 jours)
                </h3>
                <div className="space-y-2">
                  {expiringSoon.map((m) => (
                    <div key={m.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm bg-white rounded-lg p-3">
                      <span className="text-gray-700 font-medium">{m.name}</span>
                      <span className="font-semibold text-orange-700">
                        Expire: {new Date(m.expiryDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Médicaments</h3>
                  <p className="text-sm text-gray-600">Stock, prix, fournisseurs et informations détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ordonnances</h3>
                  <p className="text-sm text-gray-600">Gestion complète des ordonnances et délivrance</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes Expiration</h3>
                  <p className="text-sm text-gray-600">Notifications automatiques pour médicaments expirants</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Stock</h3>
                  <p className="text-sm text-gray-600">Alertes stock faible et réapprovisionnement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et historique</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Médicaments</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ajouter Médicament
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {medications.map((med) => (
                <div key={med.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{med.name}</h3>
                    {med.prescriptionRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs whitespace-nowrap">Ordonnance</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{med.dosage} - {med.form}</p>
                  {med.genericName && (
                    <p className="text-xs text-gray-500 mb-3">Nom générique: {med.genericName}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">${med.price}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      med.stock < 20 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Stock: {med.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ordonnances</h2>
            <p className="text-gray-600 mb-6">Gestion des ordonnances et délivrance de médicaments</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Ordonnance</h3>
                <p className="text-sm text-gray-600">Enregistrer et traiter une nouvelle ordonnance</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique des ordonnances</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Statut</h3>
                <p className="text-sm text-gray-600">Suivre le statut de chaque ordonnance</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expiry' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Gestion des Expirations</h2>
            <p className="text-gray-600 mb-6">Suivi et alertes pour médicaments expirés ou expirant bientôt</p>
            <div className="space-y-4">
              {expiringSoon.length > 0 ? (
                <div className="space-y-2">
                  {expiringSoon.map((m) => (
                    <div key={m.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <span className="font-medium text-gray-900">{m.name}</span>
                        <span className="text-sm text-orange-700 mt-1 sm:mt-0">
                          Expire le {new Date(m.expiryDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Aucun médicament n'expire dans les 30 prochains jours</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
