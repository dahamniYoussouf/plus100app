'use client'

/**
 * JEU INTERACTIF - Memory Card Game
 * 
 * CONCEPT : Jeu de mémoire avec cartes technologiques
 * - Trouvez les paires de technologies
 * - Score et timer
 * - Niveaux de difficulté
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Trophy, Clock, RotateCcw, Zap, Star } from 'lucide-react'

interface Card {
  id: number
  tech: string
  icon: string
  flipped: boolean
  matched: boolean
}

const technologies = [
  { tech: 'React', icon: '⚛️' },
  { tech: 'Next.js', icon: '▲' },
  { tech: 'Node.js', icon: '🟢' },
  { tech: 'TypeScript', icon: '📘' },
  { tech: 'WordPress', icon: '📝' },
  { tech: 'Salesforce', icon: '☁️' },
  { tech: 'Agentforce', icon: '🤖' },
  { tech: 'Python', icon: '🐍' },
]

const difficultyLevels = {
  easy: { pairs: 4, grid: 'grid-cols-4' },
  medium: { pairs: 6, grid: 'grid-cols-4' },
  hard: { pairs: 8, grid: 'grid-cols-4' },
}

export default function Game() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [difficulty, setDifficulty] = useState<keyof typeof difficultyLevels>('medium')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const initializeGame = () => {
    const selectedTechs = technologies.slice(0, difficultyLevels[difficulty].pairs)
    const gameCards: Card[] = []
    
    // Créer des paires
    selectedTechs.forEach((tech, index) => {
      gameCards.push(
        { id: index * 2, tech: tech.tech, icon: tech.icon, flipped: false, matched: false },
        { id: index * 2 + 1, tech: tech.tech, icon: tech.icon, flipped: false, matched: false }
      )
    })
    
    // Mélanger
    const shuffled = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setScore(0)
    setTime(0)
    setGameStarted(true)
    setGameWon(false)
    
    // Démarrer le timer
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameWon(true)
      if (timerRef.current) clearInterval(timerRef.current)
      // Calculer le score : moins de mouvements et moins de temps = meilleur score
      const finalScore = Math.max(0, 10000 - (moves * 50) - (time * 10))
      setScore(finalScore)
    }
  }, [cards, moves, time])

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)
    
    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstIndex, secondIndex] = newFlippedCards
      
      if (cards[firstIndex].tech === cards[secondIndex].tech) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.tech === cards[firstIndex].tech ? { ...card, matched: true, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      } else {
        // Pas de match
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === firstIndex || i === secondIndex ? { ...card, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return ` DZD{mins}: DZD{secs.toString().padStart(2, '0')}`
  }

  return (
    <section id="game" className="section-padding bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🎮</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Jeu de Mémoire Technologique
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-700 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
            Testez votre mémoire en trouvant les paires de technologies ! 
            <span className="text-blue-600 font-bold"> Amusez-vous</span> tout en découvrant mes compétences.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Zap size={20} className="text-yellow-500" />
              <span className="text-sm font-medium">Mouvements</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{moves}</div>
          </motion.div>
          
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock size={20} className="text-blue-500" />
              <span className="text-sm font-medium">Temps</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{formatTime(time)}</div>
          </motion.div>
          
          <motion.div
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Star size={20} className="text-purple-500" />
              <span className="text-sm font-medium">Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{score}</div>
          </motion.div>
        </div>

        {/* Controls */}
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Choisissez la difficulté</h3>
            <div className="flex gap-4 mb-6">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all  DZD{
                    difficulty === level
                      ? 'bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level === 'easy' ? 'Facile (4 paires)' : level === 'medium' ? 'Moyen (6 paires)' : 'Difficile (8 paires)'}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={initializeGame}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Commencer le Jeu
            </motion.button>
          </motion.div>
        )}

        {/* Game Board */}
        {gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200"
          >
            <div className={`grid  DZD{difficultyLevels[difficulty].grid} gap-4 mb-6`}>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-xl cursor-pointer relative overflow-hidden  DZD{
                    card.matched ? 'opacity-50' : ''
                  }`}
                  whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ 
                    opacity: 1, 
                    rotateY: card.flipped || card.matched ? 0 : 180 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {card.flipped || card.matched ? (
                    <div className="w-full h-full bg-gradient-to-br from-green-600 via-red-600 to-blue-600 flex flex-col items-center justify-center text-white p-4 border-2 border-blue-300">
                      <div className="text-4xl mb-2">{card.icon}</div>
                      <div className="text-sm font-bold text-center">{card.tech}</div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-gray-400">
                      <div className="text-4xl">?</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={initializeGame}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                Recommencer
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Win Modal */}
        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setGameWon(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4"
                  >
                    <Trophy className="text-yellow-500" size={64} />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">Félicitations !</h3>
                  <p className="text-gray-600 mb-6">Vous avez trouvé toutes les paires !</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600">Mouvements :</span>
                      <span className="font-bold text-gray-800">{moves}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600">Temps :</span>
                      <span className="font-bold text-gray-800">{formatTime(time)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gradient-to-r from-green-600 via-red-600 to-blue-600 rounded-lg p-3 text-white">
                      <span>Score Final :</span>
                      <span className="font-bold text-xl">{score}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      onClick={initializeGame}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 via-red-600 to-blue-600 text-white rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Rejouer
                    </motion.button>
                    <motion.button
                      onClick={() => setGameWon(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Fermer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

