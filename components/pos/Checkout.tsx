'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, CreditCard, DollarSign, Receipt } from 'lucide-react'
import { MenuItem, Order, OrderItem, Table } from '@/types/pos'

interface CheckoutProps {
  selectedTable: string | null
  setSelectedTable: (tableId: string | null) => void
  menuItems: MenuItem[]
  orders: Order[]
  setOrders: (orders: Order[]) => void
  tables: Table[]
  setTables: (tables: Table[]) => void
}

export default function Checkout({
  selectedTable,
  setSelectedTable,
  menuItems,
  orders,
  setOrders,
  tables,
  setTables,
}: CheckoutProps) {
  const [cart, setCart] = useState<OrderItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item) => item.category)))
    return cats
  }, [menuItems])

  const availableItems = useMemo(() => {
    let filtered = menuItems.filter((item) => item.available)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }
    return filtered
  }, [menuItems, selectedCategory])

  const currentTable = tables.find((t) => t.id === selectedTable)
  const existingOrder = orders.find(
    (o) => o.tableId === selectedTable && o.status !== 'completed' && o.status !== 'cancelled'
  )

  // Load existing order into cart if exists
  useEffect(() => {
    if (existingOrder && cart.length === 0) {
      setCart(existingOrder.items)
    }
  }, [existingOrder])

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find((item) => item.menuItemId === menuItem.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      const newItem: OrderItem = {
        id: `item- DZD{Date.now()}- DZD{Math.random()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      }
      setCart([...cart, newItem])
    }
  }

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + delta
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
          }
          return item
        })
        .filter((item): item is OrderItem => item !== null)
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const handlePlaceOrder = () => {
    if (!selectedTable || cart.length === 0) {
      alert('Please select a table and add items to cart')
      return
    }

    const order: Order = {
      id: existingOrder?.id || `order- DZD{Date.now()}`,
      tableId: selectedTable,
      items: cart,
      status: existingOrder?.status || 'pending',
      total: cartTotal,
      createdAt: existingOrder?.createdAt || new Date(),
      paymentStatus: 'unpaid',
    }

    if (existingOrder) {
      setOrders(orders.map((o) => (o.id === existingOrder.id ? order : o)))
    } else {
      setOrders([...orders, order])
      setTables(
        tables.map((t) =>
          t.id === selectedTable
            ? { ...t, status: 'occupied' as const, currentOrderId: order.id }
            : t
        )
      )
    }

    setCart([])
    alert('Order placed successfully!')
  }

  const handleCheckout = () => {
    if (!existingOrder || existingOrder.paymentStatus === 'paid') {
      alert('No unpaid order found')
      return
    }

    setShowPaymentModal(true)
  }

  const processPayment = () => {
    if (!existingOrder) return

    const updatedOrder: Order = {
      ...existingOrder,
      paymentStatus: 'paid',
      paymentMethod: paymentMethod,
      status: 'completed',
      completedAt: new Date(),
    }

    setOrders(orders.map((o) => (o.id === existingOrder.id ? updatedOrder : o)))

    // Free up the table
    setTables(
      tables.map((t) =>
        t.id === selectedTable
          ? { ...t, status: 'available' as const, currentOrderId: undefined }
          : t
      )
    )

    setShowPaymentModal(false)
    setSelectedTable(null)
    setCart([])
    alert('Payment processed successfully!')
  }

  if (!selectedTable) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Table Selected</h3>
        <p className="text-gray-500">Please select a table from the Tables tab to start an order</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Selection */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Table {currentTable?.number || selectedTable.replace('table-', '')}
            </h2>
            <button
              onClick={() => {
                setSelectedTable(null)
                setCart([])
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change Table
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors  DZD{
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors  DZD{
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                <p className="text-lg font-bold text-blue-600"> DZD{item.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                         DZD{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 rounded ml-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900"> DZD{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600"> DZD{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {existingOrder ? 'Update Order' : 'Place Order'}
                </button>
                {existingOrder && existingOrder.paymentStatus === 'unpaid' && (
                  <button
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-5 h-5" />
                    Checkout
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Process Payment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Total</p>
                <p className="text-2xl font-bold text-gray-900">
                   DZD{existingOrder?.total.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center gap-2  DZD{
                      paymentMethod === 'cash'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="w-6 h-6" />
                    <span className="text-sm font-medium">Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center gap-2  DZD{
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-medium">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('digital')}
                    className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center gap-2  DZD{
                      paymentMethod === 'digital'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Receipt className="w-6 h-6" />
                    <span className="text-sm font-medium">Digital</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

