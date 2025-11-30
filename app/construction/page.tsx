'use client'

import { useState, useEffect } from 'react'
import { Building2, Users, Calendar, DollarSign, BarChart3, Hammer, CheckCircle, AlertCircle } from 'lucide-react'

type TabType = 'dashboard' | 'projects' | 'workers' | 'materials' | 'equipment' | 'invoices'

interface Project {
  id: string
  name: string
  client: string
  location: string
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure'
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed'
  startDate: Date
  endDate?: Date
  budget: number
  spent: number
  progress: number
  workers: string[]
}

interface Worker {
  id: string
  name: string
  role: 'engineer' | 'foreman' | 'carpenter' | 'electrician' | 'plumber' | 'laborer'
  phone: string
  email?: string
  projects: string[]
  hourlyRate: number
  status: 'available' | 'assigned' | 'on_leave'
}

interface Material {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  cost: number
  supplier: string
  projectId?: string
}

interface Equipment {
  id: string
  name: string
  type: string
  status: 'available' | 'in_use' | 'maintenance'
  location?: string
  projectId?: string
  lastMaintenance?: Date
}

export default function ConstructionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])

  useEffect(() => {
    const savedProjects = localStorage.getItem('construction-projects')
    const savedWorkers = localStorage.getItem('construction-workers')
    const savedMaterials = localStorage.getItem('construction-materials')
    const savedEquipment = localStorage.getItem('construction-equipment')

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : undefined,
      })))
    } else {
      const sample: Project[] = [
        {
          id: '1',
          name: 'Résidence Villa Moderne',
          client: 'Ahmed Benali',
          location: 'Hydra, Alger',
          type: 'residential',
          status: 'in_progress',
          startDate: new Date('2024-01-01'),
          budget: 500000,
          spent: 250000,
          progress: 50,
          workers: ['1', '2'],
        },
        {
          id: '2',
          name: 'Bureau Commercial',
          client: 'SARL TechCorp',
          location: 'Birkhadem, Alger',
          type: 'commercial',
          status: 'planning',
          startDate: new Date('2024-03-01'),
          budget: 300000,
          spent: 0,
          progress: 0,
          workers: [],
        },
      ]
      setProjects(sample)
      localStorage.setItem('construction-projects', JSON.stringify(sample))
    }

    if (savedWorkers) {
      setWorkers(JSON.parse(savedWorkers))
    } else {
      const sample: Worker[] = [
        {
          id: '1',
          name: 'Omar Amrani',
          role: 'engineer',
          phone: '+213 555 1111',
          email: 'omar@email.com',
          projects: ['1'],
          hourlyRate: 2500,
          status: 'assigned',
        },
        {
          id: '2',
          name: 'Kamel Touati',
          role: 'foreman',
          phone: '+213 555 2222',
          projects: ['1'],
          hourlyRate: 2000,
          status: 'assigned',
        },
      ]
      setWorkers(sample)
      localStorage.setItem('construction-workers', JSON.stringify(sample))
    }

    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials))
    } else {
      const sample: Material[] = [
        {
          id: '1',
          name: 'Ciment',
          category: 'Matériaux de base',
          unit: 'Tonne',
          quantity: 50,
          cost: 8000,
          supplier: 'Cimenterie Algérie',
          projectId: '1',
        },
        {
          id: '2',
          name: 'Acier',
          category: 'Matériaux de base',
          unit: 'Tonne',
          quantity: 20,
          cost: 120000,
          supplier: 'Aciérie Algérie',
          projectId: '1',
        },
      ]
      setMaterials(sample)
      localStorage.setItem('construction-materials', JSON.stringify(sample))
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
          name: 'Bétonnière',
          type: 'Machinerie',
          status: 'in_use',
          location: 'Chantier Hydra',
          projectId: '1',
        },
        {
          id: '2',
          name: 'Grue',
          type: 'Machinerie',
          status: 'available',
        },
      ]
      setEquipment(sample)
      localStorage.setItem('construction-equipment', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('construction-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (workers.length > 0) localStorage.setItem('construction-workers', JSON.stringify(workers))
  }, [workers])

  useEffect(() => {
    if (materials.length > 0) localStorage.setItem('construction-materials', JSON.stringify(materials))
  }, [materials])

  useEffect(() => {
    if (equipment.length > 0) localStorage.setItem('construction-equipment', JSON.stringify(equipment))
  }, [equipment])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'projects' as TabType, label: 'Projets', icon: Building2 },
    { id: 'workers' as TabType, label: 'Ouvriers', icon: Users },
    { id: 'materials' as TabType, label: 'Matériaux', icon: Hammer },
    { id: 'equipment' as TabType, label: 'Équipements', icon: Building2 },
    { id: 'invoices' as TabType, label: 'Factures', icon: DollarSign },
  ]

  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const availableWorkers = workers.filter(w => w.status === 'available').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
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
                      ? 'text-orange-600 border-b-2 border-orange-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
                  </div>
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Budget Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalBudget.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dépensé</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{totalSpent.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Ouvriers Disponibles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{availableWorkers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Projets</h3>
                  <p className="text-sm text-gray-600">Suivi des projets de construction</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Ouvriers</h3>
                  <p className="text-sm text-gray-600">Planning et affectation des équipes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Matériaux</h3>
                  <p className="text-sm text-gray-600">Inventaire et commandes</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Équipements</h3>
                  <p className="text-sm text-gray-600">Gestion du parc d'équipements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Budget</h3>
                  <p className="text-sm text-gray-600">Suivi financier des projets</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Facturation</h3>
                  <p className="text-sm text-gray-600">Gestion des factures clients</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Client: {project.client}</p>
                        <p className="text-sm text-gray-500 mt-1">📍 {project.location}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' :
                         project.status === 'in_progress' ? 'En cours' :
                         project.status === 'on_hold' ? 'En pause' : 'Planification'}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progression</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Budget: DZD{project.budget.toLocaleString()}</span>
                        <span className="text-gray-900 font-medium">Dépensé: DZD{project.spent.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        📅 Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}
                        {project.endDate && ` • Fin: ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ouvriers</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ajouter Ouvrier
              </button>
            </div>
            {workers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun ouvrier</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {workers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{worker.role}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        worker.status === 'available' ? 'bg-green-100 text-green-800' :
                        worker.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {worker.status === 'available' ? 'Disponible' :
                         worker.status === 'assigned' ? 'Assigné' : 'En congé'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">📞 {worker.phone}</p>
                      {worker.email && <p className="text-sm text-gray-600">📧 {worker.email}</p>}
                      <p className="text-sm text-gray-600">💰 {worker.hourlyRate} DA/h</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Projets: {worker.projects.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Matériaux</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ajouter Matériau
              </button>
            </div>
            {materials.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Hammer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun matériau</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => (
                  <div key={material.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{material.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{material.category}</p>
                        <p className="text-sm text-gray-500 mt-1">Fournisseur: {material.supplier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{material.quantity} {material.unit}</p>
                        <p className="text-sm text-gray-600">DZD{material.cost.toLocaleString()}</p>
                      </div>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Ajouter Équipement
              </button>
            </div>
            {equipment.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun équipement</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {equipment.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'available' ? 'Disponible' :
                         item.status === 'in_use' ? 'En utilisation' : 'Maintenance'}
                      </span>
                    </div>
                    {item.location && (
                      <p className="text-sm text-gray-600">📍 {item.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Factures</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <p className="text-gray-600">Gestion des factures clients</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
