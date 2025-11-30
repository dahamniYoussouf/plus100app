'use client'

import { Book, Users, Calendar, Award } from 'lucide-react'

export default function QuranPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 mb-4">
              <Book className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Gestion École Coranique
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Système complet de gestion d'école coranique avec étudiants, cours de mémorisation et suivi religieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Étudiants</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <Book className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Cours</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <Award className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Hifz</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 sm:p-6 text-center">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">∞</div>
              <div className="text-sm text-gray-600 mt-1">Événements</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Étudiants</h3>
                  <p className="text-sm text-gray-600">Suivi complet des étudiants avec informations personnelles et progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Mémorisation (Hifz)</h3>
                  <p className="text-sm text-gray-600">Suivi de la mémorisation du Coran avec révision et progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours Religieux</h3>
                  <p className="text-sm text-gray-600">Gestion des cours de Tajwid, Tafsir et sciences islamiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Présence</h3>
                  <p className="text-sm text-gray-600">Suivi de la présence des étudiants aux cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Événements Religieux</h3>
                  <p className="text-sm text-gray-600">Organisation d'événements et activités religieuses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Génération de rapports de progression et statistiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

