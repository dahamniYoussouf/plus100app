'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Building2, Calendar, Users, Wrench, BarChart3, AlertCircle, CheckCircle, Clock } from 'lucide-react'

type TabType = 'dashboard' | 'maintenance' | 'bookings' | 'equipment' | 'staff'

interface Maintenance {
  id: string
  title: string
  description: string
  facility: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo: string
  scheduledDate: Date
  completedDate?: Date
  cost?: number
}

interface Booking {
  id: string
  facilityName: string
  bookedBy: string
  contactPhone: string
  date: Date
  startTime: string
  endTime: string
  purpose: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  attendees: number
}

interface Equipment {
  id: string
  name: string
  type: string
  location: string
  status: 'operational' | 'maintenance' | 'out_of_order'
  lastMaintenance?: Date
  nextMaintenance?: Date
  warrantyExpiry?: Date
}

interface Staff {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  activeTasks: number
}

export default function FacilityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showStaffModal, setShowStaffModal] = useState(false)
  const [newMaintenance, setNewMaintenance] = useState({ title: '', description: '', facility: '', priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent', assignedTo: '', scheduledDate: '', cost: 0 })
  const [newBooking, setNewBooking] = useState({ facilityName: '', bookedBy: '', contactPhone: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 })
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: '', email: '', phone: '' })

  useEffect(() => {
    const savedMaintenances = localStorage.getItem('facility-maintenances')
    const savedBookings = localStorage.getItem('facility-bookings')
    const savedEquipment = localStorage.getItem('facility-equipment')
    const savedStaff = localStorage.getItem('facility-staff')

    if (savedMaintenances) {
      const parsed = JSON.parse(savedMaintenances)
      setMaintenances(parsed.map((m: any) => ({
        ...m,
        scheduledDate: new Date(m.scheduledDate),
        completedDate: m.completedDate ? new Date(m.completedDate) : undefined,
      })))
    } else {
      const today = new Date()
      const sample: Maintenance[] = [
        {
          id: '1',
          title: 'Réparation système de climatisation',
          description: 'Problème avec la climatisation dans le hall principal',
          facility: 'Hall Principal',
          priority: 'high',
          status: 'in_progress',
          assignedTo: 'Ahmed Benali',
          scheduledDate: today,
          cost: 500,
        },
        {
          id: '2',
          title: 'Inspection sécurité',
          description: 'Inspection mensuelle des équipements de sécurité',
          facility: 'Bâtiment A',
          priority: 'medium',
          status: 'pending',
          assignedTo: 'Fatima Kadri',
          scheduledDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      ]
      setMaintenances(sample)
      localStorage.setItem('facility-maintenances', JSON.stringify(sample))
    }

    if (savedBookings) {
      const parsed = JSON.parse(savedBookings)
      setBookings(parsed.map((b: any) => ({
        ...b,
        date: new Date(b.date),
      })))
    } else {
      const today = new Date()
      const sample: Booking[] = [
        {
          id: '1',
          facilityName: 'Salle de conférence A',
          bookedBy: 'Omar Benali',
          contactPhone: '+213 555 1234',
          date: today,
          startTime: '10:00',
          endTime: '12:00',
          purpose: 'Réunion équipe',
          status: 'confirmed',
          attendees: 15,
        },
        {
          id: '2',
          facilityName: 'Salle polyvalente',
          bookedBy: 'Leila Kadri',
          contactPhone: '+213 555 5678',
          date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          startTime: '14:00',
          endTime: '17:00',
          purpose: 'Formation',
          status: 'pending',
          attendees: 30,
        },
      ]
      setBookings(sample)
      localStorage.setItem('facility-bookings', JSON.stringify(sample))
    }

    if (savedEquipment) {
      const parsed = JSON.parse(savedEquipment)
      setEquipment(parsed.map((e: any) => ({
        ...e,
        lastMaintenance: e.lastMaintenance ? new Date(e.lastMaintenance) : undefined,
        nextMaintenance: e.nextMaintenance ? new Date(e.nextMaintenance) : undefined,
        warrantyExpiry: e.warrantyExpiry ? new Date(e.warrantyExpiry) : undefined,
      })))
    } else {
      const sample: Equipment[] = [
        {
          id: '1',
          name: 'Système de climatisation',
          type: 'HVAC',
          location: 'Hall Principal',
          status: 'maintenance',
          lastMaintenance: new Date('2024-01-01'),
          nextMaintenance: new Date('2024-04-01'),
        },
        {
          id: '2',
          name: 'Ascenseur 1',
          type: 'Équipement',
          location: 'Bâtiment A',
          status: 'operational',
          lastMaintenance: new Date('2024-01-15'),
          nextMaintenance: new Date('2024-04-15'),
        },
      ]
      setEquipment(sample)
      localStorage.setItem('facility-equipment', JSON.stringify(sample))
    }

    if (savedStaff) {
      setStaff(JSON.parse(savedStaff))
    } else {
      const sample: Staff[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          role: 'Technicien',
          department: 'Maintenance',
          email: 'ahmed@email.com',
          phone: '+213 555 1111',
          activeTasks: 2,
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          role: 'Gestionnaire',
          department: 'Administration',
          email: 'fatima@email.com',
          phone: '+213 555 2222',
          activeTasks: 1,
        },
      ]
      setStaff(sample)
      localStorage.setItem('facility-staff', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (maintenances.length > 0) localStorage.setItem('facility-maintenances', JSON.stringify(maintenances))
  }, [maintenances])

  useEffect(() => {
    if (bookings.length > 0) localStorage.setItem('facility-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    if (equipment.length > 0) localStorage.setItem('facility-equipment', JSON.stringify(equipment))
  }, [equipment])

  useEffect(() => {
    if (staff.length > 0) localStorage.setItem('facility-staff', JSON.stringify(staff))
  }, [staff])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'maintenance' as TabType, label: 'Maintenance', icon: Wrench },
    { id: 'bookings' as TabType, label: 'Réservations', icon: Calendar },
    { id: 'equipment' as TabType, label: 'Équipements', icon: Building2 },
    { id: 'staff' as TabType, label: 'Personnel', icon: Users },
  ]

  const pendingMaintenances = maintenances.filter(m => m.status === 'pending' || m.status === 'in_progress').length
  const todayBookings = bookings.filter(b => {
    const today = new Date()
    return b.date.toDateString() === today.toDateString() && b.status === 'confirmed'
  })
  const operationalEquipment = equipment.filter(e => e.status === 'operational').length
  const urgentMaintenances = maintenances.filter(m => m.priority === 'urgent' && m.status !== 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                      ? 'text-slate-600 border-b-2 border-slate-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Maintenances</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{pendingMaintenances}</p>
                  </div>
                  <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réservations Aujourd'hui</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{todayBookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Équipements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{operationalEquipment}/{equipment.length}</p>
                  </div>
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Urgentes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{urgentMaintenances}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
              </div>
            </div>

            {urgentMaintenances > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">Maintenances Urgentes</h3>
                </div>
                <div className="space-y-2">
                  {maintenances
                    .filter(m => m.priority === 'urgent' && m.status !== 'completed')
                    .map((m) => (
                      <div key={m.id} className="bg-white rounded-lg p-3 text-sm">
                        <span className="font-medium text-gray-900">{m.title}</span>
                        <span className="text-gray-500 ml-2">- {m.facility}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Maintenance</h3>
                  <p className="text-sm text-gray-600">Planification et suivi des maintenances</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
                  <p className="text-sm text-gray-600">Gestion des réservations d'espaces</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Équipements</h3>
                  <p className="text-sm text-gray-600">Inventaire et suivi des équipements</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Personnel</h3>
                  <p className="text-sm text-gray-600">Gestion du personnel et des tâches</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Rapports</h3>
                  <p className="text-sm text-gray-600">Statistiques et analyses</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Alertes</h3>
                  <p className="text-sm text-gray-600">Notifications et alertes automatiques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Maintenances</h2>
              <button 
                onClick={() => setShowMaintenanceModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouvelle Maintenance
              </button>
            </div>
            {maintenances.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune maintenance</p>
              </div>
            ) : (
              <div className="space-y-4">
                {maintenances.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{m.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              m.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              m.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              m.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {m.priority === 'urgent' ? 'Urgent' :
                               m.priority === 'high' ? 'Élevée' :
                               m.priority === 'medium' ? 'Moyenne' : 'Basse'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              m.status === 'completed' ? 'bg-green-100 text-green-800' :
                              m.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              m.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {m.status === 'completed' ? 'Terminé' :
                               m.status === 'in_progress' ? 'En cours' :
                               m.status === 'cancelled' ? 'Annulé' : 'En attente'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">📍 {m.facility}</p>
                          <p className="text-gray-600">{m.description}</p>
                          <p className="text-gray-600">👤 Assigné à: {m.assignedTo}</p>
                          <p className="text-gray-500">
                            📅 {new Date(m.scheduledDate).toLocaleDateString('fr-FR')}
                          </p>
                          {m.cost && (
                            <p className="text-gray-700 font-medium">Coût: DZD{m.cost}</p>
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

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Réservations</h2>
              <button 
                onClick={() => setShowBookingModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouvelle Réservation
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune réservation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{booking.facilityName}</h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">👤 {booking.bookedBy}</p>
                          <p className="text-gray-600">📞 {booking.contactPhone}</p>
                          <p className="text-gray-600">📅 {new Date(booking.date).toLocaleDateString('fr-FR')}</p>
                          <div className="flex items-center gap-4">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{booking.startTime} - {booking.endTime}</span>
                          </div>
                          <p className="text-gray-600">🎯 {booking.purpose}</p>
                          <p className="text-gray-600">👥 {booking.attendees} participants</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmé' :
                         booking.status === 'cancelled' ? 'Annulé' :
                         booking.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Nouvel Équipement
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {equipment.map((eq) => (
                <div key={eq.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{eq.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      eq.status === 'operational' ? 'bg-green-100 text-green-800' :
                      eq.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {eq.status === 'operational' ? 'Opérationnel' :
                       eq.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Type: {eq.type}</p>
                    <p className="text-sm text-gray-600">📍 {eq.location}</p>
                    {eq.lastMaintenance && (
                      <p className="text-xs text-gray-500">
                        Dernière maintenance: {new Date(eq.lastMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {eq.nextMaintenance && (
                      <p className="text-xs text-gray-500">
                        Prochaine maintenance: {new Date(eq.nextMaintenance).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Personnel</h2>
              <button 
                onClick={() => setShowStaffModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Nouveau Membre
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {staff.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{member.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Rôle: {member.role}</p>
                    <p className="text-sm text-gray-600">Département: {member.department}</p>
                    <p className="text-sm text-gray-600">Email: {member.email}</p>
                    <p className="text-sm text-gray-600">Téléphone: {member.phone}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Tâches actives:</span>
                      <span className="font-medium text-slate-600">{member.activeTasks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => {
          setShowMaintenanceModal(false)
          setNewMaintenance({ title: '', description: '', facility: '', priority: 'medium', assignedTo: '', scheduledDate: '', cost: 0 })
        }}
        title="Nouvelle Maintenance"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={newMaintenance.title}
              onChange={(e) => setNewMaintenance({ ...newMaintenance, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Titre de la maintenance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newMaintenance.description}
              onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              rows={3}
              placeholder="Description de la maintenance..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Installation</label>
              <input
                type="text"
                value={newMaintenance.facility}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, facility: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Hall Principal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                value={newMaintenance.priority}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
              <input
                type="text"
                value={newMaintenance.assignedTo}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Nom de la personne"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date prévue</label>
              <input
                type="date"
                value={newMaintenance.scheduledDate}
                onChange={(e) => setNewMaintenance({ ...newMaintenance, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coût (DZD, optionnel)</label>
            <input
              type="number"
              value={newMaintenance.cost}
              onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowMaintenanceModal(false)
                setNewMaintenance({ title: '', description: '', facility: '', priority: 'medium', assignedTo: '', scheduledDate: '', cost: 0 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newMaintenance.title && newMaintenance.description && newMaintenance.facility && newMaintenance.assignedTo && newMaintenance.scheduledDate) {
                  const maintenance: Maintenance = {
                    id: Date.now().toString(),
                    title: newMaintenance.title,
                    description: newMaintenance.description,
                    facility: newMaintenance.facility,
                    priority: newMaintenance.priority,
                    status: 'pending',
                    assignedTo: newMaintenance.assignedTo,
                    scheduledDate: new Date(newMaintenance.scheduledDate),
                    cost: newMaintenance.cost > 0 ? newMaintenance.cost : undefined,
                  }
                  setMaintenances([...maintenances, maintenance])
                  setShowMaintenanceModal(false)
                  setNewMaintenance({ title: '', description: '', facility: '', priority: 'medium', assignedTo: '', scheduledDate: '', cost: 0 })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false)
          setNewBooking({ facilityName: '', bookedBy: '', contactPhone: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 })
        }}
        title="Nouvelle Réservation"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Installation</label>
            <input
              type="text"
              value={newBooking.facilityName}
              onChange={(e) => setNewBooking({ ...newBooking, facilityName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Salle de conférence A"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Réservé par</label>
              <input
                type="text"
                value={newBooking.bookedBy}
                onChange={(e) => setNewBooking({ ...newBooking, bookedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newBooking.contactPhone}
                onChange={(e) => setNewBooking({ ...newBooking, contactPhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newBooking.date}
              onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                value={newBooking.startTime}
                onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
              <input
                type="time"
                value={newBooking.endTime}
                onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objectif</label>
            <input
              type="text"
              value={newBooking.purpose}
              onChange={(e) => setNewBooking({ ...newBooking, purpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Ex: Réunion d'équipe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de participants</label>
            <input
              type="number"
              value={newBooking.attendees}
              onChange={(e) => setNewBooking({ ...newBooking, attendees: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              min="1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowBookingModal(false)
                setNewBooking({ facilityName: '', bookedBy: '', contactPhone: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newBooking.facilityName && newBooking.bookedBy && newBooking.contactPhone && newBooking.date && newBooking.startTime && newBooking.endTime && newBooking.purpose) {
                  const booking: Booking = {
                    id: Date.now().toString(),
                    facilityName: newBooking.facilityName,
                    bookedBy: newBooking.bookedBy,
                    contactPhone: newBooking.contactPhone,
                    date: new Date(newBooking.date),
                    startTime: newBooking.startTime,
                    endTime: newBooking.endTime,
                    purpose: newBooking.purpose,
                    status: 'pending',
                    attendees: newBooking.attendees,
                  }
                  setBookings([...bookings, booking])
                  setShowBookingModal(false)
                  setNewBooking({ facilityName: '', bookedBy: '', contactPhone: '', date: '', startTime: '', endTime: '', purpose: '', attendees: 1 })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStaffModal}
        onClose={() => {
          setShowStaffModal(false)
          setNewStaff({ name: '', role: '', department: '', email: '', phone: '' })
        }}
        title="Nouveau Membre"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <input
                type="text"
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Technicien"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
              <input
                type="text"
                value={newStaff.department}
                onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: Maintenance"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="text"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="+213 555 1234"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowStaffModal(false)
                setNewStaff({ name: '', role: '', department: '', email: '', phone: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newStaff.name && newStaff.role && newStaff.department && newStaff.email && newStaff.phone) {
                  const staffMember: Staff = {
                    id: Date.now().toString(),
                    name: newStaff.name,
                    role: newStaff.role,
                    department: newStaff.department,
                    email: newStaff.email,
                    phone: newStaff.phone,
                    activeTasks: 0,
                  }
                  setStaff([...staff, staffMember])
                  setShowStaffModal(false)
                  setNewStaff({ name: '', role: '', department: '', email: '', phone: '' })
                }
              }}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
