'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Baby, Users, Calendar, Activity, BarChart3, Clock, CheckCircle } from 'lucide-react'
import { Child, Activity as ActivityType, Attendance } from '@/types/kids'

type TabType = 'dashboard' | 'children' | 'activities' | 'attendance'

export default function KidsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [children, setChildren] = useState<Child[]>([])
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [showChildModal, setShowChildModal] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [newChild, setNewChild] = useState({ firstName: '', lastName: '', dateOfBirth: '', parentIds: [] as string[], emergencyContact: '', emergencyPhone: '', allergies: [] as string[] })
  const [newActivity, setNewActivity] = useState({ name: '', description: '', category: 'art' as 'art' | 'sports' | 'educational' | 'music' | 'outdoor', ageRange: '', duration: 0, capacity: 0, schedule: '' })

  useEffect(() => {
    const savedChildren = localStorage.getItem('kids-children')
    const savedActivities = localStorage.getItem('kids-activities')
    const savedAttendances = localStorage.getItem('kids-attendances')

    if (savedChildren) {
      const parsed = JSON.parse(savedChildren)
      setChildren(parsed.map((c: any) => ({ ...c, dateOfBirth: new Date(c.dateOfBirth) })))
    } else {
      const sample: Child[] = [
        {
          id: '1',
          firstName: 'Emma',
          lastName: 'Martin',
          dateOfBirth: new Date('2020-03-15'),
          parentIds: ['1'],
          emergencyContact: 'Papa Martin',
          emergencyPhone: '+33 6 12 34 56 78',
          allergies: ['Arachides'],
        },
        {
          id: '2',
          firstName: 'Lucas',
          lastName: 'Dubois',
          dateOfBirth: new Date('2019-08-22'),
          parentIds: ['2'],
          emergencyContact: 'Maman Dubois',
          emergencyPhone: '+33 6 98 76 54 32',
        },
      ]
      setChildren(sample)
      localStorage.setItem('kids-children', JSON.stringify(sample))
    }

    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    } else {
      const sample: ActivityType[] = [
        {
          id: '1',
          name: 'Peinture Créative',
          description: 'Activité de peinture pour développer la créativité et l\'expression artistique',
          category: 'art',
          ageRange: '3-6 ans',
          duration: 45,
          capacity: 12,
          enrolled: 8,
          schedule: 'Lundi 10h-10h45',
        },
        {
          id: '2',
          name: 'Gymnastique',
          description: 'Activité physique et motricité pour le développement corporel',
          category: 'sports',
          ageRange: '4-8 ans',
          duration: 60,
          capacity: 15,
          enrolled: 12,
          schedule: 'Mercredi 14h-15h',
        },
        {
          id: '3',
          name: 'Lecture de Coran',
          description: 'Apprentissage et mémorisation du Coran adapté aux enfants',
          category: 'educational',
          ageRange: '5-10 ans',
          duration: 30,
          capacity: 10,
          enrolled: 7,
          schedule: 'Vendredi 16h-16h30',
        },
      ]
      setActivities(sample)
      localStorage.setItem('kids-activities', JSON.stringify(sample))
    }

    if (savedAttendances) {
      const parsed = JSON.parse(savedAttendances)
      setAttendances(parsed.map((a: any) => ({
        ...a,
        date: new Date(a.date),
        checkIn: a.checkIn ? new Date(a.checkIn) : undefined,
        checkOut: a.checkOut ? new Date(a.checkOut) : undefined,
      })))
    }
  }, [])

  const presentToday = attendances.filter((a) => {
    const today = new Date()
    return a.date.toDateString() === today.toDateString() && a.checkIn
  })

  const categoryNames: Record<string, string> = {
    educational: 'Éducatif',
    sports: 'Sport',
    art: 'Art',
    music: 'Musique',
    outdoor: 'Extérieur',
    indoor: 'Intérieur'
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'children' as TabType, label: 'Enfants', icon: Baby },
    { id: 'activities' as TabType, label: 'Activités', icon: Activity },
    { id: 'attendance' as TabType, label: 'Présence', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Baby className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
                Gestion Enfants
              </h1>
              <p className="text-sm text-gray-500 mt-1">Gestion complète des enfants avec activités et présence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[73px] sm:top-[81px] z-10">
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Enfants</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{children.length}</p>
                  </div>
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Activités</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activities.length}</p>
                  </div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Présents Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{presentToday.length}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Inscriptions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                      {activities.reduce((sum, a) => sum + a.enrolled, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Enfants</h3>
                  <p className="text-sm text-gray-600">Fiche complète avec informations personnelles, allergies et contacts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Activités</h3>
                  <p className="text-sm text-gray-600">Organisation d'activités éducatives, sportives et artistiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Présence</h3>
                  <p className="text-sm text-gray-600">Système de check-in/check-out avec horaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Parents</h3>
                  <p className="text-sm text-gray-600">Communication avec les parents et notifications</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Repas</h3>
                  <p className="text-sm text-gray-600">Gestion des repas halal avec préférences alimentaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Rapports de présence et progression pour parents</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'children' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Enfants</h2>
              <button 
                onClick={() => setShowChildModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ajouter Enfant
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {children.map((child) => {
                const age = Math.floor((new Date().getTime() - child.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                return (
                  <div key={child.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <Baby className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {child.firstName} {child.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">Âge: {age} ans</p>
                      </div>
                    </div>
                    {child.allergies && child.allergies.length > 0 && (
                      <div className="mb-3 p-2 bg-red-50 rounded-lg">
                        <span className="text-xs font-semibold text-red-600">Allergies: </span>
                        <span className="text-xs text-red-700">{child.allergies.join(', ')}</span>
                      </div>
                    )}
                    <div className="space-y-1 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{child.emergencyContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{child.emergencyPhone}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Activités</h2>
              <button 
                onClick={() => setShowActivityModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ajouter Activité
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{activity.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap">
                      {categoryNames[activity.category] || activity.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Âge:</span>
                      <span className="font-medium">{activity.ageRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Durée:</span>
                      <span className="font-medium">{activity.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horaires:</span>
                      <span className="font-medium">{activity.schedule}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {activity.enrolled}/{activity.capacity} inscrits
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-600 h-2 rounded-full"
                        style={{ width: `${(activity.enrolled / activity.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Présence</h2>
            <p className="text-gray-600 mb-6">Suivi des présences avec check-in/check-out</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Check-in</h3>
                <p className="text-sm text-gray-600">Enregistrer l'arrivée d'un enfant</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Check-out</h3>
                <p className="text-sm text-gray-600">Enregistrer le départ d'un enfant</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historique</h3>
                <p className="text-sm text-gray-600">Consulter l'historique des présences</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showChildModal}
        onClose={() => {
          setShowChildModal(false)
          setNewChild({ firstName: '', lastName: '', dateOfBirth: '', parentIds: [], emergencyContact: '', emergencyPhone: '', allergies: [] })
        }}
        title="Ajouter Enfant"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={newChild.firstName}
                onChange={(e) => setNewChild({ ...newChild, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={newChild.lastName}
                onChange={(e) => setNewChild({ ...newChild, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Nom"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input
              type="date"
              value={newChild.dateOfBirth}
              onChange={(e) => setNewChild({ ...newChild, dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence</label>
              <input
                type="text"
                value={newChild.emergencyContact}
                onChange={(e) => setNewChild({ ...newChild, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Nom du contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone d'urgence</label>
              <input
                type="text"
                value={newChild.emergencyPhone}
                onChange={(e) => setNewChild({ ...newChild, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (séparées par des virgules)</label>
            <input
              type="text"
              value={newChild.allergies.join(', ')}
              onChange={(e) => setNewChild({ ...newChild, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Arachides, Lait, etc."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowChildModal(false)
                setNewChild({ firstName: '', lastName: '', dateOfBirth: '', parentIds: [], emergencyContact: '', emergencyPhone: '', allergies: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newChild.firstName && newChild.lastName && newChild.dateOfBirth && newChild.emergencyContact && newChild.emergencyPhone) {
                  const child: Child = {
                    id: Date.now().toString(),
                    firstName: newChild.firstName,
                    lastName: newChild.lastName,
                    dateOfBirth: new Date(newChild.dateOfBirth),
                    parentIds: newChild.parentIds,
                    emergencyContact: newChild.emergencyContact,
                    emergencyPhone: newChild.emergencyPhone,
                    allergies: newChild.allergies.length > 0 ? newChild.allergies : undefined,
                  }
                  setChildren([...children, child])
                  setShowChildModal(false)
                  setNewChild({ firstName: '', lastName: '', dateOfBirth: '', parentIds: [], emergencyContact: '', emergencyPhone: '', allergies: [] })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showActivityModal}
        onClose={() => {
          setShowActivityModal(false)
          setNewActivity({ name: '', description: '', category: 'art', ageRange: '', duration: 0, capacity: 0, schedule: '' })
        }}
        title="Ajouter Activité"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Nom de l'activité"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={3}
              placeholder="Description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newActivity.category}
                onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as 'art' | 'sports' | 'educational' | 'music' | 'outdoor' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="art">Art</option>
                <option value="sports">Sport</option>
                <option value="educational">Éducatif</option>
                <option value="music">Musique</option>
                <option value="outdoor">Extérieur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tranche d'âge</label>
              <input
                type="text"
                value={newActivity.ageRange}
                onChange={(e) => setNewActivity({ ...newActivity, ageRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: 3-6 ans"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={newActivity.capacity}
                onChange={(e) => setNewActivity({ ...newActivity, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <input
                type="text"
                value={newActivity.schedule}
                onChange={(e) => setNewActivity({ ...newActivity, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Ex: Lundi 10h-10h45"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowActivityModal(false)
                setNewActivity({ name: '', description: '', category: 'art', ageRange: '', duration: 0, capacity: 0, schedule: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newActivity.name && newActivity.description && newActivity.duration > 0 && newActivity.capacity > 0) {
                  const activity: ActivityType = {
                    id: Date.now().toString(),
                    name: newActivity.name,
                    description: newActivity.description,
                    category: newActivity.category,
                    ageRange: newActivity.ageRange,
                    duration: newActivity.duration,
                    capacity: newActivity.capacity,
                    enrolled: 0,
                    schedule: newActivity.schedule,
                  }
                  setActivities([...activities, activity])
                  setShowActivityModal(false)
                  setNewActivity({ name: '', description: '', category: 'art', ageRange: '', duration: 0, capacity: 0, schedule: '' })
                }
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
