'use client'

import { useState, useEffect } from 'react'
import { Heart, Calendar, BookOpen, Users, BarChart3, Stethoscope, Baby, Clock } from 'lucide-react'
import { Mom, Appointment, Resource } from '@/types/moms'

type TabType = 'dashboard' | 'moms' | 'appointments' | 'resources'

export default function MomsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [moms, setMoms] = useState<Mom[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    const savedMoms = localStorage.getItem('moms-moms')
    const savedAppointments = localStorage.getItem('moms-appointments')
    const savedResources = localStorage.getItem('moms-resources')

    if (savedMoms) {
      const parsed = JSON.parse(savedMoms)
      setMoms(parsed.map((m: any) => ({ ...m, dueDate: m.dueDate ? new Date(m.dueDate) : undefined })))
    } else {
      const sample: Mom[] = [
        {
          id: '1',
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: 'sophie@email.com',
          phone: '+33 6 11 22 33 44',
          dueDate: new Date('2024-09-15'),
          childrenIds: [],
          emergencyContact: 'Jean Bernard',
          address: 'Paris, France',
        },
        {
          id: '2',
          firstName: 'Marie',
          lastName: 'Lefebvre',
          email: 'marie@email.com',
          phone: '+33 6 55 66 77 88',
          childrenIds: ['1'],
          emergencyContact: 'Pierre Lefebvre',
        },
      ]
      setMoms(sample)
      localStorage.setItem('moms-moms', JSON.stringify(sample))
    }

    if (savedAppointments) {
      const parsed = JSON.parse(savedAppointments)
      setAppointments(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    }

    if (savedResources) {
      setResources(JSON.parse(savedResources))
    } else {
      const sample: Resource[] = [
        {
          id: '1',
          title: 'Nutrition Pendant la Grossesse',
          category: 'nutrition',
          content: 'Guide complet sur l\'alimentation équilibrée et halal pendant la grossesse avec recommandations islamiques...',
          tags: ['grossesse', 'nutrition', 'santé', 'halal'],
        },
        {
          id: '2',
          title: 'Exercices Post-Natal',
          category: 'exercise',
          content: 'Exercices doux pour retrouver la forme après l\'accouchement, adaptés aux valeurs religieuses...',
          tags: ['postnatal', 'sport', 'bien-être'],
        },
        {
          id: '3',
          title: 'Conseils Religieux pour Mamans',
          category: 'support',
          content: 'Guidance spirituelle et conseils pour les mamans basés sur les enseignements islamiques...',
          tags: ['religion', 'spiritualité', 'support'],
        },
      ]
      setResources(sample)
      localStorage.setItem('moms-resources', JSON.stringify(sample))
    }
  }, [])

  const upcomingAppointments = appointments.filter((a) => {
    return a.status === 'scheduled' && new Date(a.date) >= new Date()
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5)

  const categoryNames: Record<string, string> = {
    nutrition: 'Nutrition',
    exercise: 'Exercice',
    health: 'Santé',
    parenting: 'Parentalité',
    support: 'Support'
  }

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'moms' as TabType, label: 'Mamans', icon: Heart },
    { id: 'appointments' as TabType, label: 'Rendez-vous', icon: Calendar },
    { id: 'resources' as TabType, label: 'Ressources', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
                Gestion Mamans
              </h1>
              <p className="text-sm text-gray-500 mt-1">Support complet pour mamans avec rendez-vous et ressources</p>
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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Mamans</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{moms.length}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Rendez-vous</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{appointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">À Venir</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingAppointments.length}</p>
                  </div>
                  <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ressources</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{resources.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {upcomingAppointments.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Prochains Rendez-vous
                </h3>
                <div className="space-y-2">
                  {upcomingAppointments.map((apt) => {
                    const mom = moms.find((m) => m.id === apt.momId)
                    return (
                      <div key={apt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm bg-white rounded-lg p-3">
                        <span className="text-gray-700 font-medium">
                          {mom?.firstName} {mom?.lastName} - {apt.type}
                        </span>
                        <span className="font-semibold text-blue-700 mt-1 sm:mt-0">
                          {new Date(apt.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Mamans</h3>
                  <p className="text-sm text-gray-600">Suivi complet avec informations personnelles et médicales</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rendez-vous</h3>
                  <p className="text-sm text-gray-600">Prénatals, postnatals et consultations avec professionnels de santé</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Ressources</h3>
                  <p className="text-sm text-gray-600">Articles, guides et conseils adaptés aux valeurs religieuses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Nutrition Halal</h3>
                  <p className="text-sm text-gray-600">Conseils nutritionnels avec produits halal uniquement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                  <p className="text-sm text-gray-600">Communauté et support pour mamans musulmanes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Grossesse</h3>
                  <p className="text-sm text-gray-600">Suivi de la grossesse avec rappels et conseils</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mamans</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ajouter Maman
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {moms.map((mom) => (
                <div key={mom.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                        {mom.firstName} {mom.lastName}
                      </h3>
                      {mom.dueDate && (
                        <p className="text-sm text-gray-600">
                          Terme: {new Date(mom.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{mom.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{mom.phone}</span>
                    </div>
                    {mom.address && (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{mom.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Rendez-vous</h2>
            <p className="text-gray-600 mb-6">Gestion des rendez-vous prénatals et postnatals</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nouveau Rendez-vous</h3>
                <p className="text-sm text-gray-600">Programmer un rendez-vous médical</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
                <p className="text-sm text-gray-600">Suivi médical et consultations</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Échographie</h3>
                <p className="text-sm text-gray-600">Rendez-vous échographie et examens</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ressources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{resource.title}</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs whitespace-nowrap">
                      {categoryNames[resource.category] || resource.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{resource.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
