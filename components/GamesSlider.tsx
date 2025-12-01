'use client'

/**
 * SLIDER DE 10 JEUX INTERACTIFS
 * 
 * CONCEPT : Carrousel de jeux avec images excitantes
 * - 10 jeux différents avec images
 * - Navigation par flèches et indicateurs
 * - Animations fluides
 * - Design moderne et attractif
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Trophy, Zap, Target, Puzzle, Gamepad2 } from 'lucide-react'
import GameContainer from './games/GameContainer'

interface Game {
  id: number
  title: string
  description: string
  image: string
  category: string
  difficulty: string
  icon: React.ReactNode
  color: string
}

const games: Game[] = [
  {
    id: 1,
    title: 'Memory Challenge',
    description: 'Testez votre mémoire en trouvant les paires de technologies. Développez votre concentration !',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    category: 'Mémoire',
    difficulty: 'Moyen',
    icon: <Puzzle size={40} />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'Code Breaker',
    description: 'Déchiffrez le code secret en devinant la séquence. Un défi pour les esprits logiques !',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    category: 'Logique',
    difficulty: 'Difficile',
    icon: <Target size={40} />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Speed Typing',
    description: 'Testez votre vitesse de frappe avec des mots techniques. Devenez un maître du clavier !',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    category: 'Vitesse',
    difficulty: 'Facile',
    icon: <Zap size={40} />,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 4,
    title: 'Tech Quiz',
    description: 'Répondez aux questions sur les technologies web. Testez vos connaissances !',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    category: 'Quiz',
    difficulty: 'Moyen',
    icon: <Trophy size={40} />,
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 5,
    title: 'Color Match',
    description: 'Associez les couleurs rapidement. Un jeu visuel et rapide pour améliorer vos réflexes !',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80',
    category: 'Réflexes',
    difficulty: 'Facile',
    icon: <Gamepad2 size={40} />,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 6,
    title: 'Number Puzzle',
    description: 'Résolvez le puzzle numérique. Un défi mathématique pour les esprits vifs !',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    category: 'Math',
    difficulty: 'Difficile',
    icon: <Puzzle size={40} />,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 7,
    title: 'Word Scramble',
    description: 'Reconstituez les mots techniques mélangés. Parfait pour apprendre le vocabulaire !',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    category: 'Vocabulaire',
    difficulty: 'Moyen',
    icon: <Target size={40} />,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 8,
    title: 'Reaction Test',
    description: 'Testez vos réflexes en cliquant au bon moment. Un défi de rapidité et précision !',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Réflexes',
    difficulty: 'Facile',
    icon: <Zap size={40} />,
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 9,
    title: 'Pattern Master',
    description: 'Identifiez et complétez les motifs. Développez votre sens de l\'observation !',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    category: 'Observation',
    difficulty: 'Moyen',
    icon: <Puzzle size={40} />,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 10,
    title: 'Code Master',
    description: 'Découvrez les secrets du code en résolvant des énigmes de programmation. Défiez-vous !',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    category: 'Programmation',
    difficulty: 'Difficile',
    icon: <Trophy size={40} />,
    color: 'from-violet-500 to-purple-500',
  },
]

export default function GamesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedGame, setSelectedGame] = useState<number | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % games.length)
    }, 5000) // Change game every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextGame = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % games.length)
  }

  const prevGame = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length)
  }

  const goToGame = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const currentGame = games[currentIndex]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <section id="games-slider" className="section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-6"
          >
            <Gamepad2 className="text-yellow-400" size={64} />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              10 Jeux Interactifs
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Découvrez une collection de jeux passionnants pour tester vos compétences et vous amuser !
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative">
          {/* Game Card */}
          <div className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={currentGame.image}
                    alt={currentGame.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-3xl"
                  >
                    {/* Icon & Category */}
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-r  DZD{currentGame.color} flex items-center justify-center shadow-xl`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="text-white">
                          {currentGame.icon}
                        </div>
                      </motion.div>
                      <div>
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-2">
                          {currentGame.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm font-medium">Difficulté:</span>
                          <span className="text-white font-bold">{currentGame.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl md:text-6xl font-bold text-white mb-4">
                      {currentGame.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                      {currentGame.description}
                    </p>

                    {/* Play Button */}
                    <motion.button
                      onClick={() => setSelectedGame(currentGame.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-8 py-4 bg-gradient-to-r  DZD{currentGame.color} text-white rounded-xl font-bold text-lg shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all`}
                    >
                      <Play size={24} fill="white" />
                      Jouer Maintenant
                    </motion.button>
                  </motion.div>
                </div>

                {/* Game Number Badge */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30">
                    <span className="text-white font-bold text-lg">
                      {currentIndex + 1} / {games.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              setIsAutoPlaying(false)
              prevGame()
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all flex items-center justify-center z-20 shadow-xl"
            aria-label="Jeu précédent"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => {
              setIsAutoPlaying(false)
              nextGame()
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all flex items-center justify-center z-20 shadow-xl"
            aria-label="Jeu suivant"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {games.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  goToGame(index)
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                className={`transition-all rounded-full  DZD{
                  index === currentIndex
                    ? 'w-12 h-3 bg-gradient-to-r from-yellow-400 to-pink-400'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Aller au jeu  DZD{index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="mt-12 overflow-x-auto pb-4">
            <div className="flex gap-4 justify-center">
              {games.map((game, index) => (
                <motion.button
                  key={game.id}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    goToGame(index)
                  }}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all  DZD{
                    index === currentIndex
                      ? 'border-yellow-400 scale-110 shadow-xl'
                      : 'border-white/30 hover:border-white/50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r  DZD{game.color}  DZD{
                    index === currentIndex ? 'opacity-30' : 'opacity-50'
                  }`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold">{index + 1}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Jeux Disponibles', value: '10', icon: <Gamepad2 size={24} /> },
            { label: 'Catégories', value: '8', icon: <Puzzle size={24} /> },
            { label: 'Niveaux', value: '3', icon: <Trophy size={24} /> },
            { label: 'Joueurs', value: '∞', icon: <Zap size={24} /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-yellow-400 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameContainer gameId={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </section>
  )
}

