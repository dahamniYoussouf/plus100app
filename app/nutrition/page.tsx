'use client'

import { useState, useEffect } from 'react'
import { Apple, Users, Calendar, FileText, BarChart3, TrendingDown, Heart, Target, Activity } from 'lucide-react'

type TabType = 'dashboard' | 'clients' | 'plans' | 'meals' | 'progress'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: 'male' | 'female'
  height: number
  currentWeight: number
  targetWeight: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_weight' | 'gain_weight' | 'maintain' | 'muscle_gain'
  medicalConditions?: string[]
  allergies?: string[]
  dietaryPreferences?: string[]
  joinDate: Date
  lastVisit?: Date
  totalVisits: number
}

interface MealPlan {
  id: string
  clientId: string
  clientName: string
  name: string
  startDate: Date
  endDate: Date
  caloriesPerDay: number
  meals: Array<{
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    name: string
    calories: number
    proteins: number
    carbs: number
    fats: number
  }>
  notes?: string
  status: 'active' | 'completed' | 'paused'
}

interface Progress {
  id: string
  clientId: string
  clientName: string
  date: Date
  weight: number
  bodyFat?: number
  measurements?: {
    waist?: number
    hips?: number
    chest?: number
    arms?: number
  }
  notes?: string
}

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [clients, setClients] = useState<Client[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [progress, setProgress] = useState<Progress[]>([])

  useEffect(() => {
    const savedClients = localStorage.getItem('nutrition-clients')
    const savedMealPlans = localStorage.getItem('nutrition-mealPlans')
    const savedProgress = localStorage.getItem('nutrition-progress')

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({
        ...c,
        dateOfBirth: new Date(c.dateOfBirth),
        joinDate: new Date(c.joinDate),
        lastVisit: c.lastVisit ? new Date(c.lastVisit) : undefined,
      })))
    } else {
      const sample: Client[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          dateOfBirth: new Date('1990-05-15'),
          gender: 'male',
          height: 175,
          currentWeight: 85,
          targetWeight: 75,
          activityLevel: 'moderate',
          goal: 'lose_weight',
          allergies: ['Gluten'],
          dietaryPreferences: ['Halal'],
          joinDate: new Date('2024-01-01'),
          lastVisit: new Date('2024-01-20'),
          totalVisits: 5,
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          dateOfBirth: new Date('1995-03-20'),
          gender: 'female',
          height: 165,
          currentWeight: 70,
          targetWeight: 65,
          activityLevel: 'active',
          goal: 'lose_weight',
          medicalConditions: ['Hypothyroïdie'],
          dietaryPreferences: ['Végétarien'],
          joinDate: new Date('2023-12-15'),
          lastVisit: new Date('2024-01-18'),
          totalVisits: 8,
        },
      ]
      setClients(sample)
      localStorage.setItem('nutrition-clients', JSON.stringify(sample))
    }

    if (savedMealPlans) {
      const parsed = JSON.parse(savedMealPlans)
      setMealPlans(parsed.map((mp: any) => ({
        ...mp,
        startDate: new Date(mp.startDate),
        endDate: new Date(mp.endDate),
      })))
    } else {
      const sample: MealPlan[] = [
        {
          id: '1',
          clientId: '1',
          clientName: 'Ahmed Benali',
          name: 'Plan Perte de Poids - Semaine 1',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-07'),
          caloriesPerDay: 1800,
          meals: [
            { type: 'breakfast', name: 'Omelette aux légumes + Pain complet', calories: 350, proteins: 20, carbs: 30, fats: 15 },
            { type: 'lunch', name: 'Salade de poulet grillé + Quinoa', calories: 550, proteins: 35, carbs: 45, fats: 18 },
            { type: 'dinner', name: 'Saumon + Légumes vapeur', calories: 450, proteins: 30, carbs: 25, fats: 20 },
            { type: 'snack', name: 'Yaourt grec + Fruits', calories: 150, proteins: 10, carbs: 15, fats: 5 },
          ],
          status: 'active',
          notes: 'Plan adapté sans gluten',
        },
      ]
      setMealPlans(sample)
      localStorage.setItem('nutrition-mealPlans', JSON.stringify(sample))
    }

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      setProgress(parsed.map((p: any) => ({
        ...p,
        date: new Date(p.date),
      })))
    }
  }, [])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('nutrition-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (mealPlans.length > 0) localStorage.setItem('nutrition-mealPlans', JSON.stringify(mealPlans))
  }, [mealPlans])

  useEffect(() => {
    if (progress.length > 0) localStorage.setItem('nutrition-progress', JSON.stringify(progress))
  }, [progress])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'plans' as TabType, label: 'Plans Alimentaires', icon: FileText },
    { id: 'meals' as TabType, label: 'Repas', icon: Apple },
    { id: 'progress' as TabType, label: 'Progrès', icon: TrendingDown },
  ]

  const activeClients = clients.length
  const activePlans = mealPlans.filter(p => p.status === 'active').length
  const clientsWithProgress = progress.length > 0 ? Array.from(new Set(progress.map(p => p.clientId))).length : 0
  const avgWeightLoss = clients.reduce((sum, c) => {
    const progressRecords = progress.filter(p => p.clientId === c.id).sort((a, b) => a.date.getTime() - b.date.getTime())
    if (progressRecords.length >= 2) {
      const first = progressRecords[0].weight
      const last = progressRecords[progressRecords.length - 1].weight
      return sum + (first - last)
    }
    return sum
  }, 0) / (clients.length || 1)

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
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
                      ? 'text-lime-600 border-b-2 border-lime-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-lime-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeClients}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-lime-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-lime-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Plans Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activePlans}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-lime-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Suivi Progrès</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{clientsWithProgress}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-lime-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Perte Moyenne</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{avgWeightLoss.toFixed(1)}kg</p>
                  </div>
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Évaluation Nutritionnelle</h3>
                  <p className="text-sm text-gray-600">Analyse complète des besoins nutritionnels</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Plans Alimentaires</h3>
                  <p className="text-sm text-gray-600">Création de plans personnalisés par objectif</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Progrès</h3>
                  <p className="text-sm text-gray-600">Graphiques et statistiques de progression</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Base de Données Repas</h3>
                  <p className="text-sm text-gray-600">Catalogue complet de repas et recettes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Calcul Macronutriments</h3>
                  <p className="text-sm text-gray-600">Suivi protéines, glucides, lipides</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports Détaillés</h3>
                  <p className="text-sm text-gray-600">Analyses et recommandations personnalisées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Nouveau Client
              </button>
            </div>
            {clients.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun client enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clients.map((client) => {
                  const age = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()
                  const bmi = client.currentWeight / Math.pow(client.height / 100, 2)
                  const weightDiff = client.currentWeight - client.targetWeight
                  const progressRecords = progress.filter(p => p.clientId === client.id).sort((a, b) => b.date.getTime() - a.date.getTime())
                  return (
                    <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
                        <span className="px-2 py-1 bg-lime-100 text-lime-800 rounded text-xs">
                          {client.gender === 'male' ? '♂' : '♀'} {age} ans
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Poids actuel:</span>
                          <span className="font-bold text-gray-900">{client.currentWeight} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Objectif:</span>
                          <span className="font-bold text-lime-600">{client.targetWeight} kg</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Différence:</span>
                          <span className={`font-bold  DZD{weightDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">IMC:</span>
                          <span className={`font-bold  DZD{
                            bmi < 18.5 ? 'text-blue-600' :
                            bmi < 25 ? 'text-green-600' :
                            bmi < 30 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {bmi.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Taille:</span>
                          <span className="font-medium text-gray-700">{client.height} cm</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Objectif:</span>
                          <span className={`px-2 py-0.5 rounded capitalize  DZD{
                            client.goal === 'lose_weight' ? 'bg-red-100 text-red-800' :
                            client.goal === 'gain_weight' ? 'bg-green-100 text-green-800' :
                            client.goal === 'muscle_gain' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {client.goal === 'lose_weight' ? 'Perte de poids' :
                             client.goal === 'gain_weight' ? 'Prise de poids' :
                             client.goal === 'muscle_gain' ? 'Prise de muscle' : 'Maintien'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Activité:</span>
                          <span className="capitalize text-gray-700">
                            {client.activityLevel === 'sedentary' ? 'Sédentaire' :
                             client.activityLevel === 'light' ? 'Légère' :
                             client.activityLevel === 'moderate' ? 'Modérée' :
                             client.activityLevel === 'active' ? 'Active' : 'Très active'}
                          </span>
                        </div>
                        {client.allergies && client.allergies.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">⚠️ Allergies:</p>
                            <div className="flex flex-wrap gap-1">
                              {client.allergies.map((allergy, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {progressRecords.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Dernière mesure:</p>
                            <p className="text-xs font-medium text-gray-700">
                              {new Date(progressRecords[0].date).toLocaleDateString('fr-FR')} - {progressRecords[0].weight} kg
                            </p>
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

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Plans Alimentaires</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Nouveau Plan
              </button>
            </div>
            {mealPlans.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun plan alimentaire</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mealPlans.map((plan) => {
                  const totalProteins = plan.meals.reduce((sum, m) => sum + m.proteins, 0)
                  const totalCarbs = plan.meals.reduce((sum, m) => sum + m.carbs, 0)
                  const totalFats = plan.meals.reduce((sum, m) => sum + m.fats, 0)
                  return (
                    <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Client: {plan.clientName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(plan.startDate).toLocaleDateString('fr-FR')} - {new Date(plan.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          plan.status === 'active' ? 'bg-green-100 text-green-800' :
                          plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.status === 'active' ? 'Actif' :
                           plan.status === 'completed' ? 'Terminé' : 'En pause'}
                        </span>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                        <p className="text-xs font-medium text-gray-900 mb-2">📊 Calories quotidiennes: <span className="text-lg font-bold text-lime-600">{plan.caloriesPerDay} kcal</span></p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Protéines</p>
                            <p className="font-bold text-gray-900">{totalProteins}g</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Glucides</p>
                            <p className="font-bold text-gray-900">{totalCarbs}g</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Lipides</p>
                            <p className="font-bold text-gray-900">{totalFats}g</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-900 mb-2">🍽️ Repas du jour:</p>
                        {plan.meals.map((meal, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {meal.type === 'breakfast' ? '🍳 Petit-déjeuner' :
                                 meal.type === 'lunch' ? '🍲 Déjeuner' :
                                 meal.type === 'dinner' ? '🍽️ Dîner' : '🥗 Collation'}
                              </p>
                              <span className="text-sm font-bold text-lime-600">{meal.calories} kcal</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{meal.name}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span>P: {meal.proteins}g</span>
                              <span>G: {meal.carbs}g</span>
                              <span>L: {meal.fats}g</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {plan.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-900 mb-1">📝 Notes:</p>
                          <p className="text-sm text-gray-600">{plan.notes}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Suivi des Progrès</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Nouvelle Mesure
              </button>
            </div>
            {progress.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun suivi enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((record) => {
                    const client = clients.find(c => c.id === record.clientId)
                    return (
                      <div key={record.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{record.clientName || 'Client'}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              📅 {new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-lime-600">{record.weight} kg</span>
                        </div>
                        
                        {record.measurements && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                            {record.measurements.waist && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-xs text-gray-500">Tour de taille</p>
                                <p className="text-sm font-bold text-gray-900">{record.measurements.waist} cm</p>
                              </div>
                            )}
                            {record.measurements.hips && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-xs text-gray-500">Tour de hanches</p>
                                <p className="text-sm font-bold text-gray-900">{record.measurements.hips} cm</p>
                              </div>
                            )}
                            {record.measurements.chest && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-xs text-gray-500">Tour de poitrine</p>
                                <p className="text-sm font-bold text-gray-900">{record.measurements.chest} cm</p>
                              </div>
                            )}
                            {record.measurements.arms && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-xs text-gray-500">Bras</p>
                                <p className="text-sm font-bold text-gray-900">{record.measurements.arms} cm</p>
                              </div>
                            )}
                          </div>
                        )}

                        {record.bodyFat && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500">Masse grasse: <span className="font-medium text-gray-900">{record.bodyFat}%</span></p>
                          </div>
                        )}

                        {record.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Notes:</p>
                            <p className="text-sm text-gray-700">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Base de Données Repas</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
              <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Base de données de repas en cours de développement</p>
              <p className="text-sm text-gray-500 mt-2">Recherchez et ajoutez des repas pour vos plans alimentaires</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}