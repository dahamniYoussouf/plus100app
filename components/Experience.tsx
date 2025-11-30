'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Calendar, MapPin, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const experiences = [
  {
    title: 'Agentforce Developer',
    company: 'Levio',
    location: 'Algérie / Remote',
    period: '2022 - Présent',
    description: [
      'Développement et maintenance d\'applications Agentforce personnalisées avec automatisation avancée des workflows',
      'Création d\'interfaces front-end réactives utilisant des frameworks JavaScript modernes',
      'Conception et implémentation d\'APIs RESTful et architecture microservices',
      'Collaboration avec des équipes cross-fonctionnelles pour livrer des solutions scalables',
      'Optimisation des performances d\'application et implémentation des meilleures pratiques de qualité de code',
      'Consultant en transformation numérique et solutions technologiques innovantes',
    ],
    technologies: ['Agentforce', 'JavaScript', 'React', 'Node.js', 'API Integration', 'Transformation Digitale'],
    color: 'from-blue-500 to-cyan-500',
    link: 'https://levio.ca',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    logo: 'https://levio.ca/wp-content/uploads/2021/06/levio-logo.svg',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    about: 'Levio est une entreprise spécialisée dans la transformation numérique et les solutions technologiques, offrant des services-conseils en technologies de l\'information.',
  },
  {
    title: 'Salesforce Developer',
    company: 'Salesforce Solutions',
    location: 'Remote',
    period: '2021 - 2023',
    description: [
      'Customized Salesforce orgs with Apex, Visualforce, and Lightning Web Components',
      'Implemented complex business logic and automated processes using Flow and Process Builder',
      'Integrated third-party systems with Salesforce using REST and SOAP APIs',
      'Managed data migration and ETL processes for large-scale deployments',
      'Provided technical consultation and training to development teams',
    ],
    technologies: ['Salesforce', 'Apex', 'LWC', 'SOQL', 'Integration'],
    color: 'from-purple-500 to-pink-500',
    link: null,
  },
  {
    title: 'WordPress Developer',
    company: 'Gama Outillage',
    location: 'Boufarik, Blida - Algérie',
    period: '2020 - 2022',
    description: [
      'Développement et maintenance de la plateforme e-commerce pour Gama Outillage, fournisseur d\'outillage professionnel leader en Algérie',
      'Création de thèmes WordPress personnalisés et intégrations WooCommerce pour la gestion du catalogue produits',
      'Optimisation des performances du site, SEO et expérience utilisateur pour couvrir 58 wilayas (provinces)',
      'Intégration de passerelles de paiement et systèmes d\'expédition pour livraison nationale',
      'Gestion des catégories de produits, inventaire et catalogue multi-marques (Bosch, Makita, Toptul, Worcraft, Honest Pro, etc.)',
      'Développement de fonctionnalités e-commerce avancées pour outils de chantier, carottage, fixation, levage, mesure, etc.',
    ],
    technologies: ['WordPress', 'PHP', 'MySQL', 'WooCommerce', 'Custom Themes', 'E-commerce', 'SEO'],
    color: 'from-green-500 to-teal-500',
    link: 'https://gamaoutillage.net/',
    image: 'https://gamaoutillage.net/wp-content/uploads/2024/01/logo-gama-outillage.png',
    logo: 'https://gamaoutillage.net/wp-content/uploads/2024/01/logo-gama-outillage.png',
    screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    about: 'Gama Outillage est un fournisseur d\'outillage professionnel en Algérie, offrant une large gamme d\'outils et d\'équipements pour les professionnels du bâtiment et de l\'industrie. Livraison disponible dans 58 wilayas.',
  },
  {
    title: 'Full Stack Developer',
    company: 'Tawssil Food Delivery',
    location: 'Algérie / Remote',
    period: '2019 - 2021',
    description: [
      'Développement d\'une plateforme de livraison de nourriture complète avec suivi de commandes en temps réel',
      'Création d\'APIs RESTful et endpoints GraphQL pour clients mobiles et web',
      'Implémentation de systèmes d\'authentification, d\'autorisation et de traitement des paiements',
      'Création d\'un dashboard admin pour la gestion des restaurants et livraisons',
      'Optimisation des requêtes de base de données et performances d\'application pour trafic élevé',
      'Gestion de l\'expédition, ramassage et livraison de colis dans plusieurs villes d\'Algérie',
    ],
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Food Delivery', 'Real-time Tracking'],
    color: 'from-orange-500 to-red-500',
    link: 'https://tawssillik.com',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    logo: 'https://tawssillik.com/assets/images/logo.png',
    screenshot: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    about: 'Tawssil est une solution d\'expédition qui gère les livraisons en ligne, assurant le ramassage, la livraison et l\'expédition de colis dans plusieurs villes d\'Algérie.',
  },
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" ref={ref} className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Expérience Professionnelle</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Logo ou Image de l'entreprise */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 border-2 border-gray-300 shadow-md">
                        {(exp as any).logo ? (
                          <img
                            src={(exp as any).logo}
                            alt={`${exp.company} logo`}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-r ${exp.color} flex items-center justify-center`}>
                            <Briefcase className="text-white" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-2xl font-bold text-gray-800">{exp.title}</h3>
                          {exp.link && (
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                              title="Voir le site"
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                        <p className="text-lg text-gray-600 mb-2">{exp.company}</p>
                        {(exp as any).about && (
                          <p className="text-sm text-gray-500 italic">{(exp as any).about}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2 mt-4 md:mt-0">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span className="text-sm">{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Image du projet si disponible */}
                {((exp as any).image || (exp as any).screenshot) && (
                  <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 shadow-lg border border-gray-200">
                    <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={(exp as any).screenshot || (exp as any).image}
                        alt={`${exp.company} project`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if ((exp as any).image && (exp as any).image !== (exp as any).screenshot) {
                            target.src = (exp as any).image
                          } else {
                            target.style.display = 'none'
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white z-10">
                        <p className="text-lg font-semibold mb-1">{exp.company}</p>
                        <p className="text-xs text-gray-300">Projet développé par Dahamni Youssouf</p>
                      </div>
                      {exp.link && (
                        <div className="absolute top-4 right-4 z-10">
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500/90 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 backdrop-blur-sm"
                          >
                            <ExternalLink size={16} />
                            Visiter
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <ul className="space-y-3 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${exp.color} font-bold mt-1`}>
                        ▸
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${exp.color} text-white font-medium`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

