'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Zap } from 'lucide-react'

const techWords = [
  'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js',
  'WordPress', 'Salesforce', 'Agentforce', 'API', 'Database',
  'Component', 'Function', 'Variable', 'Array', 'Object'
]

export default function SpeedTyping() {
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [time, setTime] = useState(60)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wordsTyped, setWordsTyped] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isPlaying && time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000)
      return () => clearTimeout(timer)
    } else if (time === 0) {
      setIsPlaying(false)
    }
  }, [isPlaying, time])

  useEffect(() => {
    if (isPlaying) {
      generateWord()
      inputRef.current?.focus()
    }
  }, [isPlaying])

  const generateWord = () => {
    const randomWord = techWords[Math.floor(Math.random() * techWords.length)]
    setWord(randomWord)
    setInput('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (value === word) {
      setScore(score + word.length)
      setWordsTyped(wordsTyped + 1)
      generateWord()
    }
  }

  const startGame = () => {
    setIsPlaying(true)
    setTime(60)
    setScore(0)
    setWordsTyped(0)
    generateWord()
  }

  const wpm = time > 0 ? Math.round((wordsTyped / (60 - time)) * 60) : Math.round((wordsTyped / 60) * 60)

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Speed Typing</h2>
      
      {!isPlaying && time === 60 && (
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">Tapez les mots aussi vite que possible !</p>
          <motion.button
            onClick={startGame}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-bold text-lg"
            whileHover={{ scale: 1.05 }}
          >
            Commencer
          </motion.button>
        </div>
      )}

      {isPlaying && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{time}s</div>
              <div className="text-sm text-gray-600">Temps</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{wpm}</div>
              <div className="text-sm text-gray-600">Mots/min</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold text-center mb-4 text-gray-800 bg-gray-100 rounded-lg p-8">
              {word}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-xl border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tapez le mot ici..."
              autoFocus
            />
          </div>
        </>
      )}

      {!isPlaying && time === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center mb-6 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-500"
        >
          <Zap className="inline-block text-yellow-500 mb-2" size={32} />
          <p className="text-xl font-bold text-gray-800 mb-2">Temps écoulé !</p>
          <p className="text-gray-600">Score final: {score} points</p>
          <p className="text-gray-600">Vitesse: {wpm} mots/min</p>
          <motion.button
            onClick={startGame}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 mx-auto"
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





