'use client'

import { useState } from 'react'
import { X, Mail, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmailPopup({ isOpen, onClose }: EmailPopupProps) {
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    name: '',
    email: ''
  })

  const handleSendEmail = () => {
    const recipient = 'gy_dahamni@esi.dz'
    const subject = encodeURIComponent(emailData.subject || 'Contact from Website')
    const body = encodeURIComponent(
      `Name: ${emailData.name || 'Anonymous'}\n` +
      `Email: ${emailData.email || 'No email provided'}\n\n` +
      `Message:\n${emailData.message || 'No message provided'}`
    )
    
    // Open default email client
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
    
    // Optionally close the popup after a delay
    setTimeout(() => {
      onClose()
    }, 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
          >
            {/* Large Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-blue-500"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 border-b-4 border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Contactez-nous</h2>
                      <p className="text-white/90 text-lg">Envoyez-nous un message</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-3 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Votre nom *
                      </label>
                      <input
                        type="text"
                        value={emailData.name}
                        onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder="Entrez votre nom"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Votre email *
                      </label>
                      <input
                        type="email"
                        value={emailData.email}
                        onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={emailData.message}
                      onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-none"
                      placeholder="Écrivez votre message ici..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 border-t-4 border-blue-700">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm">
                    * Les champs marqués sont obligatoires
                  </p>
                  <button
                    onClick={handleSendEmail}
                    disabled={!emailData.name || !emailData.email || !emailData.subject || !emailData.message}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <Send className="w-6 h-6" />
                    Envoyer l'email
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

