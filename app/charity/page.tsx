'use client'

import { useState, useEffect } from 'react'
import { Heart, DollarSign, Users, Package, BarChart3, TrendingUp, Calendar, FileText } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'donations' | 'beneficiaries' | 'projects' | 'volunteers'

interface Donation {
  id: string
  donorName: string
  amount: number
  type: 'money' | 'goods' | 'service'
  category: 'zakat' | 'sadaqa' | 'other'
  date: Date
  description: string
  status: 'pending' | 'received' | 'distributed'
}

interface Beneficiary {
  id: string
  name: string
  familySize: number
  needs: string[]
  status: 'active' | 'pending' | 'completed'
  assistanceReceived: number
  lastAssistance: Date
  notes: string
}

interface Project {
  id: string
  name: string
  description: string
  budget: number
  collected: number
  status: 'planning' | 'active' | 'completed'
  startDate: Date
  endDate?: Date
  beneficiaries: string[]
}

interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  skills: string[]
  availability: string[]
  hoursVolunteered: number
}

export default function CharityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [donations, setDonations] = useState<Donation[]>([])
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [showDonModal, setShowDonModal] = useState(false)
  const [showBeneficiaireModal, setShowBeneficiaireModal] = useState(false)
  const [showProjetModal, setShowProjetModal] = useState(false)
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [newDonation, setNewDonation] = useState({ donorName: '', amount: 0, type: 'money' as 'money' | 'goods' | 'service', category: 'zakat' as 'zakat' | 'sadaqa' | 'other', description: '', date: '' })
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', familySize: 1, needs: '', notes: '' })
  const [newProject, setNewProject] = useState({ name: '', description: '', budget: 0, startDate: '' })
  const [newVolunteer, setNewVolunteer] = useState({ name: '', email: '', phone: '', skills: '', availability: '' })

  useEffect(() => {
    const savedDonations = localStorage.getItem('charity-donations')
    const savedBeneficiaries = localStorage.getItem('charity-beneficiaries')
    const savedProjects = localStorage.getItem('charity-projects')
    const savedVolunteers = localStorage.getItem('charity-volunteers')

    if (savedDonations) {
      const parsed = JSON.parse(savedDonations)
      setDonations(parsed.map((d: any) => ({ ...d, date: new Date(d.date), lastAssistance: d.lastAssistance ? new Date(d.lastAssistance) : undefined })))
    } else {
      const sample: Donation[] = [
        { id: '1', donorName: 'Ahmed Benali', amount: 500, type: 'money', category: 'zakat', date: new Date(), description: 'Zakat annuelle', status: 'received' },
        { id: '2', donorName: 'Fatima Ouali', amount: 200, type: 'money', category: 'sadaqa', date: new Date(), description: 'Sadaqa pour Ramadan', status: 'received' },
        { id: '3', donorName: 'Mohamed Khelif', amount: 1000, type: 'money', category: 'zakat', date: new Date(), description: 'Zakat pour orphelins', status: 'distributed' },
      ]
      setDonations(sample)
      localStorage.setItem('charity-donations', JSON.stringify(sample))
    }

    if (savedBeneficiaries) {
      const parsed = JSON.parse(savedBeneficiaries)
      setBeneficiaries(parsed.map((b: any) => ({ ...b, lastAssistance: b.lastAssistance ? new Date(b.lastAssistance) : undefined })))
    } else {
      const sample: Beneficiary[] = [
        { id: '1', name: 'Famille Bouzid', familySize: 5, needs: ['Nourriture', 'Vêtements'], status: 'active', assistanceReceived: 300, lastAssistance: new Date(), notes: 'Besoins urgents' },
        { id: '2', name: 'Famille Mekki', familySize: 3, needs: ['Médicaments'], status: 'active', assistanceReceived: 150, lastAssistance: new Date(), notes: 'Suivi médical' },
        { id: '3', name: 'Famille Aissaoui', familySize: 7, needs: ['Nourriture', 'Loyer'], status: 'pending', assistanceReceived: 0, lastAssistance: new Date(), notes: 'En attente d\'évaluation' },
      ]
      setBeneficiaries(sample)
      localStorage.setItem('charity-beneficiaries', JSON.stringify(sample))
    }

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({ ...p, startDate: new Date(p.startDate), endDate: p.endDate ? new Date(p.endDate) : undefined })))
    } else {
      const sample: Project[] = [
        { id: '1', name: 'Aide aux Orphelins', description: 'Distribution de fournitures scolaires', budget: 2000, collected: 1500, status: 'active', startDate: new Date(), beneficiaries: ['1', '2'] },
        { id: '2', name: 'Ramadan 2024', description: 'Distribution de paniers alimentaires', budget: 5000, collected: 3200, status: 'active', startDate: new Date(), beneficiaries: ['1', '2', '3'] },
      ]
      setProjects(sample)
      localStorage.setItem('charity-projects', JSON.stringify(sample))
    }

    if (savedVolunteers) {
      setVolunteers(JSON.parse(savedVolunteers))
    } else {
      const sample: Volunteer[] = [
        { id: '1', name: 'Sara Boudiaf', email: 'sara@example.com', phone: '0555123456', skills: ['Organisation', 'Communication'], availability: ['Weekend'], hoursVolunteered: 20 },
        { id: '2', name: 'Kamel Touati', email: 'kamel@example.com', phone: '0555654321', skills: ['Logistique'], availability: ['Soir'], hoursVolunteered: 15 },
      ]
      setVolunteers(sample)
      localStorage.setItem('charity-volunteers', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (donations.length > 0 || localStorage.getItem('charity-donations')) {
      localStorage.setItem('charity-donations', JSON.stringify(donations))
    }
  }, [donations])

  useEffect(() => {
    if (beneficiaries.length > 0 || localStorage.getItem('charity-beneficiaries')) {
      localStorage.setItem('charity-beneficiaries', JSON.stringify(beneficiaries))
    }
  }, [beneficiaries])

  useEffect(() => {
    if (projects.length > 0 || localStorage.getItem('charity-projects')) {
      localStorage.setItem('charity-projects', JSON.stringify(projects))
    }
  }, [projects])

  useEffect(() => {
    if (volunteers.length > 0 || localStorage.getItem('charity-volunteers')) {
      localStorage.setItem('charity-volunteers', JSON.stringify(volunteers))
    }
  }, [volunteers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'donations' as TabType, label: 'Dons', icon: DollarSign },
    { id: 'beneficiaries' as TabType, label: 'Bénéficiaires', icon: Users },
    { id: 'projects' as TabType, label: 'Projets', icon: Heart },
    { id: 'volunteers' as TabType, label: 'Volontaires', icon: Users },
  ]

  const totalDonations = donations.filter(d => d.status !== 'pending').reduce((sum, d) => sum + d.amount, 0)
  const totalDistributed = donations.filter(d => d.status === 'distributed').reduce((sum, d) => sum + d.amount, 0)
  const activeBeneficiaries = beneficiaries.filter(b => b.status === 'active').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                Gestion Association Caritative
              </h1>
              <p className="text-sm text-gray-500 mt-1">Système complet de gestion d'association caritative avec dons, bénéficiaires et projets</p>
            </div>
          </div>
        </div>
      </header>

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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dons Reçus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalDonations.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Distribué</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalDistributed.toFixed(0)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bénéficiaires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeBeneficiaries}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
                  </div>
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Dons</h3>
                  <p className="text-sm text-gray-600">Suivi des dons en argent et en nature avec transparence totale</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Bénéficiaires</h3>
                  <p className="text-sm text-gray-600">Gestion des bénéficiaires avec évaluation des besoins</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Projets Caritatifs</h3>
                  <p className="text-sm text-gray-600">Organisation et suivi de projets caritatifs et humanitaires</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Zakat & Sadaqa</h3>
                  <p className="text-sm text-gray-600">Calcul et distribution de la Zakat et Sadaqa selon les règles islamiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports Transparent</h3>
                  <p className="text-sm text-gray-600">Rapports détaillés pour transparence et confiance des donateurs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Volontaires</h3>
                  <p className="text-sm text-gray-600">Gestion des volontaires et bénévoles</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dons</h2>
              <button 
                onClick={() => setShowDonModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau Don
              </button>
            </div>
            {donations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun don enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{donation.donorName}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {donation.type === 'money' ? 'Monétaire' : donation.type === 'goods' ? 'En nature' : 'Service'} • {donation.category === 'zakat' ? 'Zakat' : donation.category === 'sadaqa' ? 'Sadaqa' : 'Autre'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{donation.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(donation.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">DZD{donation.amount.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium  DZD{
                          donation.status === 'distributed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'received' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status === 'distributed' ? 'Distribué' :
                           donation.status === 'received' ? 'Reçu' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'beneficiaries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bénéficiaires</h2>
              <button 
                onClick={() => setShowBeneficiaireModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau Bénéficiaire
              </button>
            </div>
            {beneficiaries.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun bénéficiaire enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{beneficiary.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Famille de {beneficiary.familySize} personnes</p>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Besoins:</p>
                      <div className="flex flex-wrap gap-1">
                        {beneficiary.needs.map((need, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{need}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Assistance</p>
                        <p className="font-bold text-green-600">DZD{beneficiary.assistanceReceived}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                        beneficiary.status === 'active' ? 'bg-green-100 text-green-800' :
                        beneficiary.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {beneficiary.status === 'active' ? 'Actif' : beneficiary.status === 'pending' ? 'En attente' : 'Complété'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button 
                onClick={() => setShowProjetModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Budget: DZD{project.budget}</span>
                        <span className="text-gray-900 font-semibold">Collecté: DZD{project.collected}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: ` DZD{(project.collected / project.budget) * 100}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className={`px-2 py-1 rounded text-xs font-medium  DZD{
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' : project.status === 'active' ? 'Actif' : 'En planification'}
                      </span>
                      <span className="text-xs text-gray-500">{project.beneficiaries.length} bénéficiaires</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Volontaires</h2>
              <button 
                onClick={() => setShowVolunteerModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau Volontaire
              </button>
            </div>
            {volunteers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun volontaire enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{volunteer.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{volunteer.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{volunteer.phone}</p>
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Compétences:</p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Heures</p>
                        <p className="font-bold text-blue-600">{volunteer.hoursVolunteered}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Disponibilité</p>
                        <p className="text-xs font-medium text-gray-700">{volunteer.availability.join(', ')}</p>
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
        isOpen={showDonModal}
        onClose={() => setShowDonModal(false)}
        title="Nouveau Don"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du donateur</label>
            <input
              type="text"
              value={newDonation.donorName}
              onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newDonation.type}
                onChange={(e) => setNewDonation({ ...newDonation, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="money">Argent</option>
                <option value="goods">Biens</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newDonation.category}
                onChange={(e) => setNewDonation({ ...newDonation, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="zakat">Zakat</option>
                <option value="sadaqa">Sadaqa</option>
                <option value="other">Autre</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (DZD)</label>
              <input
                type="number"
                value={newDonation.amount}
                onChange={(e) => setNewDonation({ ...newDonation, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newDonation.date}
                onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newDonation.description}
              onChange={(e) => setNewDonation({ ...newDonation, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Description du don"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowDonModal(false)
                setNewDonation({ donorName: '', amount: 0, type: 'money', category: 'zakat', description: '', date: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newDonation.donorName && newDonation.amount > 0 && newDonation.date) {
                  const donation: Donation = {
                    id: Date.now().toString(),
                    donorName: newDonation.donorName,
                    amount: newDonation.amount,
                    type: newDonation.type,
                    category: newDonation.category,
                    date: new Date(newDonation.date),
                    description: newDonation.description,
                    status: 'received',
                  }
                  setDonations([...donations, donation])
                  setShowDonModal(false)
                  setNewDonation({ donorName: '', amount: 0, type: 'money', category: 'zakat', description: '', date: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showBeneficiaireModal}
        onClose={() => setShowBeneficiaireModal(false)}
        title="Nouveau Bénéficiaire"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newBeneficiary.name}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Famille Benali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taille de la famille</label>
            <input
              type="number"
              value={newBeneficiary.familySize}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, familySize: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Besoins (séparés par des virgules)</label>
            <input
              type="text"
              value={newBeneficiary.needs}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, needs: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Nourriture, Vêtements, Médicaments"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={newBeneficiary.notes}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Notes sur le bénéficiaire"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowBeneficiaireModal(false)
                setNewBeneficiary({ name: '', familySize: 1, needs: '', notes: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newBeneficiary.name) {
                  const beneficiary: Beneficiary = {
                    id: Date.now().toString(),
                    name: newBeneficiary.name,
                    familySize: newBeneficiary.familySize,
                    needs: newBeneficiary.needs.split(',').map(n => n.trim()).filter(n => n),
                    status: 'active',
                    assistanceReceived: 0,
                    lastAssistance: new Date(),
                    notes: newBeneficiary.notes,
                  }
                  setBeneficiaries([...beneficiaries, beneficiary])
                  setShowBeneficiaireModal(false)
                  setNewBeneficiary({ name: '', familySize: 1, needs: '', notes: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showProjetModal}
        onClose={() => setShowProjetModal(false)}
        title="Nouveau Projet"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Aide aux orphelins"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Description du projet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (DZD)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowProjetModal(false)
                setNewProject({ name: '', description: '', budget: 0, startDate: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newProject.name && newProject.description && newProject.startDate) {
                  const project: Project = {
                    id: Date.now().toString(),
                    name: newProject.name,
                    description: newProject.description,
                    budget: newProject.budget,
                    collected: 0,
                    status: 'planning',
                    startDate: new Date(newProject.startDate),
                    beneficiaries: [],
                  }
                  setProjects([...projects, project])
                  setShowProjetModal(false)
                  setNewProject({ name: '', description: '', budget: 0, startDate: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showVolunteerModal}
        onClose={() => {
          setShowVolunteerModal(false)
          setNewVolunteer({ name: '', email: '', phone: '', skills: '', availability: '' })
        }}
        title="Nouveau Volontaire"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newVolunteer.name}
              onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newVolunteer.email}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: ahmed@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={newVolunteer.phone}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: +213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compétences (séparées par des virgules)</label>
            <input
              type="text"
              value={newVolunteer.skills}
              onChange={(e) => setNewVolunteer({ ...newVolunteer, skills: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Enseignement, Traduction, Organisation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité (séparées par des virgules)</label>
            <input
              type="text"
              value={newVolunteer.availability}
              onChange={(e) => setNewVolunteer({ ...newVolunteer, availability: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Lundi, Mercredi, Vendredi"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowVolunteerModal(false)
                setNewVolunteer({ name: '', email: '', phone: '', skills: '', availability: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newVolunteer.name && newVolunteer.email && newVolunteer.phone) {
                  const volunteer: Volunteer = {
                    id: Date.now().toString(),
                    name: newVolunteer.name,
                    email: newVolunteer.email,
                    phone: newVolunteer.phone,
                    skills: newVolunteer.skills.split(',').map(s => s.trim()).filter(s => s),
                    availability: newVolunteer.availability.split(',').map(a => a.trim()).filter(a => a),
                    hoursVolunteered: 0,
                  }
                  setVolunteers([...volunteers, volunteer])
                  setShowVolunteerModal(false)
                  setNewVolunteer({ name: '', email: '', phone: '', skills: '', availability: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
