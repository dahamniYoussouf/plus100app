'use client'

import { useMemo } from 'react'
import { Users, Plus, Minus } from 'lucide-react'
import { Table, Order } from '@/types/pos'

interface TableManagementProps {
  tables: Table[]
  setTables: (tables: Table[]) => void
  orders: Order[]
  setSelectedTable: (tableId: string | null) => void
  onTableSelect: (tableId: string) => void
}

export default function TableManagement({
  tables,
  setTables,
  orders,
  onTableSelect,
}: TableManagementProps) {
  const tablesWithOrders = useMemo(() => {
    return tables.map((table) => {
      const order = orders.find((o) => o.tableId === table.id && o.status !== 'completed' && o.status !== 'cancelled')
      return {
        ...table,
        currentOrder: order,
      }
    })
  }, [tables, orders])

  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      // Make table occupied and create order
      const newOrderId = `order- DZD{Date.now()}`
      setTables(
        tables.map((t) =>
          t.id === table.id
            ? { ...t, status: 'occupied' as const, currentOrderId: newOrderId }
            : t
        )
      )
      onTableSelect(table.id)
    } else if (table.status === 'occupied') {
      // Open checkout for existing order
      onTableSelect(table.id)
    }
  }

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = useMemo(() => {
    return {
      available: tables.filter((t) => t.status === 'available').length,
      occupied: tables.filter((t) => t.status === 'occupied').length,
      reserved: tables.filter((t) => t.status === 'reserved').length,
      total: tables.length,
    }
  }, [tables])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Table Management</h2>
          <p className="text-gray-500">Manage restaurant tables and seating</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-700">{stats.available}</p>
            </div>
            <div className="w-8 h-8 bg-green-200 rounded-full" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Occupied</p>
              <p className="text-2xl font-bold text-red-700">{stats.occupied}</p>
            </div>
            <div className="w-8 h-8 bg-red-200 rounded-full" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Reserved</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.reserved}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tablesWithOrders.map((table) => {
          const hasOrder = table.currentOrder !== undefined
          const orderTotal = table.currentOrder?.total || 0
          const itemCount = table.currentOrder?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`bg-white rounded-lg shadow p-6 border-2 transition-all hover:scale-105  DZD{
                table.status === 'occupied'
                  ? 'border-red-300'
                  : table.status === 'available'
                  ? 'border-green-300 hover:border-green-400'
                  : 'border-yellow-300'
              }`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className={`w-6 h-6  DZD{table.status === 'occupied' ? 'text-red-600' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Table {table.number}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Capacity: {table.capacity} guests
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium border  DZD{getStatusColor(
                    table.status
                  )}`}
                >
                  {table.status}
                </span>

                {hasOrder && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                       DZD{orderTotal.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">{itemCount} items</p>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Table Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded-full" />
            <span className="text-sm text-gray-600">Available - Ready for customers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded-full" />
            <span className="text-sm text-gray-600">Occupied - Currently in use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded-full" />
            <span className="text-sm text-gray-600">Reserved - Booked in advance</span>
          </div>
        </div>
      </div>
    </div>
  )
}




