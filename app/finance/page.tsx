'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, BarChart3, Wallet, PiggyBank, AlertTriangle } from 'lucide-react'

type TabType = 'dashboard' | 'accounts' | 'transactions' | 'budgets' | 'reports'

interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'investment' | 'credit'
  balance: number
  currency: string
  bank?: string
  accountNumber?: string
  status: 'active' | 'closed'
}

interface Transaction {
  id: string
  accountId: string
  accountName: string
  type: 'income' | 'expense' | 'transfer'
  category: string
  description: string
  amount: number
  date: Date
  paymentMethod: 'cash' | 'card' | 'transfer' | 'check'
  status: 'completed' | 'pending' | 'cancelled'
  tags?: string[]
}

interface Budget {
  id: string
  name: string
  category: string
  amount: number
  spent: number
  period: 'monthly' | 'quarterly' | 'yearly'
  startDate: Date
  endDate: Date
  status: 'active' | 'completed' | 'over_budget'
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    const savedAccounts = localStorage.getItem('finance-accounts')
    const savedTransactions = localStorage.getItem('finance-transactions')
    const savedBudgets = localStorage.getItem('finance-budgets')

    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts))
    } else {
      const sample: Account[] = [
        {
          id: '1',
          name: 'Compte Courant Principal',
          type: 'checking',
          balance: 12500.50,
          currency: 'EUR',
          bank: 'Bank of Algeria',
          accountNumber: '1234 5678 9012 3456',
          status: 'active',
        },
        {
          id: '2',
          name: 'Épargne',
          type: 'savings',
          balance: 45000.00,
          currency: 'EUR',
          bank: 'Bank of Algeria',
          accountNumber: '9876 5432 1098 7654',
          status: 'active',
        },
        {
          id: '3',
          name: 'Carte de Crédit',
          type: 'credit',
          balance: -850.25,
          currency: 'EUR',
          bank: 'Credit Bank',
          accountNumber: '**** **** **** 7890',
          status: 'active',
        },
      ]
      setAccounts(sample)
      localStorage.setItem('finance-accounts', JSON.stringify(sample))
    }

    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions)
      setTransactions(parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })))
    } else {
      const today = new Date()
      const sample: Transaction[] = [
        {
          id: '1',
          accountId: '1',
          accountName: 'Compte Courant Principal',
          type: 'income',
          category: 'Salaire',
          description: 'Salaire mensuel',
          amount: 5000.00,
          date: new Date(today.getFullYear(), today.getMonth(), 1),
          paymentMethod: 'transfer',
          status: 'completed',
          tags: ['salaire', 'mensuel'],
        },
        {
          id: '2',
          accountId: '1',
          accountName: 'Compte Courant Principal',
          type: 'expense',
          category: 'Loyer',
          description: 'Loyer appartement',
          amount: -800.00,
          date: new Date(today.getFullYear(), today.getMonth(), 5),
          paymentMethod: 'transfer',
          status: 'completed',
          tags: ['loyer', 'habitation'],
        },
        {
          id: '3',
          accountId: '3',
          accountName: 'Carte de Crédit',
          type: 'expense',
          category: 'Épicerie',
          description: 'Courses supermarché',
          amount: -125.50,
          date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          paymentMethod: 'card',
          status: 'completed',
          tags: ['épicerie', 'courses'],
        },
      ]
      setTransactions(sample)
      localStorage.setItem('finance-transactions', JSON.stringify(sample))
    }

    if (savedBudgets) {
      const parsed = JSON.parse(savedBudgets)
      setBudgets(parsed.map((b: any) => ({
        ...b,
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
      })))
    } else {
      const today = new Date()
      const sample: Budget[] = [
        {
          id: '1',
          name: 'Budget Alimentaire Mensuel',
          category: 'Alimentation',
          amount: 600,
          spent: 425.50,
          period: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth(), 1),
          endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          status: 'active',
        },
        {
          id: '2',
          name: 'Budget Transport Mensuel',
          category: 'Transport',
          amount: 300,
          spent: 285.00,
          period: 'monthly',
          startDate: new Date(today.getFullYear(), today.getMonth(), 1),
          endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
          status: 'active',
        },
      ]
      setBudgets(sample)
      localStorage.setItem('finance-budgets', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (accounts.length > 0) localStorage.setItem('finance-accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem('finance-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    if (budgets.length > 0) localStorage.setItem('finance-budgets', JSON.stringify(budgets))
  }, [budgets])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'accounts' as TabType, label: 'Comptes', icon: Wallet },
    { id: 'transactions' as TabType, label: 'Transactions', icon: CreditCard },
    { id: 'budgets' as TabType, label: 'Budgets', icon: PiggyBank },
    { id: 'reports' as TabType, label: 'Rapports', icon: TrendingUp },
  ]

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))
  const activeBudgets = budgets.filter(b => b.status === 'active').length
  const overBudget = budgets.filter(b => b.spent > b.amount).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Solde Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-2">€{totalIncome.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dépenses</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 mt-2">€{totalExpenses.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Budgets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeBudgets}</p>
                    {overBudget > 0 && (
                      <p className="text-xs text-red-600 mt-1">{overBudget} dépassés</p>
                    )}
                  </div>
                  <PiggyBank className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {overBudget > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Budgets dépassés ({overBudget})
                </h3>
                <div className="space-y-2">
                  {budgets.filter(b => b.spent > b.amount).slice(0, 3).map((budget) => (
                    <div key={budget.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{budget.name}</span>
                      <span className="font-semibold text-red-700 mt-1 sm:mt-0">
                        €{budget.spent.toFixed(2)} / €{budget.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Multi-Comptes</h3>
                  <p className="text-sm text-gray-600">Suivi de plusieurs comptes bancaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Transactions</h3>
                  <p className="text-sm text-gray-600">Enregistrement et catégorisation des transactions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Budgets</h3>
                  <p className="text-sm text-gray-600">Création et suivi des budgets par catégorie</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Graphiques</h3>
                  <p className="text-sm text-gray-600">Visualisations des revenus et dépenses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Analyses financières détaillées</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes Budget</h3>
                  <p className="text-sm text-gray-600">Notifications de dépassement de budget</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Comptes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Compte
              </button>
            </div>
            {accounts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun compte enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {accounts.map((account) => (
                  <div key={account.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{account.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.status === 'active' ? 'Actif' : 'Fermé'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Type:</span>
                        <span className="text-xs font-medium text-gray-700 capitalize">
                          {account.type === 'checking' ? 'Courant' :
                           account.type === 'savings' ? 'Épargne' :
                           account.type === 'investment' ? 'Investissement' : 'Crédit'}
                        </span>
                      </div>
                      {account.bank && (
                        <p className="text-sm text-gray-600">🏦 {account.bank}</p>
                      )}
                      {account.accountNumber && (
                        <p className="text-xs text-gray-500 font-mono">{account.accountNumber}</p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Solde:</span>
                        <span className={`text-xl font-bold ${
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {account.balance >= 0 ? '+' : ''}€{Math.abs(account.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{account.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Transactions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouvelle Transaction
              </button>
            </div>
            {transactions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune transaction</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((transaction) => (
                    <div key={transaction.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                          <p className="text-sm text-gray-600 mt-1">{transaction.category}</p>
                          <p className="text-xs text-gray-500 mt-1">📁 {transaction.accountName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            📅 {new Date(transaction.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-lg font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Complétée' :
                             transaction.status === 'pending' ? 'En attente' : 'Annulée'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="capitalize">
                          {transaction.paymentMethod === 'cash' ? '💵 Espèces' :
                           transaction.paymentMethod === 'card' ? '💳 Carte' :
                           transaction.paymentMethod === 'transfer' ? '🏦 Virement' : '📝 Chèque'}
                        </span>
                        {transaction.tags && transaction.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {transaction.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Budgets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Nouveau Budget
              </button>
            </div>
            {budgets.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun budget défini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const usage = (budget.spent / budget.amount) * 100
                  const remaining = budget.amount - budget.spent
                  return (
                    <div key={budget.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{budget.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{budget.category}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(budget.startDate).toLocaleDateString('fr-FR')} - {new Date(budget.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          budget.status === 'over_budget' ? 'bg-red-100 text-red-800' :
                          budget.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {budget.status === 'over_budget' ? 'Dépassé' :
                           budget.status === 'completed' ? 'Terminé' : 'Actif'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Budget utilisé</span>
                            <span className={`text-xs font-medium ${
                              usage > 100 ? 'text-red-600' :
                              usage > 80 ? 'text-yellow-600' : 'text-gray-700'
                            }`}>
                              €{budget.spent.toFixed(2)} / €{budget.amount.toFixed(2)} ({usage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                usage > 100 ? 'bg-red-500' :
                                usage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usage, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Reste:</span>
                          <span className={`font-bold ${
                            remaining < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            €{remaining.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="capitalize">
                            Période: {budget.period === 'monthly' ? 'Mensuelle' :
                                     budget.period === 'quarterly' ? 'Trimestrielle' : 'Annuelle'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports Financiers</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-center">Module de rapports en cours de développement</p>
              <p className="text-sm text-gray-500 text-center mt-2">Visualisations graphiques des revenus et dépenses par catégorie</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}