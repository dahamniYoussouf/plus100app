'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Pill, Package, FileText, AlertTriangle, BarChart3, Calendar, Users, TrendingUp } from 'lucide-react'
import { Medication, Prescription } from '@/types/pharmacy'

type TabType = 'dashboard' | 'medications' | 'prescriptions' | 'expiry'

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [medications, setMedications] = useState<Medication[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [showMedicationModal, setShowMedicationModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [newMedication, setNewMedication] = useState({ name: '', genericName: '', category: 'otc' as 'otc' | 'prescription', dosage: '', form: 'tablet' as 'tablet' | 'capsule' | 'syrup' | 'injection', stock: 0, expiryDate: '', price: 0, cost: 0, prescriptionRequired: false, manufacturer: '' })
  const [newPrescription, setNewPrescription] = useState({ patientName: '', patientPhone: '', doctorName: '', doctorLicense: '', medications: [] as Array<{ medicationId: string; quantity: number; instructions: string }>, date: '' })

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
              <button 
                onClick={() => setShowMedicationModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
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
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors text-left w-full"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle Ordonnance</h3>
                <p className="text-sm text-gray-600">Enregistrer et traiter une nouvelle ordonnance</p>
              </button>
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

      {/* Modals */}
      <Modal
        isOpen={showMedicationModal}
        onClose={() => {
          setShowMedicationModal(false)
          setNewMedication({ name: '', genericName: '', category: 'otc', dosage: '', form: 'tablet', stock: 0, expiryDate: '', price: 0, cost: 0, prescriptionRequired: false, manufacturer: '' })
        }}
        title="Ajouter Médicament"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom commercial</label>
            <input
              type="text"
              value={newMedication.name}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Paracétamol 500mg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom générique (optionnel)</label>
            <input
              type="text"
              value={newMedication.genericName}
              onChange={(e) => setNewMedication({ ...newMedication, genericName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Acetaminophen"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newMedication.category}
                onChange={(e) => setNewMedication({ ...newMedication, category: e.target.value as any, prescriptionRequired: e.target.value === 'prescription' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="otc">Sans ordonnance</option>
                <option value="prescription">Sur ordonnance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 500mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forme</label>
              <select
                value={newMedication.form}
                onChange={(e) => setNewMedication({ ...newMedication, form: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="tablet">Comprimé</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Sirop</option>
                <option value="injection">Injection</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={newMedication.stock}
                onChange={(e) => setNewMedication({ ...newMedication, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newMedication.price}
                onChange={(e) => setNewMedication({ ...newMedication, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD)</label>
              <input
                type="number"
                value={newMedication.cost}
                onChange={(e) => setNewMedication({ ...newMedication, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="date"
                value={newMedication.expiryDate}
                onChange={(e) => setNewMedication({ ...newMedication, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabricant (optionnel)</label>
              <input
                type="text"
                value={newMedication.manufacturer}
                onChange={(e) => setNewMedication({ ...newMedication, manufacturer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Pharma Corp"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMedicationModal(false)
                setNewMedication({ name: '', genericName: '', category: 'otc', dosage: '', form: 'tablet', stock: 0, expiryDate: '', price: 0, cost: 0, prescriptionRequired: false, manufacturer: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMedication.name && newMedication.dosage && newMedication.expiryDate) {
                  const medication: Medication = {
                    id: Date.now().toString(),
                    name: newMedication.name,
                    genericName: newMedication.genericName || undefined,
                    category: newMedication.category,
                    dosage: newMedication.dosage,
                    form: newMedication.form,
                    stock: newMedication.stock,
                    expiryDate: new Date(newMedication.expiryDate),
                    price: newMedication.price,
                    cost: newMedication.cost,
                    prescriptionRequired: newMedication.prescriptionRequired,
                    manufacturer: newMedication.manufacturer || undefined,
                  }
                  setMedications([...medications, medication])
                  setShowMedicationModal(false)
                  setNewMedication({ name: '', genericName: '', category: 'otc', dosage: '', form: 'tablet', stock: 0, expiryDate: '', price: 0, cost: 0, prescriptionRequired: false, manufacturer: '' })
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
        isOpen={showPrescriptionModal}
        onClose={() => {
          setShowPrescriptionModal(false)
          setNewPrescription({ patientName: '', patientPhone: '', doctorName: '', doctorLicense: '', medications: [], date: '' })
        }}
        title="Nouvelle Ordonnance"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du patient</label>
              <input
                type="text"
                value={newPrescription.patientName}
                onChange={(e) => setNewPrescription({ ...newPrescription, patientName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Ahmed Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newPrescription.patientPhone}
                onChange={(e) => setNewPrescription({ ...newPrescription, patientPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du médecin</label>
              <input
                type="text"
                value={newPrescription.doctorName}
                onChange={(e) => setNewPrescription({ ...newPrescription, doctorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Dr. Mohamed Ali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° Licence</label>
              <input
                type="text"
                value={newPrescription.doctorLicense}
                onChange={(e) => setNewPrescription({ ...newPrescription, doctorLicense: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: MED-12345"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newPrescription.date}
              onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {medications.filter(m => m.category === 'prescription' && m.stock > 0).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Médicaments</label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {medications.filter(m => m.category === 'prescription' && m.stock > 0).map(medication => {
                  const prescriptionItem = newPrescription.medications.find(m => m.medicationId === medication.id)
                  return (
                    <div key={medication.id} className="flex items-start justify-between p-2 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-500">{medication.dosage} • Stock: {medication.stock}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (prescriptionItem && prescriptionItem.quantity > 0) {
                              setNewPrescription({
                                ...newPrescription,
                                medications: newPrescription.medications.map(m => m.medicationId === medication.id ? { ...m, quantity: m.quantity - 1 } : m).filter(m => m.quantity > 0)
                              })
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{prescriptionItem?.quantity || 0}</span>
                        <button
                          onClick={() => {
                            if (prescriptionItem) {
                              if (prescriptionItem.quantity < medication.stock) {
                                setNewPrescription({
                                  ...newPrescription,
                                  medications: newPrescription.medications.map(m => m.medicationId === medication.id ? { ...m, quantity: m.quantity + 1 } : m)
                                })
                              }
                            } else {
                              setNewPrescription({
                                ...newPrescription,
                                medications: [...newPrescription.medications, { medicationId: medication.id, quantity: 1, instructions: '' }]
                              })
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          disabled={prescriptionItem ? prescriptionItem.quantity >= medication.stock : false}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPrescriptionModal(false)
                setNewPrescription({ patientName: '', patientPhone: '', doctorName: '', doctorLicense: '', medications: [], date: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newPrescription.patientName && newPrescription.doctorName && newPrescription.date && newPrescription.medications.length > 0) {
                  const prescription: Prescription = {
                    id: Date.now().toString(),
                    patientName: newPrescription.patientName,
                    patientPhone: newPrescription.patientPhone,
                    doctorName: newPrescription.doctorName,
                    medications: newPrescription.medications.map(item => {
                      const medication = medications.find(m => m.id === item.medicationId)
                      return {
                        medicationId: item.medicationId,
                        medicationName: medication ? medication.name : '',
                        quantity: item.quantity,
                        dosage: medication ? medication.dosage : '',
                        instructions: item.instructions,
                      }
                    }),
                    date: new Date(newPrescription.date),
                    status: 'pending',
                  }
                  setPrescriptions([...prescriptions, prescription])
                  // Mettre à jour le stock
                  setMedications(medications.map(medication => {
                    const prescriptionItem = newPrescription.medications.find(m => m.medicationId === medication.id)
                    if (prescriptionItem) {
                      return { ...medication, stock: Math.max(0, medication.stock - prescriptionItem.quantity) }
                    }
                    return medication
                  }))
                  setShowPrescriptionModal(false)
                  setNewPrescription({ patientName: '', patientPhone: '', doctorName: '', doctorLicense: '', medications: [], date: '' })
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
