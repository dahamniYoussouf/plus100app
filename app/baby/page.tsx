'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Baby, Calendar, Droplet, Moon, Heart, BarChart3, Clock, Activity } from 'lucide-react'

type TabType = 'dashboard' | 'feeding' | 'sleep' | 'diapers' | 'health' | 'milestones'

interface Feeding {
  id: string
  date: Date
  time: string
  type: 'breast' | 'bottle' | 'solid'
  amount?: number // ml for bottle, minutes for breast
  food?: string // for solid food
  notes?: string
}

interface Sleep {
  id: string
  date: Date
  startTime: string
  endTime?: string
  duration?: number // minutes
  type: 'nap' | 'night'
  notes?: string
}

interface Diaper {
  id: string
  date: Date
  time: string
  type: 'wet' | 'dirty' | 'both'
  notes?: string
}

interface Health {
  id: string
  date: Date
  type: 'vaccination' | 'medication' | 'temperature' | 'weight' | 'height' | 'other'
  value?: string
  notes?: string
}

interface Milestone {
  id: string
  date: Date
  category: 'motor' | 'language' | 'social' | 'cognitive'
  description: string
  notes?: string
}

export default function BabyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [feedings, setFeedings] = useState<Feeding[]>([])
  const [sleeps, setSleeps] = useState<Sleep[]>([])
  const [diapers, setDiapers] = useState<Diaper[]>([])
  const [showRepasModal, setShowRepasModal] = useState(false)
  const [showSommeilModal, setShowSommeilModal] = useState(false)
  const [showEtapeModal, setShowEtapeModal] = useState(false)
  const [showDiaperModal, setShowDiaperModal] = useState(false)
  const [showHealthModal, setShowHealthModal] = useState(false)
  const [newFeeding, setNewFeeding] = useState({ date: '', time: '', type: 'bottle' as 'breast' | 'bottle' | 'solid', amount: 0, food: '', notes: '' })
  const [newSleep, setNewSleep] = useState({ date: '', startTime: '', endTime: '', type: 'nap' as 'nap' | 'night', notes: '' })
  const [newDiaper, setNewDiaper] = useState({ date: '', time: '', type: 'wet' as 'wet' | 'dirty' | 'both', notes: '' })
  const [newHealth, setNewHealth] = useState({ date: '', type: 'temperature' as 'vaccination' | 'medication' | 'temperature' | 'weight' | 'height' | 'other', value: '', notes: '' })
  const [newMilestone, setNewMilestone] = useState({ date: '', category: 'motor' as 'motor' | 'language' | 'social' | 'cognitive', description: '', notes: '' })
  const [health, setHealth] = useState<Health[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    const savedFeedings = localStorage.getItem('baby-feedings')
    const savedSleeps = localStorage.getItem('baby-sleeps')
    const savedDiapers = localStorage.getItem('baby-diapers')
    const savedHealth = localStorage.getItem('baby-health')
    const savedMilestones = localStorage.getItem('baby-milestones')

    if (savedFeedings) {
      const parsed = JSON.parse(savedFeedings)
      setFeedings(parsed.map((f: any) => ({ ...f, date: new Date(f.date) })))
    } else {
      const today = new Date()
      const sample: Feeding[] = [
        {
          id: '1',
          date: today,
          time: '08:00',
          type: 'bottle',
          amount: 120,
        },
        {
          id: '2',
          date: today,
          time: '12:00',
          type: 'solid',
          food: 'Purée de carottes',
          amount: 50,
        },
      ]
      setFeedings(sample)
      localStorage.setItem('baby-feedings', JSON.stringify(sample))
    }

    if (savedSleeps) {
      const parsed = JSON.parse(savedSleeps)
      setSleeps(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const today = new Date()
      const sample: Sleep[] = [
        {
          id: '1',
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          duration: 90,
          type: 'nap',
        },
        {
          id: '2',
          date: today,
          startTime: '20:00',
          type: 'night',
        },
      ]
      setSleeps(sample)
      localStorage.setItem('baby-sleeps', JSON.stringify(sample))
    }

    if (savedDiapers) {
      const parsed = JSON.parse(savedDiapers)
      setDiapers(parsed.map((d: any) => ({ ...d, date: new Date(d.date) })))
    } else {
      const today = new Date()
      const sample: Diaper[] = [
        {
          id: '1',
          date: today,
          time: '09:00',
          type: 'wet',
        },
        {
          id: '2',
          date: today,
          time: '13:00',
          type: 'both',
        },
      ]
      setDiapers(sample)
      localStorage.setItem('baby-diapers', JSON.stringify(sample))
    }

    if (savedHealth) {
      const parsed = JSON.parse(savedHealth)
      setHealth(parsed.map((h: any) => ({ ...h, date: new Date(h.date) })))
    } else {
      const sample: Health[] = [
        {
          id: '1',
          date: new Date('2024-01-15'),
          type: 'vaccination',
          value: 'Vaccin DTP',
          notes: 'Première dose',
        },
        {
          id: '2',
          date: new Date('2024-01-20'),
          type: 'weight',
          value: '6.5 kg',
        },
      ]
      setHealth(sample)
      localStorage.setItem('baby-health', JSON.stringify(sample))
    }

    if (savedMilestones) {
      const parsed = JSON.parse(savedMilestones)
      setMilestones(parsed.map((m: any) => ({ ...m, date: new Date(m.date) })))
    } else {
      const sample: Milestone[] = [
        {
          id: '1',
          date: new Date('2024-01-10'),
          category: 'motor',
          description: 'Premier sourire',
        },
        {
          id: '2',
          date: new Date('2024-01-18'),
          category: 'motor',
          description: 'Tient sa tête droite',
        },
      ]
      setMilestones(sample)
      localStorage.setItem('baby-milestones', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (feedings.length > 0) localStorage.setItem('baby-feedings', JSON.stringify(feedings))
  }, [feedings])

  useEffect(() => {
    if (sleeps.length > 0) localStorage.setItem('baby-sleeps', JSON.stringify(sleeps))
  }, [sleeps])

  useEffect(() => {
    if (diapers.length > 0) localStorage.setItem('baby-diapers', JSON.stringify(diapers))
  }, [diapers])

  useEffect(() => {
    if (health.length > 0) localStorage.setItem('baby-health', JSON.stringify(health))
  }, [health])

  useEffect(() => {
    if (milestones.length > 0) localStorage.setItem('baby-milestones', JSON.stringify(milestones))
  }, [milestones])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'feeding' as TabType, label: 'Repas', icon: Droplet },
    { id: 'sleep' as TabType, label: 'Sommeil', icon: Moon },
    { id: 'diapers' as TabType, label: 'Couches', icon: Baby },
    { id: 'health' as TabType, label: 'Santé', icon: Heart },
    { id: 'milestones' as TabType, label: 'Étapes', icon: Activity },
  ]

  const today = new Date()
  const todayFeedings = feedings.filter(f => f.date.toDateString() === today.toDateString())
  const todaySleeps = sleeps.filter(s => s.date.toDateString() === today.toDateString())
  const todayDiapers = diapers.filter(d => d.date.toDateString() === today.toDateString())
  const totalFeedings = feedings.length
  const totalSleepHours = sleeps.reduce((sum, s) => sum + (s.duration || 0), 0) / 60

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Repas Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayFeedings.length}</p>
                  </div>
                  <Droplet className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Sommeil Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todaySleeps.length}</p>
                  </div>
                  <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Couches Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayDiapers.length}</p>
                  </div>
                  <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Heures de Sommeil</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalSleepHours.toFixed(1)}h</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Repas</h3>
                  <p className="text-sm text-gray-600">Allaitement, biberon, alimentation solide</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Sommeil</h3>
                  <p className="text-sm text-gray-600">Siestes et nuits</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Couches</h3>
                  <p className="text-sm text-gray-600">Changements et types</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Santé</h3>
                  <p className="text-sm text-gray-600">Vaccinations, médicaments, mesures</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Étapes Développement</h3>
                  <p className="text-sm text-gray-600">Suivi des étapes importantes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feeding' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Repas</h2>
              <button 
                onClick={() => setShowRepasModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau Repas
              </button>
            </div>
            {feedings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Droplet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun repas enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedings.map((feeding) => (
                  <div key={feeding.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {feeding.type === 'breast' ? 'Allaitement' :
                           feeding.type === 'bottle' ? 'Biberon' : 'Alimentation solide'}
                        </h3>
                        <div className="space-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            📅 {new Date(feeding.date).toLocaleDateString('fr-FR')} à {feeding.time}
                          </p>
                          {feeding.amount && (
                            <p className="text-gray-600">
                              {feeding.type === 'breast' ? `Durée:  DZD{feeding.amount} min` :
                               feeding.type === 'bottle' ? `Quantité:  DZD{feeding.amount} ml` :
                               `Quantité:  DZD{feeding.amount} g`}
                            </p>
                          )}
                          {feeding.food && (
                            <p className="text-gray-600">🍼 {feeding.food}</p>
                          )}
                          {feeding.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {feeding.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'sleep' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sommeil</h2>
              <button 
                onClick={() => setShowSommeilModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau Sommeil
              </button>
            </div>
            {sleeps.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Moon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun sommeil enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sleeps.map((sleep) => (
                  <div key={sleep.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {sleep.type === 'nap' ? 'Siestes' : 'Nuit'}
                        </h3>
                        <div className="space-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            📅 {new Date(sleep.date).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-gray-600">
                            ⏰ Début: {sleep.startTime}
                            {sleep.endTime && ` - Fin:  DZD{sleep.endTime}`}
                          </p>
                          {sleep.duration && (
                            <p className="text-gray-600">⏱️ Durée: {sleep.duration} min ({Math.round(sleep.duration / 60 * 10) / 10}h)</p>
                          )}
                          {sleep.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {sleep.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'diapers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Couches</h2>
              <button 
                onClick={() => setShowDiaperModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Couche
              </button>
            </div>
            {diapers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune couche enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {diapers.map((diaper) => (
                  <div key={diaper.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {diaper.type === 'wet' ? 'Mouillé' :
                           diaper.type === 'dirty' ? 'Sale' : 'Mouillé et Sale'}
                        </h3>
                        <div className="space-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            📅 {new Date(diaper.date).toLocaleDateString('fr-FR')} à {diaper.time}
                          </p>
                          {diaper.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {diaper.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Santé</h2>
              <button 
                onClick={() => setShowHealthModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Entrée
              </button>
            </div>
            {health.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune donnée de santé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {health.map((h) => (
                  <div key={h.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {h.type === 'vaccination' ? 'Vaccination' :
                           h.type === 'medication' ? 'Médicament' :
                           h.type === 'temperature' ? 'Température' :
                           h.type === 'weight' ? 'Poids' :
                           h.type === 'height' ? 'Taille' : 'Autre'}
                        </h3>
                        <div className="space-y-1 mt-2 text-sm">
                          <p className="text-gray-600">
                            📅 {new Date(h.date).toLocaleDateString('fr-FR')}
                          </p>
                          {h.value && (
                            <p className="text-gray-600">📊 {h.value}</p>
                          )}
                          {h.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {h.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Étapes de Développement</h2>
              <button 
                onClick={() => setShowEtapeModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Étape
              </button>
            </div>
            {milestones.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune étape enregistrée</p>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{milestone.description}</h3>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs capitalize">
                            {milestone.category === 'motor' ? 'Moteur' :
                             milestone.category === 'language' ? 'Langage' :
                             milestone.category === 'social' ? 'Social' : 'Cognitif'}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            📅 {new Date(milestone.date).toLocaleDateString('fr-FR')}
                          </p>
                          {milestone.notes && (
                            <p className="text-gray-500 text-xs mt-1">Note: {milestone.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showRepasModal}
        onClose={() => {
          setShowRepasModal(false)
          setNewFeeding({ date: '', time: '', type: 'bottle', amount: 0, food: '', notes: '' })
        }}
        title="Nouveau Repas"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newFeeding.date}
                onChange={(e) => setNewFeeding({ ...newFeeding, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newFeeding.time}
                onChange={(e) => setNewFeeding({ ...newFeeding, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newFeeding.type}
              onChange={(e) => setNewFeeding({ ...newFeeding, type: e.target.value as 'breast' | 'bottle' | 'solid' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="breast">Allaitement</option>
              <option value="bottle">Biberon</option>
              <option value="solid">Solide</option>
            </select>
          </div>
          {newFeeding.type === 'bottle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (ml)</label>
              <input
                type="number"
                value={newFeeding.amount}
                onChange={(e) => setNewFeeding({ ...newFeeding, amount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
          )}
          {newFeeding.type === 'solid' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aliment</label>
                <input
                  type="text"
                  value={newFeeding.food}
                  onChange={(e) => setNewFeeding({ ...newFeeding, food: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Ex: Purée de carottes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (g)</label>
                <input
                  type="number"
                  value={newFeeding.amount}
                  onChange={(e) => setNewFeeding({ ...newFeeding, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </>
          )}
          {newFeeding.type === 'breast' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input
                type="number"
                value={newFeeding.amount}
                onChange={(e) => setNewFeeding({ ...newFeeding, amount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                min="0"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newFeeding.notes}
              onChange={(e) => setNewFeeding({ ...newFeeding, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowRepasModal(false)
                setNewFeeding({ date: '', time: '', type: 'bottle', amount: 0, food: '', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newFeeding.date && newFeeding.time && (newFeeding.type === 'solid' ? newFeeding.food : true)) {
                  const feeding: Feeding = {
                    id: Date.now().toString(),
                    date: new Date(newFeeding.date),
                    time: newFeeding.time,
                    type: newFeeding.type,
                    amount: newFeeding.amount || undefined,
                    food: newFeeding.food || undefined,
                    notes: newFeeding.notes || undefined,
                  }
                  setFeedings([...feedings, feeding])
                  setShowRepasModal(false)
                  setNewFeeding({ date: '', time: '', type: 'bottle', amount: 0, food: '', notes: '' })
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
        isOpen={showSommeilModal}
        onClose={() => {
          setShowSommeilModal(false)
          setNewSleep({ date: '', startTime: '', endTime: '', type: 'nap', notes: '' })
        }}
        title="Nouveau Sommeil"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newSleep.date}
                onChange={(e) => setNewSleep({ ...newSleep, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newSleep.type}
                onChange={(e) => setNewSleep({ ...newSleep, type: e.target.value as 'nap' | 'night' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="nap">Sieste</option>
                <option value="night">Nuit</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                value={newSleep.startTime}
                onChange={(e) => setNewSleep({ ...newSleep, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin (optionnel)</label>
              <input
                type="time"
                value={newSleep.endTime}
                onChange={(e) => setNewSleep({ ...newSleep, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newSleep.notes}
              onChange={(e) => setNewSleep({ ...newSleep, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowSommeilModal(false)
                setNewSleep({ date: '', startTime: '', endTime: '', type: 'nap', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newSleep.date && newSleep.startTime) {
                  const start = new Date(` DZD{newSleep.date}T DZD{newSleep.startTime}`)
                  const end = newSleep.endTime ? new Date(` DZD{newSleep.date}T DZD{newSleep.endTime}`) : undefined
                  const duration = end ? Math.round((end.getTime() - start.getTime()) / 60000) : undefined
                  const sleep: Sleep = {
                    id: Date.now().toString(),
                    date: new Date(newSleep.date),
                    startTime: newSleep.startTime,
                    endTime: newSleep.endTime || undefined,
                    duration,
                    type: newSleep.type,
                    notes: newSleep.notes || undefined,
                  }
                  setSleeps([...sleeps, sleep])
                  setShowSommeilModal(false)
                  setNewSleep({ date: '', startTime: '', endTime: '', type: 'nap', notes: '' })
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
        isOpen={showEtapeModal}
        onClose={() => {
          setShowEtapeModal(false)
          setNewMilestone({ date: '', category: 'motor', description: '', notes: '' })
        }}
        title="Nouvelle Étape"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newMilestone.date}
                onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newMilestone.category}
                onChange={(e) => setNewMilestone({ ...newMilestone, category: e.target.value as 'motor' | 'language' | 'social' | 'cognitive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="motor">Moteur</option>
                <option value="language">Langage</option>
                <option value="social">Social</option>
                <option value="cognitive">Cognitif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Ex: Premier pas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newMilestone.notes}
              onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowEtapeModal(false)
                setNewMilestone({ date: '', category: 'motor', description: '', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMilestone.date && newMilestone.description) {
                  const milestone: Milestone = {
                    id: Date.now().toString(),
                    date: new Date(newMilestone.date),
                    category: newMilestone.category,
                    description: newMilestone.description,
                    notes: newMilestone.notes || undefined,
                  }
                  setMilestones([...milestones, milestone])
                  setShowEtapeModal(false)
                  setNewMilestone({ date: '', category: 'motor', description: '', notes: '' })
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
        isOpen={showDiaperModal}
        onClose={() => {
          setShowDiaperModal(false)
          setNewDiaper({ date: '', time: '', type: 'wet', notes: '' })
        }}
        title="Nouvelle Couche"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newDiaper.date}
                onChange={(e) => setNewDiaper({ ...newDiaper, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input
                type="time"
                value={newDiaper.time}
                onChange={(e) => setNewDiaper({ ...newDiaper, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={newDiaper.type}
              onChange={(e) => setNewDiaper({ ...newDiaper, type: e.target.value as 'wet' | 'dirty' | 'both' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="wet">Mouillé</option>
              <option value="dirty">Sale</option>
              <option value="both">Mouillé et Sale</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newDiaper.notes}
              onChange={(e) => setNewDiaper({ ...newDiaper, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDiaperModal(false)
                setNewDiaper({ date: '', time: '', type: 'wet', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDiaper.date && newDiaper.time) {
                  const diaper: Diaper = {
                    id: Date.now().toString(),
                    date: new Date(newDiaper.date),
                    time: newDiaper.time,
                    type: newDiaper.type,
                    notes: newDiaper.notes || undefined,
                  }
                  setDiapers([...diapers, diaper])
                  setShowDiaperModal(false)
                  setNewDiaper({ date: '', time: '', type: 'wet', notes: '' })
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
        isOpen={showHealthModal}
        onClose={() => {
          setShowHealthModal(false)
          setNewHealth({ date: '', type: 'temperature', value: '', notes: '' })
        }}
        title="Nouvelle Entrée Santé"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newHealth.date}
                onChange={(e) => setNewHealth({ ...newHealth, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newHealth.type}
                onChange={(e) => setNewHealth({ ...newHealth, type: e.target.value as 'vaccination' | 'medication' | 'temperature' | 'weight' | 'height' | 'other' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="temperature">Température</option>
                <option value="weight">Poids</option>
                <option value="height">Taille</option>
                <option value="vaccination">Vaccination</option>
                <option value="medication">Médicament</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
            <input
              type="text"
              value={newHealth.value}
              onChange={(e) => setNewHealth({ ...newHealth, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder={newHealth.type === 'temperature' ? 'Ex: 37.2°C' : newHealth.type === 'weight' ? 'Ex: 8.5 kg' : newHealth.type === 'height' ? 'Ex: 70 cm' : 'Valeur'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={newHealth.notes}
              onChange={(e) => setNewHealth({ ...newHealth, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={2}
              placeholder="Notes supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowHealthModal(false)
                setNewHealth({ date: '', type: 'temperature', value: '', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newHealth.date) {
                  const healthEntry: Health = {
                    id: Date.now().toString(),
                    date: new Date(newHealth.date),
                    type: newHealth.type,
                    value: newHealth.value || undefined,
                    notes: newHealth.notes || undefined,
                  }
                  setHealth([...health, healthEntry])
                  setShowHealthModal(false)
                  setNewHealth({ date: '', type: 'temperature', value: '', notes: '' })
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
