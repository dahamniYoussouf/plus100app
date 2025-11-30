'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Play, Pause, Settings, Zap, Activity } from 'lucide-react'
import { MenuItem, Order, Table, OrderItem } from '@/types/pos'

interface AutomationAgentProps {
  menuItems: MenuItem[]
  orders: Order[]
  setOrders: (orders: Order[]) => void
  tables: Table[]
  setTables: (tables: Table[]) => void
}

export default function AutomationAgent({
  menuItems,
  orders,
  setOrders,
  tables,
  setTables,
}: AutomationAgentProps) {
  const [isActive, setIsActive] = useState(false)
  const [speed, setSpeed] = useState(5000) // Interval en millisecondes
  const [autoCheckout, setAutoCheckout] = useState(true)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        simulateActivity()
      }, speed)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, speed])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setActivityLog((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20))
  }

  const simulateActivity = () => {
    const availableTables = tables.filter((t) => t.status === 'available')
    const pendingOrders = orders.filter((o) => o.status === 'pending')
    const preparingOrders = orders.filter((o) => o.status === 'preparing')
    const readyOrders = orders.filter((o) => o.status === 'ready')
    const servedOrders = orders.filter((o) => o.status === 'served' && o.paymentStatus === 'unpaid')

    // 1. Créer une nouvelle commande si des tables sont disponibles
    if (availableTables.length > 0 && Math.random() > 0.4) {
      const randomTable = availableTables[Math.floor(Math.random() * availableTables.length)]
      const availableMenuItems = menuItems.filter((item) => item.available)
      
      if (availableMenuItems.length > 0) {
        const itemCount = Math.floor(Math.random() * 3) + 1 // 1-3 items
        const selectedItems: OrderItem[] = []
        
        for (let i = 0; i < itemCount; i++) {
          const randomItem = availableMenuItems[Math.floor(Math.random() * availableMenuItems.length)]
          const existingOrderItem = selectedItems.find((oi) => oi.menuItemId === randomItem.id)
          
          if (existingOrderItem) {
            existingOrderItem.quantity += 1
          } else {
            selectedItems.push({
              id: `item-${Date.now()}-${Math.random()}`,
              menuItemId: randomItem.id,
              name: randomItem.name,
              price: randomItem.price,
              quantity: 1,
            })
          }
        }

        const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const newOrder: Order = {
          id: `order-${Date.now()}`,
          tableId: randomTable.id,
          items: selectedItems,
          status: 'pending',
          total,
          createdAt: new Date(),
          paymentStatus: 'unpaid',
        }

        setOrders([...orders, newOrder])
        setTables(
          tables.map((t) =>
            t.id === randomTable.id
              ? { ...t, status: 'occupied' as const, currentOrderId: newOrder.id }
              : t
          )
        )
        addLog(`🆕 Nouvelle commande créée - Table ${randomTable.number} (${itemCount} items, $${total.toFixed(2)})`)
      }
    }

    // 2. Progression automatique des statuts de commande
    // Pending → Preparing
    if (pendingOrders.length > 0 && Math.random() > 0.3) {
      const orderToUpdate = pendingOrders[Math.floor(Math.random() * pendingOrders.length)]
      setOrders(
        orders.map((o) =>
          o.id === orderToUpdate.id ? { ...o, status: 'preparing' } : o
        )
      )
      const tableNum = tables.find((t) => t.id === orderToUpdate.tableId)?.number || 0
      addLog(`👨‍🍳 Commande Table ${tableNum} en préparation`)
    }

    // Preparing → Ready
    if (preparingOrders.length > 0 && Math.random() > 0.3) {
      const orderToUpdate = preparingOrders[Math.floor(Math.random() * preparingOrders.length)]
      setOrders(
        orders.map((o) =>
          o.id === orderToUpdate.id ? { ...o, status: 'ready' } : o
        )
      )
      const tableNum = tables.find((t) => t.id === orderToUpdate.tableId)?.number || 0
      addLog(`✅ Commande Table ${tableNum} prête à servir`)
    }

    // Ready → Served
    if (readyOrders.length > 0 && Math.random() > 0.3) {
      const orderToUpdate = readyOrders[Math.floor(Math.random() * readyOrders.length)]
      setOrders(
        orders.map((o) =>
          o.id === orderToUpdate.id ? { ...o, status: 'served' } : o
        )
      )
      const tableNum = tables.find((t) => t.id === orderToUpdate.tableId)?.number || 0
      addLog(`🍽️ Commande Table ${tableNum} servie`)
    }

    // 3. Paiement automatique et libération de table
    if (autoCheckout && servedOrders.length > 0 && Math.random() > 0.4) {
      const orderToCheckout = servedOrders[Math.floor(Math.random() * servedOrders.length)]
      const paymentMethods: ('cash' | 'card' | 'digital')[] = ['cash', 'card', 'digital']
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]

      const updatedOrder: Order = {
        ...orderToCheckout,
        paymentStatus: 'paid',
        paymentMethod: randomPaymentMethod,
        status: 'completed',
        completedAt: new Date(),
      }

      setOrders(orders.map((o) => (o.id === orderToCheckout.id ? updatedOrder : o)))
      setTables(
        tables.map((t) =>
          t.id === orderToCheckout.tableId
            ? { ...t, status: 'available' as const, currentOrderId: undefined }
            : t
        )
      )
      const tableNum = tables.find((t) => t.id === orderToCheckout.tableId)?.number || 0
      addLog(`💳 Table ${tableNum} payée (${randomPaymentMethod}) - $${orderToCheckout.total.toFixed(2)} - Table libérée`)
    }
  }

  const toggleAutomation = () => {
    setIsActive(!isActive)
    if (!isActive) {
      addLog('🚀 Agent d\'automatisation activé')
    } else {
      addLog('⏸️ Agent d\'automatisation désactivé')
    }
  }

  const clearLogs = () => {
    setActivityLog([])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">Agent d'Automatisation</h3>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleAutomation}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Arrêter
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Démarrer
                </>
              )}
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
            >
              Effacer
            </button>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Vitesse:</span>
              <span className="font-medium text-gray-900">{speed / 1000}s</span>
            </label>
            <input
              type="range"
              min="2000"
              max="10000"
              step="1000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full"
              disabled={isActive}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Rapide (2s)</span>
              <span>Normal (5s)</span>
              <span>Lent (10s)</span>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoCheckout}
              onChange={(e) => setAutoCheckout(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Paiement automatique</span>
          </label>
        </div>

        {/* Activity Log */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-sm text-gray-700">Journal d'Activité</h4>
          </div>
          <div className="space-y-1">
            {activityLog.length > 0 ? (
              activityLog.map((log, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 p-2 bg-white rounded border border-gray-200"
                >
                  {log}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                L'agent n'a pas encore d'activité
              </p>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="p-3 bg-gray-100 border-t border-gray-200 rounded-b-lg">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-gray-900">
                {orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length}
              </div>
              <div className="text-gray-500">Commandes actives</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {tables.filter((t) => t.status === 'occupied').length}
              </div>
              <div className="text-gray-500">Tables occupées</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {orders.filter((o) => o.paymentStatus === 'paid' && o.completedAt && new Date(o.completedAt).toDateString() === new Date().toDateString()).length}
              </div>
              <div className="text-gray-500">Payées aujourd'hui</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

