'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Check, X } from 'lucide-react'

export default function CodeBreaker() {
  const [code, setCode] = useState<string[]>([])
  const [guess, setGuess] = useState<string[]>(['', '', '', ''])
  const [attempts, setAttempts] = useState<string[][]>([])
  const [feedback, setFeedback] = useState<string[][]>([])
  const [gameWon, setGameWon] = useState(false)
  const [maxAttempts] = useState(10)

  const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠']

  useEffect(() => {
    generateCode()
  }, [])

  const generateCode = () => {
    const newCode = Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)])
    setCode(newCode)
    setGuess(['', '', '', ''])
    setAttempts([])
    setFeedback([])
    setGameWon(false)
  }

  const handleColorSelect = (index: number, color: string) => {
    if (gameWon) return
    const newGuess = [...guess]
    newGuess[index] = color
    setGuess(newGuess)
  }

  const checkGuess = () => {
    if (guess.some(g => !g) || gameWon) return

    const newAttempts = [...attempts, [...guess]]
    setAttempts(newAttempts)

    const newFeedback: string[] = []
    const codeCopy = [...code]
    const guessCopy = [...guess]

    // Check exact matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        newFeedback.push('✅')
        guessCopy[i] = ''
        codeCopy[i] = ''
      }
    }

    // Check color matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] && codeCopy.includes(guessCopy[i])) {
        newFeedback.push('⚪')
        const index = codeCopy.indexOf(guessCopy[i])
        codeCopy[index] = ''
        guessCopy[i] = ''
      }
    }

    setFeedback([...feedback, newFeedback])

    if (newFeedback.every(f => f === '✅') && newFeedback.length === 4) {
      setGameWon(true)
    } else if (newAttempts.length >= maxAttempts) {
      alert(`Perdu ! Le code était:  DZD{code.join(' ')}`)
      generateCode()
    }

    setGuess(['', '', '', ''])
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Breaker</h2>
      <p className="text-gray-600 mb-6">Déchiffrez le code secret de 4 couleurs !</p>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {guess.map((color, index) => (
            <div
              key={index}
              className="w-16 h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center text-3xl cursor-pointer hover:border-blue-500"
              onClick={() => {
                const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠']
                const currentIndex = color ? colors.indexOf(color) : -1
                const nextIndex = (currentIndex + 1) % colors.length
                handleColorSelect(index, colors[nextIndex])
              }}
            >
              {color || '?'}
            </div>
          ))}
        </div>
        <motion.button
          onClick={checkGuess}
          disabled={guess.some(g => !g) || gameWon}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
        >
          Vérifier
        </motion.button>
      </div>

      <div className="space-y-2 mb-6">
        {attempts.map((attempt, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex gap-2">
              {attempt.map((color, i) => (
                <div key={i} className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 border-gray-200">
                  {color}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {feedback[index]?.map((f, i) => (
                <span key={i} className="text-xl">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          Tentatives: {attempts.length} / {maxAttempts}
        </div>
        <motion.button
          onClick={generateCode}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <RotateCcw size={18} />
          Nouveau Code
        </motion.button>
      </div>

      {gameWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center"
        >
          <p className="text-green-800 font-bold text-lg">🎉 Félicitations ! Vous avez trouvé le code !</p>
        </motion.div>
      )}
    </div>
  )
}





