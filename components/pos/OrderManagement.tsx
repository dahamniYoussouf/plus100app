'use client'

import { useState, useMemo } from 'react'
import { Clock, CheckCircle, X, RefreshCw } from 'lucide-react'
import { Order, MenuItem, Table } from '@/types/pos'

interface OrderManagementProps {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  menuItems: MenuItem[]
  tables: Table[]
  setTables: (tables: Table[]) => void
}

const statusOptions: Array<{ value: Order['status']; label: string; color: string }> = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'preparing', label: 'Preparing', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready', label: 'Ready', color: 'bg-purple-100 text-purple-800' },
  { value: 'served', label: 'Served', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

export default function OrderManagement({
  orders,
  setOrders,
  tables,
  setTables,
}: OrderManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const updated = {
            ...order,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date() : order.completedAt,
          }

          // If completed or cancelled, free up the table
          if (newStatus === 'completed' || newStatus === 'cancelled') {
            setTables(
              tables.map((table) =>
                table.id === order.tableId
                  ? { ...table, status: 'available' as const, currentOrderId: undefined }
                  : table
              )
            )
          }

          return updated
        }
        return order
      })
    )
  }

  const getTableNumber = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    return table?.number || tableId.replace('table-', '')
  }

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-500">
            Manage and track all orders ({activeOrders} active)
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors  DZD{
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter((o) => o.status === status.value).length
            return (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors  DZD{
                  statusFilter === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusOption = statusOptions.find((s) => s.value === order.status)
            const currentStatusIndex = statusOptions.findIndex((s) => s.value === order.status)
            const nextStatus = statusOptions[currentStatusIndex + 1]

            return (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Table {getTableNumber(order.tableId)}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium  DZD{
                          statusOption?.color || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusOption?.label || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                       DZD{order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-900">{item.name}</span>
                          {item.notes && (
                            <span className="text-xs text-gray-500">({item.notes})</span>
                          )}
                        </div>
                        <span className="text-gray-900 font-medium">
                           DZD{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Payment:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium  DZD{
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  {order.paymentMethod && (
                    <span className="text-xs text-gray-500 capitalize">
                      {order.paymentMethod}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {nextStatus && order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, nextStatus.value)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Mark as {nextStatus.label}
                    </button>
                  )}
                  {order.status !== 'completed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-2 text-center py-12 bg-white rounded-lg shadow">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}




