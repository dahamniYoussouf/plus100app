'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'

const colors = [
  { name: 'Rouge', value: '#EF4444' },
  { name: 'Vert', value: '#10B981' },
  { name: 'Bleu', value: '#3B82F6' },
  { name: 'Jaune', value: '#F59E0B' },
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Rose', value: '#EC4899' },
]

export default function ColorMatch() {
  const [targetColor, setTargetColor] = useState<{ name: string; value: string } | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [shuffledColors, setShuffledColors] = useState<Array<{ name: string; value: string }>>([])

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameActive(false)
    }
  }, [gameActive, timeLeft])

  const startGame = () => {
    setGameActive(true)
    setTimeLeft(30)
    setScore(0)
    generateNewColor()
  }

  const generateNewColor = () => {
    const target = colors[Math.floor(Math.random() * colors.length)]
    setTargetColor(target)
    
    const shuffled = [...colors].sort(() => Math.random() - 0.5)
    setShuffledColors(shuffled)
  }

  const handleColorClick = (color: { name: string; value: string }) => {
    if (!gameActive || !targetColor) return

    if (color.name === targetColor.name) {
      setScore(score + 10)
      generateNewColor()
    } else {
      setScore(Math.max(0, score - 5))
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Color Match</h2>
      
      {!gameActive && timeLeft === 30 && (
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">Cliquez sur la couleur qui correspond au nom affiché !</p>
          <motion.button
            onClick={startGame}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg"
            whileHover={{ scale: 1.05 }}
          >
            Commencer
          </motion.button>
        </div>
      )}

      {gameActive && targetColor && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
              <div className="text-sm text-gray-600">Temps</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">Trouvez cette couleur :</p>
              <div
                className="w-32 h-32 mx-auto rounded-lg border-4 border-gray-300 shadow-lg"
                style={{ backgroundColor: targetColor.value }}
              />
              <p className="text-3xl font-bold text-gray-800 mt-4">{targetColor.name}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {shuffledColors.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleColorClick(color)}
                  className="aspect-square rounded-lg border-4 border-gray-300 hover:border-blue-500 transition-all shadow-lg"
                  style={{ backgroundColor: color.value }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!gameActive && timeLeft === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-500"
        >
          <Trophy className="inline-block text-yellow-500 mb-2" size={32} />
          <p className="text-xl font-bold text-gray-800 mb-2">Temps écoulé !</p>
          <p className="text-gray-600 mb-4">Score final: {score} points</p>
          <motion.button
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={18} />
            Rejouer
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}




