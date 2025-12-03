// Script pour générer des pages d'application complètes
// Usage: node scripts/generate-app-pages.js

const fs = require('fs')
const path = require('path')

const appConfigs = [
  { id: 'sushi', title: 'Gestion Sushis', icon: 'Fish', color: 'teal', description: 'Gestion de restaurant de sushis avec menu et réservations' },
  { id: 'fastfood', title: 'Gestion Fast-Food', icon: 'UtensilsCrossed', color: 'orange', description: 'Système de point de vente pour fast-food avec commande rapide' },
  { id: 'foodtruck', title: 'Gestion Food Truck', icon: 'Truck', color: 'yellow', description: 'Gestion mobile pour food truck avec localisation et commandes' },
  { id: 'catering', title: 'Gestion Traiteur', icon: 'Utensils', color: 'purple', description: 'Gestion de service traiteur avec événements et menus' },
  // Ajouter d'autres configurations ici
]

function generatePage(app) {
  const iconImport = `import {  DZD{app.icon}, Package, ShoppingCart, BarChart3, TrendingUp, Calendar, Users } from 'lucide-react'`
  
  const pageContent = `'use client'

import { useState, useEffect } from 'react'
 DZD{iconImport}

type TabType = 'dashboard' | 'items' | 'orders' | 'stock'

export default function  DZD{app.id.charAt(0).toUpperCase() + app.id.slice(1)}Page() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [items, setItems] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(' DZD{app.id}-items')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'items' as TabType, label: 'Éléments', icon:  DZD{app.icon} },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
    { id: 'stock' as TabType, label: 'Stock', icon: Package },
  ]

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from- DZD{app.color}-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                < DZD{app.icon} className="w-6 h-6 sm:w-7 sm:h-7 text- DZD{app.color}-600" />
                 DZD{app.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1"> DZD{app.description}</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={\`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
                    activeTab === tab.id
                      ? 'text- DZD{app.color}-600 border-b-2 border- DZD{app.color}-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }\`}
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
              <div className="bg-white rounded-xl shadow-lg border border- DZD{app.color}-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Éléments</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{items.length}</p>
                  </div>
                  < DZD{app.icon} className="w-8 h-8 sm:w-10 sm:h-10 text- DZD{app.color}-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border- DZD{app.color}-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2"> DZD{totalRevenue.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border- DZD{app.color}-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border- DZD{app.color}-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">0</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion</h3>
                  <p className="text-sm text-gray-600">Gestion complète des éléments et produits</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Commandes</h3>
                  <p className="text-sm text-gray-600">Système de commande et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Éléments</h2>
            <p className="text-gray-600">Gestion des éléments</p>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Commandes</h2>
            <p className="text-gray-600">Gestion des commandes</p>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Stock</h2>
            <p className="text-gray-600">Gestion du stock</p>
          </div>
        )}
      </main>
    </div>
  )
}
`

  return pageContent
}

// Générer les pages
appConfigs.forEach(app => {
  const dirPath = path.join(__dirname, '..', 'app', app.id)
  const filePath = path.join(dirPath, 'page.tsx')
  
  // Créer le répertoire s'il n'existe pas
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  
  // Écrire le fichier
  fs.writeFileSync(filePath, generatePage(app))
  console.log(`✓ Généré:  DZD{filePath}`)
})

console.log('Toutes les pages ont été générées!')




