'use client'

import { useState, useEffect } from 'react'
import { FolderKanban, Users, Calendar, CheckCircle, BarChart3, Clock, AlertCircle, TrendingUp } from 'lucide-react'

type TabType = 'dashboard' | 'projects' | 'tasks' | 'team'

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate: Date
  endDate: Date
  budget: number
  spent: number
  client?: string
  teamMembers: string[]
  progress: number
  createdAt: Date
}

interface Task {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  assignee?: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
  createdAt: Date
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  projects: number
  tasksCompleted: number
  status: 'available' | 'busy' | 'offline'
}

export default function ProjectPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    const savedProjects = localStorage.getItem('project-projects')
    const savedTasks = localStorage.getItem('project-tasks')
    const savedTeam = localStorage.getItem('project-team')

    if (savedProjects) {
      const parsed = JSON.parse(savedProjects)
      setProjects(parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
        createdAt: new Date(p.createdAt),
      })))
    } else {
      const today = new Date()
      const sample: Project[] = [
        {
          id: '1',
          name: 'Refonte Site Web E-commerce',
          description: 'Modernisation complète de la plateforme e-commerce avec nouvelle interface utilisateur',
          status: 'in_progress',
          priority: 'high',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-31'),
          budget: 50000,
          spent: 32500,
          client: 'TechCorp SARL',
          teamMembers: ['Ahmed Benali', 'Fatima Kadri', 'Omar Cherif'],
          progress: 65,
          createdAt: new Date('2023-12-15'),
        },
        {
          id: '2',
          name: 'Application Mobile Food Delivery',
          description: 'Développement application mobile iOS et Android pour livraison de nourriture',
          status: 'in_progress',
          priority: 'urgent',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-30'),
          budget: 75000,
          spent: 45000,
          client: 'FoodDelivery Inc',
          teamMembers: ['Mohamed Amrani', 'Leila Kadri'],
          progress: 60,
          createdAt: new Date('2023-12-20'),
        },
        {
          id: '3',
          name: 'Migration Base de Données',
          description: 'Migration de MySQL vers PostgreSQL avec optimisation des performances',
          status: 'planning',
          priority: 'medium',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-15'),
          budget: 25000,
          spent: 0,
          teamMembers: ['Ahmed Benali', 'Sara Cherif'],
          progress: 10,
          createdAt: new Date('2024-01-10'),
        },
      ]
      setProjects(sample)
      localStorage.setItem('project-projects', JSON.stringify(sample))
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
          projectId: '1',
          projectName: 'Refonte Site Web E-commerce',
          title: 'Design nouvelle interface utilisateur',
          description: 'Créer les maquettes Figma pour la nouvelle interface',
          assignee: 'Fatima Kadri',
          status: 'in_progress',
          priority: 'high',
          dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          estimatedHours: 40,
          actualHours: 28,
          tags: ['design', 'ui/ux'],
          createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          projectId: '1',
          projectName: 'Refonte Site Web E-commerce',
          title: 'Intégration API paiement',
          description: 'Intégrer Stripe pour les paiements en ligne',
          assignee: 'Ahmed Benali',
          status: 'review',
          priority: 'urgent',
          dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
          estimatedHours: 16,
          actualHours: 18,
          tags: ['backend', 'api'],
          createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          projectId: '2',
          projectName: 'Application Mobile Food Delivery',
          title: 'Écran de connexion mobile',
          description: 'Développer l\'écran de connexion avec authentification',
          assignee: 'Mohamed Amrani',
          status: 'done',
          priority: 'high',
          dueDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
          estimatedHours: 12,
          actualHours: 10,
          tags: ['mobile', 'ios', 'android'],
          createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
        },
      ]
      setTasks(sample)
      localStorage.setItem('project-tasks', JSON.stringify(sample))
    }

    if (savedTeam) {
      setTeamMembers(JSON.parse(savedTeam))
    } else {
      const sample: TeamMember[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@team.com',
          role: 'Développeur Full Stack',
          department: 'Développement',
          projects: 5,
          tasksCompleted: 128,
          status: 'busy',
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@team.com',
          role: 'Designer UI/UX',
          department: 'Design',
          projects: 4,
          tasksCompleted: 95,
          status: 'available',
        },
        {
          id: '3',
          name: 'Omar Cherif',
          email: 'omar@team.com',
          role: 'Développeur Frontend',
          department: 'Développement',
          projects: 3,
          tasksCompleted: 78,
          status: 'available',
        },
      ]
      setTeamMembers(sample)
      localStorage.setItem('project-team', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('project-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('project-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (teamMembers.length > 0) localStorage.setItem('project-team', JSON.stringify(teamMembers))
  }, [teamMembers])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'projects' as TabType, label: 'Projets', icon: FolderKanban },
    { id: 'tasks' as TabType, label: 'Tâches', icon: CheckCircle },
    { id: 'team' as TabType, label: 'Équipe', icon: Users },
  ]

  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length
  const overdueTasks = tasks.filter(t => {
    if (t.dueDate && t.status !== 'done') {
      return new Date(t.dueDate) < new Date()
    }
    return false
  }).length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
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
                      ? 'text-rose-600 border-b-2 border-rose-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Projets Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeProjects}</p>
                    <p className="text-xs text-gray-500 mt-1">{projects.length} total</p>
                  </div>
                  <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Tâches En Cours</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingTasks}</p>
                    {overdueTasks > 0 && (
                      <p className="text-xs text-red-600 mt-1">{overdueTasks} en retard</p>
                    )}
                  </div>
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Budget Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{(totalBudget / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-gray-500 mt-1">€{(totalSpent / 1000).toFixed(0)}k dépensé</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-rose-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Équipe</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{teamMembers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{teamMembers.filter(m => m.status === 'available').length} disponibles</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {overdueTasks > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Tâches en retard ({overdueTasks})
                </h3>
                <div className="space-y-2">
                  {tasks
                    .filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done')
                    .slice(0, 3)
                    .map((task) => (
                      <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                        <span className="text-gray-700 font-medium">{task.title}</span>
                        <span className="text-red-600 mt-1 sm:mt-0">
                          Échéance: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'Non définie'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Projets</h3>
                  <p className="text-sm text-gray-600">Suivi complet des projets avec budget et délais</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Tâches</h3>
                  <p className="text-sm text-gray-600">Création, assignation et suivi des tâches</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Équipe</h3>
                  <p className="text-sm text-gray-600">Collaboration et communication d'équipe</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Kanban Board</h3>
                  <p className="text-sm text-gray-600">Vue kanban pour gestion visuelle des tâches</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Suivi Budget</h3>
                  <p className="text-sm text-gray-600">Budget vs dépenses en temps réel</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses de performance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Projets</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                Nouveau Projet
              </button>
            </div>
            {projects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun projet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const budgetUsage = (project.spent / project.budget) * 100
                  const daysRemaining = Math.ceil((project.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          {project.client && (
                            <p className="text-sm text-gray-500 mb-2">👤 Client: {project.client}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                            project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'completed' ? 'Terminé' :
                             project.status === 'in_progress' ? 'En cours' :
                             project.status === 'on_hold' ? 'En pause' :
                             project.status === 'cancelled' ? 'Annulé' : 'Planification'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            project.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            project.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.priority === 'urgent' ? 'Urgent' :
                             project.priority === 'high' ? 'Haute' :
                             project.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Progression</span>
                            <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                project.progress >= 80 ? 'bg-green-500' :
                                project.progress >= 50 ? 'bg-blue-500' :
                                project.progress >= 25 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Date début</p>
                            <p className="text-sm font-medium text-gray-900">{new Date(project.startDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date fin</p>
                            <p className="text-sm font-medium text-gray-900">{new Date(project.endDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Jours restants</p>
                            <p className={`text-sm font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-gray-900'}`}>
                              {daysRemaining < 0 ? `+${Math.abs(daysRemaining)}` : daysRemaining}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Budget</p>
                            <p className="text-sm font-medium text-gray-900">€{project.budget.toLocaleString()}</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Budget utilisé</span>
                            <span className={`text-xs font-medium ${
                              budgetUsage > 90 ? 'text-red-600' :
                              budgetUsage > 75 ? 'text-yellow-600' : 'text-gray-700'
                            }`}>
                              €{project.spent.toLocaleString()} / €{project.budget.toLocaleString()} ({budgetUsage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                budgetUsage > 90 ? 'bg-red-500' :
                                budgetUsage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
                            />
                          </div>
                        </div>

                        {project.teamMembers.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">👥 Équipe ({project.teamMembers.length}):</p>
                            <div className="flex flex-wrap gap-2">
                              {project.teamMembers.map((member, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {member}
                                </span>
                              ))}
                            </div>
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

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tâches</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
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
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
                  return (
                    <div key={task.id} className={`bg-white rounded-xl shadow-lg border p-4 sm:p-6 hover:shadow-xl transition-shadow ${
                      isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <p className="text-xs text-gray-500 mt-1">📁 {task.projectName}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status === 'done' ? 'Terminé' :
                             task.status === 'review' ? 'En révision' :
                             task.status === 'in_progress' ? 'En cours' : 'À faire'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.priority === 'urgent' ? 'Urgent' :
                             task.priority === 'high' ? 'Haute' :
                             task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {task.assignee && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            Assigné à: <span className="font-medium">{task.assignee}</span>
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className={`flex items-center gap-2 text-sm ${
                            isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'
                          }`}>
                            <Calendar className="w-4 h-4" />
                            Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                            {isOverdue && <span className="text-xs">(En retard!)</span>}
                          </div>
                        )}

                        {(task.estimatedHours || task.actualHours) && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {task.estimatedHours && (
                              <span>⏱️ Estimé: {task.estimatedHours}h</span>
                            )}
                            {task.actualHours && (
                              <span>✓ Réel: {task.actualHours}h</span>
                            )}
                            {task.estimatedHours && task.actualHours && (
                              <span className={`${
                                task.actualHours > task.estimatedHours ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {task.actualHours > task.estimatedHours ? '+' : ''}{(task.actualHours - task.estimatedHours).toFixed(0)}h
                              </span>
                            )}
                          </div>
                        )}

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {task.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                #{tag}
                              </span>
                            ))}
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

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Équipe</h2>
            </div>
            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun membre d'équipe</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500 mt-1">{member.department}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.status === 'available' ? 'bg-green-100 text-green-800' :
                        member.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'available' ? 'Disponible' :
                         member.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">📧 {member.email}</p>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Projets</span>
                        <span className="font-bold text-gray-900">{member.projects}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Tâches complétées</span>
                        <span className="font-bold text-rose-600">{member.tasksCompleted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}