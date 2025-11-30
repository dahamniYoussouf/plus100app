'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, CheckCircle, Gift, BarChart3, Clock, MessageSquare, ShoppingCart } from 'lucide-react'

type TabType = 'dashboard' | 'members' | 'calendar' | 'tasks' | 'shopping' | 'events'

interface FamilyMember {
  id: string
  name: string
  role: 'parent' | 'child' | 'grandparent' | 'other'
  email?: string
  phone?: string
  dateOfBirth?: Date
  avatar?: string
}

interface Task {
  id: string
  title: string
  description?: string
  assignedTo: string[]
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  category: 'chores' | 'shopping' | 'appointments' | 'other'
  createdBy: string
  createdAt: Date
}

interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  time?: string
  participants: string[]
  type: 'appointment' | 'event' | 'reminder' | 'birthday'
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

interface ShoppingItem {
  id: string
  name: string
  quantity?: number
  category: string
  addedBy: string
  status: 'pending' | 'purchased'
  priority: 'low' | 'medium' | 'high'
}

export default function FamilyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [shopping, setShopping] = useState<ShoppingItem[]>([])

  useEffect(() => {
    const savedMembers = localStorage.getItem('family-members')
    const savedTasks = localStorage.getItem('family-tasks')
    const savedEvents = localStorage.getItem('family-events')
    const savedShopping = localStorage.getItem('family-shopping')

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({
        ...m,
        dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth) : undefined,
      })))
    } else {
      const sample: FamilyMember[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          role: 'parent',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
        },
        {
          id: '2',
          name: 'Fatima Benali',
          role: 'parent',
          email: 'fatima@email.com',
          phone: '+213 555 1235',
        },
        {
          id: '3',
          name: 'Lina Benali',
          role: 'child',
          dateOfBirth: new Date('2015-05-10'),
        },
        {
          id: '4',
          name: 'Omar Benali',
          role: 'child',
          dateOfBirth: new Date('2018-09-15'),
        },
      ]
      setMembers(sample)
      localStorage.setItem('family-members', JSON.stringify(sample))
    }

    if (savedTasks) {
      const parsed = JSON.parse(savedTasks)
      setTasks(parsed.map((t: any) => ({
        ...t,
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdAt: new Date(t.createdAt),
      })))
    } else {
      const today = new Date()
      const sample: Task[] = [
        {
          id: '1',
          title: 'Faire les courses',
          description: 'Acheter les produits de la semaine',
          assignedTo: ['1'],
          dueDate: today,
          priority: 'high',
          status: 'pending',
          category: 'shopping',
          createdBy: '2',
          createdAt: today,
        },
        {
          id: '2',
          title: 'Ranger la chambre',
          assignedTo: ['3'],
          priority: 'medium',
          status: 'pending',
          category: 'chores',
          createdBy: '1',
          createdAt: today,
        },
      ]
      setTasks(sample)
      localStorage.setItem('family-tasks', JSON.stringify(sample))
    }

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      })))
    } else {
      const today = new Date()
      const nextWeek = new Date(today)
      nextWeek.setDate(today.getDate() + 7)
      const sample: CalendarEvent[] = [
        {
          id: '1',
          title: 'Rendez-vous médecin',
          description: 'Contrôle annuel',
          date: nextWeek,
          time: '14:00',
          participants: ['1'],
          type: 'appointment',
        },
        {
          id: '2',
          title: 'Anniversaire Lina',
          date: new Date(today.getFullYear(), 4, 10),
          participants: ['1', '2', '3', '4'],
          type: 'birthday',
          recurring: 'yearly',
        },
      ]
      setEvents(sample)
      localStorage.setItem('family-events', JSON.stringify(sample))
    }

    if (savedShopping) {
      setShopping(JSON.parse(savedShopping))
    } else {
      const sample: ShoppingItem[] = [
        {
          id: '1',
          name: 'Lait',
          quantity: 2,
          category: 'Produits laitiers',
          addedBy: '2',
          status: 'pending',
          priority: 'high',
        },
        {
          id: '2',
          name: 'Pain',
          quantity: 1,
          category: 'Boulangerie',
          addedBy: '1',
          status: 'pending',
          priority: 'high',
        },
      ]
      setShopping(sample)
      localStorage.setItem('family-shopping', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('family-members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('family-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (events.length > 0) localStorage.setItem('family-events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (shopping.length > 0) localStorage.setItem('family-shopping', JSON.stringify(shopping))
  }, [shopping])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
    { id: 'calendar' as TabType, label: 'Calendrier', icon: Calendar },
    { id: 'tasks' as TabType, label: 'Tâches', icon: CheckCircle },
    { id: 'shopping' as TabType, label: 'Courses', icon: ShoppingCart },
    { id: 'events' as TabType, label: 'Événements', icon: Gift },
  ]

  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length
  const pendingShopping = shopping.filter(s => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
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
                      ? 'text-pink-600 border-b-2 border-pink-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Membres</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{members.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Tâches en attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingTasks}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Événements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Courses</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingShopping}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Membres</h3>
                  <p className="text-sm text-gray-600">Profils de tous les membres de la famille</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Calendrier Familial</h3>
                  <p className="text-sm text-gray-600">Événements, rendez-vous et anniversaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tâches</h3>
                  <p className="text-sm text-gray-600">Répartition et suivi des tâches</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Liste de Courses</h3>
                  <p className="text-sm text-gray-600">Liste collaborative de courses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                  <p className="text-sm text-gray-600">Messages et notifications familiales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                  <p className="text-sm text-gray-600">Suivi des dépenses familiales</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres de la Famille</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Ajouter Membre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {members.map((member) => {
                const age = member.dateOfBirth
                  ? new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()
                  : null
                return (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {member.email && <p className="text-sm text-gray-600">📧 {member.email}</p>}
                      {member.phone && <p className="text-sm text-gray-600">📞 {member.phone}</p>}
                      {age !== null && <p className="text-sm text-gray-600">🎂 {age} ans</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tâches</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouvelle Tâche
              </button>
            </div>
            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune tâche</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => {
                  const assignedMembers = members.filter(m => task.assignedTo.includes(m.id))
                  return (
                    <div key={task.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-800' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status === 'completed' ? 'Terminé' :
                           task.status === 'in_progress' ? 'En cours' : 'En attente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority === 'high' ? 'Haute' :
                           task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                        <span className="text-gray-500">Assigné à: {assignedMembers.map(m => m.name).join(', ')}</span>
                        {task.dueDate && (
                          <span className="text-gray-500">
                            📅 {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Calendrier</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const eventMembers = members.filter(m => event.participants.includes(m.id))
                  return (
                    <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          )}
                        </div>
                        <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs capitalize">
                          {event.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          📅 {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          {event.time && ` à ${event.time}`}
                        </p>
                        <p className="text-gray-600">👥 {eventMembers.map(m => m.name).join(', ')}</p>
                        {event.recurring && (
                          <p className="text-xs text-gray-500">🔄 Récurrent: {event.recurring}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Liste de Courses</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Ajouter Article
              </button>
            </div>
            {shopping.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Liste de courses vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shopping.map((item) => {
                  const addedByMember = members.find(m => m.id === item.addedBy)
                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={item.status === 'purchased'}
                              onChange={() => {}}
                              className="w-5 h-5 text-pink-600 rounded"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              {item.quantity && (
                                <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <span className="text-gray-500">Catégorie: {item.category}</span>
                            {addedByMember && (
                              <span className="text-gray-500">Ajouté par: {addedByMember.name}</span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.priority === 'high' ? 'bg-red-100 text-red-800' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.priority === 'high' ? 'Haute' :
                           item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
            <p className="text-gray-600">Voir l'onglet Calendrier pour gérer les événements</p>
          </div>
        )}
      </main>
    </div>
  )
}
