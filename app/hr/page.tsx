'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Briefcase, Users, UserPlus, Calendar, FileText, BarChart3, TrendingUp, DollarSign, Award } from 'lucide-react'

type TabType = 'dashboard' | 'employees' | 'candidates' | 'leaves' | 'recruitment'

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  hireDate: Date
  salary: number
  status: 'active' | 'on_leave' | 'terminated'
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  status: 'pending' | 'interview' | 'accepted' | 'rejected'
  appliedDate: Date
  resume?: string
}

interface Leave {
  id: string
  employeeId: string
  employeeName: string
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity'
  startDate: Date
  endDate: Date
  days: number
  status: 'pending' | 'approved' | 'rejected'
  reason: string
}

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '', position: '', status: 'pending' as 'pending' | 'interview' | 'accepted' | 'rejected' })
  const [newLeave, setNewLeave] = useState({ employeeId: '', type: 'vacation' as 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity', startDate: '', endDate: '', reason: '' })

  useEffect(() => {
    const savedEmployees = localStorage.getItem('hr-employees')
    const savedCandidates = localStorage.getItem('hr-candidates')
    const savedLeaves = localStorage.getItem('hr-leaves')

    if (savedEmployees) {
      const parsed = JSON.parse(savedEmployees)
      setEmployees(parsed.map((e: any) => ({
        ...e,
        hireDate: new Date(e.hireDate),
      })))
    } else {
      const sample: Employee[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@company.com', phone: '+213 555 1234', position: 'Développeur', department: 'IT', hireDate: new Date('2022-01-15'), salary: 45000, status: 'active' },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@company.com', phone: '+213 555 5678', position: 'Designer', department: 'Design', hireDate: new Date('2021-06-01'), salary: 40000, status: 'active' },
      ]
      setEmployees(sample)
      localStorage.setItem('hr-employees', JSON.stringify(sample))
    }

    if (savedCandidates) {
      const parsed = JSON.parse(savedCandidates)
      setCandidates(parsed.map((c: any) => ({
        ...c,
        appliedDate: new Date(c.appliedDate),
      })))
    } else {
      const sample: Candidate[] = [
        { id: '1', name: 'Omar Cherif', email: 'omar@email.com', phone: '+213 555 9999', position: 'Développeur Full Stack', status: 'interview', appliedDate: new Date('2024-01-20') },
      ]
      setCandidates(sample)
      localStorage.setItem('hr-candidates', JSON.stringify(sample))
    }

    if (savedLeaves) {
      const parsed = JSON.parse(savedLeaves)
      setLeaves(parsed.map((l: any) => ({
        ...l,
        startDate: new Date(l.startDate),
        endDate: new Date(l.endDate),
      })))
    }
  }, [])

  useEffect(() => {
    if (employees.length > 0) localStorage.setItem('hr-employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    if (candidates.length > 0) localStorage.setItem('hr-candidates', JSON.stringify(candidates))
  }, [candidates])

  useEffect(() => {
    if (leaves.length > 0) localStorage.setItem('hr-leaves', JSON.stringify(leaves))
  }, [leaves])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'employees' as TabType, label: 'Employés', icon: Users },
    { id: 'candidates' as TabType, label: 'Candidats', icon: UserPlus },
    { id: 'leaves' as TabType, label: 'Congés', icon: Calendar },
    { id: 'recruitment' as TabType, label: 'Recrutement', icon: Briefcase },
  ]

  const activeEmployees = employees.filter(e => e.status === 'active').length
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length
  const totalSalary = employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0)
  const activeCandidates = candidates.filter(c => c.status === 'pending' || c.status === 'interview').length

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
                    <p className="text-xs sm:text-sm text-gray-600">Employés Actifs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeEmployees}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Candidats</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{activeCandidates}</p>
                  </div>
                  <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Congés En Attente</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingLeaves}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Masse Salariale</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">DZD{(totalSalary / 1000).toFixed(0)}k</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            {pendingLeaves > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">Demandes de congés en attente</h3>
                <div className="space-y-2">
                  {leaves.filter(l => l.status === 'pending').slice(0, 3).map((leave) => (
                    <div key={leave.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 text-sm">
                      <span className="text-gray-700 font-medium">{leave.employeeName}</span>
                      <span className="text-gray-500 mt-1 sm:mt-0">
                        {leave.days} jour(s) - {leave.type === 'vacation' ? 'Vacances' : leave.type === 'sick' ? 'Maladie' : leave.type}
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
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Employés</h3>
                  <p className="text-sm text-gray-600">Dossiers complets et informations employés</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recrutement</h3>
                  <p className="text-sm text-gray-600">Gestion des candidatures et processus</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Congés</h3>
                  <p className="text-sm text-gray-600">Demandes et approbations de congés</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Évaluations</h3>
                  <p className="text-sm text-gray-600">Suivi des performances et évaluations</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Formation</h3>
                  <p className="text-sm text-gray-600">Programmes de formation et développement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Paie</h3>
                  <p className="text-sm text-gray-600">Gestion de la paie et avantages</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employés</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvel Employé
              </button>
            </div>
            {employees.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun employé enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {employees.map((employee) => (
                  <div key={employee.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{employee.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{employee.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{employee.phone}</p>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-600">Poste: {employee.position}</p>
                      <p className="text-sm text-gray-600">Département: {employee.department}</p>
                      <p className="text-xs text-gray-500">
                        Embauché le {new Date(employee.hireDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Salaire</p>
                        <p className="font-bold text-gray-900">DZD{employee.salary.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        employee.status === 'active' ? 'bg-green-100 text-green-800' :
                        employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 'active' ? 'Actif' :
                         employee.status === 'on_leave' ? 'En congé' : 'Terminé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Candidats</h2>
              <button 
                onClick={() => setShowCandidateModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau Candidat
              </button>
            </div>
            {candidates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun candidat</p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{candidate.email} - {candidate.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">Poste: {candidate.position}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Candidature le {new Date(candidate.appliedDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidate.status === 'accepted' ? 'Accepté' :
                         candidate.status === 'rejected' ? 'Rejeté' :
                         candidate.status === 'interview' ? 'Entretien' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaves' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Congés</h2>
              <button 
                onClick={() => setShowLeaveModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouvelle Demande
              </button>
            </div>
            {leaves.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune demande de congé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{leave.employeeName}</h3>
                        <p className="text-sm text-gray-600 mt-1 capitalize">
                          {leave.type === 'vacation' ? 'Vacances' :
                           leave.type === 'sick' ? 'Maladie' :
                           leave.type === 'personal' ? 'Personnel' :
                           leave.type === 'maternity' ? 'Maternité' : 'Paternité'} - {leave.days} jour(s)
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(leave.startDate).toLocaleDateString('fr-FR')} - {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status === 'approved' ? 'Approuvé' :
                         leave.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Processus de Recrutement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-10 h-10 text-blue-500" />
                  <span className="text-2xl font-bold text-blue-600">{candidates.filter(c => c.status === 'pending').length}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Candidatures</h3>
                <p className="text-sm text-gray-600">Nouvelles candidatures à traiter</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="w-10 h-10 text-green-500" />
                  <span className="text-2xl font-bold text-green-600">{candidates.filter(c => c.status === 'interview').length}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Entretiens</h3>
                <p className="text-sm text-gray-600">Entretiens programmés</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-10 h-10 text-purple-500" />
                  <span className="text-2xl font-bold text-purple-600">{candidates.filter(c => c.status === 'accepted').length}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Acceptés</h3>
                <p className="text-sm text-gray-600">Candidats acceptés</p>
              </div>
            </div>
      </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showCandidateModal}
        onClose={() => {
          setShowCandidateModal(false)
          setNewCandidate({ name: '', email: '', phone: '', position: '', status: 'pending' })
        }}
        title="Nouveau Candidat"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newCandidate.name}
              onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newCandidate.email}
                onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newCandidate.phone}
                onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
              <input
                type="text"
                value={newCandidate.position}
                onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Développeur Full Stack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={newCandidate.status}
                onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value as 'pending' | 'interview' | 'accepted' | 'rejected' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">En attente</option>
                <option value="interview">Entretien</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCandidateModal(false)
                setNewCandidate({ name: '', email: '', phone: '', position: '', status: 'pending' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newCandidate.name && newCandidate.email && newCandidate.phone && newCandidate.position) {
                  const candidate: Candidate = {
                    id: Date.now().toString(),
                    name: newCandidate.name,
                    email: newCandidate.email,
                    phone: newCandidate.phone,
                    position: newCandidate.position,
                    status: newCandidate.status,
                    appliedDate: new Date(),
                  }
                  setCandidates([...candidates, candidate])
                  setShowCandidateModal(false)
                  setNewCandidate({ name: '', email: '', phone: '', position: '', status: 'pending' })
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
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false)
          setNewLeave({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' })
        }}
        title="Nouvelle Demande de Congé"
        size="lg"
      >
        <div className="space-y-4">
          {employees.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
              <select
                value={newLeave.employeeId}
                onChange={(e) => setNewLeave({ ...newLeave, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name} - {employee.position}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de congé</label>
            <select
              value={newLeave.type}
              onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="vacation">Vacances</option>
              <option value="sick">Maladie</option>
              <option value="personal">Personnel</option>
              <option value="maternity">Maternité</option>
              <option value="paternity">Paternité</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
            <textarea
              value={newLeave.reason}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Raison de la demande de congé..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowLeaveModal(false)
                setNewLeave({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newLeave.employeeId && newLeave.startDate && newLeave.endDate && newLeave.reason) {
                  const employee = employees.find(e => e.id === newLeave.employeeId)
                  if (employee) {
                    const startDate = new Date(newLeave.startDate)
                    const endDate = new Date(newLeave.endDate)
                    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                    const leave: Leave = {
                      id: Date.now().toString(),
                      employeeId: newLeave.employeeId,
                      employeeName: employee.name,
                      type: newLeave.type,
                      startDate,
                      endDate,
                      days,
                      status: 'pending',
                      reason: newLeave.reason,
                    }
                    setLeaves([...leaves, leave])
                    setShowLeaveModal(false)
                    setNewLeave({ employeeId: '', type: 'vacation', startDate: '', endDate: '', reason: '' })
                  }
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