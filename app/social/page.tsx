'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Modal from '@/components/Modal'
import { MessageSquare, Users, Bell, Home, Search, Settings, Heart, Share2, Send, Image as ImageIcon, Video, MapPin, Smile, MoreVertical, Edit2, Trash2, X, Plus, CheckCircle, UserPlus, UserMinus, Calendar, Clock, Hash } from 'lucide-react'

type TabType = 'feed' | 'messages' | 'groups' | 'notifications' | 'profile'

interface Post {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  imageUrl?: string
  likes: string[]
  comments: Comment[]
  shares: number
  createdAt: Date
  location?: string
  edited?: boolean
}

interface Comment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  likes: string[]
  createdAt: Date
  edited?: boolean
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  createdAt: Date
  read: boolean
  type: 'text' | 'image' | 'file'
}

interface Conversation {
  id: string
  participants: string[]
  participantNames: { [key: string]: string }
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
}

interface Group {
  id: string
  name: string
  description: string
  avatar?: string
  members: string[]
  memberNames: { [key: string]: string }
  admins: string[]
  isPrivate: boolean
  createdAt: Date
  posts: Post[]
}

interface Notification {
  id: string
  type: 'like' | 'comment' | 'share' | 'friend_request' | 'group_invite' | 'mention'
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  targetId: string
  content: string
  read: boolean
  createdAt: Date
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  friends: string[]
  friendNames: { [key: string]: string }
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<TabType>('feed')
  const [currentUserId] = useState('user1')
  const [currentUserName] = useState('Vous')
  const [posts, setPosts] = useState<Post[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  
  // Modals
  const [showPostModal, setShowPostModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showEditPostModal, setShowEditPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedPostForComment, setSelectedPostForComment] = useState<string | null>(null)
  
  // Form states
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '', location: '' })
  const [newComment, setNewComment] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false })
  const [profile, setProfile] = useState<UserProfile>({
    id: currentUserId,
    name: currentUserName,
    email: 'vous@example.com',
    bio: '',
    location: '',
    website: '',
    friends: [],
    friendNames: {}
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsExpanded, setNotificationsExpanded] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('social-posts')
    const savedConversations = localStorage.getItem('social-conversations')
    const savedMessages = localStorage.getItem('social-messages')
    const savedGroups = localStorage.getItem('social-groups')
    const savedNotifications = localStorage.getItem('social-notifications')
    const savedUsers = localStorage.getItem('social-users')
    const savedProfile = localStorage.getItem('social-profile')

    if (savedPosts) {
      const parsed = JSON.parse(savedPosts)
      setPosts(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        comments: p.comments?.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })) || []
      })))
    } else {
      const samplePosts: Post[] = [
        {
          id: '1',
          authorId: 'user2',
          authorName: 'Ahmed Benali',
          content: 'Belle journée aujourd\'hui! ☀️',
          likes: ['user1'],
          comments: [],
          shares: 2,
          createdAt: new Date(Date.now() - 3600000),
          location: 'Alger, Algérie'
        },
        {
          id: '2',
          authorId: 'user3',
          authorName: 'Fatima Zohra',
          content: 'Nouveau projet terminé! Fier de mon équipe! 🎉',
          likes: ['user1', 'user2'],
          comments: [
            {
              id: 'c1',
              authorId: 'user1',
              authorName: 'Vous',
              content: 'Félicitations! 👏',
              likes: [],
              createdAt: new Date(Date.now() - 1800000)
            }
          ],
          shares: 5,
          createdAt: new Date(Date.now() - 7200000)
        }
      ]
      setPosts(samplePosts)
      localStorage.setItem('social-posts', JSON.stringify(samplePosts))
    }

    if (savedConversations) {
      const parsed = JSON.parse(savedConversations)
      setConversations(parsed.map((c: any) => ({
        ...c,
        updatedAt: new Date(c.updatedAt),
        lastMessage: c.lastMessage ? { ...c.lastMessage, createdAt: new Date(c.lastMessage.createdAt) } : undefined
      })))
    } else {
      const sampleConversations: Conversation[] = [
        {
          id: 'conv1',
          participants: ['user1', 'user2'],
          participantNames: { 'user2': 'Ahmed Benali' },
          unreadCount: 2,
          updatedAt: new Date(Date.now() - 1800000)
        }
      ]
      setConversations(sampleConversations)
      localStorage.setItem('social-conversations', JSON.stringify(sampleConversations))
    }

    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) })))
    } else {
      const sampleMessages: Message[] = [
        {
          id: 'msg1',
          conversationId: 'conv1',
          senderId: 'user2',
          senderName: 'Ahmed Benali',
          content: 'Salut! Comment ça va?',
          createdAt: new Date(Date.now() - 3600000),
          read: false,
          type: 'text'
        },
        {
          id: 'msg2',
          conversationId: 'conv1',
          senderId: 'user2',
          senderName: 'Ahmed Benali',
          content: 'On se voit demain?',
          createdAt: new Date(Date.now() - 1800000),
          read: false,
          type: 'text'
        }
      ]
      setMessages(sampleMessages)
      localStorage.setItem('social-messages', JSON.stringify(sampleMessages))
    }

    if (savedGroups) {
      const parsed = JSON.parse(savedGroups)
      setGroups(parsed.map((g: any) => ({
        ...g,
        createdAt: new Date(g.createdAt),
        posts: g.posts?.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          comments: p.comments?.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) })) || []
        })) || []
      })))
    } else {
      const sampleGroups: Group[] = [
        {
          id: 'group1',
          name: 'Équipe Développement',
          description: 'Groupe pour l\'équipe de développement',
          members: ['user1', 'user2', 'user3'],
          memberNames: { 'user1': 'Vous', 'user2': 'Ahmed Benali', 'user3': 'Fatima Zohra' },
          admins: ['user1'],
          isPrivate: false,
          createdAt: new Date(),
          posts: []
        }
      ]
      setGroups(sampleGroups)
      localStorage.setItem('social-groups', JSON.stringify(sampleGroups))
    }

    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })))
    } else {
      const sampleNotifications: Notification[] = [
        {
          id: 'notif1',
          type: 'like',
          fromUserId: 'user2',
          fromUserName: 'Ahmed Benali',
          targetId: '1',
          content: 'a aimé votre publication',
          read: false,
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          id: 'notif2',
          type: 'comment',
          fromUserId: 'user3',
          fromUserName: 'Fatima Zohra',
          targetId: '2',
          content: 'a commenté votre publication',
          read: false,
          createdAt: new Date(Date.now() - 7200000)
        }
      ]
      setNotifications(sampleNotifications)
      localStorage.setItem('social-notifications', JSON.stringify(sampleNotifications))
    }

    if (savedUsers) {
      const parsed = JSON.parse(savedUsers)
      setUsers(parsed.map((u: any) => ({ ...u, friends: u.friends || [], friendNames: u.friendNames || {} })))
    } else {
      const sampleUsers: UserProfile[] = [
        {
          id: 'user2',
          name: 'Ahmed Benali',
          email: 'ahmed@example.com',
          bio: 'Développeur passionné',
          location: 'Alger, Algérie',
          friends: ['user1'],
          friendNames: { 'user1': 'Vous' }
        },
        {
          id: 'user3',
          name: 'Fatima Zohra',
          email: 'fatima@example.com',
          bio: 'Designer UI/UX',
          location: 'Oran, Algérie',
          friends: [],
          friendNames: {}
        }
      ]
      setUsers(sampleUsers)
      localStorage.setItem('social-users', JSON.stringify(sampleUsers))
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      localStorage.setItem('social-profile', JSON.stringify(profile))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (posts.length > 0) localStorage.setItem('social-posts', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    if (conversations.length > 0) localStorage.setItem('social-conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('social-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (groups.length > 0) localStorage.setItem('social-groups', JSON.stringify(groups))
  }, [groups])

  useEffect(() => {
    if (notifications.length > 0) localStorage.setItem('social-notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('social-profile', JSON.stringify(profile))
  }, [profile])

  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      authorId: currentUserId,
      authorName: currentUserName,
      content: newPost.content,
      imageUrl: newPost.imageUrl || undefined,
      location: newPost.location || undefined,
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date()
    }

    setPosts([post, ...posts])
    setNewPost({ content: '', imageUrl: '', location: '' })
    setShowPostModal(false)
  }

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(currentUserId)
        const newLikes = isLiked
          ? post.likes.filter(id => id !== currentUserId)
          : [...post.likes, currentUserId]
        
        // Create notification if liked
        if (!isLiked && post.authorId !== currentUserId) {
          const notification: Notification = {
            id: Date.now().toString(),
            type: 'like',
            fromUserId: currentUserId,
            fromUserName: currentUserName,
            targetId: postId,
            content: 'a aimé votre publication',
            read: false,
            createdAt: new Date()
          }
          setNotifications([notification, ...notifications])
        }
        
        return { ...post, likes: newLikes }
      }
      return post
    }))
  }

  const handleSharePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 }
      }
      return post
    }))
  }

  const handleDeletePost = (postId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication?')) {
      setPosts(posts.filter(post => post.id !== postId))
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setNewPost({ content: post.content, imageUrl: post.imageUrl || '', location: post.location || '' })
    setShowEditPostModal(true)
  }

  const handleUpdatePost = () => {
    if (!editingPost || !newPost.content.trim()) return

    setPosts(posts.map(post => {
      if (post.id === editingPost.id) {
        return {
          ...post,
          content: newPost.content,
          imageUrl: newPost.imageUrl || undefined,
          location: newPost.location || undefined,
          edited: true
        }
      }
      return post
    }))

    setShowEditPostModal(false)
    setEditingPost(null)
    setNewPost({ content: '', imageUrl: '', location: '' })
  }

  const handleAddComment = () => {
    if (!selectedPostForComment || !newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      authorId: currentUserId,
      authorName: currentUserName,
      content: newComment,
      likes: [],
      createdAt: new Date()
    }

    setPosts(posts.map(post => {
      if (post.id === selectedPostForComment) {
        // Create notification
        if (post.authorId !== currentUserId) {
          const notification: Notification = {
            id: Date.now().toString(),
            type: 'comment',
            fromUserId: currentUserId,
            fromUserName: currentUserName,
            targetId: post.id,
            content: 'a commenté votre publication',
            read: false,
            createdAt: new Date()
          }
          setNotifications([notification, ...notifications])
        }

        return { ...post, comments: [...post.comments, comment] }
      }
      return post
    }))

    setNewComment('')
    setShowCommentModal(false)
    setSelectedPostForComment(null)
  }

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage,
      createdAt: new Date(),
      read: false,
      type: 'text'
    }

    setMessages([...messages, message])

    // Update conversation
    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          lastMessage: message,
          updatedAt: new Date()
        }
      }
      return conv
    }))

    setNewMessage('')
  }

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return

    const group: Group = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      members: [currentUserId],
      memberNames: { [currentUserId]: currentUserName },
      admins: [currentUserId],
      isPrivate: newGroup.isPrivate,
      createdAt: new Date(),
      posts: []
    }

    setGroups([...groups, group])
    setNewGroup({ name: '', description: '', isPrivate: false })
    setShowGroupModal(false)
  }

  const handleJoinGroup = (groupId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId && !group.members.includes(currentUserId)) {
        return {
          ...group,
          members: [...group.members, currentUserId],
          memberNames: { ...group.memberNames, [currentUserId]: currentUserName }
        }
      }
      return group
    }))
  }

  const handleLeaveGroup = (groupId: string) => {
    if (confirm('Êtes-vous sûr de vouloir quitter ce groupe?')) {
      setGroups(groups.map(group => {
        if (group.id === groupId) {
          const { [currentUserId]: removed, ...remainingNames } = group.memberNames
          return {
            ...group,
            members: group.members.filter(id => id !== currentUserId),
            memberNames: remainingNames
          }
        }
        return group
      }))
    }
  }

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n))
  }

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const currentConversationMessages = useMemo(() => {
    if (!selectedConversation) return []
    return messages
      .filter(m => m.conversationId === selectedConversation)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }, [messages, selectedConversation])

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return posts
    return posts.filter(post =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [posts, searchQuery])

  const tabs = [
    { id: 'feed' as TabType, label: 'Fil d\'actualité', icon: Home },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'groups' as TabType, label: 'Groupes', icon: Users },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
    { id: 'profile' as TabType, label: 'Profil', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Réseau Social</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {unreadNotifications > 0 && (
                <button
                  onClick={() => {
                    setActiveTab('notifications')
                    handleMarkAllNotificationsRead()
                  }}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
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
                  {tab.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="sm:hidden w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* Create Post Button */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <button
                onClick={() => setShowPostModal(true)}
                className="w-full text-left p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-gray-500"
              >
                Quoi de neuf?
              </button>
            </div>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune publication</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => {
                  const isLiked = post.likes.includes(currentUserId)
                  const isAuthor = post.authorId === currentUserId
                  return (
                    <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {post.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(post.createdAt).toLocaleString('fr-FR')}</span>
                              {post.edited && <span>(modifié)</span>}
                              {post.location && (
                                <>
                                  <MapPin className="w-3 h-3 ml-2" />
                                  <span>{post.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {isAuthor && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

                      {post.imageUrl && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-2 ${isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                        >
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes.length}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPostForComment(post.id)
                            setShowCommentModal(true)
                          }}
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.comments.length}</span>
                        </button>
                        <button
                          onClick={() => handleSharePost(post.id)}
                          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>

                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-600 text-xs font-semibold">
                                  {comment.authorName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="font-semibold text-sm text-gray-900">{comment.authorName}</p>
                                  <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <button className="text-xs text-gray-500 hover:text-red-600">
                                    J'aime ({comment.likes.length})
                                  </button>
                                  <span className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleString('fr-FR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucune conversation</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conv) => {
                      const otherParticipant = conv.participants.find(id => id !== currentUserId)
                      const otherName = otherParticipant ? conv.participantNames[otherParticipant] || 'Utilisateur' : 'Groupe'
                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                            selectedConversation === conv.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {otherName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{otherName}</p>
                                {conv.lastMessage && (
                                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                    {conv.lastMessage.content}
                                  </p>
                                )}
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.participantNames[
                        conversations.find(c => c.id === selectedConversation)?.participants.find(id => id !== currentUserId) || ''
                      ] || 'Conversation'}
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentConversationMessages.map((message) => {
                      const isOwn = message.senderId === currentUserId
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Écrire un message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Sélectionnez une conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Groupes</h2>
              <button
                onClick={() => setShowGroupModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center"
              >
                <Plus className="w-5 h-5" />
                Créer un groupe
              </button>
            </div>

            {groups.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun groupe</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => {
                  const isMember = group.members.includes(currentUserId)
                  const isAdmin = group.admins.includes(currentUserId)
                  return (
                    <div key={group.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Hash className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                            {group.isPrivate && (
                              <span className="text-xs text-gray-500">Privé</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{group.members.length} membre(s)</span>
                        <span>{group.posts.length} publication(s)</span>
                      </div>
                      <div className="flex gap-2">
                        {isMember ? (
                          <>
                            <button
                              onClick={() => setSelectedGroup(group.id)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Voir le groupe
                            </button>
                            <button
                              onClick={() => handleLeaveGroup(group.id)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <UserMinus className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
                          >
                            <UserPlus className="w-5 h-5" />
                            Rejoindre
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h2>
              {unreadNotifications > 0 && (
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkNotificationRead(notif.id)}
                    className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notif.read ? 'border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold">
                          {notif.fromUserName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">
                          <span className="font-semibold">{notif.fromUserName}</span>{' '}
                          {notif.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mon Profil</h2>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-2xl font-semibold">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>
                {profile.bio && (
                  <div>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-1">
                      <span>🌐</span>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{profile.friends.length}</span> ami(s)
                  </p>
                </div>
              </div>
            </div>

            {/* User's Posts */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Mes Publications</h3>
              <div className="space-y-4">
                {posts.filter(p => p.authorId === currentUserId).length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune publication</p>
                  </div>
                ) : (
                  posts.filter(p => p.authorId === currentUserId).map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                      <p className="text-gray-900 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span>❤️ {post.likes.length}</span>
                        <span>💬 {post.comments.length}</span>
                        <span>🔄 {post.shares}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false)
          setNewPost({ content: '', imageUrl: '', location: '' })
        }}
        title="Créer une publication"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Quoi de neuf?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
            <input
              type="text"
              value={newPost.imageUrl}
              onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (optionnel)</label>
            <input
              type="text"
              value={newPost.location}
              onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alger, Algérie"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowPostModal(false)
                setNewPost({ content: '', imageUrl: '', location: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreatePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publier
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditPostModal}
        onClose={() => {
          setShowEditPostModal(false)
          setEditingPost(null)
          setNewPost({ content: '', imageUrl: '', location: '' })
        }}
        title="Modifier la publication"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Quoi de neuf?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
            <input
              type="text"
              value={newPost.imageUrl}
              onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation (optionnel)</label>
            <input
              type="text"
              value={newPost.location}
              onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alger, Algérie"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowEditPostModal(false)
                setEditingPost(null)
                setNewPost({ content: '', imageUrl: '', location: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleUpdatePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false)
          setSelectedPostForComment(null)
          setNewComment('')
        }}
        title="Ajouter un commentaire"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Écrire un commentaire..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowCommentModal(false)
                setSelectedPostForComment(null)
                setNewComment('')
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Commenter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showGroupModal}
        onClose={() => {
          setShowGroupModal(false)
          setNewGroup({ name: '', description: '', isPrivate: false })
        }}
        title="Créer un groupe"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nom du groupe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Description du groupe..."
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newGroup.isPrivate}
                onChange={(e) => setNewGroup({ ...newGroup, isPrivate: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Groupe privé</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowGroupModal(false)
                setNewGroup({ name: '', description: '', isPrivate: false })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateGroup}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Modifier le profil"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Parlez-nous de vous..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ville, Pays"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
            <input
              type="url"
              value={profile.website || ''}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowProfileModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => setShowProfileModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
