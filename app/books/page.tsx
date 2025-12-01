'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Book, BookOpen, Users, ShoppingCart, BarChart3, Search, Star, Tag } from 'lucide-react'

type TabType = 'dashboard' | 'catalog' | 'sales' | 'customers' | 'inventory'

interface BookItem {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  price: number
  stock: number
  sold: number
  rating: number
  publishedYear: number
}

interface Sale {
  id: string
  customerId: string
  customerName: string
  date: Date
  items: { bookId: string; bookTitle: string; quantity: number; price: number }[]
  total: number
  status: 'completed' | 'pending' | 'cancelled'
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalPurchases: number
  totalSpent: number
  favoriteCategory?: string
}

export default function BooksPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [books, setBooks] = useState<BookItem[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showLivreModal, setShowLivreModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '', price: 0, stock: 0, publishedYear: new Date().getFullYear() })
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', favoriteCategory: '' })

  useEffect(() => {
    const savedBooks = localStorage.getItem('books-catalog')
    const savedSales = localStorage.getItem('books-sales')
    const savedCustomers = localStorage.getItem('books-customers')

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks))
    } else {
      const sample: BookItem[] = [
        { id: '1', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry', isbn: '978-2070612758', category: 'Littérature', price: 8.50, stock: 45, sold: 120, rating: 4.8, publishedYear: 1943 },
        { id: '2', title: 'L\'Étranger', author: 'Albert Camus', isbn: '978-2070360024', category: 'Littérature', price: 7.20, stock: 32, sold: 89, rating: 4.6, publishedYear: 1942 },
        { id: '3', title: 'Harry Potter Tome 1', author: 'J.K. Rowling', isbn: '978-2070541200', category: 'Fantasy', price: 12.90, stock: 28, sold: 234, rating: 4.9, publishedYear: 1997 },
        { id: '4', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', isbn: '978-2267025071', category: 'Fantasy', price: 15.50, stock: 15, sold: 156, rating: 4.7, publishedYear: 1954 },
        { id: '5', title: '1984', author: 'George Orwell', isbn: '978-2070368228', category: 'Science-Fiction', price: 9.90, stock: 38, sold: 98, rating: 4.5, publishedYear: 1949 },
      ]
      setBooks(sample)
      localStorage.setItem('books-catalog', JSON.stringify(sample))
    }

    if (savedSales) {
      const parsed = JSON.parse(savedSales)
      setSales(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const today = new Date()
      const sample: Sale[] = [
        {
          id: '1',
          customerId: '1',
          customerName: 'Ahmed Benali',
          date: today,
          items: [{ bookId: '1', bookTitle: 'Le Petit Prince', quantity: 2, price: 8.50 }],
          total: 17.00,
          status: 'completed',
        },
        {
          id: '2',
          customerId: '2',
          customerName: 'Fatima Kadri',
          date: today,
          items: [{ bookId: '3', bookTitle: 'Harry Potter Tome 1', quantity: 1, price: 12.90 }],
          total: 12.90,
          status: 'completed',
        },
      ]
      setSales(sample)
      localStorage.setItem('books-sales', JSON.stringify(sample))
    }

    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers))
    } else {
      const sample: Customer[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', phone: '+213 555 1234', totalPurchases: 5, totalSpent: 45.50, favoriteCategory: 'Littérature' },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', phone: '+213 555 5678', totalPurchases: 3, totalSpent: 38.70, favoriteCategory: 'Fantasy' },
      ]
      setCustomers(sample)
      localStorage.setItem('books-customers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (books.length > 0) localStorage.setItem('books-catalog', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    if (sales.length > 0) localStorage.setItem('books-sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('books-customers', JSON.stringify(customers))
  }, [customers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'catalog' as TabType, label: 'Catalogue', icon: Book },
    { id: 'sales' as TabType, label: 'Ventes', icon: ShoppingCart },
    { id: 'customers' as TabType, label: 'Clients', icon: Users },
    { id: 'inventory' as TabType, label: 'Inventaire', icon: BookOpen },
  ]

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0)
  const totalBooks = books.reduce((sum, b) => sum + b.stock, 0)
  const totalSold = books.reduce((sum, b) => sum + b.sold, 0)
  const lowStock = books.filter(b => b.stock < 20).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
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
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue.toFixed(2)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Livres en stock</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalBooks}</p>
                  </div>
                  <Book className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Livres vendus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalSold}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stock faible</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{lowStock}</p>
                  </div>
                  <Tag className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Meilleures ventes</h3>
                <div className="space-y-3">
                  {books.sort((a, b) => b.sold - a.sold).slice(0, 5).map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{book.sold}</p>
                        <p className="text-xs text-gray-500">vendus</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ventes récentes</h3>
                <div className="space-y-3">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{sale.customerName}</p>
                        <p className="text-sm text-gray-500">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">DZD{sale.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{sale.items.length} livre(s)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Catalogue</h2>
              <button 
                onClick={() => setShowLivreModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ajouter un livre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">{book.category}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-600">{book.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ISBN:</span>
                      <span className="text-gray-900 font-mono text-xs">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-bold ${book.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>{book.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendus:</span>
                      <span className="font-bold text-gray-900">{book.sold}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Prix:</span>
                      <span className="font-bold text-red-600">DZD{book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouvelle vente
              </button>
            </div>
            <div className="space-y-4">
              {sales.map((sale) => (
                <div key={sale.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Vente #{sale.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sale.customerName}</p>
                      <p className="text-sm text-gray-500 mt-1">{new Date(sale.date).toLocaleDateString('fr-FR')}</p>
                      <div className="mt-3 space-y-1">
                        {sale.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.quantity}x {item.bookTitle} - DZD{item.price.toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                        sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status === 'completed' ? 'Complétée' : sale.status === 'pending' ? 'En attente' : 'Annulée'}
                      </span>
                      <span className="text-lg font-bold text-gray-900">DZD{sale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button 
                onClick={() => setShowClientModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Nouveau client
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {customers.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{customer.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{customer.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Achats:</span>
                      <span className="font-medium text-gray-900">{customer.totalPurchases}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total dépensé:</span>
                      <span className="font-medium text-green-600">DZD{customer.totalSpent.toFixed(2)}</span>
                    </div>
                    {customer.favoriteCategory && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Catégorie préférée:</span>
                        <span className="font-medium text-red-600">{customer.favoriteCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Inventaire</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auteur</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vendus</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{book.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{book.author}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{book.stock}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{book.sold}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">DZD{book.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            book.stock < 10 ? 'bg-red-100 text-red-800' :
                            book.stock < 20 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {book.stock < 10 ? 'Stock faible' : book.stock < 20 ? 'Stock moyen' : 'En stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showLivreModal}
        onClose={() => {
          setShowLivreModal(false)
          setNewBook({ title: '', author: '', isbn: '', category: '', price: 0, stock: 0, publishedYear: new Date().getFullYear() })
        }}
        title="Ajouter un livre"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Le Petit Prince"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
              <input
                type="text"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Antoine de Saint-Exupéry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input
                type="text"
                value={newBook.isbn}
                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 978-2070612758"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newBook.category}
                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Littérature"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
              <input
                type="number"
                value={newBook.price}
                onChange={(e) => setNewBook({ ...newBook, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="number"
                value={newBook.publishedYear}
                onChange={(e) => setNewBook({ ...newBook, publishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                max={new Date().getFullYear() + 1}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              value={newBook.stock}
              onChange={(e) => setNewBook({ ...newBook, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowLivreModal(false)
                setNewBook({ title: '', author: '', isbn: '', category: '', price: 0, stock: 0, publishedYear: new Date().getFullYear() })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newBook.title && newBook.author && newBook.isbn && newBook.category && newBook.price > 0) {
                  const book: BookItem = {
                    id: Date.now().toString(),
                    title: newBook.title,
                    author: newBook.author,
                    isbn: newBook.isbn,
                    category: newBook.category,
                    price: newBook.price,
                    stock: newBook.stock,
                    sold: 0,
                    rating: 0,
                    publishedYear: newBook.publishedYear,
                  }
                  setBooks([...books, book])
                  setShowLivreModal(false)
                  setNewBook({ title: '', author: '', isbn: '', category: '', price: 0, stock: 0, publishedYear: new Date().getFullYear() })
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false)
          setNewCustomer({ name: '', email: '', phone: '', favoriteCategory: '' })
        }}
        title="Nouveau client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie préférée (optionnel)</label>
            <input
              type="text"
              value={newCustomer.favoriteCategory}
              onChange={(e) => setNewCustomer({ ...newCustomer, favoriteCategory: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Littérature"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowClientModal(false)
                setNewCustomer({ name: '', email: '', phone: '', favoriteCategory: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newCustomer.name && newCustomer.email && newCustomer.phone) {
                  const customer: Customer = {
                    id: Date.now().toString(),
                    name: newCustomer.name,
                    email: newCustomer.email,
                    phone: newCustomer.phone,
                    totalPurchases: 0,
                    totalSpent: 0,
                    favoriteCategory: newCustomer.favoriteCategory || undefined,
                  }
                  setCustomers([...customers, customer])
                  setShowClientModal(false)
                  setNewCustomer({ name: '', email: '', phone: '', favoriteCategory: '' })
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
