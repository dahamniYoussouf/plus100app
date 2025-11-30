'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, MapPin, Clock, BarChart3, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

type TabType = 'dashboard' | 'agents' | 'missions' | 'rounds' | 'incidents' | 'schedules'

interface Agent {
  id: string
  name: string
  badgeNumber: string
  phone: string
  email: string
  position: 'guard' | 'supervisor' | 'manager'
  status: 'on_duty' | 'off_duty' | 'on_break'
  currentLocation?: string
  shift: 'morning' | 'afternoon' | 'night'
  joinDate: Date
  totalMissions: number
}

interface Mission {
  id: string
  title: string
  description: string
  location: string
  assignedAgents: string[]
  startDate: Date
  endDate?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  type: 'patrol' | 'event' | 'surveillance' | 'access_control' | 'other'
  notes?: string
}

interface Round {
  id: string
  agentId: string
  agentName: string
  route: string
  checkpoints: Array<{ name: string; time: Date; status: 'checked' | 'missed' }>
  startTime: Date
  endTime?: Date
  status: 'in_progress' | 'completed'
  notes?: string
}

interface Incident {
  id: string
  title: string
  description: string
  location: string
  reportedBy: string
  reportedAt: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'investigating' | 'resolved' | 'closed'
  assignedAgent?: string
  resolution?: string
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [agents, setAgents] = useState<Agent[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const savedAgents = localStorage.getItem('security-agents')
    const savedMissions = localStorage.getItem('security-missions')
    const savedRounds = localStorage.getItem('security-rounds')
    const savedIncidents = localStorage.getItem('security-incidents')

    if (savedAgents) {
      const parsed = JSON.parse(savedAgents)
      setAgents(parsed.map((a: any) => ({ ...a, joinDate: new Date(a.joinDate) })))
    } else {
      const sample: Agent[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          badgeNumber: 'SEC001',
          phone: '+213 555 1111',
          email: 'ahmed@security.com',
          position: 'guard',
          status: 'on_duty',
          currentLocation: 'Poste Principal',
          shift: 'morning',
          joinDate: new Date('2023-01-15'),
          totalMissions: 45,
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          badgeNumber: 'SEC002',
          phone: '+213 555 2222',
          email: 'fatima@security.com',
          position: 'supervisor',
          status: 'on_duty',
          shift: 'afternoon',
          joinDate: new Date('2022-06-01'),
          totalMissions: 120,
        },
      ]
      setAgents(sample)
      localStorage.setItem('security-agents', JSON.stringify(sample))
    }

    if (savedMissions) {
      const parsed = JSON.parse(savedMissions)
      setMissions(parsed.map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
        endDate: m.endDate ? new Date(m.endDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Mission[] = [
        {
          id: '1',
          title: 'Patrouille Zone A',
          description: 'Patrouille de routine dans la zone A',
          location: 'Zone A - Bâtiment Principal',
          assignedAgents: ['1'],
          startDate: today,
          priority: 'medium',
          status: 'in_progress',
          type: 'patrol',
        },
      ]
      setMissions(sample)
      localStorage.setItem('security-missions', JSON.stringify(sample))
    }

    if (savedRounds) {
      const parsed = JSON.parse(savedRounds)
      setRounds(parsed.map((r: any) => ({
        ...r,
        startTime: new Date(r.startTime),
        endTime: r.endTime ? new Date(r.endTime) : undefined,
        checkpoints: r.checkpoints.map((cp: any) => ({
          ...cp,
          time: new Date(cp.time),
        })),
      })))
    } else {
      const today = new Date()
      const sample: Round[] = [
        {
          id: '1',
          agentId: '1',
          agentName: 'Ahmed Benali',
          route: 'Route Principale',
          checkpoints: [
            { name: 'Point A', time: today, status: 'checked' },
            { name: 'Point B', time: new Date(today.getTime() + 30 * 60000), status: 'checked' },
          ],
          startTime: today,
          status: 'in_progress',
        },
      ]
      setRounds(sample)
      localStorage.setItem('security-rounds', JSON.stringify(sample))
    }

    if (savedIncidents) {
      const parsed = JSON.parse(savedIncidents)
      setIncidents(parsed.map((i: any) => ({ ...i, reportedAt: new Date(i.reportedAt) })))
    } else {
      const sample: Incident[] = [
        {
          id: '1',
          title: 'Porte non verrouillée',
          description: 'Porte d\'entrée principale trouvée ouverte',
          location: 'Entrée Principale',
          reportedBy: 'Ahmed Benali',
          reportedAt: new Date(),
          severity: 'medium',
          status: 'investigating',
          assignedAgent: '1',
        },
      ]
      setIncidents(sample)
      localStorage.setItem('security-incidents', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (agents.length > 0) localStorage.setItem('security-agents', JSON.stringify(agents))
  }, [agents])

  useEffect(() => {
    if (missions.length > 0) localStorage.setItem('security-missions', JSON.stringify(missions))
  }, [missions])

  useEffect(() => {
    if (rounds.length > 0) localStorage.setItem('security-rounds', JSON.stringify(rounds))
  }, [rounds])

  useEffect(() => {
    if (incidents.length > 0) localStorage.setItem('security-incidents', JSON.stringify(incidents))
  }, [incidents])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'agents' as TabType, label: 'Agents', icon: Users },
    { id: 'missions' as TabType, label: 'Missions', icon: Shield },
    { id: 'rounds' as TabType, label: 'Rondes', icon: MapPin },
    { id: 'incidents' as TabType, label: 'Incidents', icon: AlertCircle },
    { id: 'schedules' as TabType, label: 'Planning', icon: Calendar },
  ]

  const onDutyAgents = agents.filter(a => a.status === 'on_duty').length
  const activeMissions = missions.filter(m => m.status === 'in_progress').length
  const activeRounds = rounds.filter(r => r.status === 'in_progress').length
  const openIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                      ? 'text-gray-600 border-b-2 border-gray-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Agents en Service</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{onDutyAgents}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Missions Actives</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeMissions}</p>
                  </div>
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rondes en Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeRounds}</p>
                  </div>
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Incidents Ouverts</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{openIncidents}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {openIncidents > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3">⚠️ Incidents Ouverts</h3>
                <div className="space-y-2">
                  {incidents
                    .filter(i => i.status !== 'resolved' && i.status !== 'closed')
                    .slice(0, 3)
                    .map((incident) => (
                      <div key={incident.id} className="bg-white rounded-lg p-3 text-sm">
                        <span className="font-medium text-gray-900">{incident.title}</span>
                        <span className="text-gray-500 ml-2">- {incident.location}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Agents</h3>
                  <p className="text-sm text-gray-600">Agents de sécurité et statuts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Missions</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des missions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rondes</h3>
                  <p className="text-sm text-gray-600">Suivi des rondes de sécurité</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Incidents</h3>
                  <p className="text-sm text-gray-600">Gestion et résolution des incidents</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                  <p className="text-sm text-gray-600">Horaires et équipes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Agents de Sécurité</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvel Agent
              </button>
            </div>
            {agents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun agent enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{agent.name}</h3>
                        <p className="text-sm text-gray-500">Badge: {agent.badgeNumber}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        agent.status === 'on_duty' ? 'bg-green-100 text-green-800' :
                        agent.status === 'on_break' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status === 'on_duty' ? 'En service' :
                         agent.status === 'on_break' ? 'En pause' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {agent.phone}</p>
                      <p className="text-sm text-gray-600">📧 {agent.email}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        Poste: {agent.position === 'guard' ? 'Garde' :
                                agent.position === 'supervisor' ? 'Superviseur' : 'Manager'}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        Quart: {agent.shift === 'morning' ? 'Matin' :
                                agent.shift === 'afternoon' ? 'Après-midi' : 'Nuit'}
                      </p>
                      {agent.currentLocation && (
                        <p className="text-sm text-gray-600">📍 {agent.currentLocation}</p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Missions:</span>
                        <span className="font-medium text-gray-900">{agent.totalMissions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Missions</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvelle Mission
              </button>
            </div>
            {missions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune mission</p>
              </div>
            ) : (
              <div className="space-y-4">
                {missions.map((mission) => {
                  const assignedAgentsList = agents.filter(a => mission.assignedAgents.includes(a.id))
                  return (
                    <div key={mission.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{mission.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            mission.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            mission.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            mission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {mission.priority === 'urgent' ? 'Urgent' :
                             mission.priority === 'high' ? 'Élevée' :
                             mission.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                            mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            mission.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {mission.status === 'completed' ? 'Terminée' :
                             mission.status === 'in_progress' ? 'En cours' :
                             mission.status === 'cancelled' ? 'Annulée' : 'Programmée'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">📍 {mission.location}</p>
                        <p className="text-gray-600">
                          👥 Agents: {assignedAgentsList.map(a => a.name).join(', ')}
                        </p>
                        <p className="text-gray-600">
                          📅 {new Date(mission.startDate).toLocaleDateString('fr-FR')}
                          {mission.endDate && ` - ${new Date(mission.endDate).toLocaleDateString('fr-FR')}`}
                        </p>
                        <p className="text-gray-500 capitalize">
                          Type: {mission.type === 'patrol' ? 'Patrouille' :
                                 mission.type === 'event' ? 'Événement' :
                                 mission.type === 'surveillance' ? 'Surveillance' :
                                 mission.type === 'access_control' ? 'Contrôle d\'accès' : 'Autre'}
                        </p>
                        {mission.notes && (
                          <p className="text-gray-500 text-xs mt-1">Note: {mission.notes}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rounds' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Rondes de Sécurité</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvelle Ronde
              </button>
            </div>
            {rounds.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune ronde</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rounds.map((round) => (
                  <div key={round.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{round.route}</h3>
                        <p className="text-sm text-gray-600 mt-1">Agent: {round.agentName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        round.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {round.status === 'completed' ? 'Terminée' : 'En cours'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <p className="text-gray-600">
                        ⏰ Début: {new Date(round.startTime).toLocaleString('fr-FR')}
                      </p>
                      {round.endTime && (
                        <p className="text-gray-600">
                          ⏰ Fin: {new Date(round.endTime).toLocaleString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Points de contrôle:</p>
                      <div className="space-y-1">
                        {round.checkpoints.map((checkpoint, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">{checkpoint.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">
                                {new Date(checkpoint.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {checkpoint.status === 'checked' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Incidents</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Nouvel Incident
              </button>
            </div>
            {incidents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun incident</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => {
                  const assignedAgent = incident.assignedAgent
                    ? agents.find(a => a.id === incident.assignedAgent)
                    : null
                  return (
                    <div key={incident.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{incident.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {incident.severity === 'critical' ? 'Critique' :
                             incident.severity === 'high' ? 'Élevée' :
                             incident.severity === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            incident.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                            incident.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {incident.status === 'resolved' ? 'Résolu' :
                             incident.status === 'closed' ? 'Fermé' :
                             incident.status === 'investigating' ? 'En enquête' : 'Signalé'}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">📍 {incident.location}</p>
                        <p className="text-gray-600">👤 Signalé par: {incident.reportedBy}</p>
                        <p className="text-gray-600">
                          📅 {new Date(incident.reportedAt).toLocaleString('fr-FR')}
                        </p>
                        {assignedAgent && (
                          <p className="text-gray-600">🛡️ Agent assigné: {assignedAgent.name}</p>
                        )}
                        {incident.resolution && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                            <p className="font-medium text-green-900">Résolution:</p>
                            <p className="text-green-700">{incident.resolution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des horaires et équipes</p>
            </div>
      </div>
        )}
      </main>
    </div>
  )
}
