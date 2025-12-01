'use client'

import { useState, useEffect } from 'react'
import { Menu, ShoppingCart, LayoutGrid, BarChart3, Settings, LogOut } from 'lucide-react'
import MenuManagement from '@/components/pos/MenuManagement'
import OrderManagement from '@/components/pos/OrderManagement'
import TableManagement from '@/components/pos/TableManagement'
import Checkout from '@/components/pos/Checkout'
import Dashboard from '@/components/pos/Dashboard'
import { MenuItem, Order, Table } from '@/types/pos'

type TabType = 'dashboard' | 'menu' | 'orders' | 'tables' | 'checkout'

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMenuItems = localStorage.getItem('pos-menu-items')
    const savedOrders = localStorage.getItem('pos-orders')
    const savedTables = localStorage.getItem('pos-tables')

    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems))
    } else {
      // Initialize with sample data - Produits Halal uniquement
      const sampleMenu: MenuItem[] = [
        { id: '1', name: 'Pizza Margherita Halal', description: 'Tomate, mozzarella halal et basilic', price: 12.99, category: 'Pizza', available: true },
        { id: '2', name: 'Pizza Poulet Halal', description: 'Poulet halal, mozzarella et légumes', price: 14.99, category: 'Pizza', available: true },
        { id: '3', name: 'Salade César Halal', description: 'Salade romaine, parmesan halal et croûtons', price: 8.99, category: 'Salades', available: true },
        { id: '4', name: 'Poulet Grillé Halal', description: 'Suprême de poulet halal mariné aux herbes', price: 16.99, category: 'Plats Principaux', available: true },
        { id: '5', name: 'Gâteau au Chocolat', description: 'Gâteau au chocolat artisanal', price: 6.99, category: 'Desserts', available: true },
        { id: '6', name: 'Jus d\'Orange Frais', description: 'Jus d\'orange pressé 100% naturel', price: 3.99, category: 'Boissons', available: true },
        { id: '7', name: 'Thé à la Menthe', description: 'Thé vert à la menthe traditionnel', price: 2.99, category: 'Boissons', available: true },
        { id: '8', name: 'Café Turc', description: 'Café turc authentique', price: 2.50, category: 'Boissons', available: true },
      ]
      setMenuItems(sampleMenu)
      localStorage.setItem('pos-menu-items', JSON.stringify(sampleMenu))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(parsed.map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        completedAt: o.completedAt ? new Date(o.completedAt) : undefined,
      })))
    }

    if (savedTables) {
      setTables(JSON.parse(savedTables))
    } else {
      // Initialize with sample tables
      const sampleTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
        id: `table- DZD{i + 1}`,
        number: i + 1,
        capacity: i < 6 ? 4 : i < 9 ? 6 : 8,
        status: 'available' as const,
      }))
      setTables(sampleTables)
      localStorage.setItem('pos-tables', JSON.stringify(sampleTables))
    }
  }, [])

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('pos-menu-items', JSON.stringify(menuItems))
    }
  }, [menuItems])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0 || localStorage.getItem('pos-orders')) {
      localStorage.setItem('pos-orders', JSON.stringify(orders))
    }
  }, [orders])

  // Save tables to localStorage whenever they change
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem('pos-tables', JSON.stringify(tables))
    }
  }, [tables])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'menu' as TabType, label: 'Menu', icon: Menu },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
    { id: 'tables' as TabType, label: 'Tables', icon: LayoutGrid },
    { id: 'checkout' as TabType, label: 'Checkout', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative  DZD{
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'dashboard' && (
          <Dashboard menuItems={menuItems} orders={orders} tables={tables} />
        )}
        {activeTab === 'menu' && (
          <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} />
        )}
        {activeTab === 'orders' && (
          <OrderManagement
            orders={orders}
            setOrders={setOrders}
            menuItems={menuItems}
            tables={tables}
            setTables={setTables}
          />
        )}
        {activeTab === 'tables' && (
          <TableManagement
            tables={tables}
            setTables={setTables}
            orders={orders}
            setSelectedTable={setSelectedTable}
            onTableSelect={(tableId) => {
              setSelectedTable(tableId)
              setActiveTab('checkout')
            }}
          />
        )}
        {activeTab === 'checkout' && (
          <Checkout
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            menuItems={menuItems}
            orders={orders}
            setOrders={setOrders}
            tables={tables}
            setTables={setTables}
          />
        )}
      </main>
    </div>
  )
}

