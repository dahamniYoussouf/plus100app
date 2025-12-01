'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { MessageCircle, Users, Send, Search, BarChart3, Phone, Video, MoreVertical, Check, CheckCheck, Clock } from 'lucide-react'
import Modal from '@/components/Modal'

type TabType = 'dashboard' | 'conversations' | 'contacts' | 'groups'

interface Conversation {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  type: 'direct' | 'group'
  members?: string[]
  online?: boolean
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
}

interface Contact {
  id: string
  name: string
  email: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastSeen?: Date
}

interface Group {
  id: string
  name: string
  description?: string
  members: string[]
  avatar?: string
  createdAt: Date
}

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', email: '' })
  const [newGroup, setNewGroup] = useState({ name: '', description: '', memberIds: [] as string[] })

  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations')
    const savedMessages = localStorage.getItem('chat-messages')
    const savedContacts = localStorage.getItem('chat-contacts')
    const savedGroups = localStorage.getItem('chat-groups')

    if (savedConversations) {
      const parsed = JSON.parse(savedConversations)
      setConversations(parsed.map((c: any) => ({ ...c, lastMessageTime: new Date(c.lastMessageTime) })))
    } else {
      const today = new Date()
      const sample: Conversation[] = [
        { id: '1', name: 'Ahmed Benali', lastMessage: 'Salut, comment ça va ?', lastMessageTime: today, unreadCount: 2, type: 'direct', online: true },
        { id: '2', name: 'Fatima Kadri', lastMessage: 'Merci pour ton aide !', lastMessageTime: today, unreadCount: 0, type: 'direct', online: false },
        { id: '3', name: 'Équipe Dev', lastMessage: 'Réunion demain à 10h', lastMessageTime: today, unreadCount: 5, type: 'group', members: ['1', '2', '3'] },
      ]
      setConversations(sample)
      localStorage.setItem('chat-conversations', JSON.stringify(sample))
    }

    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })))
    } else {
      const today = new Date()
      const sample: Message[] = [
        { id: '1', conversationId: '1', senderId: '1', senderName: 'Ahmed Benali', content: 'Salut, comment ça va ?', timestamp: today, status: 'read', type: 'text' },
        { id: '2', conversationId: '1', senderId: 'me', senderName: 'Moi', content: 'Ça va bien, merci !', timestamp: today, status: 'read', type: 'text' },
        { id: '3', conversationId: '2', senderId: '2', senderName: 'Fatima Kadri', content: 'Merci pour ton aide !', timestamp: today, status: 'read', type: 'text' },
      ]
      setMessages(sample)
      localStorage.setItem('chat-messages', JSON.stringify(sample))
    }

    if (savedContacts) {
      const parsed = JSON.parse(savedContacts)
      setContacts(parsed.map((c: any) => ({ ...c, lastSeen: c.lastSeen ? new Date(c.lastSeen) : undefined })))
    } else {
      const sample: Contact[] = [
        { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', status: 'online' },
        { id: '2', name: 'Fatima Kadri', email: 'fatima@email.com', status: 'offline', lastSeen: new Date() },
        { id: '3', name: 'Mohamed Tazi', email: 'mohamed@email.com', status: 'away' },
      ]
      setContacts(sample)
      localStorage.setItem('chat-contacts', JSON.stringify(sample))
    }

    if (savedGroups) {
      const parsed = JSON.parse(savedGroups)
      setGroups(parsed.map((g: any) => ({ ...g, createdAt: new Date(g.createdAt) })))
    } else {
      const sample: Group[] = [
        { id: '1', name: 'Équipe Dev', description: 'Groupe de développement', members: ['1', '2', '3'], createdAt: new Date() },
        { id: '2', name: 'Projet Alpha', description: 'Discussion du projet', members: ['1', '2'], createdAt: new Date() },
      ]
      setGroups(sample)
      localStorage.setItem('chat-groups', JSON.stringify(sample))
    }
  }, [])

  useEffect(() => {
    if (conversations.length > 0) localStorage.setItem('chat-conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('chat-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (contacts.length > 0) localStorage.setItem('chat-contacts', JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    if (groups.length > 0) localStorage.setItem('chat-groups', JSON.stringify(groups))
  }, [groups])

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Tableau de bord', icon: BarChart3 },
    { id: 'conversations' as TabType, label: 'Conversations', icon: MessageCircle },
    { id: 'contacts' as TabType, label: 'Contacts', icon: Users },
    { id: 'groups' as TabType, label: 'Groupes', icon: Users },
  ]

  const totalConversations = useMemo(() => conversations.length, [conversations.length])
  const totalMessages = useMemo(() => messages.length, [messages.length])
  const unreadMessages = useMemo(() => conversations.reduce((sum, c) => sum + c.unreadCount, 0), [conversations])
  const onlineContacts = useMemo(() => contacts.filter(c => c.status === 'online').length, [contacts])

  const currentMessages = useMemo(() => selectedConversation
    ? messages.filter(m => m.conversationId === selectedConversation)
    : [], [messages, selectedConversation])

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: 'me',
      senderName: 'Moi',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }, [newMessage, selectedConversation])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
                      ? 'text-green-600 border-b-2 border-green-600'
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
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Conversations</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalConversations}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Messages</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{totalMessages}</p>
                  </div>
                  <Send className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Non lus</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{unreadMessages}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg border border-green-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">En ligne</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{onlineContacts}</p>
                  </div>
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Conversations récentes</h3>
                <div className="space-y-3">
                  {conversations.slice(0, 5).map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConversation(conv.id)
                        setActiveTab('conversations')
                      }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{conv.name}</p>
                          <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4">
                        {conv.unreadCount > 0 && (
                          <span className="bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-medium">
                            {conv.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{new Date(conv.lastMessageTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contacts en ligne</h3>
                <div className="space-y-3">
                  {contacts.filter(c => c.status === 'online').slice(0, 5).map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  ))}
                  {onlineContacts === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucun contact en ligne</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="flex-1 border-0 focus:ring-0 text-sm"
                />
              </div>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation === conv.id ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900 truncate text-sm">{conv.name}</p>
                          {conv.online && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-green-600 text-white rounded-full px-2 py-0.5 text-xs font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col" style={{ height: '600px' }}>
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {conversations.find(c => c.id === selectedConversation)?.name}
                        </p>
                        <p className="text-xs text-gray-500">En ligne</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === 'me' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className={`text-xs ${message.senderId === 'me' ? 'text-green-100' : 'text-gray-500'}`}>
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.senderId === 'me' && (
                              <span>
                                {message.status === 'read' ? (
                                  <CheckCheck className="w-3 h-3 text-green-100" />
                                ) : message.status === 'delivered' ? (
                                  <CheckCheck className="w-3 h-3 text-gray-400" />
                                ) : message.status === 'sent' ? (
                                  <Check className="w-3 h-3 text-gray-400" />
                                ) : (
                                  <Clock className="w-3 h-3 text-gray-400" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Tapez un message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p>Sélectionnez une conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contacts</h2>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau contact
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' :
                        contact.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <span className={`text-xs px-2 py-1 rounded ${
                      contact.status === 'online' ? 'bg-green-100 text-green-800' :
                      contact.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status === 'online' ? 'En ligne' : contact.status === 'away' ? 'Absent' : 'Hors ligne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Groupes</h2>
              <button 
                onClick={() => setShowGroupModal(true)}
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nouveau groupe
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-gray-500">{group.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">{group.members.length} membres</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false)
          setNewContact({ name: '', email: '' })
        }}
        title="Nouveau contact"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Ahmed Benali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: ahmed@email.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowContactModal(false)
                setNewContact({ name: '', email: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newContact.name && newContact.email) {
                  const contact: Contact = {
                    id: Date.now().toString(),
                    name: newContact.name,
                    email: newContact.email,
                    status: 'offline',
                  }
                  setContacts([...contacts, contact])
                  setShowContactModal(false)
                  setNewContact({ name: '', email: '' })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showGroupModal}
        onClose={() => {
          setShowGroupModal(false)
          setNewGroup({ name: '', description: '', memberIds: [] })
        }}
        title="Nouveau groupe"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
            <input
              type="text"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Équipe Marketing"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              value={newGroup.description}
              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Description du groupe"
            />
          </div>
          {contacts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membres</label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {contacts.map(contact => (
                  <label key={contact.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGroup.memberIds.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGroup({ ...newGroup, memberIds: [...newGroup.memberIds, contact.id] })
                        } else {
                          setNewGroup({ ...newGroup, memberIds: newGroup.memberIds.filter(id => id !== contact.id) })
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{contact.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setShowGroupModal(false)
                setNewGroup({ name: '', description: '', memberIds: [] })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                if (newGroup.name && newGroup.memberIds.length > 0) {
                  const group: Group = {
                    id: Date.now().toString(),
                    name: newGroup.name,
                    description: newGroup.description || undefined,
                    members: newGroup.memberIds,
                    createdAt: new Date(),
                  }
                  setGroups([...groups, group])
                  setShowGroupModal(false)
                  setNewGroup({ name: '', description: '', memberIds: [] })
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
