'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Code, Key, Globe, BarChart3, FileText, Zap, Shield, Activity, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react'

type TabType = 'dashboard' | 'endpoints' | 'keys' | 'logs' | 'documentation'

interface Endpoint {
  id: string
  name: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  description?: string
  status: 'active' | 'deprecated' | 'maintenance'
  requests: number
  errors: number
  avgResponseTime: number
  lastUsed?: Date
}

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  rateLimit: number
  requestsUsed: number
  status: 'active' | 'revoked' | 'expired'
  createdAt: Date
  expiresAt?: Date
}

interface Log {
  id: string
  endpointId: string
  endpointName: string
  method: string
  statusCode: number
  responseTime: number
  timestamp: Date
  ipAddress: string
  userAgent?: string
}

export default function APIPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const savedEndpoints = localStorage.getItem('api-endpoints')
    const savedApiKeys = localStorage.getItem('api-keys')
    const savedLogs = localStorage.getItem('api-logs')

    if (savedEndpoints) {
      const parsed = JSON.parse(savedEndpoints)
      setEndpoints(parsed.map((e: any) => ({ ...e, lastUsed: e.lastUsed ? new Date(e.lastUsed) : undefined })))
    } else {
      const today = new Date()
      const sample: Endpoint[] = [
        { id: '1', name: 'Get Users', path: '/api/v1/users', method: 'GET', description: 'Récupère la liste des utilisateurs', status: 'active', requests: 1250, errors: 12, avgResponseTime: 45, lastUsed: today },
        { id: '2', name: 'Create User', path: '/api/v1/users', method: 'POST', description: 'Crée un nouvel utilisateur', status: 'active', requests: 320, errors: 5, avgResponseTime: 120, lastUsed: today },
        { id: '3', name: 'Get Products', path: '/api/v1/products', method: 'GET', description: 'Récupère la liste des produits', status: 'active', requests: 890, errors: 8, avgResponseTime: 38, lastUsed: today },
        { id: '4', name: 'Update Product', path: '/api/v1/products/:id', method: 'PUT', description: 'Met à jour un produit', status: 'deprecated', requests: 45, errors: 2, avgResponseTime: 95, lastUsed: today },
      ]
      setEndpoints(sample)
      localStorage.setItem('api-endpoints', JSON.stringify(sample))
    }

    if (savedApiKeys) {
      const parsed = JSON.parse(savedApiKeys)
      setApiKeys(parsed.map((k: any) => ({ ...k, createdAt: new Date(k.createdAt), expiresAt: k.expiresAt ? new Date(k.expiresAt) : undefined })))
    } else {
      const today = new Date()
      const sample: APIKey[] = [
        { id: '1', name: 'Production Key', key: 'sk_live_abc123...', permissions: ['read', 'write'], rateLimit: 10000, requestsUsed: 3250, status: 'active', createdAt: today },
        { id: '2', name: 'Development Key', key: 'sk_test_xyz789...', permissions: ['read'], rateLimit: 1000, requestsUsed: 450, status: 'active', createdAt: today },
        { id: '3', name: 'Legacy Key', key: 'sk_old_def456...', permissions: ['read', 'write'], rateLimit: 5000, requestsUsed: 0, status: 'revoked', createdAt: new Date('2023-01-15') },
      ]
      setApiKeys(sample)
      localStorage.setItem('api-keys', JSON.stringify(sample))
    }

    if (savedLogs) {
      const parsed = JSON.parse(savedLogs)
      setLogs(parsed.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp) })))
    } else {
      const today = new Date()
      const sample: Log[] = [
        { id: '1', endpointId: '1', endpointName: 'Get Users', method: 'GET', statusCode: 200, responseTime: 42, timestamp: today, ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0...' },
        { id: '2', endpointId: '2', endpointName: 'Create User', method: 'POST', statusCode: 201, responseTime: 118, timestamp: today, ipAddress: '192.168.1.2', userAgent: 'Mozilla/5.0...' },
        { id: '3', endpointId: '1', endpointName: 'Get Users', method: 'GET', statusCode: 500, responseTime: 1200, timestamp: today, ipAddress: '192.168.1.3', userAgent: 'Mozilla/5.0...' },
      ]
      setLogs(sample)
      localStorage.setItem('api-logs', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (endpoints.length > 0) localStorage.setItem('api-endpoints', JSON.stringify(endpoints))
  }, [endpoints])

  useEffect(() => {
    if (apiKeys.length > 0) localStorage.setItem('api-keys', JSON.stringify(apiKeys))
  }, [apiKeys])

  useEffect(() => {
    if (logs.length > 0) localStorage.setItem('api-logs', JSON.stringify(logs))
  }, [logs])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'endpoints' as TabType, label: 'Endpoints', icon: Code },
    { id: 'keys' as TabType, label: 'Clés API', icon: Key },
    { id: 'logs' as TabType, label: 'Logs', icon: FileText },
    { id: 'documentation' as TabType, label: 'Documentation', icon: Globe },
  ]

  const totalRequests = useMemo(() => endpoints.reduce((sum, e) => sum + e.requests, 0), [endpoints])
  const totalErrors = useMemo(() => endpoints.reduce((sum, e) => sum + e.errors, 0), [endpoints])
  const activeEndpoints = useMemo(() => endpoints.filter(e => e.status === 'active').length, [endpoints])
  const activeKeys = useMemo(() => apiKeys.filter(k => k.status === 'active').length, [apiKeys])
  const avgResponseTime = useMemo(() => endpoints.length > 0 ? Math.round(endpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / endpoints.length) : 0, [endpoints])
  const successRate = useMemo(() => totalRequests > 0 ? ((totalRequests - totalErrors) / totalRequests * 100).toFixed(1) : '100', [totalRequests, totalErrors])

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
                    <p className="text-xs sm:text-sm text-gray-600">Requêtes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalRequests.toLocaleString()}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-teal-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Taux de réussite</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{successRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Temps moyen</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{avgResponseTime}ms</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Endpoints</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeEndpoints}</p>
                  </div>
                  <Code className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Endpoints récents</h3>
                <div className="space-y-3">
                  {endpoints.slice(0, 5).map((endpoint) => (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <p className="font-medium text-gray-900 truncate text-sm">{endpoint.path}</p>
                        </div>
                        <p className="text-xs text-gray-500">{endpoint.requests} requêtes • {endpoint.avgResponseTime}ms</p>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs ${
                        endpoint.status === 'active' ? 'bg-green-100 text-green-800' :
                        endpoint.status === 'deprecated' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.status === 'active' ? 'Actif' : endpoint.status === 'deprecated' ? 'Déprécié' : 'Maintenance'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Clés API</h3>
                <div className="space-y-3">
                  {apiKeys.slice(0, 5).map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{key.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate">{key.key}</p>
                        <p className="text-xs text-gray-400 mt-1">{key.requestsUsed}/{key.rateLimit} requêtes</p>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs ${
                        key.status === 'active' ? 'bg-green-100 text-green-800' :
                        key.status === 'revoked' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {key.status === 'active' ? 'Actif' : key.status === 'revoked' ? 'Révoqué' : 'Expiré'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Endpoints</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouvel endpoint
              </button>
            </div>
            <div className="space-y-4">
              {endpoints.map((endpoint) => (
                <div key={endpoint.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                      </div>
                      {endpoint.description && (
                        <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {endpoint.requests} requêtes
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          {endpoint.errors} erreurs
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {endpoint.avgResponseTime}ms
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      endpoint.status === 'active' ? 'bg-green-100 text-green-800' :
                      endpoint.status === 'deprecated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.status === 'active' ? 'Actif' : endpoint.status === 'deprecated' ? 'Déprécié' : 'Maintenance'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clés API</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Nouvelle clé
              </button>
            </div>
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{key.name}</h3>
                      <code className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded block mb-3">{key.key}</code>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Permissions: </span>
                          <span className="font-medium text-gray-900">{key.permissions.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Limite: </span>
                          <span className="font-medium text-gray-900">{key.rateLimit.toLocaleString()}/jour</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilisé: </span>
                          <span className="font-medium text-gray-900">{key.requestsUsed.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${(key.requestsUsed / key.rateLimit) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' :
                      key.status === 'revoked' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {key.status === 'active' ? 'Actif' : key.status === 'revoked' ? 'Révoqué' : 'Expiré'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Logs API</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Temps</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.endpointName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            log.method === 'POST' ? 'bg-green-100 text-green-800' :
                            log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            log.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            log.statusCode >= 200 && log.statusCode < 300 ? 'bg-green-100 text-green-800' :
                            log.statusCode >= 300 && log.statusCode < 400 ? 'bg-yellow-100 text-yellow-800' :
                            log.statusCode >= 400 && log.statusCode < 500 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{log.responseTime}ms</td>
                        <td className="px-4 py-3 text-sm text-gray-600 font-mono">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(log.timestamp).toLocaleString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documentation' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Documentation API</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Introduction</h3>
                <p className="text-gray-600 mb-4">
                  Bienvenue dans la documentation de notre API. Cette API vous permet d'accéder aux fonctionnalités de notre plateforme.
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-6">Authentification</h3>
                <p className="text-gray-600 mb-4">
                  Toutes les requêtes doivent inclure votre clé API dans l'en-tête Authorization:
                </p>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </pre>
                <h3 className="text-lg font-bold text-gray-900 mb-4 mt-6">Endpoints disponibles</h3>
                <div className="space-y-4">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.id} className="border-l-4 border-teal-500 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      {endpoint.description && (
                        <p className="text-sm text-gray-600">{endpoint.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
      </div>
        )}
      </main>
    </div>
  )
}
