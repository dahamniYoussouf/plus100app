'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const skillCategories = [
  {
    title: 'Platforms & Frameworks',
    skills: [
      { name: 'Agentforce', level: 95, color: 'bg-blue-500' },
      { name: 'Salesforce', level: 90, color: 'bg-purple-500' },
      { name: 'WordPress', level: 88, color: 'bg-green-500' },
      { name: 'React', level: 92, color: 'bg-cyan-500' },
      { name: 'Next.js', level: 90, color: 'bg-gray-500' },
      { name: 'Node.js', level: 88, color: 'bg-green-600' },
    ],
  },
  {
    title: 'Languages & Tools',
    skills: [
      { name: 'JavaScript/TypeScript', level: 93, color: 'bg-yellow-500' },
      { name: 'Python', level: 85, color: 'bg-blue-600' },
      { name: 'PHP', level: 87, color: 'bg-indigo-500' },
      { name: 'SQL', level: 90, color: 'bg-orange-500' },
      { name: 'Git', level: 92, color: 'bg-red-500' },
      { name: 'Docker', level: 80, color: 'bg-blue-400' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', level: 85, color: 'bg-orange-600' },
      { name: 'Azure', level: 82, color: 'bg-blue-500' },
      { name: 'CI/CD', level: 88, color: 'bg-purple-600' },
      { name: 'Kubernetes', level: 75, color: 'bg-blue-700' },
      { name: 'Terraform', level: 78, color: 'bg-purple-700' },
    ],
  },
]

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" ref={ref} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Skills & Technologies</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-bold mb-6 text-white">{category.title}</h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                      <span className="text-gray-600 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className={`h-full ${skill.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: categoryIndex * 0.2 + skillIndex * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-white">Additional Expertise</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'RESTful APIs',
              'GraphQL',
              'Microservices',
              'Agile/Scrum',
              'Test-Driven Development',
              'Code Review',
              'Technical Writing',
              'System Architecture',
              'Database Design',
              'Performance Optimization',
            ].map((skill, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}


