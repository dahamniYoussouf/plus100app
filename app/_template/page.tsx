// Template pour pages d'application - À utiliser comme référence
'use client'

import { useState } from 'react'
import { IconType } from 'lucide-react'

interface TemplateProps {
  title: string
  description: string
  icon: IconType
  color: string
  bgColor: string
  iconColor: string
  features: string[]
  stats: { label: string; value: string; icon: IconType }[]
}

export default function TemplatePage({
  title,
  description,
  icon: Icon,
  color,
  bgColor,
  iconColor,
  features,
  stats
}: TemplateProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgColor} to-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex p-4 rounded-full ${bgColor} mb-4`}>
              <Icon className={`w-12 h-12 sm:w-16 sm:h-16 ${iconColor}`} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8`}>
            {stats.map((stat, i) => {
              const StatIcon = stat.icon
              return (
                <div key={i} className={`${bgColor} rounded-lg p-4 sm:p-6 text-center`}>
                  <StatIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor} mx-auto mb-2`} />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{feature}</h3>
                    <p className="text-sm text-gray-600">
                      Fonctionnalité complète pour une gestion optimale
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

