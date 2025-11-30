'use client'

import { Shield, CheckCircle, FileText, Package } from 'lucide-react'

export default function HalalFoodPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Certification Halal
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Système complet de gestion de certification halal pour produits alimentaires avec contrôles et traçabilité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Produits</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Certifications</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Contrôles</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Rapports</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
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
        </div>
      </div>
    </div>
  )
}

