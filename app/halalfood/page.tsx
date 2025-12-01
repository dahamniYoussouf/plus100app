'use client'

import { useState, useEffect } from 'react'
import { Shield, Package, CheckCircle, FileText, BarChart3, AlertTriangle, Calendar, Users, Search, TrendingUp } from 'lucide-react'

type TabType = 'dashboard' | 'products' | 'certifications' | 'controls' | 'audits' | 'traceability'

interface Product {
  id: string
  name: string
  category: string
  manufacturer: string
  halalStatus: 'certified' | 'pending' | 'rejected' | 'expired'
  certificationNumber?: string
  certificationDate?: Date
  expiryDate?: Date
  ingredients: string[]
  supplyChain: string[]
  notes?: string
}

interface Certification {
  id: string
  productId: string
  productName: string
  certificateNumber: string
  issueDate: Date
  expiryDate: Date
  status: 'active' | 'expired' | 'revoked'
  controlDate?: Date
  inspector: string
  notes?: string
}

interface Control {
  id: string
  productId: string
  productName: string
  date: Date
  type: 'inspection' | 'laboratory' | 'audit'
  inspector: string
  result: 'passed' | 'failed' | 'pending'
  findings: string[]
  recommendations?: string
}

interface Audit {
  id: string
  name: string
  type: 'routine' | 'surprise' | 'follow-up'
  date: Date
  inspector: string
  products: string[]
  status: 'scheduled' | 'in_progress' | 'completed'
  findings?: string[]
  report?: string
}

export default function HalalFoodPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [controls, setControls] = useState<Control[]>([])
  const [audits, setAudits] = useState<Audit[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('halalfood-products')
    const savedCertifications = localStorage.getItem('halalfood-certifications')
    const savedControls = localStorage.getItem('halalfood-controls')
    const savedAudits = localStorage.getItem('halalfood-audits')

    if (savedProducts) {
      const parsed = JSON.parse(savedProducts)
      setProducts(parsed.map((p: any) => ({
        ...p,
        certificationDate: p.certificationDate ? new Date(p.certificationDate) : undefined,
        expiryDate: p.expiryDate ? new Date(p.expiryDate) : undefined,
      })))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Viande de Bœuf Halal',
          category: 'Viande',
          manufacturer: 'Halal Food Co.',
          halalStatus: 'certified',
          certificationNumber: 'HAL-2024-001',
          certificationDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01'),
          ingredients: ['Bœuf halal', 'Sel', 'Épices'],
          supplyChain: ['Éleveur certifié', 'Abattoir halal', 'Transformateur'],
        },
        {
          id: '2',
          name: 'Poulet Halal',
          category: 'Volaille',
          manufacturer: 'Poultry Halal Ltd.',
          halalStatus: 'certified',
          certificationNumber: 'HAL-2024-002',
          certificationDate: new Date('2024-01-15'),
          expiryDate: new Date('2025-01-15'),
          ingredients: ['Poulet halal', 'Sel marin'],
          supplyChain: ['Élevage certifié', 'Abattoir halal'],
        },
        {
          id: '3',
          name: 'Sauce Tomate Halal',
          category: 'Condiments',
          manufacturer: 'Sauce Factory',
          halalStatus: 'pending',
          ingredients: ['Tomates', 'Vinaigre', 'Sel', 'Sucre'],
          supplyChain: ['Agriculteur', 'Transformateur'],
        },
      ]
      setProducts(sample)
      localStorage.setItem('halalfood-products', JSON.stringify(sample))
    }

    if (savedCertifications) {
      const parsed = JSON.parse(savedCertifications)
      setCertifications(parsed.map((c: any) => ({
        ...c,
        issueDate: new Date(c.issueDate),
        expiryDate: new Date(c.expiryDate),
        controlDate: c.controlDate ? new Date(c.controlDate) : undefined,
      })))
    } else {
      const sample: Certification[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Viande de Bœuf Halal',
          certificateNumber: 'HAL-2024-001',
          issueDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-01-01'),
          status: 'active',
          controlDate: new Date('2024-01-15'),
          inspector: 'Cheikh Ahmed',
        },
        {
          id: '2',
          productId: '2',
          productName: 'Poulet Halal',
          certificateNumber: 'HAL-2024-002',
          issueDate: new Date('2024-01-15'),
          expiryDate: new Date('2025-01-15'),
          status: 'active',
          controlDate: new Date('2024-01-20'),
          inspector: 'Cheikh Mohamed',
        },
      ]
      setCertifications(sample)
      localStorage.setItem('halalfood-certifications', JSON.stringify(sample))
    }

    if (savedControls) {
      const parsed = JSON.parse(savedControls)
      setControls(parsed.map((c: any) => ({
        ...c,
        date: new Date(c.date),
      })))
    } else {
      const sample: Control[] = [
        {
          id: '1',
          productId: '1',
          productName: 'Viande de Bœuf Halal',
          date: new Date('2024-01-15'),
          type: 'inspection',
          inspector: 'Cheikh Ahmed',
          result: 'passed',
          findings: ['Toutes les conditions halal respectées', 'Documentation complète'],
        },
        {
          id: '2',
          productId: '3',
          productName: 'Sauce Tomate Halal',
          date: new Date('2024-01-18'),
          type: 'laboratory',
          inspector: 'Dr. Fatima',
          result: 'pending',
          findings: ['Analyse en cours'],
        },
      ]
      setControls(sample)
      localStorage.setItem('halalfood-controls', JSON.stringify(sample))
    }

    if (savedAudits) {
      const parsed = JSON.parse(savedAudits)
      setAudits(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })))
    } else {
      const sample: Audit[] = [
        {
          id: '1',
          name: 'Audit Trimestriel Q1 2024',
          type: 'routine',
          date: new Date('2024-02-01'),
          inspector: 'Cheikh Hassan',
          products: ['1', '2'],
          status: 'scheduled',
        },
        {
          id: '2',
          name: 'Inspection Surprise - Halal Food Co.',
          type: 'surprise',
          date: new Date('2024-01-10'),
          inspector: 'Cheikh Ahmed',
          products: ['1'],
          status: 'completed',
          findings: ['Conformité totale', 'Excellente traçabilité'],
        },
      ]
      setAudits(sample)
      localStorage.setItem('halalfood-audits', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('halalfood-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (certifications.length > 0) localStorage.setItem('halalfood-certifications', JSON.stringify(certifications))
  }, [certifications])

  useEffect(() => {
    if (controls.length > 0) localStorage.setItem('halalfood-controls', JSON.stringify(controls))
  }, [controls])

  useEffect(() => {
    if (audits.length > 0) localStorage.setItem('halalfood-audits', JSON.stringify(audits))
  }, [audits])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'certifications' as TabType, label: 'Certifications', icon: CheckCircle },
    { id: 'controls' as TabType, label: 'Contrôles', icon: Shield },
    { id: 'audits' as TabType, label: 'Audits', icon: FileText },
    { id: 'traceability' as TabType, label: 'Traçabilité', icon: Search },
  ]

  const certifiedProducts = products.filter(p => p.halalStatus === 'certified').length
  const pendingProducts = products.filter(p => p.halalStatus === 'pending').length
  const activeCertifications = certifications.filter(c => c.status === 'active').length
  const expiredCertifications = certifications.filter(c => c.status === 'expired').length
  const passedControls = controls.filter(c => c.result === 'passed').length
  const failedControls = controls.filter(c => c.result === 'failed').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Produits</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Certifiés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{certifiedProducts}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Certifications</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeCertifications}</p>
                  </div>
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Contrôles OK</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{passedControls}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            {pendingProducts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Produits en Attente de Certification ({pendingProducts})
                </h3>
                <p className="text-sm text-yellow-800">
                  {pendingProducts} produit(s) nécessitent une inspection et une certification.
                </p>
              </div>
            )}

            {expiredCertifications > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Certifications Expirées ({expiredCertifications})
                </h3>
                <p className="text-sm text-red-800">
                  {expiredCertifications} certification(s) ont expiré et nécessitent un renouvellement.
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Produits</h3>
                  <p className="text-sm text-gray-600">Enregistrement et suivi des produits à certifier halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Contrôles Qualité</h3>
                  <p className="text-sm text-gray-600">Inspections et contrôles selon les standards halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
                  <p className="text-sm text-gray-600">Délivrance et gestion des certificats halal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Traçabilité</h3>
                  <p className="text-sm text-gray-600">Suivi complet de la chaîne d'approvisionnement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Audits</h3>
                  <p className="text-sm text-gray-600">Planning et réalisation d'audits réguliers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Base de Données</h3>
                  <p className="text-sm text-gray-600">Base de données des produits certifiés halal</p>
                </div>
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap  DZD{
                      product.halalStatus === 'certified' ? 'bg-green-100 text-green-800' :
                      product.halalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      product.halalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.halalStatus === 'certified' ? 'Certifié' :
                       product.halalStatus === 'pending' ? 'En attente' :
                       product.halalStatus === 'rejected' ? 'Rejeté' : 'Expiré'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Catégorie: {product.category}</p>
                  <p className="text-sm text-gray-600 mb-3">Fabricant: {product.manufacturer}</p>
                  {product.certificationNumber && (
                    <p className="text-xs text-gray-500 mb-2">Cert. n°: {product.certificationNumber}</p>
                  )}
                  {product.expiryDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Expire le: {new Date(product.expiryDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Ingrédients:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          +{product.ingredients.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Certifications</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle Certification
              </button>
            </div>
            {certifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune certification enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.productName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Certificat n°: {cert.certificateNumber}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Émis le: {new Date(cert.issueDate).toLocaleDateString('fr-FR')} • 
                          Expire le: {new Date(cert.expiryDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Inspecteur: {cert.inspector}</p>
                        {cert.controlDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Dernier contrôle: {new Date(cert.controlDate).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        cert.status === 'active' ? 'bg-green-100 text-green-800' :
                        cert.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cert.status === 'active' ? 'Actif' :
                         cert.status === 'expired' ? 'Expiré' : 'Révoqué'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'controls' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contrôles Qualité</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Contrôle
              </button>
            </div>
            {controls.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun contrôle enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {controls.map((control) => (
                  <div key={control.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{control.productName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Type: {control.type === 'inspection' ? 'Inspection' :
                                 control.type === 'laboratory' ? 'Analyse Laboratoire' : 'Audit'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Date: {new Date(control.date).toLocaleDateString('fr-FR')} • Inspecteur: {control.inspector}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Constats:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {control.findings.map((finding, i) => (
                              <li key={i}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                        {control.recommendations && (
                          <p className="text-xs text-gray-500 mt-2">
                            <strong>Recommandations:</strong> {control.recommendations}
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        control.result === 'passed' ? 'bg-green-100 text-green-800' :
                        control.result === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {control.result === 'passed' ? 'Conforme' :
                         control.result === 'failed' ? 'Non conforme' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audits' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Audits</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvel Audit
              </button>
            </div>
            {audits.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun audit programmé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {audits.map((audit) => (
                  <div key={audit.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{audit.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Type: {audit.type === 'routine' ? 'Routine' :
                                 audit.type === 'surprise' ? 'Surprise' : 'Suivi'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Date: {new Date(audit.date).toLocaleDateString('fr-FR')} • Inspecteur: {audit.inspector}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Produits concernés: {audit.products.length}
                        </p>
                        {audit.findings && audit.findings.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Résultats:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {audit.findings.map((finding, i) => (
                                <li key={i}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                        audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        audit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {audit.status === 'completed' ? 'Terminé' :
                         audit.status === 'in_progress' ? 'En cours' : 'Planifié'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'traceability' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Traçabilité des Produits</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600 mb-6">Suivi complet de la chaîne d'approvisionnement pour chaque produit certifié halal</p>
              <div className="space-y-4">
                {products.filter(p => p.halalStatus === 'certified').map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{product.name}</h3>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Chaîne d'approvisionnement:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.supplyChain.map((step, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {step}
                            </span>
                            {i < product.supplyChain.length - 1 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Certificat: {product.certificationNumber} • 
                        Émis le: {product.certificationDate ? new Date(product.certificationDate).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
