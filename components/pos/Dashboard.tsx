'use client'

import { useMemo } from 'react'
import { DollarSign, ShoppingCart, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { MenuItem, Order, Table } from '@/types/pos'

interface DashboardProps {
  menuItems: MenuItem[]
  orders: Order[]
  tables: Table[]
}

export default function Dashboard({ menuItems, orders, tables }: DashboardProps) {
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter(
      (order) => new Date(order.createdAt) >= today
    )

    const todayRevenue = todayOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0)

    const pendingOrders = orders.filter(
      (o) => o.status !== 'completed' && o.status !== 'cancelled'
    ).length

    const occupiedTables = tables.filter((t) => t.status === 'occupied').length

    const completedToday = todayOrders.filter((o) => o.status === 'completed').length

    return {
      todayRevenue,
      totalOrders: todayOrders.length,
      occupiedTables,
      pendingOrders,
      completedToday,
    }
  }, [orders, tables])

  const topSellingItems = useMemo(() => {
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCounts[item.menuItemId]) {
          itemCounts[item.menuItemId] = {
            name: item.name,
            count: 0,
            revenue: 0,
          }
        }
        itemCounts[item.menuItemId].count += item.quantity
        itemCounts[item.menuItemId].revenue += item.price * item.quantity
      })
    })

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [orders])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  }, [orders])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-purple-100 text-purple-800',
    served: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${stats.todayRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied Tables</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.occupiedTables}/{tables.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Items & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Selling Items
          </h2>
          <div className="space-y-3">
            {topSellingItems.length > 0 ? (
              topSellingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.count} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${item.revenue.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Table {order.tableId.replace('table-', '')}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{order.items.length} item(s)</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

