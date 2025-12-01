'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Dumbbell, Users, Calendar, CreditCard, BarChart3, TrendingUp, Package, Clock, Award } from 'lucide-react'

type TabType = 'dashboard' | 'members' | 'subscriptions' | 'classes' | 'equipment'

interface Member {
  id: string
  name: string
  email: string
  phone: string
  subscriptionType: 'monthly' | 'quarterly' | 'yearly'
  startDate: Date
  endDate: Date
  status: 'active' | 'expired' | 'suspended'
  joinDate: Date
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalNotes?: string
  photo?: string
  visitsCount: number
  lastVisit?: Date
  preferredClasses?: string[]
  personalTrainer?: string
}

interface Subscription {
  id: string
  memberId: string
  type: 'monthly' | 'quarterly' | 'yearly'
  price: number
  startDate: Date
  endDate: Date
  status: 'active' | 'expired'
}

interface Class {
  id: string
  name: string
  instructor: string
  schedule: string
  capacity: number
  enrolled: number
  duration: number
  category: 'cardio' | 'strength' | 'flexibility' | 'martial_arts' | 'dance'
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  price: number
  room: string
  equipment?: string[]
  dayOfWeek: string
}

interface Equipment {
  id: string
  name: string
  category: string
  status: 'available' | 'maintenance' | 'out_of_order'
  lastMaintenance?: Date
  nextMaintenance?: Date
  location: string
  brand: string
  model: string
  purchaseDate: Date
  warrantyExpiry?: Date
  usageHours: number
  maintenanceNotes?: string
}

export default function GymPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [members, setMembers] = useState<Member[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showClassModal, setShowClassModal] = useState(false)
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', subscriptionType: 'monthly' as 'monthly' | 'quarterly' | 'yearly', startDate: '' })
  const [newClass, setNewClass] = useState({ name: '', instructor: '', schedule: '', capacity: 20, duration: 60, category: 'cardio' as 'cardio' | 'strength' | 'flexibility' | 'martial_arts' | 'dance', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced', description: '', price: 0, room: '', dayOfWeek: '' })
  const [newEquipment, setNewEquipment] = useState({ name: '', category: '', location: '', brand: '', model: '', purchaseDate: '' })

  useEffect(() => {
    const savedMembers = localStorage.getItem('gym-members')
    const savedSubscriptions = localStorage.getItem('gym-subscriptions')
    const savedClasses = localStorage.getItem('gym-classes')
    const savedEquipment = localStorage.getItem('gym-equipment')

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
        endDate: new Date(m.endDate),
      })))
    } else {
      const sample: Member[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          phone: '+213 555 1234',
          subscriptionType: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          status: 'active',
          joinDate: new Date('2023-06-15'),
          address: '123 Rue Didouche Mourad, Alger',
          emergencyContact: 'Fatima Benali',
          emergencyPhone: '+213 555 1235',
          medicalNotes: 'Aucune restriction',
          visitsCount: 45,
          lastVisit: new Date('2024-01-20'),
          preferredClasses: ['Cardio Intensif', 'Musculation'],
          personalTrainer: 'Omar',
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          phone: '+213 555 5678',
          subscriptionType: 'yearly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01'),
          status: 'active',
          joinDate: new Date('2023-03-10'),
          address: '45 Boulevard de la République, Oran',
          emergencyContact: 'Mohamed Kadri',
          emergencyPhone: '+213 555 5679',
          medicalNotes: 'Précautions avec charges lourdes',
          visitsCount: 128,
          lastVisit: new Date('2024-01-21'),
          preferredClasses: ['Yoga Matin', 'Pilates'],
        },
        {
          id: '3',
          name: 'Omar Cherif',
          email: 'omar@email.com',
          phone: '+213 555 9876',
          subscriptionType: 'quarterly',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-15'),
          status: 'active',
          joinDate: new Date('2023-11-20'),
          address: '78 Avenue de la Liberté, Constantine',
          emergencyContact: 'Sara Cherif',
          emergencyPhone: '+213 555 9877',
          visitsCount: 32,
          lastVisit: new Date('2024-01-19'),
          preferredClasses: ['Musculation', 'Boxe'],
          personalTrainer: 'Ali',
        },
        {
          id: '4',
          name: 'Leila Amrani',
          email: 'leila@email.com',
          phone: '+213 555 2468',
          subscriptionType: 'monthly',
          startDate: new Date('2023-12-01'),
          endDate: new Date('2024-01-01'),
          status: 'expired',
          joinDate: new Date('2023-09-05'),
          address: '12 Rue des Martyrs, Tizi Ouzou',
          visitsCount: 18,
          lastVisit: new Date('2023-12-28'),
          preferredClasses: ['Zumba', 'Aérobic'],
        },
      ]
      setMembers(sample)
      localStorage.setItem('gym-members', JSON.stringify(sample))
    }

    if (savedSubscriptions) {
      const parsed = JSON.parse(savedSubscriptions)
      setSubscriptions(parsed.map((s: any) => ({
        ...s,
        startDate: new Date(s.startDate),
        endDate: new Date(s.endDate),
      })))
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses))
    } else {
      const sample: Class[] = [
        { 
          id: '1', 
          name: 'Yoga Matin', 
          instructor: 'Sarah', 
          schedule: 'Lundi 8h-9h', 
          capacity: 20, 
          enrolled: 15, 
          duration: 60,
          category: 'flexibility',
          level: 'intermediate',
          description: 'Cours de yoga pour améliorer la flexibilité et la relaxation',
          price: 10,
          room: 'Salle Zen',
          equipment: ['Tapis de yoga', 'Blocs', 'Sangles'],
          dayOfWeek: 'Lundi',
        },
        { 
          id: '2', 
          name: 'Cardio Intensif', 
          instructor: 'Ali', 
          schedule: 'Mardi 18h-19h', 
          capacity: 30, 
          enrolled: 25, 
          duration: 60,
          category: 'cardio',
          level: 'advanced',
          description: 'Entraînement cardio haute intensité pour brûler les calories',
          price: 12,
          room: 'Salle Cardio',
          equipment: ['Tapis de course', 'Vélos elliptiques', 'Rameurs'],
          dayOfWeek: 'Mardi',
        },
        { 
          id: '3', 
          name: 'Musculation Complète', 
          instructor: 'Omar', 
          schedule: 'Mercredi 17h-18h', 
          capacity: 15, 
          enrolled: 12, 
          duration: 60,
          category: 'strength',
          level: 'intermediate',
          description: 'Séance complète de musculation pour développer la force',
          price: 15,
          room: 'Salle Musculation',
          equipment: ['Haltères', 'Barres', 'Machines'],
          dayOfWeek: 'Mercredi',
        },
        { 
          id: '4', 
          name: 'Boxe Fitness', 
          instructor: 'Karim', 
          schedule: 'Jeudi 19h-20h', 
          capacity: 20, 
          enrolled: 18, 
          duration: 60,
          category: 'martial_arts',
          level: 'beginner',
          description: 'Cours de boxe pour le cardio et la coordination',
          price: 18,
          room: 'Salle Boxe',
          equipment: ['Gants', 'Sacs de frappe', 'Protections'],
          dayOfWeek: 'Jeudi',
        },
        { 
          id: '5', 
          name: 'Zumba', 
          instructor: 'Nadia', 
          schedule: 'Vendredi 18h30-19h30', 
          capacity: 35, 
          enrolled: 28, 
          duration: 60,
          category: 'dance',
          level: 'beginner',
          description: 'Danse fitness énergique sur des rythmes latinos',
          price: 10,
          room: 'Salle Danse',
          equipment: [],
          dayOfWeek: 'Vendredi',
        },
        { 
          id: '6', 
          name: 'Pilates', 
          instructor: 'Sarah', 
          schedule: 'Samedi 10h-11h', 
          capacity: 15, 
          enrolled: 10, 
          duration: 60,
          category: 'flexibility',
          level: 'intermediate',
          description: 'Renforcement musculaire profond et amélioration de la posture',
          price: 12,
          room: 'Salle Zen',
          equipment: ['Ballons', 'Bandes élastiques', 'Matelas'],
          dayOfWeek: 'Samedi',
        },
      ]
      setClasses(sample)
      localStorage.setItem('gym-classes', JSON.stringify(sample))
    }

    if (savedEquipment) {
      const parsed = JSON.parse(savedEquipment)
      setEquipment(parsed.map((e: any) => ({
        ...e,
        lastMaintenance: e.lastMaintenance ? new Date(e.lastMaintenance) : undefined,
      })))
    } else {
      const sample: Equipment[] = [
        { 
          id: '1', 
          name: 'Tapis de Course ProForm', 
          category: 'Cardio', 
          status: 'available',
          location: 'Salle Cardio - Zone 1',
          brand: 'ProForm',
          model: 'TF-50',
          purchaseDate: new Date('2022-03-15'),
          warrantyExpiry: new Date('2025-03-15'),
          usageHours: 1250,
          lastMaintenance: new Date('2024-01-10'),
          nextMaintenance: new Date('2024-04-10'),
        },
        { 
          id: '2', 
          name: 'Vélo Elliptique Precor', 
          category: 'Cardio', 
          status: 'available',
          location: 'Salle Cardio - Zone 2',
          brand: 'Precor',
          model: 'EFX-885',
          purchaseDate: new Date('2021-11-20'),
          warrantyExpiry: new Date('2024-11-20'),
          usageHours: 2100,
          lastMaintenance: new Date('2023-12-05'),
          nextMaintenance: new Date('2024-03-05'),
        },
        { 
          id: '3', 
          name: 'Haltères Réglables', 
          category: 'Musculation', 
          status: 'maintenance', 
          lastMaintenance: new Date('2024-01-15'),
          location: 'Salle Musculation - Zone Libre',
          brand: 'PowerBlock',
          model: 'Sport 24kg',
          purchaseDate: new Date('2023-01-10'),
          usageHours: 890,
          maintenanceNotes: 'Vérification des mécanismes de verrouillage',
          nextMaintenance: new Date('2024-04-15'),
        },
        { 
          id: '4', 
          name: 'Machine à Presse Jambes', 
          category: 'Musculation', 
          status: 'available',
          location: 'Salle Musculation - Zone Machines',
          brand: 'Life Fitness',
          model: 'Leg Press',
          purchaseDate: new Date('2020-08-12'),
          warrantyExpiry: new Date('2023-08-12'),
          usageHours: 3450,
          lastMaintenance: new Date('2024-01-05'),
          nextMaintenance: new Date('2024-04-05'),
        },
        { 
          id: '5', 
          name: 'Rameur Concept2', 
          category: 'Cardio', 
          status: 'available',
          location: 'Salle Cardio - Zone 3',
          brand: 'Concept2',
          model: 'Model D',
          purchaseDate: new Date('2023-05-18'),
          warrantyExpiry: new Date('2026-05-18'),
          usageHours: 520,
          lastMaintenance: new Date('2024-01-08'),
          nextMaintenance: new Date('2024-04-08'),
        },
        { 
          id: '6', 
          name: 'Cage à Squat', 
          category: 'Musculation', 
          status: 'out_of_order',
          location: 'Salle Musculation - Zone Libre',
          brand: 'Rogue',
          model: 'RML-490',
          purchaseDate: new Date('2019-06-22'),
          usageHours: 4100,
          lastMaintenance: new Date('2023-11-20'),
          maintenanceNotes: 'Réparation de la barre de sécurité nécessaire',
        },
      ]
      setEquipment(sample)
      localStorage.setItem('gym-equipment', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('gym-members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    if (classes.length > 0) localStorage.setItem('gym-classes', JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    if (equipment.length > 0) localStorage.setItem('gym-equipment', JSON.stringify(equipment))
  }, [equipment])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
    { id: 'subscriptions' as TabType, label: 'Abonnements', icon: CreditCard },
    { id: 'classes' as TabType, label: 'Cours', icon: Calendar },
    { id: 'equipment' as TabType, label: 'Équipements', icon: Package },
  ]

  const activeMembers = members.filter(m => m.status === 'active').length
  const expiredMembers = members.filter(m => m.status === 'expired').length
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.price, 0)
  const monthlyRevenue = subscriptions
    .filter(s => s.type === 'monthly' && s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0)
  const availableEquipment = equipment.filter(e => e.status === 'available').length
  const equipmentInMaintenance = equipment.filter(e => e.status === 'maintenance').length
  const totalClassEnrollments = classes.reduce((sum, c) => sum + c.enrolled, 0)
  const averageClassOccupancy = classes.length > 0 
    ? (totalClassEnrollments / classes.reduce((sum, c) => sum + c.capacity, 0) * 100).toFixed(0)
    : 0
  const totalVisits = members.reduce((sum, m) => sum + (m.visitsCount || 0), 0)

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

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Membres Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeMembers}</p>
                    <p className="text-xs text-gray-500 mt-1">{members.length} total</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Revenus Mensuels</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{monthlyRevenue}</p>
                    <p className="text-xs text-gray-500 mt-1">DZD{totalRevenue} total</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{classes.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{averageClassOccupancy}% occupation</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Équipements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableEquipment}/{equipment.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{equipmentInMaintenance} maintenance</p>
                  </div>
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Visites Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalVisits}</p>
                  </div>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Inscriptions Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalClassEnrollments}</p>
                  </div>
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-red-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Membres Expirés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{expiredMembers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Membres</h3>
                  <p className="text-sm text-gray-600">Inscription, suivi et gestion des membres</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Abonnements</h3>
                  <p className="text-sm text-gray-600">Gestion des abonnements mensuels, trimestriels et annuels</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours Collectifs</h3>
                  <p className="text-sm text-gray-600">Planning et inscriptions aux cours</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Équipements</h3>
                  <p className="text-sm text-gray-600">Suivi de l'état et maintenance</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Gestion des paiements et facturation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses détaillées</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
              <button 
                onClick={() => setShowMemberModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Nouveau Membre
              </button>
            </div>
            {members.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun membre enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {members.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                        member.status === 'active' ? 'bg-green-100 text-green-800' :
                        member.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status === 'active' ? 'Actif' : member.status === 'expired' ? 'Expiré' : 'Suspendu'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📧 {member.email}</p>
                      <p className="text-sm text-gray-600">📞 {member.phone}</p>
                      {member.address && <p className="text-sm text-gray-600">📍 {member.address}</p>}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          🏋️ {member.visitsCount} visites
                        </span>
                        {member.lastVisit && (
                          <span className="text-gray-500">
                            Dernière: {new Date(member.lastVisit).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      {member.personalTrainer && (
                        <p className="text-sm text-blue-600">👤 Coach: {member.personalTrainer}</p>
                      )}
                      {member.preferredClasses && member.preferredClasses.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.preferredClasses.map((className, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {className}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Abonnement</p>
                          <p className="font-bold text-red-600 capitalize">{member.subscriptionType}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Jusqu'au {new Date(member.endDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Membre depuis</p>
                          <p className="text-xs font-medium text-gray-700">
                            {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Abonnements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Nouvel Abonnement
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                <CreditCard className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">DZD50</p>
                <p className="text-sm text-gray-600">Mensuel</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                <CreditCard className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">DZD130</p>
                <p className="text-sm text-gray-600">Trimestriel</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                <CreditCard className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">DZD500</p>
                <p className="text-sm text-gray-600">Annuel</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Abonnements Actifs</h3>
              <div className="space-y-3">
                {members.filter(m => m.status === 'active').map((member) => (
                  <div key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div>
                      <span className="font-medium text-gray-900">{member.name}</span>
                      <span className="text-sm text-gray-500 ml-2 capitalize">({member.subscriptionType})</span>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="text-sm text-gray-600">
                        Jusqu'au {new Date(member.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Cours</h2>
              <button 
                onClick={() => setShowClassModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Nouveau Cours
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {classes.map((classItem) => {
                const occupancyRate = (classItem.enrolled / classItem.capacity) * 100
                return (
                  <div key={classItem.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{classItem.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                        classItem.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        classItem.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {classItem.level === 'beginner' ? 'Débutant' :
                         classItem.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">👤 Instructeur: <span className="font-medium">{classItem.instructor}</span></p>
                    <p className="text-sm text-gray-600 mb-2">📅 {classItem.schedule}</p>
                    <p className="text-sm text-gray-600 mb-2">📍 {classItem.room}</p>
                    <p className="text-xs text-gray-500 mb-3">{classItem.description}</p>
                    {classItem.equipment && classItem.equipment.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Équipement:</p>
                        <div className="flex flex-wrap gap-1">
                          {classItem.equipment.map((eq, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Inscrits</p>
                          <p className="font-bold text-gray-900">{classItem.enrolled}/{classItem.capacity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Prix</p>
                          <p className="font-bold text-red-600">DZD{classItem.price}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full  DZD{
                            occupancyRate >= 90 ? 'bg-red-500' :
                            occupancyRate >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: ` DZD{occupancyRate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">⏱️ {classItem.duration} min</span>
                        <span className="text-gray-500">{occupancyRate.toFixed(0)}% rempli</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipements</h2>
              <button 
                onClick={() => setShowEquipmentModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ajouter Équipement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {equipment.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'available' ? 'Disponible' :
                       item.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">🏷️ Catégorie: <span className="font-medium">{item.category}</span></p>
                    <p className="text-sm text-gray-600">📍 Emplacement: {item.location}</p>
                    <p className="text-sm text-gray-600">🏭 Marque: {item.brand} {item.model}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">⏱️ {item.usageHours.toLocaleString()}h utilisées</span>
                      <span className="text-gray-500">
                        Acheté: {new Date(item.purchaseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {item.lastMaintenance && (
                      <p className="text-xs text-gray-500">
                        🔧 Dernière maintenance: {new Date(item.lastMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {item.nextMaintenance && (
                      <p className="text-xs text-orange-600">
                        📅 Prochaine maintenance: {new Date(item.nextMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {item.maintenanceNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                        <p className="text-xs text-yellow-800">⚠️ {item.maintenanceNotes}</p>
                      </div>
                    )}
                    {item.warrantyExpiry && (
                      <p className={`text-xs  DZD{
                        new Date(item.warrantyExpiry) > new Date() ? 'text-green-600' : 'text-red-600'
                      }`}>
                        🛡️ Garantie: {new Date(item.warrantyExpiry).toLocaleDateString('fr-FR')}
                        {new Date(item.warrantyExpiry) > new Date() ? ' (Active)' : ' (Expirée)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false)
          setNewMember({ name: '', email: '', phone: '', subscriptionType: 'monthly', startDate: '' })
        }}
        title="Nouveau Membre"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type d'abonnement</label>
              <select
                value={newMember.subscriptionType}
                onChange={(e) => setNewMember({ ...newMember, subscriptionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="monthly">Mensuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="yearly">Annuel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={newMember.startDate}
                onChange={(e) => setNewMember({ ...newMember, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMemberModal(false)
                setNewMember({ name: '', email: '', phone: '', subscriptionType: 'monthly', startDate: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMember.name && newMember.email && newMember.phone && newMember.startDate) {
                  const startDate = new Date(newMember.startDate)
                  const endDate = new Date(startDate)
                  if (newMember.subscriptionType === 'monthly') {
                    endDate.setMonth(endDate.getMonth() + 1)
                  } else if (newMember.subscriptionType === 'quarterly') {
                    endDate.setMonth(endDate.getMonth() + 3)
                  } else {
                    endDate.setFullYear(endDate.getFullYear() + 1)
                  }
                  const member: Member = {
                    id: Date.now().toString(),
                    name: newMember.name,
                    email: newMember.email,
                    phone: newMember.phone,
                    subscriptionType: newMember.subscriptionType,
                    startDate,
                    endDate,
                    status: 'active',
                    joinDate: new Date(),
                    visitsCount: 0,
                  }
                  setMembers([...members, member])
                  setShowMemberModal(false)
                  setNewMember({ name: '', email: '', phone: '', subscriptionType: 'monthly', startDate: '' })
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showClassModal}
        onClose={() => {
          setShowClassModal(false)
          setNewClass({ name: '', instructor: '', schedule: '', capacity: 20, duration: 60, category: 'cardio', level: 'beginner', description: '', price: 0, room: '', dayOfWeek: '' })
        }}
        title="Nouveau Cours"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours</label>
            <input
              type="text"
              value={newClass.name}
              onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Yoga Matin"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructeur</label>
              <input
                type="text"
                value={newClass.instructor}
                onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Karim Benali"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <input
                type="text"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Salle A"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newClass.category}
                onChange={(e) => setNewClass({ ...newClass, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Force</option>
                <option value="flexibility">Flexibilité</option>
                <option value="martial_arts">Arts martiaux</option>
                <option value="dance">Danse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={newClass.level}
                onChange={(e) => setNewClass({ ...newClass, level: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour de la semaine</label>
              <select
                value={newClass.dayOfWeek}
                onChange={(e) => setNewClass({ ...newClass, dayOfWeek: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="Lundi">Lundi</option>
                <option value="Mardi">Mardi</option>
                <option value="Mercredi">Mercredi</option>
                <option value="Jeudi">Jeudi</option>
                <option value="Vendredi">Vendredi</option>
                <option value="Samedi">Samedi</option>
                <option value="Dimanche">Dimanche</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horaire</label>
              <input
                type="time"
                value={newClass.schedule}
                onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input
                type="number"
                value={newClass.duration}
                onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) || 60 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                value={newClass.capacity}
                onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DZD)</label>
            <input
              type="number"
              value={newClass.price}
              onChange={(e) => setNewClass({ ...newClass, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newClass.description}
              onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Description du cours"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowClassModal(false)
                setNewClass({ name: '', instructor: '', schedule: '', capacity: 20, duration: 60, category: 'cardio', level: 'beginner', description: '', price: 0, room: '', dayOfWeek: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newClass.name && newClass.instructor && newClass.schedule && newClass.room && newClass.dayOfWeek) {
                  const classItem: Class = {
                    id: Date.now().toString(),
                    name: newClass.name,
                    instructor: newClass.instructor,
                    schedule: newClass.schedule,
                    capacity: newClass.capacity,
                    enrolled: 0,
                    duration: newClass.duration,
                    category: newClass.category,
                    level: newClass.level,
                    description: newClass.description,
                    price: newClass.price,
                    room: newClass.room,
                    dayOfWeek: newClass.dayOfWeek,
                  }
                  setClasses([...classes, classItem])
                  setShowClassModal(false)
                  setNewClass({ name: '', instructor: '', schedule: '', capacity: 20, duration: 60, category: 'cardio', level: 'beginner', description: '', price: 0, room: '', dayOfWeek: '' })
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
          setNewEquipment({ name: '', category: '', location: '', brand: '', model: '', purchaseDate: '' })
        }}
        title="Ajouter Équipement"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Tapis de course"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                value={newEquipment.category}
                onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Cardio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <input
                type="text"
                value={newEquipment.location}
                onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Zone A"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={newEquipment.brand}
                onChange={(e) => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Technogym"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                value={newEquipment.model}
                onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: Run 500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'achat</label>
            <input
              type="date"
              value={newEquipment.purchaseDate}
              onChange={(e) => setNewEquipment({ ...newEquipment, purchaseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowEquipmentModal(false)
                setNewEquipment({ name: '', category: '', location: '', brand: '', model: '', purchaseDate: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newEquipment.name && newEquipment.category && newEquipment.location && newEquipment.brand && newEquipment.model && newEquipment.purchaseDate) {
                  const equipmentItem: Equipment = {
                    id: Date.now().toString(),
                    name: newEquipment.name,
                    category: newEquipment.category,
                    status: 'available',
                    location: newEquipment.location,
                    brand: newEquipment.brand,
                    model: newEquipment.model,
                    purchaseDate: new Date(newEquipment.purchaseDate),
                    usageHours: 0,
                  }
                  setEquipment([...equipment, equipmentItem])
                  setShowEquipmentModal(false)
                  setNewEquipment({ name: '', category: '', location: '', brand: '', model: '', purchaseDate: '' })
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}