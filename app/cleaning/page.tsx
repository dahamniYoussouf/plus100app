'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Droplet, Users, Calendar, CheckCircle, BarChart3, Clock, MapPin, Package } from 'lucide-react'

type TabType = 'dashboard' | 'teams' | 'missions' | 'clients' | 'equipment' | 'schedules'

interface Team {
  id: string
  name: string
  members: string[]
  supervisor: string
  specializations: string[]
  status: 'available' | 'on_mission' | 'off_duty'
  totalMissions: number
}

interface Mission {
  id: string
  clientId: string
  clientName: string
  location: string
  address: string
  assignedTeam: string
  teamName: string
  type: 'regular' | 'deep' | 'window' | 'carpet' | 'post_construction' | 'other'
  scheduledDate: Date
  scheduledTime: string
  duration: number // minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  price: number
  notes?: string
  completedDate?: Date
}

interface Client {
  id: string
  name: string
  contactPerson: string
  phone: string
  email?: string
  address: string
  serviceFrequency: 'one_time' | 'weekly' | 'bi_weekly' | 'monthly'
  totalMissions: number
  lastService?: Date
  notes?: string
}

interface Equipment {
  id: string
  name: string
  type: string
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order'
  assignedTo?: string
  lastMaintenance?: Date
  nextMaintenance?: Date
}

export default function CleaningPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [teams, setTeams] = useState<Team[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [showClientModal, setShowClientModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [showMissionModal, setShowMissionModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', contactPerson: '', phone: '', email: '', address: '', serviceFrequency: 'one_time' as 'one_time' | 'weekly' | 'bi_weekly' | 'monthly' })
  const [newTeam, setNewTeam] = useState({ name: '', supervisor: '', members: [] as string[], specializations: [] as string[] })
  const [newMission, setNewMission] = useState({ clientId: '', teamId: '', type: 'regular' as 'regular' | 'deep' | 'window' | 'carpet' | 'post_construction', scheduledDate: '', scheduledTime: '', address: '', notes: '' })
  const [newEquipment, setNewEquipment] = useState({ name: '', type: '', lastMaintenance: '', nextMaintenance: '' })

  useEffect(() => {
    const savedTeams = localStorage.getItem('cleaning-teams')
    const savedMissions = localStorage.getItem('cleaning-missions')
    const savedClients = localStorage.getItem('cleaning-clients')
    const savedEquipment = localStorage.getItem('cleaning-equipment')

    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    } else {
      const sample: Team[] = [
        {
          id: '1',
          name: 'Équipe A',
          members: ['Ahmed Benali', 'Fatima Kadri'],
          supervisor: 'Omar Amrani',
          specializations: ['Bureaux', 'Vitres'],
          status: 'available',
          totalMissions: 45,
        },
        {
          id: '2',
          name: 'Équipe B',
          members: ['Leila Bouzid', 'Yacine Cherif'],
          supervisor: 'Omar Amrani',
          specializations: ['Résidentiel', 'Tapis'],
          status: 'on_mission',
          totalMissions: 38,
        },
      ]
      setTeams(sample)
      localStorage.setItem('cleaning-teams', JSON.stringify(sample))
    }

    if (savedMissions) {
      const parsed = JSON.parse(savedMissions)
      setMissions(parsed.map((m: any) => ({
        ...m,
        scheduledDate: new Date(m.scheduledDate),
        completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Mission[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Entreprise ABC',
          location: 'Bureaux',
          address: '123 Rue des Affaires, Alger',
          assignedTeam: '1',
          teamName: 'Équipe A',
          type: 'regular',
          scheduledDate: today,
          scheduledTime: '09:00',
          duration: 120,
          status: 'scheduled',
          priority: 'medium',
          price: 150,
        },
        {
          id: '2',
          clientId: '2',
          clientName: 'Résidence XYZ',
          location: 'Appartement',
          address: '456 Avenue de la Paix, Oran',
          assignedTeam: '2',
          teamName: 'Équipe B',
          type: 'deep',
          scheduledDate: today,
          scheduledTime: '14:00',
          duration: 180,
          status: 'in_progress',
          priority: 'high',
          price: 250,
        },
      ]
      setMissions(sample)
      localStorage.setItem('cleaning-missions', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        lastService: c.lastService ? new Date(c.lastService) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Entreprise ABC',
          contactPerson: 'Ahmed Benali',
          phone: '+213 555 1234',
          email: 'contact@abc.dz',
          address: '123 Rue des Affaires, Alger',
          serviceFrequency: 'weekly',
          totalMissions: 12,
          lastService: new Date('2024-01-20'),
        },
        {
          id: '2',
          name: 'Résidence XYZ',
          contactPerson: 'Fatima Kadri',
          phone: '+213 555 5678',
          address: '456 Avenue de la Paix, Oran',
          serviceFrequency: 'monthly',
          totalMissions: 3,
        },
      ]
      setClients(sample)
      localStorage.setItem('cleaning-clients', JSON.stringify(sample))
    }

    if (savedEquipment) {
      const parsed = JSON.parse(savedEquipment)
      setEquipment(parsed.map((e: any) => ({
        ...e,
        lastMaintenance: e.lastMaintenance ? new Date(e.lastMaintenance) : undefined,
        nextMaintenance: e.nextMaintenance ? new Date(e.nextMaintenance) : undefined,
      })))
    } else {
      const sample: Equipment[] = [
        {
          id: '1',
          name: 'Aspirateur Professionnel',
          type: 'Aspirateur',
          status: 'available',
          lastMaintenance: new Date('2024-01-01'),
          nextMaintenance: new Date('2024-04-01'),
        },
        {
          id: '2',
          name: 'Lave-vitres',
          type: 'Équipement Vitres',
          status: 'in_use',
          assignedTo: 'Équipe A',
        },
      ]
      setEquipment(sample)
      localStorage.setItem('cleaning-equipment', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (teams.length > 0) localStorage.setItem('cleaning-teams', JSON.stringify(teams))
  }, [teams])

  useEffect(() => {
    if (missions.length > 0) localStorage.setItem('cleaning-missions', JSON.stringify(missions))
  }, [missions])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('cleaning-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (equipment.length > 0) localStorage.setItem('cleaning-equipment', JSON.stringify(equipment))
  }, [equipment])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'teams' as TabType, label: 'Équipes', icon: Users },
    { id: 'missions' as TabType, label: 'Missions', icon: Calendar },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'equipment' as TabType, label: 'Équipements', icon: Package },
    { id: 'schedules' as TabType, label: 'Planning', icon: Clock },
  ]

  const todayMissions = missions.filter(m => {
    const today = new Date()
    return m.scheduledDate.toDateString() === today.toDateString()
  })
  const activeMissions = missions.filter(m => m.status === 'in_progress').length
  const totalRevenue = missions.filter(m => m.status === 'completed').reduce((sum, m) => sum + m.price, 0)
  const availableTeams = teams.filter(t => t.status === 'available').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Missions Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayMissions.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Missions Actives</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeMissions}</p>
                  </div>
                  <Droplet className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalRevenue}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Équipes Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableTeams}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Équipes</h3>
                  <p className="text-sm text-gray-600">Équipes de nettoyage et superviseurs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Missions</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des missions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Clients</h3>
                  <p className="text-sm text-gray-600">Base de données clients et contrats</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Équipements</h3>
                  <p className="text-sm text-gray-600">Gestion du matériel de nettoyage</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Planning</h3>
                  <p className="text-sm text-gray-600">Horaires et affectations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et factures</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipes</h2>
              <button 
                onClick={() => setShowTeamModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Équipe
              </button>
            </div>
            {teams.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune équipe</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{team.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        team.status === 'available' ? 'bg-green-100 text-green-800' :
                        team.status === 'on_mission' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status === 'available' ? 'Disponible' :
                         team.status === 'on_mission' ? 'En mission' : 'Hors service'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👤 Superviseur: {team.supervisor}</p>
                      <p className="text-sm text-gray-600">👥 Membres: {team.members.join(', ')}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {team.specializations.map((spec, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Missions:</span>
                        <span className="font-medium text-gray-900">{team.totalMissions}</span>
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
              <button 
                onClick={() => setShowMissionModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Mission
              </button>
            </div>
            {missions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune mission</p>
              </div>
            ) : (
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div key={mission.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{mission.clientName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{mission.location} - {mission.address}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          mission.priority === 'high' ? 'bg-red-100 text-red-800' :
                          mission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {mission.priority === 'high' ? 'Haute' :
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
                      <p className="text-gray-600">
                        👥 Équipe: {mission.teamName}
                      </p>
                      <p className="text-gray-600">
                        📅 {new Date(mission.scheduledDate).toLocaleDateString('fr-FR')} à {mission.scheduledTime}
                      </p>
                      <p className="text-gray-600">
                        ⏱️ Durée: {mission.duration} min
                      </p>
                      <p className="text-gray-500 capitalize">
                        Type: {mission.type === 'regular' ? 'Régulier' :
                               mission.type === 'deep' ? 'Nettoyage profond' :
                               mission.type === 'window' ? 'Vitres' :
                               mission.type === 'carpet' ? 'Tapis' :
                               mission.type === 'post_construction' ? 'Après travaux' : 'Autre'}
                      </p>
                      <p className="text-gray-700 font-medium">💰 Prix: DZD{mission.price}</p>
                      {mission.notes && (
                        <p className="text-gray-500 text-xs mt-1">Note: {mission.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{client.name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">👤 {client.contactPerson}</p>
                      <p className="text-sm text-gray-600">📞 {client.phone}</p>
                      {client.email && <p className="text-sm text-gray-600">📧 {client.email}</p>}
                      <p className="text-sm text-gray-600">📍 {client.address}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        Fréquence: {client.serviceFrequency === 'one_time' ? 'Unique' :
                                    client.serviceFrequency === 'weekly' ? 'Hebdomadaire' :
                                    client.serviceFrequency === 'bi_weekly' ? 'Bi-hebdomadaire' : 'Mensuelle'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Missions:</span>
                        <span className="font-medium text-blue-600">{client.totalMissions}</span>
                      </div>
                      {client.lastService && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Dernier service:</span>
                          <span className="text-gray-600">{new Date(client.lastService).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipements</h2>
              <button 
                onClick={() => setShowEquipmentModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvel Équipement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {equipment.map((eq) => (
                <div key={eq.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{eq.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      eq.status === 'available' ? 'bg-green-100 text-green-800' :
                      eq.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                      eq.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {eq.status === 'available' ? 'Disponible' :
                       eq.status === 'in_use' ? 'En utilisation' :
                       eq.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Type: {eq.type}</p>
                    {eq.assignedTo && (
                      <p className="text-sm text-gray-600">Assigné à: {eq.assignedTo}</p>
                    )}
                    {eq.lastMaintenance && (
                      <p className="text-xs text-gray-500">
                        Dernière maintenance: {new Date(eq.lastMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {eq.nextMaintenance && (
                      <p className="text-xs text-gray-500">
                        Prochaine maintenance: {new Date(eq.nextMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Planning</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Voir l'onglet Missions pour le planning détaillé</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false)
          setNewClient({ name: '', contactPerson: '', phone: '', email: '', address: '', serviceFrequency: 'one_time' })
        }}
        title="Nouveau Client"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Entreprise</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Entreprise ABC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personne de contact</label>
            <input
              type="text"
              value={newClient.contactPerson}
              onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: contact@entreprise.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={newClient.address}
              onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 123 Rue Didouche Mourad, Alger"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence de service</label>
            <select
              value={newClient.serviceFrequency}
              onChange={(e) => setNewClient({ ...newClient, serviceFrequency: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="one_time">Une seule fois</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="bi_weekly">Bi-hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowClientModal(false)
                setNewClient({ name: '', contactPerson: '', phone: '', email: '', address: '', serviceFrequency: 'one_time' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newClient.name && newClient.contactPerson && newClient.phone && newClient.address) {
                  const client: Client = {
                    id: Date.now().toString(),
                    name: newClient.name,
                    contactPerson: newClient.contactPerson,
                    phone: newClient.phone,
                    email: newClient.email || undefined,
                    address: newClient.address,
                    serviceFrequency: newClient.serviceFrequency,
                    totalMissions: 0,
                  }
                  setClients([...clients, client])
                  setShowClientModal(false)
                  setNewClient({ name: '', contactPerson: '', phone: '', email: '', address: '', serviceFrequency: 'one_time' })
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
        isOpen={showEquipmentModal}
        onClose={() => {
          setShowEquipmentModal(false)
          setNewEquipment({ name: '', type: '', lastMaintenance: '', nextMaintenance: '' })
        }}
        title="Nouvel Équipement"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Aspirateur Professionnel"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              type="text"
              value={newEquipment.type}
              onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Aspirateur"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dernière maintenance</label>
              <input
                type="date"
                value={newEquipment.lastMaintenance}
                onChange={(e) => setNewEquipment({ ...newEquipment, lastMaintenance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine maintenance</label>
              <input
                type="date"
                value={newEquipment.nextMaintenance}
                onChange={(e) => setNewEquipment({ ...newEquipment, nextMaintenance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowEquipmentModal(false)
                setNewEquipment({ name: '', type: '', lastMaintenance: '', nextMaintenance: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newEquipment.name && newEquipment.type) {
                  const equipmentItem: Equipment = {
                    id: Date.now().toString(),
                    name: newEquipment.name,
                    type: newEquipment.type,
                    status: 'available',
                    lastMaintenance: newEquipment.lastMaintenance ? new Date(newEquipment.lastMaintenance) : undefined,
                    nextMaintenance: newEquipment.nextMaintenance ? new Date(newEquipment.nextMaintenance) : undefined,
                  }
                  setEquipment([...equipment, equipmentItem])
                  setShowEquipmentModal(false)
                  setNewEquipment({ name: '', type: '', lastMaintenance: '', nextMaintenance: '' })
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
