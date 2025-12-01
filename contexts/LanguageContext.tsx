'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'fr' | 'ar' | 'dz'

interface Translations {
  [key: string]: {
    fr: string
    ar: string
    dz: string
  }
}

const translations: Translations = {
  // Common
  'app.title': {
    fr: 'Applications Web',
    ar: 'تطبيقات الويب',
    dz: 'التطبيقات د الويب'
  },
  'app.description': {
    fr: 'Collection complète de {count} applications web interactives et fonctionnelles',
    ar: 'مجموعة كاملة من {count} تطبيق ويب تفاعلي ووظيفي',
    dz: 'مجموعة كاملة من {count} تطبيق ويب تفاعلي ووظيفي'
  },
  'app.access': {
    fr: 'Accéder',
    ar: 'الوصول',
    dz: 'دخول'
  },
  'category.all': {
    fr: 'Toutes',
    ar: 'الكل',
    dz: 'كامل'
  },
  'currency.symbol': {
    fr: 'د.ج',
    ar: 'د.ج',
    dz: 'د.ج'
  },
  // Navigation
  'nav.home': {
    fr: 'Accueil',
    ar: 'الرئيسية',
    dz: 'البيت'
  },
  'nav.apps': {
    fr: 'Applications',
    ar: 'التطبيقات',
    dz: 'التطبيقات'
  },
  // Dashboard
  'dashboard.title': {
    fr: 'Tableau de bord',
    ar: 'لوحة التحكم',
    dz: 'لوحة التحكم'
  },
  'dashboard.revenue': {
    fr: 'Revenus',
    ar: 'الإيرادات',
    dz: 'الربح'
  },
  'dashboard.total': {
    fr: 'Total',
    ar: 'المجموع',
    dz: 'المجموع'
  },
  // Real Estate
  'realestate.properties': {
    fr: 'Biens',
    ar: 'العقارات',
    dz: 'العقارات'
  },
  'realestate.available': {
    fr: 'Disponibles',
    ar: 'متاحة',
    dz: 'متاحة'
  },
  'realestate.rented': {
    fr: 'Loués',
    ar: 'مؤجرة',
    dz: 'مؤجرة'
  },
  'realestate.tenants': {
    fr: 'Locataires',
    ar: 'المستأجرون',
    dz: 'المستأجرون'
  },
  'realestate.revenue': {
    fr: 'Revenus/mois',
    ar: 'الإيرادات/شهر',
    dz: 'الربح/شهر'
  },
  // Spa
  'spa.services': {
    fr: 'Services',
    ar: 'الخدمات',
    dz: 'الخدمات'
  },
  'spa.appointments': {
    fr: 'Rendez-vous',
    ar: 'المواعيد',
    dz: 'المواعيد'
  },
  'spa.clients': {
    fr: 'Clients',
    ar: 'العملاء',
    dz: 'الزبائن'
  },
  'spa.today': {
    fr: 'RDV Aujourd\'hui',
    ar: 'المواعيد اليوم',
    dz: 'المواعيد اليوم'
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && ['fr', 'ar', 'dz'].includes(saved)) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'dz' ? 'ar' : 'fr'
  }

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language === 'ar' ? 'ar' : language === 'dz' ? 'ar' : 'fr'
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = translations[key]?.[language] || translations[key]?.['fr'] || key
    
    if (params) {
      return Object.entries(params).reduce(
        (text, [paramKey, paramValue]) => text.replace(`{ DZD{paramKey}}`, String(paramValue)),
        translation
      )
    }
    
    return translation
  }

  const isRTL = language === 'ar' || language === 'dz'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

