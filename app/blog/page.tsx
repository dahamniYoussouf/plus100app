'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Newspaper, FileText, Users, MessageSquare, BarChart3, Calendar, Eye, Heart, TrendingUp, Tag, Search, Edit } from 'lucide-react'

type TabType = 'dashboard' | 'posts' | 'categories' | 'comments' | 'authors'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  authorName: string
  categoryId: string
  categoryName: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  publishDate: Date
  views: number
  likes: number
  comments: number
  featured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
  color: string
}

interface Comment {
  id: string
  postId: string
  postTitle: string
  authorName: string
  authorEmail: string
  content: string
  date: Date
  status: 'approved' | 'pending' | 'spam'
}

interface Author {
  id: string
  name: string
  email: string
  bio?: string
  avatar?: string
  posts: number
  totalViews: number
  joinDate: Date
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const savedPosts = localStorage.getItem('blog-posts')
    const savedCategories = localStorage.getItem('blog-categories')
    const savedComments = localStorage.getItem('blog-comments')
    const savedAuthors = localStorage.getItem('blog-authors')

    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      setPosts(parsed.map((p: any) => ({ ...p, publishDate: new Date(p.publishDate) })))
    } else {
      const today = new Date()
      const sample: Post[] = [
        { id: '1', title: 'Introduction à React', content: 'Contenu complet...', excerpt: 'Découvrez les bases de React', authorId: '1', authorName: 'Ahmed Benali', categoryId: '1', categoryName: 'Technologie', tags: ['react', 'javascript', 'frontend'], status: 'published', publishDate: today, views: 1250, likes: 45, comments: 12, featured: true },
        { id: '2', title: 'Guide du Développement Web', content: 'Contenu complet...', excerpt: 'Un guide complet pour débuter', authorId: '1', authorName: 'Ahmed Benali', categoryId: '1', categoryName: 'Technologie', tags: ['web', 'développement'], status: 'published', publishDate: today, views: 890, likes: 32, comments: 8, featured: false },
        { id: '3', title: 'Tendances Design 2024', content: 'Contenu complet...', excerpt: 'Les dernières tendances en design', authorId: '2', authorName: 'Fatima Kadri', categoryId: '2', categoryName: 'Design', tags: ['design', 'tendances'], status: 'draft', publishDate: today, views: 0, likes: 0, comments: 0, featured: false },
      ]
      setPosts(sample)
      localStorage.setItem('blog-posts', JSON.stringify(sample))
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      const sample: Category[] = [
        { id: '1', name: 'Technologie', slug: 'technologie', description: 'Articles sur la technologie', postCount: 2, color: 'blue' },
        { id: '2', name: 'Design', slug: 'design', description: 'Articles sur le design', postCount: 1, color: 'purple' },
        { id: '3', name: 'Business', slug: 'business', description: 'Articles business', postCount: 0, color: 'green' },
      ]
      setCategories(sample)
      localStorage.setItem('blog-categories', JSON.stringify(sample))
    }

    if (savedComments) {
      const parsed = JSON.parse(savedComments)
      setComments(parsed.map((c: any) => ({ ...c, date: new Date(c.date) })))
    } else {
      const today = new Date()
      const sample: Comment[] = [
        { id: '1', postId: '1', postTitle: 'Introduction à React', authorName: 'Mohamed Tazi', authorEmail: 'mohamed@email.com', content: 'Excellent article !', date: today, status: 'approved' },
        { id: '2', postId: '1', postTitle: 'Introduction à React', authorName: 'Sara Benali', authorEmail: 'sara@email.com', content: 'Merci pour ce partage', date: today, status: 'approved' },
        { id: '3', postId: '2', postTitle: 'Guide du Développement Web', authorName: 'Youssef Dahmani', authorEmail: 'youssef@email.com', content: 'Très utile', date: today, status: 'pending' },
      ]
      setComments(sample)
      localStorage.setItem('blog-comments', JSON.stringify(sample))
    }

    if (savedAuthors) {
      const parsed = JSON.parse(savedAuthors)
      setAuthors(parsed.map((a: any) => ({ ...a, joinDate: new Date(a.joinDate) })))
    } else {
      const sample: Author[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', bio: 'Développeur full-stack', posts: 2, totalViews: 2140, joinDate: new Date('2023-01-15') },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', bio: 'Designer UI/UX', posts: 1, totalViews: 0, joinDate: new Date('2023-06-20') },
      ]
      setAuthors(sample)
      localStorage.setItem('blog-authors', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('blog-posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    if (categories.length > 0) localStorage.setItem('blog-categories', JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    if (comments.length > 0) localStorage.setItem('blog-comments', JSON.stringify(comments))
  }, [comments])

  useEffect(() => {
    if (authors.length > 0) localStorage.setItem('blog-authors', JSON.stringify(authors))
  }, [authors])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'posts' as TabType, label: 'Articles', icon: FileText },
    { id: 'categories' as TabType, label: 'Catégories', icon: Tag },
    { id: 'comments' as TabType, label: 'Commentaires', icon: MessageSquare },
    { id: 'authors' as TabType, label: 'Auteurs', icon: Users },
  ]

  const totalPosts = useMemo(() => posts.length, [posts.length])
  const publishedPosts = useMemo(() => posts.filter(p => p.status === 'published').length, [posts])
  const totalViews = useMemo(() => posts.reduce((sum, p) => sum + p.views, 0), [posts])
  const totalComments = useMemo(() => comments.filter(c => c.status === 'approved').length, [comments])
  const pendingComments = useMemo(() => comments.filter(c => c.status === 'pending').length, [comments])

  const filteredPosts = useMemo(() => posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [posts, searchQuery])

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
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors relative whitespace-nowrap  DZD{
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
                    <p className="text-xs sm:text-sm text-gray-600">Articles</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalPosts}</p>
                  </div>
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Publiés</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{publishedPosts}</p>
                  </div>
                  <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Vues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Commentaires</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalComments}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Articles récents</h3>
                <div className="space-y-3">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{post.title}</p>
                        <p className="text-sm text-gray-500">{post.authorName} • {post.categoryName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded text-xs  DZD{
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Commentaires en attente</h3>
                <div className="space-y-3">
                  {comments.filter(c => c.status === 'pending').slice(0, 5).map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm">{comment.authorName}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">Sur: {comment.postTitle}</p>
                    </div>
                  ))}
                  {pendingComments === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucun commentaire en attente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Articles</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                  Nouvel article
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                        {post.featured && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">À la une</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>{post.categoryName}</span>
                        <span>•</span>
                        <span>{new Date(post.publishDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.comments} commentaires
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </span>
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
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
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                      <div className={`w-12 h-12 rounded-lg  DZD{colorClass.split(' ')[0]} flex items-center justify-center`}>
                        <Tag className={`w-6 h-6  DZD{colorClass.split(' ')[1]}`} />
                      </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.postCount} articles</p>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Commentaires</h2>
            </div>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{comment.authorName}</h3>
                        <span className="text-sm text-gray-500">{comment.authorEmail}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{comment.content}</p>
                      <p className="text-xs text-gray-400">Sur: {comment.postTitle}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(comment.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap  DZD{
                      comment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      comment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {comment.status === 'approved' ? 'Approuvé' : comment.status === 'pending' ? 'En attente' : 'Spam'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'authors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Auteurs</h2>
              <button className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Nouvel auteur
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {authors.map((author) => (
                <div key={author.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{author.name}</h3>
                      <p className="text-sm text-gray-500">{author.email}</p>
                    </div>
                  </div>
                  {author.bio && (
                    <p className="text-sm text-gray-600 mb-3">{author.bio}</p>
                  )}
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Articles:</span>
                      <span className="font-medium text-gray-900">{author.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Vues totales:</span>
                      <span className="font-medium text-gray-900">{author.totalViews}</span>
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
