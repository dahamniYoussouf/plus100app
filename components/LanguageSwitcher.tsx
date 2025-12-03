'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
    { code: 'dz' as const, name: 'الدارجة', flag: '🇩🇿' },
  ]

  const currentLang = languages.find(l => l.code === language) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium">{currentLang.flag} {currentLang.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute  DZD{isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2  DZD{
                  language === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}




