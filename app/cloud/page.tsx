'use client'

import { useState, useEffect } from 'react'
import { Cloud, Folder, FileText, Users, BarChart3, Upload, Download, Trash2, Share2, Search } from 'lucide-react'

type TabType = 'dashboard' | 'files' | 'folders' | 'shared' | 'storage'

interface File {
  id: string
  name: string
  type: string
  size: number
  uploadedBy: string
  uploadedDate: Date
  modifiedDate: Date
  folderId?: string
  sharedWith: string[]
  tags: string[]
}

interface Folder {
  id: string
  name: string
  parentId?: string
  createdBy: string
  createdDate: Date
  files: number
  subfolders: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  storageUsed: number
  storageLimit: number
}

export default function CloudPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [files, setFiles] = useState<File[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedFiles = localStorage.getItem('cloud-files')
    const savedFolders = localStorage.getItem('cloud-folders')
    const savedUsers = localStorage.getItem('cloud-users')

    if (savedFiles) {
      const parsed = JSON.parse(savedFiles)
      setFiles(parsed.map((f: any) => ({
        ...f,
        uploadedDate: new Date(f.uploadedDate),
        modifiedDate: new Date(f.modifiedDate),
      })))
    } else {
      const today = new Date()
      const sample: File[] = [
        {
          id: '1',
          name: 'Document Important.pdf',
          type: 'pdf',
          size: 2048000,
          uploadedBy: 'Ahmed Benali',
          uploadedDate: today,
          modifiedDate: today,
          sharedWith: ['Fatima Kadri'],
          tags: ['important', 'document'],
        },
        {
          id: '2',
          name: 'Présentation.pptx',
          type: 'pptx',
          size: 5120000,
          uploadedBy: 'Fatima Kadri',
          uploadedDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          modifiedDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          sharedWith: [],
          tags: ['presentation'],
        },
        {
          id: '3',
          name: 'Image.jpg',
          type: 'jpg',
          size: 1024000,
          uploadedBy: 'Ahmed Benali',
          uploadedDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          modifiedDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
          sharedWith: [],
          tags: ['image'],
        },
      ]
      setFiles(sample)
      localStorage.setItem('cloud-files', JSON.stringify(sample))
    }

    if (savedFolders) {
      const parsed = JSON.parse(savedFolders)
      setFolders(parsed.map((f: any) => ({
        ...f,
        createdDate: new Date(f.createdDate),
      })))
    } else {
      const sample: Folder[] = [
        {
          id: '1',
          name: 'Documents',
          createdBy: 'Ahmed Benali',
          createdDate: new Date('2024-01-01'),
          files: 5,
          subfolders: 2,
        },
        {
          id: '2',
          name: 'Images',
          createdBy: 'Fatima Kadri',
          createdDate: new Date('2024-01-05'),
          files: 12,
          subfolders: 0,
        },
      ]
      setFolders(sample)
      localStorage.setItem('cloud-folders', JSON.stringify(sample))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const sample: User[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          role: 'admin',
          storageUsed: 1024000000,
          storageLimit: 5000000000,
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          role: 'user',
          storageUsed: 512000000,
          storageLimit: 2000000000,
        },
      ]
      setUsers(sample)
      localStorage.setItem('cloud-users', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (files.length > 0) localStorage.setItem('cloud-files', JSON.stringify(files))
  }, [files])

  useEffect(() => {
    if (folders.length > 0) localStorage.setItem('cloud-folders', JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('cloud-users', JSON.stringify(users))
  }, [users])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'files' as TabType, label: 'Fichiers', icon: FileText },
    { id: 'folders' as TabType, label: 'Dossiers', icon: Folder },
    { id: 'shared' as TabType, label: 'Partagés', icon: Share2 },
    { id: 'storage' as TabType, label: 'Stockage', icon: Cloud },
  ]

  const totalStorage = users.reduce((sum, u) => sum + u.storageUsed, 0)
  const totalLimit = users.reduce((sum, u) => sum + u.storageLimit, 0)
  const sharedFiles = files.filter(f => f.sharedWith.length > 0)
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }

  const filteredFiles = searchQuery
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

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
                    <p className="text-xs sm:text-sm text-gray-600">Fichiers</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{files.length}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dossiers</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{folders.length}</p>
                  </div>
                  <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Partagés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{sharedFiles.length}</p>
                  </div>
                  <Share2 className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Stockage</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{formatSize(totalStorage)}</p>
                  </div>
                  <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Utilisation du Stockage</h2>
              <div className="space-y-4">
                {users.map((user) => {
                  const usagePercent = (user.storageUsed / user.storageLimit) * 100
                  return (
                    <div key={user.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">{user.name}</span>
                        <span className="text-gray-600">{formatSize(user.storageUsed)} / {formatSize(user.storageLimit)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            usagePercent >= 90 ? 'bg-red-500' :
                            usagePercent >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Stockage de Fichiers</h3>
                  <p className="text-sm text-gray-600">Upload, téléchargement et gestion de fichiers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Organisation</h3>
                  <p className="text-sm text-gray-600">Création de dossiers et organisation</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Partage</h3>
                  <p className="text-sm text-gray-600">Partage de fichiers et dossiers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Recherche</h3>
                  <p className="text-sm text-gray-600">Recherche avancée de fichiers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Versions</h3>
                  <p className="text-sm text-gray-600">Gestion des versions de fichiers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Sécurité</h3>
                  <p className="text-sm text-gray-600">Permissions et sécurité des fichiers</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fichiers</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Uploader</span>
                </button>
              </div>
            </div>
            {filteredFiles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun fichier</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{file.name}</h3>
                          <p className="text-xs text-gray-500">{file.type.toUpperCase()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Taille:</span>
                        <span className="text-gray-700">{formatSize(file.size)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Par:</span>
                        <span className="text-gray-700">{file.uploadedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Modifié:</span>
                        <span className="text-gray-700">{new Date(file.modifiedDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {file.sharedWith.length > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Share2 className="w-3 h-3 text-purple-500" />
                          <span className="text-purple-600">Partagé avec {file.sharedWith.length} personne(s)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100 flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        Télécharger
                      </button>
                      <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded text-xs hover:bg-purple-100">
                        <Share2 className="w-3 h-3" />
                      </button>
                      <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'folders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dossiers</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Nouveau Dossier
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {folders.map((folder) => (
                <div key={folder.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Folder className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{folder.name}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Fichiers:</span>
                      <span className="text-gray-700">{folder.files}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Sous-dossiers:</span>
                      <span className="text-gray-700">{folder.subfolders}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Créé par:</span>
                      <span className="text-gray-700">{folder.createdBy}</span>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Ouvrir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shared' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fichiers Partagés</h2>
            {sharedFiles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun fichier partagé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sharedFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Share2 className="w-4 h-4 text-purple-500" />
                      <h3 className="font-semibold text-gray-900">{file.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Partagé avec:</p>
                      <div className="flex flex-wrap gap-1">
                        {file.sharedWith.map((user, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                            {user}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion du Stockage</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Stockage utilisé</span>
                  <span className="font-bold">{formatSize(totalStorage)} / {formatSize(totalLimit)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      (totalStorage / totalLimit) >= 0.9 ? 'bg-red-500' :
                      (totalStorage / totalLimit) >= 0.7 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(totalStorage / totalLimit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((totalLimit - totalStorage) / (1024 * 1024 * 1024)).toFixed(2)} GB disponibles
                </p>
              </div>
              <div className="space-y-4">
                {users.map((user) => {
                  const usagePercent = (user.storageUsed / user.storageLimit) * 100
                  return (
                    <div key={user.id} className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'user' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' :
                           user.role === 'user' ? 'Utilisateur' : 'Lecteur'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">{formatSize(user.storageUsed)} / {formatSize(user.storageLimit)}</span>
                        <span className="font-medium">{usagePercent.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            usagePercent >= 90 ? 'bg-red-500' :
                            usagePercent >= 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
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
