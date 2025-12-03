'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'

const patterns = [
  { sequence: [1, 2, 3, 4], answer: 5 },
  { sequence: [2, 4, 6, 8], answer: 10 },
  { sequence: [1, 4, 9, 16], answer: 25 },
  { sequence: [5, 10, 15, 20], answer: 25 },
  { sequence: [1, 3, 5, 7], answer: 9 },
]

export default function PatternMaster() {
  const [currentPattern, setCurrentPattern] = useState<{ sequence: number[]; answer: number } | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    generatePattern()
  }, [level])

  const generatePattern = () => {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]
    setCurrentPattern(pattern)
    setUserAnswer('')
  }

  const checkAnswer = () => {
    if (!currentPattern) return

    const answer = parseInt(userAnswer)
    if (answer === currentPattern.answer) {
      setScore(score + 10)
      setStreak(streak + 1)
      setLevel(level + 1)
      setTimeout(() => generatePattern(), 1000)
    } else {
      setStreak(0)
      alert(`Incorrect ! La bonne réponse était  DZD{currentPattern.answer}`)
      generatePattern()
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Pattern Master</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          Niveau: <span className="font-bold text-gray-800">{level}</span>
        </div>
        <div className="text-gray-600">
          Score: <span className="font-bold text-gray-800">{score}</span>
        </div>
        <div className="text-gray-600">
          Série: <span className="font-bold text-orange-600">{streak}</span>
        </div>
      </div>

      {currentPattern && (
        <>
          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <p className="text-gray-600 mb-4 text-center">Trouvez le nombre suivant dans la séquence :</p>
            <div className="flex justify-center gap-4 mb-4">
              {currentPattern.sequence.map((num, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold"
                >
                  {num}
                </div>
              ))}
              <div className="w-16 h-16 bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center text-2xl font-bold border-2 border-dashed border-gray-400">
                ?
              </div>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className="w-full px-4 py-3 text-xl border-2 border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              placeholder="Votre réponse..."
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={checkAnswer}
              disabled={!userAnswer}
              className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-lg font-bold disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
            >
              Vérifier
            </motion.button>
            <motion.button
              onClick={generatePattern}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw size={18} />
              Passer
            </motion.button>
          </div>
        </>
      )}
    </div>
  )
}






