'use client'

import { useState, useEffect } from 'react'
import { Activity, Server, AlertTriangle, CheckCircle, BarChart3, Clock, TrendingUp, Cpu, FileText } from 'lucide-react'

type TabType = 'dashboard' | 'systems' | 'alerts' | 'metrics' | 'logs'

interface System {
  id: string
  name: string
  type: 'server' | 'application' | 'database' | 'api'
  status: 'healthy' | 'warning' | 'critical' | 'down'
  uptime: number // percentage
  cpu: number // percentage
  memory: number // percentage
  disk: number // percentage
  lastCheck: Date
  location: string
}

interface Alert {
  id: string
  systemId: string
  systemName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  status: 'active' | 'acknowledged' | 'resolved'
  category: 'performance' | 'availability' | 'error' | 'security'
}

interface Metric {
  id: string
  systemId: string
  systemName: string
  name: string
  value: number
  unit: string
  timestamp: Date
  threshold?: { min: number; max: number }
}

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [systems, setSystems] = useState<System[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metrics, setMetrics] = useState<Metric[]>([])

  useEffect(() => {
    const savedSystems = localStorage.getItem('monitoring-systems')
    const savedAlerts = localStorage.getItem('monitoring-alerts')
    const savedMetrics = localStorage.getItem('monitoring-metrics')

    if (savedSystems) {
      const parsed = JSON.parse(savedSystems)
      setSystems(parsed.map((s: any) => ({ ...s, lastCheck: new Date(s.lastCheck) })))
    } else {
      const sample: System[] = [
        {
          id: '1',
          name: 'Serveur Web Principal',
          type: 'server',
          status: 'healthy',
          uptime: 99.8,
          cpu: 45,
          memory: 62,
          disk: 78,
          lastCheck: new Date(),
          location: 'Datacenter Alger',
        },
        {
          id: '2',
          name: 'API Backend',
          type: 'api',
          status: 'warning',
          uptime: 98.5,
          cpu: 85,
          memory: 90,
          disk: 45,
          lastCheck: new Date(),
          location: 'Cloud AWS',
        },
        {
          id: '3',
          name: 'Base de Données',
          type: 'database',
          status: 'healthy',
          uptime: 99.9,
          cpu: 30,
          memory: 55,
          disk: 60,
          lastCheck: new Date(),
          location: 'Datacenter Alger',
        },
      ]
      setSystems(sample)
      localStorage.setItem('monitoring-systems', JSON.stringify(sample))
    }

    if (savedAlerts) {
      const parsed = JSON.parse(savedAlerts)
      setAlerts(parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) })))
    } else {
      const sample: Alert[] = [
        {
          id: '1',
          systemId: '2',
          systemName: 'API Backend',
          severity: 'high',
          message: 'Utilisation CPU élevée: 85%',
          timestamp: new Date(),
          status: 'active',
          category: 'performance',
        },
        {
          id: '2',
          systemId: '2',
          systemName: 'API Backend',
          severity: 'medium',
          message: 'Utilisation mémoire élevée: 90%',
          timestamp: new Date(),
          status: 'active',
          category: 'performance',
        },
      ]
      setAlerts(sample)
      localStorage.setItem('monitoring-alerts', JSON.stringify(sample))
    }

    if (savedMetrics) {
      const parsed = JSON.parse(savedMetrics)
      setMetrics(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
    }
  }, [])

  useEffect(() => {
    if (systems.length > 0) localStorage.setItem('monitoring-systems', JSON.stringify(systems))
  }, [systems])

  useEffect(() => {
    if (alerts.length > 0) localStorage.setItem('monitoring-alerts', JSON.stringify(alerts))
  }, [alerts])

  useEffect(() => {
    if (metrics.length > 0) localStorage.setItem('monitoring-metrics', JSON.stringify(metrics))
  }, [metrics])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'systems' as TabType, label: 'Systèmes', icon: Server },
    { id: 'alerts' as TabType, label: 'Alertes', icon: AlertTriangle },
    { id: 'metrics' as TabType, label: 'Métriques', icon: Activity },
    { id: 'logs' as TabType, label: 'Logs', icon: FileText },
  ]

  const healthySystems = systems.filter(s => s.status === 'healthy').length
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
  const averageUptime = systems.length > 0 ? systems.reduce((sum, s) => sum + s.uptime, 0) / systems.length : 0

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
                    <p className="text-xs sm:text-sm text-gray-600">Systèmes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{systems.length}</p>
                  </div>
                  <Server className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Systèmes OK</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{healthySystems}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Uptime Moyen</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{averageUptime.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Alertes Critiques</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{criticalAlerts}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            {criticalAlerts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3">🚨 Alertes Critiques</h3>
                <div className="space-y-2">
                  {alerts
                    .filter(a => a.severity === 'critical' && a.status === 'active')
                    .slice(0, 3)
                    .map((alert) => (
                      <div key={alert.id} className="bg-white rounded-lg p-3 text-sm">
                        <span className="font-medium text-gray-900">{alert.systemName}</span>
                        <span className="text-gray-500 ml-2">- {alert.message}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Monitoring Systèmes</h3>
                  <p className="text-sm text-gray-600">Surveillance en temps réel des systèmes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes</h3>
                  <p className="text-sm text-gray-600">Notifications et alertes automatiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Métriques</h3>
                  <p className="text-sm text-gray-600">CPU, mémoire, disque, réseau</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Logs</h3>
                  <p className="text-sm text-gray-600">Consultation des logs système</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses de performance</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Uptime</h3>
                  <p className="text-sm text-gray-600">Suivi de la disponibilité</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Systèmes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ajouter Système
              </button>
            </div>
            {systems.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun système</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {systems.map((system) => (
                  <div key={system.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{system.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{system.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        system.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        system.status === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {system.status === 'healthy' ? 'OK' :
                         system.status === 'warning' ? 'Avertissement' :
                         system.status === 'critical' ? 'Critique' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">CPU</span>
                          <span className="font-medium">{system.cpu}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              system.cpu >= 90 ? 'bg-red-500' :
                              system.cpu >= 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${system.cpu}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Mémoire</span>
                          <span className="font-medium">{system.memory}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              system.memory >= 90 ? 'bg-red-500' :
                              system.memory >= 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${system.memory}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Disque</span>
                          <span className="font-medium">{system.disk}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              system.disk >= 90 ? 'bg-red-500' :
                              system.disk >= 70 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${system.disk}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Uptime:</span>
                        <span className="font-medium text-green-600">{system.uptime.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Localisation:</span>
                        <span className="text-gray-600">{system.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Alertes</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Configurer Alertes
              </button>
            </div>
            {alerts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune alerte</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{alert.systemName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity === 'critical' ? 'Critique' :
                           alert.severity === 'high' ? 'Élevée' :
                           alert.severity === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.status === 'resolved' ? 'Résolue' :
                           alert.status === 'acknowledged' ? 'Reconnue' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 capitalize">
                        Catégorie: {alert.category === 'performance' ? 'Performance' :
                                    alert.category === 'availability' ? 'Disponibilité' :
                                    alert.category === 'error' ? 'Erreur' : 'Sécurité'}
                      </p>
                      <p className="text-gray-500 text-xs">
                        ⏰ {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Métriques</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Graphiques et historiques des métriques système</p>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Logs Système</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Consultation des logs en temps réel</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
