'use client'

import { useState, useEffect } from 'react'
import { Cake, ShoppingCart, Package, BarChart3, Settings } from 'lucide-react'
import BakeryDashboard from '@/components/bakery/BakeryDashboard'
import ProductManagement from '@/components/bakery/ProductManagement'
import OrderManagement from '@/components/bakery/OrderManagement'
import { Product, Order } from '@/types/bakery'

type TabType = 'dashboard' | 'products' | 'orders'

export default function BakeryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem('bakery-products')
    const savedOrders = localStorage.getItem('bakery-orders')

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      const sample: Product[] = [
        {
          id: '1',
          name: 'Gâteau Chocolat',
          description: 'Gâteau au chocolat fondant avec glaçage',
          category: 'cake',
          price: 25.99,
          ingredients: ['Chocolat', 'Farine', 'Œufs', 'Beurre'],
          available: true,
          stock: 10,
        },
        {
          id: '2',
          name: 'Croissant',
          description: 'Croissant beurre frais',
          category: 'pastry',
          price: 1.50,
          ingredients: ['Farine', 'Beurre', 'Levure'],
          available: true,
          stock: 50,
        },
        {
          id: '3',
          name: 'Pain Complet',
          description: 'Pain complet bio',
          category: 'bread',
          price: 3.00,
          ingredients: ['Farine complète', 'Levure', 'Eau'],
          available: true,
          stock: 30,
        },
      ]
      setProducts(sample)
      localStorage.setItem('bakery-products', JSON.stringify(sample))
    }

    if (savedOrders) {
      const parsed = JSON.parse(savedOrders)
      setOrders(
        parsed.map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt),
          deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : undefined,
        }))
      )
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) localStorage.setItem('bakery-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    if (orders.length > 0 || localStorage.getItem('bakery-orders')) {
      localStorage.setItem('bakery-orders', JSON.stringify(orders))
    }
  }, [orders])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'products' as TabType, label: 'Produits', icon: Package },
    { id: 'orders' as TabType, label: 'Commandes', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative ${
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

      <main className="p-6">
        {activeTab === 'dashboard' && (
          <BakeryDashboard products={products} orders={orders} />
        )}
        {activeTab === 'products' && (
          <ProductManagement products={products} setProducts={setProducts} />
        )}
        {activeTab === 'orders' && (
          <OrderManagement orders={orders} setOrders={setOrders} products={products} />
        )}
      </main>
    </div>
  )
}

