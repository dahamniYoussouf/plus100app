'use client'

import { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, FileText, BarChart3, Receipt, CreditCard, Building2 } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'transactions' | 'invoices' | 'reports' | 'clients'

interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  account: string
  status: 'pending' | 'completed' | 'cancelled'
}

interface Invoice {
  id: string
  clientId: string
  clientName: string
  date: Date
  dueDate: Date
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  items: { description: string; quantity: number; price: number }[]
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  totalInvoiced: number
  totalPaid: number
  balance: number
}

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [showClientModal, setShowClientModal] = useState(false)

  useEffect(() => {
    const savedTransactions = localStorage.getItem('accounting-transactions')
    const savedInvoices = localStorage.getItem('accounting-invoices')
    const savedClients = localStorage.getItem('accounting-clients')

    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions)
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })))
    } else {
      const today = new Date()
      const sample: Transaction[] = [
        { id: '1', date: today, description: 'Vente produit A', amount: 1500, type: 'income', category: 'Ventes', account: 'Compte Principal', status: 'completed' },
        { id: '2', date: today, description: 'Paiement fournisseur', amount: 800, type: 'expense', category: 'Achats', account: 'Compte Principal', status: 'completed' },
        { id: '3', date: today, description: 'Salaire employé', amount: 1200, type: 'expense', category: 'Personnel', account: 'Compte Principal', status: 'pending' },
      ]
      setTransactions(sample)
      localStorage.setItem('accounting-transactions', JSON.stringify(sample))
    }

    if (savedInvoices) {
      const parsed = JSON.parse(savedInvoices)
      setInvoices(parsed.map((i: any) => ({ ...i, date: new Date(i.date), dueDate: new Date(i.dueDate) })))
    } else {
      const today = new Date()
      const sample: Invoice[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Entreprise ABC',
          date: today,
          dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
          amount: 5000,
          status: 'sent',
          items: [{ description: 'Services conseil', quantity: 10, price: 500 }],
        },
      ]
      setInvoices(sample)
      localStorage.setItem('accounting-invoices', JSON.stringify(sample))
    }

    if (savedClients) {
      setClients(JSON.parse(savedClients))
    } else {
      const sample: Client[] = [
        { id: '1', name: 'Entreprise ABC', email: 'contact@abc.com', phone: '+213 555 1234', company: 'ABC Corp', totalInvoiced: 5000, totalPaid: 3000, balance: 2000 },
        { id: '2', name: 'Société XYZ', email: 'info@xyz.com', phone: '+213 555 5678', company: 'XYZ Ltd', totalInvoiced: 8000, totalPaid: 8000, balance: 0 },
      ]
      setClients(sample)
      localStorage.setItem('accounting-clients', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem('accounting-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (invoices.length > 0) localStorage.setItem('accounting-invoices', JSON.stringify(invoices))
  }, [invoices])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('accounting-clients', JSON.stringify(clients))
  }, [clients])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Receipt },
    { id: 'invoices' as TabType, label: 'Factures', icon: FileText },
    { id: 'reports' as TabType, label: 'Rapports', icon: TrendingUp },
    { id: 'clients' as TabType, label: 'Clients', icon: Building2 },
  ]

  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const profit = totalIncome - totalExpenses
  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length
  const totalPending = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      ? 'text-blue-600 border-b-2 border-blue-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalIncome.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dépenses</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalExpenses.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 rotate-180" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéfice</p>
                    <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-2 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      DZD{profit.toFixed(0)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Factures en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingInvoices}</p>
                    <p className="text-xs text-gray-500 mt-1">DZD{totalPending.toFixed(0)}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Transactions Récentes</h2>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('fr-FR')} • {transaction.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}DZD{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transactions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle Transaction
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{transaction.category}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'income' ? 'Revenu' : 'Dépense'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm font-bold text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'}DZD{transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Complété' : transaction.status === 'pending' ? 'En attente' : 'Annulé'}
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

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Factures</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle Facture
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Facture #{invoice.id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{invoice.clientName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Envoyée' : invoice.status === 'overdue' ? 'En retard' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Échéance:</span>
                      <span className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-blue-600">DZD{invoice.amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports Financiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Résumé Mensuel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus totaux</span>
                    <span className="font-bold text-green-600">DZD{totalIncome.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dépenses totales</span>
                    <span className="font-bold text-red-600">DZD{totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Bénéfice net</span>
                    <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      DZD{profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transactions</span>
                    <span className="font-bold text-gray-900">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Factures</span>
                    <span className="font-bold text-gray-900">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clients</span>
                    <span className="font-bold text-gray-900">{clients.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button 
                onClick={() => setShowClientModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau Client
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                  {client.company && <p className="text-sm text-gray-600 mb-1">{client.company}</p>}
                  <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{client.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Facturé:</span>
                      <span className="font-medium text-gray-900">DZD{client.totalInvoiced.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payé:</span>
                      <span className="font-medium text-green-600">DZD{client.totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Solde:</span>
                      <span className={`font-bold ${client.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        DZD{client.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        title="Nouveau Client"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Fonctionnalité en cours de développement. Cette fonctionnalité permettra d'ajouter un nouveau client.</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowClientModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
