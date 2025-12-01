'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { FileText, Folder, Upload, Search, BarChart3, Download, Share2, Trash2, Clock, User, Tag, File } from 'lucide-react'

type TabType = 'dashboard' | 'files' | 'folders' | 'shared' | 'recent'

interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  folderId?: string
  folderName?: string
  ownerId: string
  ownerName: string
  uploadDate: Date
  modifiedDate: Date
  tags: string[]
  sharedWith: string[]
  status: 'active' | 'archived' | 'deleted'
}

interface Folder {
  id: string
  name: string
  parentId?: string
  ownerId: string
  ownerName: string
  files: number
  createdAt: Date
  color?: string
}

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedFiles = localStorage.getItem('document-files')
    const savedFolders = localStorage.getItem('document-folders')

    if (savedFiles) {
      const parsed = JSON.parse(savedFiles)
      setFiles(parsed.map((f: any) => ({ ...f, uploadDate: new Date(f.uploadDate), modifiedDate: new Date(f.modifiedDate) })))
    } else {
      const today = new Date()
      const sample: DocumentFile[] = [
        { id: '1', name: 'Rapport_2024.pdf', type: 'pdf', size: 2048000, folderId: '1', folderName: 'Rapports', ownerId: '1', ownerName: 'Ahmed Benali', uploadDate: today, modifiedDate: today, tags: ['rapport', '2024'], sharedWith: ['2'], status: 'active' },
        { id: '2', name: 'Présentation.pptx', type: 'pptx', size: 5120000, folderId: '2', folderName: 'Présentations', ownerId: '1', ownerName: 'Ahmed Benali', uploadDate: today, modifiedDate: today, tags: ['présentation'], sharedWith: [], status: 'active' },
        { id: '3', name: 'Budget.xlsx', type: 'xlsx', size: 1024000, folderId: '3', folderName: 'Finances', ownerId: '2', ownerName: 'Fatima Kadri', uploadDate: today, modifiedDate: today, tags: ['budget', 'finances'], sharedWith: ['1'], status: 'active' },
      ]
      setFiles(sample)
      localStorage.setItem('document-files', JSON.stringify(sample))
    }

    if (savedFolders) {
      const parsed = JSON.parse(savedFolders)
      setFolders(parsed.map((f: any) => ({ ...f, createdAt: new Date(f.createdAt) })))
    } else {
      const today = new Date()
      const sample: Folder[] = [
        { id: '1', name: 'Rapports', ownerId: '1', ownerName: 'Ahmed Benali', files: 1, createdAt: today, color: 'blue' },
        { id: '2', name: 'Présentations', ownerId: '1', ownerName: 'Ahmed Benali', files: 1, createdAt: today, color: 'purple' },
        { id: '3', name: 'Finances', ownerId: '2', ownerName: 'Fatima Kadri', files: 1, createdAt: today, color: 'green' },
      ]
      setFolders(sample)
      localStorage.setItem('document-folders', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (files.length > 0) localStorage.setItem('document-files', JSON.stringify(files))
  }, [files])

  useEffect(() => {
    if (folders.length > 0) localStorage.setItem('document-folders', JSON.stringify(folders))
  }, [folders])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'files' as TabType, label: 'Fichiers', icon: FileText },
    { id: 'folders' as TabType, label: 'Dossiers', icon: Folder },
    { id: 'shared' as TabType, label: 'Partagés', icon: Share2 },
    { id: 'recent' as TabType, label: 'Récents', icon: Clock },
  ]

  const totalFiles = useMemo(() => files.length, [files.length])
  const totalFolders = useMemo(() => folders.length, [folders.length])
  const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files])
  const sharedFiles = useMemo(() => files.filter(f => f.sharedWith.length > 0).length, [files])

  const formatSize = useCallback((bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }, [])

  const getFileIcon = useCallback((type: string) => {
    if (type.includes('pdf')) return '📄'
    if (type.includes('doc') || type.includes('docx')) return '📝'
    if (type.includes('xls') || type.includes('xlsx')) return '📊'
    if (type.includes('ppt') || type.includes('pptx')) return '📽️'
    if (type.includes('image')) return '🖼️'
    return '📎'
  }, [])

  const filteredFiles = useMemo(() => files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [files, searchQuery])

  const recentFiles = useMemo(() => [...files].sort((a, b) => b.modifiedDate.getTime() - a.modifiedDate.getTime()).slice(0, 10), [files])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
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
                      ? 'text-sky-600 border-b-2 border-sky-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Fichiers</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalFiles}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-sky-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Dossiers</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalFolders}</p>
                  </div>
                  <Folder className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Espace utilisé</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{formatSize(totalSize)}</p>
                  </div>
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Partagés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{sharedFiles}</p>
                  </div>
                  <Share2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Fichiers récents</h3>
                <div className="space-y-3">
                  {recentFiles.slice(0, 5).map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.ownerName} • {formatSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Dossiers</h3>
                <div className="space-y-3">
                  {folders.map((folder) => (
                    <div key={folder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Folder className={`w-8 h-8  DZD{
                          folder.color === 'blue' ? 'text-blue-500' :
                          folder.color === 'purple' ? 'text-purple-500' :
                          folder.color === 'green' ? 'text-green-500' :
                          folder.color === 'red' ? 'text-red-500' :
                          folder.color === 'yellow' ? 'text-yellow-500' :
                          'text-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{folder.name}</p>
                          <p className="text-sm text-gray-500">{folder.files} fichiers • {folder.ownerName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fichiers</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Téléverser
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  {file.folderName && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Folder className="w-4 h-4" />
                      <span>{file.folderName}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {file.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{file.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'folders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dossiers</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                Nouveau dossier
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {folders.map((folder) => {
                const folderColorClass = folder.color === 'blue' ? 'text-blue-500' :
                  folder.color === 'purple' ? 'text-purple-500' :
                  folder.color === 'green' ? 'text-green-500' :
                  folder.color === 'red' ? 'text-red-500' :
                  folder.color === 'yellow' ? 'text-yellow-500' :
                  'text-gray-500'
                return (
                  <div key={folder.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Folder className={`w-12 h-12  DZD{folderColorClass}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                        <p className="text-sm text-gray-500">{folder.files} fichiers</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Propriétaire: {folder.ownerName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'shared' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fichiers partagés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {files.filter(f => f.sharedWith.length > 0).map((file) => (
                <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                      <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Partagé avec {file.sharedWith.length} personne(s)</p>
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-sky-500" />
                      <span className="text-xs text-sky-600">Partagé</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fichiers récents</h2>
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-3xl">{getFileIcon(file.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                        <p className="text-sm text-gray-500">{file.ownerName} • {formatSize(file.size)}</p>
                        <p className="text-xs text-gray-400 mt-1">Modifié le {new Date(file.modifiedDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
