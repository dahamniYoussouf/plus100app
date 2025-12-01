'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Globe, Smartphone, Monitor } from 'lucide-react'

type TabType = 'dashboard' | 'traffic' | 'users' | 'conversions' | 'reports'

interface Metric {
  id: string
  name: string
  value: number
  change: number
  trend: 'up' | 'down'
  period: string
}

interface TrafficSource {
  id: string
  source: string
  visitors: number
  sessions: number
  bounceRate: number
  avgDuration: number
}

interface UserSegment {
  id: string
  segment: string
  users: number
  percentage: number
  device: 'desktop' | 'mobile' | 'tablet'
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([])
  const [userSegments, setUserSegments] = useState<UserSegment[]>([])

  useEffect(() => {
    const savedMetrics = localStorage.getItem('analytics-metrics')
    const savedTraffic = localStorage.getItem('analytics-traffic')
    const savedSegments = localStorage.getItem('analytics-segments')

    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics))
    } else {
      const sample: Metric[] = [
        { id: '1', name: 'Visiteurs uniques', value: 12543, change: 12.5, trend: 'up', period: '30 jours' },
        { id: '2', name: 'Sessions', value: 18920, change: 8.3, trend: 'up', period: '30 jours' },
        { id: '3', name: 'Taux de rebond', value: 42.3, change: -5.2, trend: 'down', period: '30 jours' },
        { id: '4', name: 'Durée moyenne', value: 245, change: 15.7, trend: 'up', period: '30 jours' },
        { id: '5', name: 'Taux de conversion', value: 3.8, change: 2.1, trend: 'up', period: '30 jours' },
        { id: '6', name: 'Pages vues', value: 45678, change: 18.9, trend: 'up', period: '30 jours' },
      ]
      setMetrics(sample)
      localStorage.setItem('analytics-metrics', JSON.stringify(sample))
    }

    if (savedTraffic) {
      setTrafficSources(JSON.parse(savedTraffic))
    } else {
      const sample: TrafficSource[] = [
        { id: '1', source: 'Recherche organique', visitors: 8450, sessions: 12340, bounceRate: 38.5, avgDuration: 312 },
        { id: '2', source: 'Réseaux sociaux', visitors: 2340, sessions: 3456, bounceRate: 52.3, avgDuration: 198 },
        { id: '3', source: 'Direct', visitors: 1234, sessions: 1890, bounceRate: 35.2, avgDuration: 456 },
        { id: '4', source: 'Référencement payant', visitors: 519, sessions: 1234, bounceRate: 28.7, avgDuration: 389 },
      ]
      setTrafficSources(sample)
      localStorage.setItem('analytics-traffic', JSON.stringify(sample))
    }

    if (savedSegments) {
      setUserSegments(JSON.parse(savedSegments))
    } else {
      const sample: UserSegment[] = [
        { id: '1', segment: 'Desktop', users: 7845, percentage: 62.5, device: 'desktop' },
        { id: '2', segment: 'Mobile', users: 4123, percentage: 32.9, device: 'mobile' },
        { id: '3', segment: 'Tablet', users: 575, percentage: 4.6, device: 'tablet' },
      ]
      setUserSegments(sample)
      localStorage.setItem('analytics-segments', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (metrics.length > 0) localStorage.setItem('analytics-metrics', JSON.stringify(metrics))
  }, [metrics])

  useEffect(() => {
    if (trafficSources.length > 0) localStorage.setItem('analytics-traffic', JSON.stringify(trafficSources))
  }, [trafficSources])

  useEffect(() => {
    if (userSegments.length > 0) localStorage.setItem('analytics-segments', JSON.stringify(userSegments))
  }, [userSegments])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'traffic' as TabType, label: 'Trafic', icon: Globe },
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users },
    { id: 'conversions' as TabType, label: 'Conversions', icon: TrendingUp },
    { id: 'reports' as TabType, label: 'Rapports', icon: BarChart3 },
  ]

  const totalVisitors = metrics.find(m => m.name === 'Visiteurs uniques')?.value || 0
  const totalSessions = metrics.find(m => m.name === 'Sessions')?.value || 0
  const avgBounceRate = metrics.find(m => m.name === 'Taux de rebond')?.value || 0
  const conversionRate = metrics.find(m => m.name === 'Taux de conversion')?.value || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {metrics.map((metric) => (
                <div key={metric.id} className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs sm:text-sm text-gray-600">{metric.name}</p>
                    <TrendingUp className={`w-4 h-4  DZD{metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}  DZD{metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {metric.name.includes('Taux') || metric.name.includes('Durée') ? (
                      <>
                        {metric.value}
                        {metric.name.includes('Taux') ? '%' : 's'}
                      </>
                    ) : (
                      metric.value.toLocaleString('fr-FR')
                    )}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2  DZD{metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? '↑' : '↓'} {Math.abs(metric.change)}% vs {metric.period}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sources de trafic</h3>
                <div className="space-y-3">
                  {trafficSources.map((source) => (
                    <div key={source.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{source.source}</span>
                        <span className="text-sm font-bold text-indigo-600">{source.visitors.toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="block">Sessions</span>
                          <span className="font-medium text-gray-900">{source.sessions.toLocaleString('fr-FR')}</span>
                        </div>
                        <div>
                          <span className="block">Rebond</span>
                          <span className="font-medium text-gray-900">{source.bounceRate}%</span>
                        </div>
                        <div>
                          <span className="block">Durée</span>
                          <span className="font-medium text-gray-900">{source.avgDuration}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Appareils</h3>
                <div className="space-y-3">
                  {userSegments.map((segment) => (
                    <div key={segment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {segment.device === 'desktop' && <Monitor className="w-4 h-4 text-indigo-600" />}
                          {segment.device === 'mobile' && <Smartphone className="w-4 h-4 text-indigo-600" />}
                          {segment.device === 'tablet' && <Monitor className="w-4 h-4 text-indigo-600" />}
                          <span className="font-medium text-gray-900">{segment.segment}</span>
                        </div>
                        <span className="text-sm font-bold text-indigo-600">{segment.users.toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: ` DZD{segment.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{segment.percentage}% du total</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analyse du Trafic</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Visiteurs</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sessions</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Taux de rebond</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Durée moyenne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trafficSources.map((source) => (
                      <tr key={source.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{source.source}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{source.visitors.toLocaleString('fr-FR')}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{source.sessions.toLocaleString('fr-FR')}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{source.bounceRate}%</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">{source.avgDuration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analyse des Utilisateurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {userSegments.map((segment) => (
                <div key={segment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {segment.device === 'desktop' && <Monitor className="w-12 h-12 text-indigo-600" />}
                    {segment.device === 'mobile' && <Smartphone className="w-12 h-12 text-indigo-600" />}
                    {segment.device === 'tablet' && <Monitor className="w-12 h-12 text-indigo-600" />}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{segment.segment}</h3>
                  <p className="text-3xl font-bold text-indigo-600 mb-2">{segment.users.toLocaleString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">Utilisateurs</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{segment.percentage}%</p>
                    <p className="text-xs text-gray-500">du total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'conversions' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Conversions</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Taux de conversion global</h3>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-indigo-600 mb-2">{conversionRate}%</p>
                    <p className="text-sm text-gray-600">Sur {totalSessions.toLocaleString('fr-FR')} sessions</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Objectifs atteints</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Inscriptions</span>
                      <span className="font-bold text-gray-900">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Achats</span>
                      <span className="font-bold text-gray-900">456</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Téléchargements</span>
                      <span className="font-bold text-gray-900">789</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rapports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Rapport Mensuel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visiteurs</span>
                    <span className="font-bold text-gray-900">{totalVisitors.toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sessions</span>
                    <span className="font-bold text-gray-900">{totalSessions.toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de rebond</span>
                    <span className="font-bold text-gray-900">{avgBounceRate}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages vues</span>
                    <span className="font-bold text-gray-900">45,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages/session</span>
                    <span className="font-bold text-gray-900">2.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taux de conversion</span>
                    <span className="font-bold text-indigo-600">{conversionRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
