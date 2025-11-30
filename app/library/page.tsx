'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Users, Calendar, Book, BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react'

type TabType = 'dashboard' | 'books' | 'members' | 'loans'

interface BookItem {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  publishedYear: number
  totalCopies: number
  availableCopies: number
  status: 'available' | 'borrowed' | 'reserved'
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  membershipType: 'student' | 'regular' | 'premium'
  joinDate: Date
  activeLoans: number
  maxLoans: number
}

interface Loan {
  id: string
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  borrowDate: Date
  dueDate: Date
  returnDate?: Date
  status: 'active' | 'returned' | 'overdue'
  fine?: number
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [books, setBooks] = useState<BookItem[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loans, setLoans] = useState<Loan[]>([])

  useEffect(() => {
    const savedBooks = localStorage.getItem('library-books')
    const savedMembers = localStorage.getItem('library-members')
    const savedLoans = localStorage.getItem('library-loans')

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks))
    } else {
      const sample: BookItem[] = [
        {
          id: '1',
          title: 'Les Misérables',
          author: 'Victor Hugo',
          isbn: '978-2-07-040632-5',
          category: 'Littérature',
          publishedYear: 1862,
          totalCopies: 5,
          availableCopies: 3,
          status: 'available',
        },
        {
          id: '2',
          title: 'Le Petit Prince',
          author: 'Antoine de Saint-Exupéry',
          isbn: '978-2-07-061275-8',
          category: 'Littérature',
          publishedYear: 1943,
          totalCopies: 10,
          availableCopies: 7,
          status: 'available',
        },
        {
          id: '3',
          title: 'Introduction à la Programmation',
          author: 'John Doe',
          isbn: '978-1-23-456789-0',
          category: 'Informatique',
          publishedYear: 2020,
          totalCopies: 3,
          availableCopies: 1,
          status: 'available',
        },
      ]
      setBooks(sample)
      localStorage.setItem('library-books', JSON.stringify(sample))
    }

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({
        ...m,
        joinDate: new Date(m.joinDate),
      })))
    } else {
      const sample: Member[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          membershipType: 'student',
          joinDate: new Date('2024-01-01'),
          activeLoans: 2,
          maxLoans: 5,
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          membershipType: 'premium',
          joinDate: new Date('2023-06-15'),
          activeLoans: 1,
          maxLoans: 10,
        },
      ]
      setMembers(sample)
      localStorage.setItem('library-members', JSON.stringify(sample))
    }

    if (savedLoans) {
      const parsed = JSON.parse(savedLoans)
      setLoans(parsed.map((l: any) => ({
        ...l,
        borrowDate: new Date(l.borrowDate),
        dueDate: new Date(l.dueDate),
        returnDate: l.returnDate ? new Date(l.returnDate) : undefined,
      })))
    } else {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 14)
      const sample: Loan[] = [
        {
          id: '1',
          bookId: '1',
          bookTitle: 'Les Misérables',
          memberId: '1',
          memberName: 'Ahmed Benali',
          borrowDate: today,
          dueDate: dueDate,
          status: 'active',
        },
      ]
      setLoans(sample)
      localStorage.setItem('library-loans', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (books.length > 0) localStorage.setItem('library-books', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('library-members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    if (loans.length > 0) localStorage.setItem('library-loans', JSON.stringify(loans))
  }, [loans])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'books' as TabType, label: 'Livres', icon: Book },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
    { id: 'loans' as TabType, label: 'Emprunts', icon: Calendar },
  ]

  const activeLoans = loans.filter(l => l.status === 'active').length
  const overdueLoans = loans.filter(l => {
    if (l.status !== 'active') return false
    return new Date(l.dueDate) < new Date()
  }).length
  const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0)
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
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
                      ? 'text-teal-600 border-b-2 border-teal-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Livres</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{books.length}</p>
                  </div>
                  <Book className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableBooks}/{totalBooks}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Emprunts</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeLoans}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En Retard</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{overdueLoans}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {overdueLoans > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3">⚠️ Emprunts en retard</h3>
                <div className="space-y-2">
                  {loans.filter(l => {
                    if (l.status !== 'active') return false
                    return new Date(l.dueDate) < new Date()
                  }).slice(0, 3).map((loan) => (
                    <div key={loan.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{loan.bookTitle}</span>
                      <span className="text-gray-500 mt-1 sm:mt-0">Emprunté par {loan.memberName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Catalogue de Livres</h3>
                  <p className="text-sm text-gray-600">Gestion complète du catalogue avec recherche</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Membres</h3>
                  <p className="text-sm text-gray-600">Inscription et suivi des membres</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Emprunts</h3>
                  <p className="text-sm text-gray-600">Gestion des prêts et retours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Système de réservation de livres</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Amendes</h3>
                  <p className="text-sm text-gray-600">Gestion des retards et amendes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Livres</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Ajouter Livre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Auteur: {book.author}</p>
                  <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Disponibilité</p>
                      <p className="font-bold text-gray-900">{book.availableCopies}/{book.totalCopies}</p>
                    </div>
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">
                      {book.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouveau Membre
              </button>
            </div>
            {members.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun membre enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{member.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{member.phone}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Emprunts</p>
                        <p className="font-bold text-gray-900">{member.activeLoans}/{member.maxLoans}</p>
                      </div>
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs capitalize">
                        {member.membershipType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Emprunts</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouvel Emprunt
              </button>
            </div>
            {loans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun emprunt enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {loans.map((loan) => {
                  const isOverdue = loan.status === 'active' && new Date(loan.dueDate) < new Date()
                  return (
                    <div key={loan.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{loan.bookTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">Emprunté par {loan.memberName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Emprunté le {new Date(loan.borrowDate).toLocaleDateString('fr-FR')}
                          </p>
                          <p className={`text-sm mt-1 ${isOverdue ? 'text-red-700 font-semibold' : 'text-gray-500'}`}>
                            Date limite: {new Date(loan.dueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          loan.status === 'returned' ? 'bg-green-100 text-green-800' :
                          isOverdue ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {loan.status === 'returned' ? 'Retourné' :
                           isOverdue ? 'En retard' : 'Actif'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}