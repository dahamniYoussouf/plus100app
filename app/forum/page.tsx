'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { MessageSquare, Users, TrendingUp, BarChart3, Tag, Clock, Heart, Reply, Search, Plus } from 'lucide-react'

type TabType = 'dashboard' | 'topics' | 'categories' | 'members'

interface Topic {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  categoryId: string
  categoryName: string
  tags: string[]
  views: number
  replies: number
  likes: number
  lastReply?: Date
  createdAt: Date
  pinned: boolean
  locked: boolean
}

interface Reply {
  id: string
  topicId: string
  topicTitle: string
  authorId: string
  authorName: string
  content: string
  likes: number
  createdAt: Date
}

interface Category {
  id: string
  name: string
  description?: string
  topics: number
  color: string
}

interface Member {
  id: string
  name: string
  email: string
  avatar?: string
  posts: number
  reputation: number
  joinDate: Date
  role: 'member' | 'moderator' | 'admin'
}

export default function ForumPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [topics, setTopics] = useState<Topic[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedTopics = localStorage.getItem('forum-topics')
    const savedReplies = localStorage.getItem('forum-replies')
    const savedCategories = localStorage.getItem('forum-categories')
    const savedMembers = localStorage.getItem('forum-members')

    if (savedTopics) {
      const parsed = JSON.parse(savedTopics)
      setTopics(parsed.map((t: any) => ({ ...t, createdAt: new Date(t.createdAt), lastReply: t.lastReply ? new Date(t.lastReply) : undefined })))
    } else {
      const today = new Date()
      const sample: Topic[] = [
        { id: '1', title: 'Comment débuter avec React ?', content: 'Je suis nouveau et je veux apprendre React...', authorId: '1', authorName: 'Ahmed Benali', categoryId: '1', categoryName: 'Développement', tags: ['react', 'javascript', 'débutant'], views: 1250, replies: 12, likes: 45, createdAt: today, pinned: true, locked: false },
        { id: '2', title: 'Meilleure pratique pour les API REST', content: 'Quelles sont les meilleures pratiques...', authorId: '2', authorName: 'Fatima Kadri', categoryId: '1', categoryName: 'Développement', tags: ['api', 'rest', 'backend'], views: 890, replies: 8, likes: 32, createdAt: today, pinned: false, locked: false },
        { id: '3', title: 'Discussion générale', content: 'Espace de discussion libre...', authorId: '3', authorName: 'Mohamed Tazi', categoryId: '2', categoryName: 'Général', tags: ['discussion'], views: 450, replies: 5, likes: 15, createdAt: today, pinned: false, locked: false },
      ]
      setTopics(sample)
      localStorage.setItem('forum-topics', JSON.stringify(sample))
    }

    if (savedReplies) {
      const parsed = JSON.parse(savedReplies)
      setReplies(parsed.map((r: any) => ({ ...r, createdAt: new Date(r.createdAt) })))
    } else {
      const today = new Date()
      const sample: Reply[] = [
        { id: '1', topicId: '1', topicTitle: 'Comment débuter avec React ?', authorId: '2', authorName: 'Fatima Kadri', content: 'Je recommande de commencer par la documentation officielle...', likes: 12, createdAt: today },
        { id: '2', topicId: '1', topicTitle: 'Comment débuter avec React ?', authorId: '3', authorName: 'Mohamed Tazi', content: 'Excellente question ! Voici quelques ressources...', likes: 8, createdAt: today },
      ]
      setReplies(sample)
      localStorage.setItem('forum-replies', JSON.stringify(sample))
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      const sample: Category[] = [
        { id: '1', name: 'Développement', description: 'Discussions sur le développement', topics: 2, color: 'blue' },
        { id: '2', name: 'Général', description: 'Discussions générales', topics: 1, color: 'gray' },
        { id: '3', name: 'Aide', description: 'Demandes d\'aide', topics: 0, color: 'green' },
      ]
      setCategories(sample)
      localStorage.setItem('forum-categories', JSON.stringify(sample))
    }

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers)
      setMembers(parsed.map((m: any) => ({ ...m, joinDate: new Date(m.joinDate) })))
    } else {
      const sample: Member[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', posts: 25, reputation: 150, joinDate: new Date('2023-01-15'), role: 'admin' },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', posts: 18, reputation: 120, joinDate: new Date('2023-03-20'), role: 'moderator' },
        { id: '3', name: 'Mohamed Tazi', email: 'mohamed@email.com', posts: 12, reputation: 85, joinDate: new Date('2023-06-10'), role: 'member' },
      ]
      setMembers(sample)
      localStorage.setItem('forum-members', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (topics.length > 0) localStorage.setItem('forum-topics', JSON.stringify(topics))
  }, [topics])

  useEffect(() => {
    if (replies.length > 0) localStorage.setItem('forum-replies', JSON.stringify(replies))
  }, [replies])

  useEffect(() => {
    if (categories.length > 0) localStorage.setItem('forum-categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('forum-members', JSON.stringify(members))
  }, [members])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'topics' as TabType, label: 'Topics', icon: MessageSquare },
    { id: 'categories' as TabType, label: 'Catégories', icon: Tag },
    { id: 'members' as TabType, label: 'Membres', icon: Users },
  ]

  const totalTopics = useMemo(() => topics.length, [topics.length])
  const totalReplies = useMemo(() => replies.length, [replies.length])
  const totalMembers = useMemo(() => members.length, [members.length])
  const totalViews = useMemo(() => topics.reduce((sum, t) => sum + t.views, 0), [topics])

  const filteredTopics = useMemo(() => topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [topics, searchQuery])

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
                    <p className="text-xs sm:text-sm text-gray-600">Topics</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalTopics}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Réponses</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalReplies}</p>
                  </div>
                  <Reply className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
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
                    <p className="text-xs sm:text-sm text-gray-600">Vues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Topics populaires</h3>
                <div className="space-y-3">
                  {topics.sort((a, b) => b.views - a.views).slice(0, 5).map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {topic.pinned && (
                            <span className="text-amber-500">📌</span>
                          )}
                          <p className="font-medium text-gray-900 truncate">{topic.title}</p>
                        </div>
                        <p className="text-sm text-gray-500">{topic.authorName} • {topic.categoryName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {topic.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Reply className="w-3 h-3" />
                            {topic.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {topic.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                          <Tag className={`w-5 h-5 text-${category.color}-600`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.topics} topics</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Topics</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau topic
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredTopics.map((topic) => (
                <div key={topic.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {topic.pinned && (
                          <span className="text-amber-500">📌</span>
                        )}
                        {topic.locked && (
                          <span className="text-gray-500">🔒</span>
                        )}
                        <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{topic.categoryName}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{topic.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {topic.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>{topic.authorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(topic.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {topic.views} vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Reply className="w-3 h-3" />
                          {topic.replies} réponses
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {topic.likes} likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Catégories</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Nouvelle catégorie
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => {
                const colorClasses = {
                  blue: 'bg-blue-100 text-blue-600',
                  purple: 'bg-purple-100 text-purple-600',
                  green: 'bg-green-100 text-green-600',
                  red: 'bg-red-100 text-red-600',
                  yellow: 'bg-yellow-100 text-yellow-600',
                  gray: 'bg-gray-100 text-gray-600',
                }
                const colorClass = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.gray
                return (
                  <div key={category.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg ${colorClass.split(' ')[0]} flex items-center justify-center`}>
                        <Tag className={`w-6 h-6 ${colorClass.split(' ')[1]}`} />
                      </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.topics} topics</p>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Membres</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {members.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Posts:</span>
                      <span className="font-medium text-gray-900">{member.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Réputation:</span>
                      <span className="font-medium text-blue-600">{member.reputation}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rôle:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.role === 'admin' ? 'bg-red-100 text-red-800' :
                        member.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'admin' ? 'Admin' : member.role === 'moderator' ? 'Modérateur' : 'Membre'}
                      </span>
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
