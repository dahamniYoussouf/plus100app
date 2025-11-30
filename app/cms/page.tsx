'use client'

import { useState, useEffect } from 'react'
import { FileText, Users, Calendar, Eye, BarChart3, Edit, Plus, Trash2, Globe, Image } from 'lucide-react'

type TabType = 'dashboard' | 'posts' | 'pages' | 'media' | 'users'

interface Post {
  id: string
  title: string
  content: string
  author: string
  category: string
  status: 'draft' | 'published' | 'archived'
  publishedDate?: Date
  createdDate: Date
  views: number
  tags: string[]
  featuredImage?: string
}

interface Page {
  id: string
  title: string
  slug: string
  content: string
  author: string
  status: 'draft' | 'published'
  lastModified: Date
  template: string
}

interface Media {
  id: string
  name: string
  type: string
  url: string
  size: number
  uploadedBy: string
  uploadedDate: Date
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author' | 'viewer'
  postsCount: number
  lastLogin?: Date
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [posts, setPosts] = useState<Post[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const savedPosts = localStorage.getItem('cms-posts')
    const savedPages = localStorage.getItem('cms-pages')
    const savedMedia = localStorage.getItem('cms-media')
    const savedUsers = localStorage.getItem('cms-users')

    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      setPosts(parsed.map((p: any) => ({
        ...p,
        publishedDate: p.publishedDate ? new Date(p.publishedDate) : undefined,
        createdDate: new Date(p.createdDate),
      })))
    } else {
      const today = new Date()
      const sample: Post[] = [
        {
          id: '1',
          title: 'Bienvenue sur notre site',
          content: 'Contenu de l\'article...',
          author: 'Ahmed Benali',
          category: 'Actualités',
          status: 'published',
          publishedDate: today,
          createdDate: today,
          views: 150,
          tags: ['bienvenue', 'actualités'],
        },
        {
          id: '2',
          title: 'Nouveau produit disponible',
          content: 'Contenu de l\'article...',
          author: 'Fatima Kadri',
          category: 'Produits',
          status: 'draft',
          createdDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          views: 0,
          tags: ['produit'],
        },
      ]
      setPosts(sample)
      localStorage.setItem('cms-posts', JSON.stringify(sample))
    }

    if (savedPages) {
      const parsed = JSON.parse(savedPages)
      setPages(parsed.map((p: any) => ({
        ...p,
        lastModified: new Date(p.lastModified),
      })))
    } else {
      const sample: Page[] = [
        {
          id: '1',
          title: 'À propos',
          slug: 'a-propos',
          content: 'Contenu de la page...',
          author: 'Ahmed Benali',
          status: 'published',
          lastModified: new Date(),
          template: 'default',
        },
        {
          id: '2',
          title: 'Contact',
          slug: 'contact',
          content: 'Contenu de la page...',
          author: 'Ahmed Benali',
          status: 'published',
          lastModified: new Date(),
          template: 'contact',
        },
      ]
      setPages(sample)
      localStorage.setItem('cms-pages', JSON.stringify(sample))
    }

    if (savedMedia) {
      const parsed = JSON.parse(savedMedia)
      setMedia(parsed.map((m: any) => ({
        ...m,
        uploadedDate: new Date(m.uploadedDate),
      })))
    } else {
      const sample: Media[] = [
        {
          id: '1',
          name: 'logo.png',
          type: 'image',
          url: '/media/logo.png',
          size: 102400,
          uploadedBy: 'Ahmed Benali',
          uploadedDate: new Date(),
        },
        {
          id: '2',
          name: 'video.mp4',
          type: 'video',
          url: '/media/video.mp4',
          size: 5120000,
          uploadedBy: 'Fatima Kadri',
          uploadedDate: new Date(),
        },
      ]
      setMedia(sample)
      localStorage.setItem('cms-media', JSON.stringify(sample))
    }

    if (savedUsers) {
      const parsed = JSON.parse(savedUsers)
      setUsers(parsed.map((u: any) => ({
        ...u,
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
      })))
    } else {
      const sample: User[] = [
        {
          id: '1',
          name: 'Ahmed Benali',
          email: 'ahmed@email.com',
          role: 'admin',
          postsCount: 5,
          lastLogin: new Date(),
        },
        {
          id: '2',
          name: 'Fatima Kadri',
          email: 'fatima@email.com',
          role: 'editor',
          postsCount: 3,
          lastLogin: new Date(),
        },
      ]
      setUsers(sample)
      localStorage.setItem('cms-users', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('cms-posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    if (pages.length > 0) localStorage.setItem('cms-pages', JSON.stringify(pages))
  }, [pages])

  useEffect(() => {
    if (media.length > 0) localStorage.setItem('cms-media', JSON.stringify(media))
  }, [media])

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('cms-users', JSON.stringify(users))
  }, [users])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'posts' as TabType, label: 'Articles', icon: FileText },
    { id: 'pages' as TabType, label: 'Pages', icon: Globe },
    { id: 'media' as TabType, label: 'Médias', icon: Image },
    { id: 'users' as TabType, label: 'Utilisateurs', icon: Users },
  ]

  const publishedPosts = posts.filter(p => p.status === 'published').length
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)
  const draftPosts = posts.filter(p => p.status === 'draft').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
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
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Articles Publiés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{publishedPosts}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Vues Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Brouillons</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{draftPosts}</p>
                  </div>
                  <Edit className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Fonctionnalités</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Articles</h3>
                  <p className="text-sm text-gray-600">Création, édition et publication d'articles</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Gestion Pages</h3>
                  <p className="text-sm text-gray-600">Création et gestion de pages statiques</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Bibliothèque Médias</h3>
                  <p className="text-sm text-gray-600">Upload et gestion des médias</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Utilisateurs</h3>
                  <p className="text-sm text-gray-600">Gestion des utilisateurs et permissions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Catégories & Tags</h3>
                  <p className="text-sm text-gray-600">Organisation du contenu</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">SEO</h3>
                  <p className="text-sm text-gray-600">Optimisation pour les moteurs de recherche</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Articles</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvel Article
              </button>
            </div>
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun article</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published' ? 'bg-green-100 text-green-800' :
                            post.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Publié' :
                             post.status === 'archived' ? 'Archivé' : 'Brouillon'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">Auteur: {post.author}</p>
                          <p className="text-gray-600">Catégorie: {post.category}</p>
                          {post.publishedDate && (
                            <p className="text-gray-500">
                              Publié le: {new Date(post.publishedDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{post.views} vues</span>
                          </div>
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pages</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Page
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pages.map((page) => (
                <div key={page.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{page.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      page.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Slug: /{page.slug}</p>
                    <p className="text-sm text-gray-600">Auteur: {page.author}</p>
                    <p className="text-sm text-gray-600">Template: {page.template}</p>
                    <p className="text-xs text-gray-500">
                      Modifié: {new Date(page.lastModified).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                      Éditer
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bibliothèque Médias</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Uploader
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {media.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    {item.type === 'image' ? (
                      <Image className="w-8 h-8 text-gray-400" />
                    ) : (
                      <FileText className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 truncate mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {(item.size / 1024).toFixed(2)} KB
                  </p>
                  <p className="text-xs text-gray-500">
                    Par {item.uploadedBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Utilisateurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvel Utilisateur
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'author' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' :
                       user.role === 'editor' ? 'Éditeur' :
                       user.role === 'author' ? 'Auteur' : 'Lecteur'}
                    </span>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Articles:</span>
                      <span className="font-medium text-indigo-600">{user.postsCount}</span>
                    </div>
                    {user.lastLogin && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Dernière connexion:</span>
                        <span className="text-gray-600">{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
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
