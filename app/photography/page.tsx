'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Camera, Image as ImageIcon, Users, Calendar, BarChart3, Folder, Tag, Clock, TrendingUp, Star, Download, Share2 } from 'lucide-react'

type TabType = 'dashboard' | 'photos' | 'albums' | 'clients' | 'sessions' | 'tags'

interface Photo {
  id: string
  title: string
  description?: string
  url: string
  albumId?: string
  tags: string[]
  clientId?: string
  sessionId?: string
  date: Date
  location?: string
  camera?: string
  settings?: string
  views: number
  downloads: number
  rating?: number
  status: 'draft' | 'published' | 'archived'
}

interface Album {
  id: string
  name: string
  description?: string
  coverPhotoId?: string
  clientId?: string
  sessionId?: string
  photos: string[]
  date: Date
  status: 'private' | 'public' | 'shared'
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  type: 'individual' | 'corporate' | 'wedding' | 'event'
  totalSessions: number
  totalPhotos: number
  joinDate: Date
}

interface Session {
  id: string
  name: string
  type: 'wedding' | 'portrait' | 'event' | 'commercial' | 'other'
  clientId: string
  clientName: string
  date: Date
  location: string
  duration: number
  photos: number
  status: 'scheduled' | 'completed' | 'cancelled'
  price?: number
}

export default function PhotographyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const savedPhotos = localStorage.getItem('photography-photos')
    const savedAlbums = localStorage.getItem('photography-albums')
    const savedClients = localStorage.getItem('photography-clients')
    const savedSessions = localStorage.getItem('photography-sessions')

    if (savedPhotos) {
      const parsed = JSON.parse(savedPhotos)
      setPhotos(parsed.map((p: any) => ({ ...p, date: new Date(p.date) })))
    } else {
      const today = new Date()
      const sample: Photo[] = [
        { id: '1', title: 'Couple au coucher du soleil', description: 'Photo de mariage romantique', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&q=80', albumId: '1', tags: ['mariage', 'couple', 'romantique'], clientId: '1', sessionId: '1', date: today, location: 'Plage', camera: 'Canon EOS R5', settings: 'f/2.8, 1/200s, ISO 400', views: 1250, downloads: 45, rating: 4.8, status: 'published' },
        { id: '2', title: 'Portrait professionnel', description: 'Séance portrait entreprise', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&q=80', albumId: '2', tags: ['portrait', 'professionnel'], clientId: '2', sessionId: '2', date: today, location: 'Studio', camera: 'Sony A7III', settings: 'f/4, 1/125s, ISO 200', views: 890, downloads: 32, rating: 4.6, status: 'published' },
        { id: '3', title: 'Événement corporatif', description: 'Conférence annuelle', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=800&fit=crop&q=80', albumId: '3', tags: ['événement', 'corporate'], clientId: '2', sessionId: '3', date: today, location: 'Hôtel', camera: 'Nikon D850', settings: 'f/5.6, 1/250s, ISO 800', views: 650, downloads: 18, status: 'published' },
      ]
      setPhotos(sample)
      localStorage.setItem('photography-photos', JSON.stringify(sample))
    }

    if (savedAlbums) {
      const parsed = JSON.parse(savedAlbums)
      setAlbums(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })))
    } else {
      const today = new Date()
      const sample: Album[] = [
        { id: '1', name: 'Mariage Sarah & Ahmed', description: 'Album complet du mariage', coverPhotoId: '1', clientId: '1', sessionId: '1', photos: ['1'], date: today, status: 'shared' },
        { id: '2', name: 'Portraits Entreprise', description: 'Séance photos corporate', coverPhotoId: '2', clientId: '2', sessionId: '2', photos: ['2'], date: today, status: 'private' },
        { id: '3', name: 'Événement 2024', description: 'Photos événement corporatif', coverPhotoId: '3', clientId: '2', sessionId: '3', photos: ['3'], date: today, status: 'public' },
      ]
      setAlbums(sample)
      localStorage.setItem('photography-albums', JSON.stringify(sample))
    }

    if (savedClients) {
      const parsed = JSON.parse(savedClients)
      setClients(parsed.map((c: any) => ({ ...c, joinDate: new Date(c.joinDate) })))
    } else {
      const sample: Client[] = [
        { id: '1', name: 'Sarah Benali', email: 'sarah@email.com', phone: '+213 555 1234', type: 'wedding', totalSessions: 1, totalPhotos: 150, joinDate: new Date('2024-01-15') },
        { id: '2', name: 'Entreprise TechCorp', email: 'contact@techcorp.com', phone: '+213 555 5678', address: 'Alger', type: 'corporate', totalSessions: 2, totalPhotos: 85, joinDate: new Date('2023-11-20') },
      ]
      setClients(sample)
      localStorage.setItem('photography-clients', JSON.stringify(sample))
    }

    if (savedSessions) {
      const parsed = JSON.parse(savedSessions)
      setSessions(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    } else {
      const today = new Date()
      const sample: Session[] = [
        { id: '1', name: 'Mariage Sarah & Ahmed', type: 'wedding', clientId: '1', clientName: 'Sarah Benali', date: today, location: 'Plage', duration: 8, photos: 150, status: 'completed', price: 2500 },
        { id: '2', name: 'Portrait Entreprise', type: 'portrait', clientId: '2', clientName: 'Entreprise TechCorp', date: today, location: 'Studio', duration: 2, photos: 45, status: 'completed', price: 800 },
        { id: '3', name: 'Conférence Annuelle', type: 'event', clientId: '2', clientName: 'Entreprise TechCorp', date: today, location: 'Hôtel', duration: 4, photos: 120, status: 'completed', price: 1200 },
      ]
      setSessions(sample)
      localStorage.setItem('photography-sessions', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (photos.length > 0) localStorage.setItem('photography-photos', JSON.stringify(photos))
  }, [photos])

  useEffect(() => {
    if (albums.length > 0) localStorage.setItem('photography-albums', JSON.stringify(albums))
  }, [albums])

  useEffect(() => {
    if (clients.length > 0) localStorage.setItem('photography-clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('photography-sessions', JSON.stringify(sessions))
  }, [sessions])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'photos' as TabType, label: 'Photos', icon: ImageIcon },
    { id: 'albums' as TabType, label: 'Albums', icon: Folder },
    { id: 'clients' as TabType, label: 'Clients', icon: Users },
    { id: 'sessions' as TabType, label: 'Séances', icon: Camera },
    { id: 'tags' as TabType, label: 'Tags', icon: Tag },
  ]

  const totalPhotos = useMemo(() => photos.length, [photos.length])
  const totalAlbums = useMemo(() => albums.length, [albums.length])
  const totalClients = useMemo(() => clients.length, [clients.length])
  const totalViews = useMemo(() => photos.reduce((sum, p) => sum + p.views, 0), [photos])
  const totalDownloads = useMemo(() => photos.reduce((sum, p) => sum + p.downloads, 0), [photos])
  const upcomingSessions = useMemo(() => sessions.filter(s => s.status === 'scheduled').length, [sessions])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                      ? 'text-purple-600 border-b-2 border-purple-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Photos</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalPhotos}</p>
                  </div>
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Vues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Téléchargements</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalDownloads}</p>
                  </div>
                  <Download className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Clients</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalClients}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Photos récentes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.slice(0, 6).map((photo, idx) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden relative group">
                      <Image
                        src={photo.url || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=400&h=400&fit=crop&q=80`}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 text-white text-xs text-center p-2">
                          <p className="font-medium truncate">{photo.title}</p>
                          <p className="text-xs mt-1">{photo.views} vues</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Séances à venir</h3>
                <div className="space-y-3">
                  {sessions.filter(s => s.status === 'scheduled').slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{session.name}</p>
                        <p className="text-sm text-gray-500">{session.clientName}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(session.date).toLocaleDateString('fr-FR')} • {session.location}</p>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Programmée</span>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune séance programmée</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Photos</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Ajouter une photo
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, idx) => (
                <div key={photo.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
                  <div className="aspect-square relative">
                    <Image
                      src={photo.url || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=400&h=400&fit=crop&q=80`}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                      <button className="opacity-0 group-hover:opacity-100 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded transition-opacity">
                        <Download className="w-5 h-5" />
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded transition-opacity">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{photo.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{photo.views} vues</span>
                      <span>{photo.downloads} téléch.</span>
                    </div>
                    {photo.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600">{photo.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Albums</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvel album
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {albums.map((album, idx) => {
                const coverPhoto = photos.find(p => p.id === album.coverPhotoId)
                return (
                  <div key={album.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="aspect-video relative">
                      {coverPhoto ? (
                        <Image
                          src={coverPhoto.url || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=600&h=400&fit=crop&q=80`}
                          alt={album.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                          <Folder className="w-16 h-16 text-purple-600" />
                        </div>
                      )}
                    </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-1">{album.name}</h3>
                    {album.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-200">
                      <span className="text-gray-600">{album.photos.length} photos</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        album.status === 'public' ? 'bg-green-100 text-green-800' :
                        album.status === 'shared' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {album.status === 'public' ? 'Public' : album.status === 'shared' ? 'Partagé' : 'Privé'}
                      </span>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouveau client
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {clients.map((client) => (
                <div key={client.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{client.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{client.email}</p>
                  <p className="text-sm text-gray-600 mb-4">{client.phone}</p>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{client.type === 'individual' ? 'Individuel' : client.type === 'corporate' ? 'Entreprise' : client.type === 'wedding' ? 'Mariage' : 'Événement'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Séances:</span>
                      <span className="font-medium text-gray-900">{client.totalSessions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Photos:</span>
                      <span className="font-medium text-gray-900">{client.totalPhotos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Séances</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvelle séance
              </button>
            </div>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{session.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{session.clientName}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.duration}h</span>
                        </div>
                        <span className="capitalize">{session.type === 'wedding' ? 'Mariage' : session.type === 'portrait' ? 'Portrait' : session.type === 'event' ? 'Événement' : session.type === 'commercial' ? 'Commercial' : 'Autre'}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{session.location} • {session.photos} photos</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' :
                        session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status === 'completed' ? 'Terminée' : session.status === 'scheduled' ? 'Programmée' : 'Annulée'}
                      </span>
                      {session.price && (
                        <span className="text-lg font-bold text-purple-600">DZD{session.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tags</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(photos.flatMap(p => p.tags))).map((tag) => {
                  const count = photos.filter(p => p.tags.includes(tag)).length
                  return (
                    <span key={tag} className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {tag}
                      <span className="bg-purple-200 text-purple-900 rounded-full px-2 py-0.5 text-xs">{count}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
