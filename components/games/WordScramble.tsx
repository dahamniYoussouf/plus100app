'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Check } from 'lucide-react'

const techWords = [
  { word: 'REACT', hint: 'Framework JavaScript' },
  { word: 'NODEJS', hint: 'Runtime JavaScript côté serveur' },
  { word: 'TYPESCRIPT', hint: 'Langage typé basé sur JavaScript' },
  { word: 'WORDPRESS', hint: 'CMS populaire' },
  { word: 'SALESFORCE', hint: 'Plateforme CRM' },
  { word: 'DATABASE', hint: 'Base de données' },
]

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState<{ word: string; hint: string } | null>(null)
  const [scrambled, setScrambled] = useState('')
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    generateWord()
  }, [level])

  const generateWord = () => {
    const wordData = techWords[Math.floor(Math.random() * techWords.length)]
    setCurrentWord(wordData)
    setScrambled(shuffleWord(wordData.word))
    setGuess('')
    setShowHint(false)
  }

  const shuffleWord = (word: string): string => {
    const arr = word.split('')
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.join('')
  }

  const checkAnswer = () => {
    if (!currentWord) return
    
    if (guess.toUpperCase() === currentWord.word) {
      setScore(score + 10)
      setLevel(level + 1)
      setTimeout(() => generateWord(), 1000)
    } else {
      alert('Incorrect ! Essayez encore.')
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Word Scramble</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          Niveau: <span className="font-bold text-gray-800">{level}</span>
        </div>
        <div className="text-gray-600">
          Score: <span className="font-bold text-gray-800">{score}</span>
        </div>
      </div>

      {currentWord && (
        <>
          <div className="bg-purple-50 rounded-lg p-6 mb-6 text-center">
            <p className="text-gray-600 mb-2">Mot mélangé :</p>
            <div className="text-4xl font-bold text-purple-600 mb-4 tracking-wider">
              {scrambled}
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-purple-600 hover:text-purple-700 underline"
            >
              {showHint ? 'Masquer' : 'Afficher'} l'indice
            </button>
            {showHint && (
              <p className="mt-2 text-gray-600 italic">{currentWord.hint}</p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className="w-full px-4 py-3 text-xl border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center uppercase"
              placeholder="Tapez votre réponse..."
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={checkAnswer}
              disabled={!guess}
              className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Check size={20} />
              Vérifier
            </motion.button>
            <motion.button
              onClick={generateWord}
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





