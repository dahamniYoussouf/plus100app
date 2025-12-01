'use client'

/**
 * GALERIE DE PROJETS - Images réelles des projets
 * 
 * CONCEPT : Galerie visuelle avec images réelles des projets développés
 */

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Gama Outillage E-commerce',
    description: 'Plateforme e-commerce WordPress avec WooCommerce - Livraison dans 58 wilayas',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    logo: 'https://gamaoutillage.net/wp-content/uploads/2024/01/logo-gama-outillage.png',
    link: 'https://gamaoutillage.net/',
    technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'E-commerce'],
    screenshots: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    ],
  },
  {
    id: 2,
    title: 'Tawssil Food Delivery',
    description: 'Application de livraison de nourriture full stack avec suivi en temps réel',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    logo: 'https://tawssillik.com/assets/images/logo.png',
    link: 'https://tawssillik.com',
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Real-time'],
    screenshots: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    ],
  },
  {
    id: 3,
    title: 'Solutions Agentforce - Levio',
    description: 'Applications Agentforce avec workflow automatisé et transformation numérique',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    logo: 'https://levio.ca/wp-content/uploads/2021/06/levio-logo.svg',
    link: 'https://levio.ca',
    technologies: ['Agentforce', 'JavaScript', 'React', 'Node.js', 'Workflow'],
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
    ],
  },
  {
    id: 4,
    title: 'Dashboard Analytics',
    description: 'Tableau de bord analytique avec visualisations',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    technologies: ['React', 'D3.js', 'TypeScript', 'API'],
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    ],
  },
  {
    id: 5,
    title: 'API RESTful Services',
    description: 'Services backend avec architecture microservices',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    screenshots: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    ],
  },
  {
    id: 6,
    title: 'Mobile Application',
    description: 'Application mobile cross-platform',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    ],
  },
]

export default function ProjectGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openProject = (projectId: number) => {
    setSelectedProject(projectId)
    setCurrentImageIndex(0)
  }

  const closeProject = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    const project = projects.find(p => p.id === selectedProject)
    if (project && currentImageIndex < project.screenshots.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  return (
    <section id="projects" ref={ref} className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Galerie de Projets</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez mes réalisations en images
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openProject(project.id)}
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all hover:shadow-2xl shadow-lg">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-300">{project.description}</p>
                  </div>
                  {project.logo && (
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <img src={project.logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 border border-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 border border-gray-300">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de projet */}
      {selectedProjectData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeProject}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-4">
                {selectedProjectData.logo && (
                  <img
                    src={selectedProjectData.logo}
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedProjectData.title}</h3>
                  <p className="text-gray-600">{selectedProjectData.description}</p>
                </div>
              </div>
              <button
                onClick={closeProject}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Images carousel */}
            <div className="relative h-96 bg-gray-100">
              <img
                src={selectedProjectData.screenshots[currentImageIndex]}
                alt={`${selectedProjectData.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {selectedProjectData.screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-gray-300 shadow-lg flex items-center justify-center text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === selectedProjectData.screenshots.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-gray-300 shadow-lg flex items-center justify-center text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {selectedProjectData.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentImageIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedProjectData.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-sm text-white font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {selectedProjectData.link && (
                  <a
                    href={selectedProjectData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 rounded-lg text-white hover:shadow-lg transition-all"
                  >
                    <ExternalLink size={18} />
                    Visiter le site
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

