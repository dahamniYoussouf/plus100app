'use client'

import { useState, useEffect } from 'react'
import { Building, Calendar, Users, DollarSign, BarChart3, Clock, BookOpen, Heart } from 'lucide-react'

type TabType = 'dashboard' | 'events' | 'prayers' | 'services' | 'donations' | 'members'

interface Event {
  id: string
  title: string
  description: string
  type: 'lecture' | 'conference' | 'course' | 'ceremony' | 'other'
  date: Date
  time: string
  location: string
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface PrayerTime {
  id: string
  name: string
  time: string
  date: Date
}

interface Service {
  id: string
  name: string
  description: string
  type: 'marriage' | 'funeral' | 'baptism' | 'other'
  date: Date
  clientName: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Donation {
  id: string
  donorName: string
  amount: number
  purpose: string
  date: Date
  type: 'monthly' | 'special' | 'zakat' | 'sadaqa'
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  role: 'member' | 'volunteer' | 'imam' | 'administrator'
  joinedDate: Date
  attendanceCount: number
}

export default function MosquePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [events, setEvents] = useState<Event[]>([])
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const savedEvents = localStorage.getItem('mosque-events')
    const savedPrayerTimes = localStorage.getItem('mosque-prayer-times')
    const savedServices = localStorage.getItem('mosque-services')
    const savedDonations = localStorage.getItem('mosque-donations')
    const savedMembers = localStorage.getItem('mosque-members')

    if (savedEvents) {
      const parsed = JSON.parse(savedEvents)
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    } else {
      const sample: Event[] = [
        { id: '1', title: 'Cours de Tajwid', description: 'Cours de récitation du Coran', type: 'course', date: new Date(), time: '18:00', location: 'Salle principale', attendees: 25, status: 'upcoming' },
        { id: '2', title: 'Conférence Ramadan', description: 'Conférence sur les bienfaits du jeûne', type: 'conference', date: new Date(), time: '19:30', location: 'Salle principale', attendees: 50, status: 'upcoming' },
        { id: '3', title: 'Mariage', description: 'Cérémonie de mariage', type: 'ceremony', date: new Date(), time: '14:00', location: 'Salle événements', attendees: 100, status: 'upcoming' },
      ]
      setEvents(sample)
      localStorage.setItem('mosque-events', JSON.stringify(sample))
    }

    if (savedPrayerTimes) {
      const parsed = JSON.parse(savedPrayerTimes)
      setPrayerTimes(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })))
    } else {
      const today = new Date()
      const sample: PrayerTime[] = [
        { id: '1', name: 'Fajr', time: '05:30', date: today },
        { id: '2', name: 'Dhuhr', time: '12:45', date: today },
        { id: '3', name: 'Asr', time: '16:20', date: today },
        { id: '4', name: 'Maghrib', time: '19:15', date: today },
        { id: '5', name: 'Isha', time: '20:45', date: today },
      ]
      setPrayerTimes(sample)
      localStorage.setItem('mosque-prayer-times', JSON.stringify(sample))
    }

    if (savedServices) {
      const parsed = JSON.parse(savedServices)
      setServices(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const sample: Service[] = [
        { id: '1', name: 'Mariage', description: 'Cérémonie de mariage', type: 'marriage', date: new Date(), clientName: 'Ahmed & Fatima', status: 'scheduled' },
      ]
      setServices(sample)
      localStorage.setItem('mosque-services', JSON.stringify(sample))
    }

    if (savedDonations) {
      const parsed = JSON.parse(savedDonations)
      setDonations(parsed.map((d: any) => ({ ...d, date: new Date(d.date) })))
    } else {
      const sample: Donation[] = [
        { id: '1', donorName: 'Mohamed Benali', amount: 500, purpose: 'Entretien mosquée', date: new Date(), type: 'monthly' },
        { id: '2', donorName: 'Association Al-Imane', amount: 1000, purpose: 'Construction', date: new Date(), type: 'special' },
      ]
      setDonations(sample)
      localStorage.setItem('mosque-donations', JSON.stringify(sample))
    }

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({ ...m, joinedDate: new Date(m.joinedDate) })))
    } else {
      const sample: Member[] = [
        { id: '1', name: 'Ahmed Ouali', email: 'ahmed@example.com', phone: '0555123456', role: 'member', joinedDate: new Date(), attendanceCount: 45 },
        { id: '2', name: 'Imam Khaled', email: 'imam@example.com', phone: '0555654321', role: 'imam', joinedDate: new Date(), attendanceCount: 120 },
        { id: '3', name: 'Sara Mekki', email: 'sara@example.com', phone: '0555987654', role: 'volunteer', joinedDate: new Date(), attendanceCount: 30 },
      ]
      setMembers(sample)
      localStorage.setItem('mosque-members', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0 || localStorage.getItem('mosque-events')) {
      localStorage.setItem('mosque-events', JSON.stringify(events))
    }
  }, [events])

  useEffect(() => {
    if (prayerTimes.length > 0 || localStorage.getItem('mosque-prayer-times')) {
      localStorage.setItem('mosque-prayer-times', JSON.stringify(prayerTimes))
    }
  }, [prayerTimes])

  useEffect(() => {
    if (services.length > 0 || localStorage.getItem('mosque-services')) {
      localStorage.setItem('mosque-services', JSON.stringify(services))
    }
  }, [services])

  useEffect(() => {
    if (donations.length > 0 || localStorage.getItem('mosque-donations')) {
      localStorage.setItem('mosque-donations', JSON.stringify(donations))
    }
  }, [donations])

  useEffect(() => {
    if (members.length > 0 || localStorage.getItem('mosque-members')) {
      localStorage.setItem('mosque-members', JSON.stringify(members))
    }
  }, [members])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'events' as TabType, label: 'Événements', icon: Calendar },
    { id: 'prayers' as TabType, label: 'Horaires Prière', icon: Clock },
    { id: 'services' as TabType, label: 'Services', icon: BookOpen },
    { id: 'donations' as TabType, label: 'Dons', icon: DollarSign },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
  ]

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length
  const totalMembers = members.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                <Building className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                Gestion Mosquée
              </h1>
              <p className="text-sm text-gray-500 mt-1">Système complet de gestion de mosquée avec événements, services religieux et dons</p>
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
                    <p className="text-xs sm:text-sm text-gray-600">Événements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{upcomingEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Membres</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalMembers}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dons</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">€{totalDonations.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Services</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{services.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Horaires de Prière du Jour</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {prayerTimes.map((prayer) => (
                  <div key={prayer.id} className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">{prayer.name}</p>
                    <p className="text-xl font-bold text-blue-600">{prayer.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Horaires de Prière</h3>
                  <p className="text-sm text-gray-600">Gestion des horaires de prière avec notifications</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Événements Religieux</h3>
                  <p className="text-sm text-gray-600">Organisation de conférences, cours et événements religieux</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion des Dons</h3>
                  <p className="text-sm text-gray-600">Suivi des dons et contributions avec transparence</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cours Religieux</h3>
                  <p className="text-sm text-gray-600">Organisation de cours et séances d'enseignement</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Mariages & Services</h3>
                  <p className="text-sm text-gray-600">Gestion des cérémonies de mariage et autres services</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Membres</h3>
                  <p className="text-sm text-gray-600">Gestion des membres et fidèles de la mosquée</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Événements</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvel Événement
              </button>
            </div>
            {events.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement programmé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                        event.type === 'lecture' ? 'bg-purple-100 text-purple-800' :
                        event.type === 'conference' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'course' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees} participants</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'completed' ? 'Terminé' : event.status === 'ongoing' ? 'En cours' : 'À venir'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Horaires de Prière</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {prayerTimes.map((prayer) => (
                  <div key={prayer.id} className="bg-blue-50 rounded-lg p-6 text-center">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">{prayer.name}</p>
                    <p className="text-2xl font-bold text-blue-600">{prayer.time}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(prayer.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouveau Service
              </button>
            </div>
            {services.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun service enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Client: {service.clientName}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(service.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === 'completed' ? 'bg-green-100 text-green-800' :
                          service.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {service.status === 'completed' ? 'Terminé' : service.status === 'scheduled' ? 'Programmé' : 'Annulé'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dons</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                        <p className="text-sm text-gray-600 mt-1">{donation.purpose}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(donation.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-900">€{donation.amount.toFixed(2)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          donation.type === 'zakat' ? 'bg-green-100 text-green-800' :
                          donation.type === 'sadaqa' ? 'bg-blue-100 text-blue-800' :
                          donation.type === 'monthly' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.type === 'zakat' ? 'Zakat' : donation.type === 'sadaqa' ? 'Sadaqa' : donation.type === 'monthly' ? 'Mensuel' : 'Spécial'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                  <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{member.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{member.phone}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Rôle</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          member.role === 'imam' ? 'bg-purple-100 text-purple-800' :
                          member.role === 'administrator' ? 'bg-blue-100 text-blue-800' :
                          member.role === 'volunteer' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {member.role === 'imam' ? 'Imam' : member.role === 'administrator' ? 'Administrateur' : member.role === 'volunteer' ? 'Volontaire' : 'Membre'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Présences</p>
                        <p className="font-bold text-blue-600">{member.attendanceCount}</p>
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
