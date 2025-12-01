'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'

export default function NumberPuzzle() {
  const [numbers, setNumbers] = useState<number[]>([])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [target, setTarget] = useState(0)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    generatePuzzle()
  }, [level])

  const generatePuzzle = () => {
    const newNumbers: number[] = []
    for (let i = 0; i < 6; i++) {
      newNumbers.push(Math.floor(Math.random() * 20) + 1)
    }
    setNumbers(newNumbers)
    setSelectedNumbers([])
    setTarget(newNumbers.reduce((a, b) => a + b, 0) - Math.floor(Math.random() * 10))
  }

  const toggleNumber = (num: number, index: number) => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index))
    } else {
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const checkSolution = () => {
    const sum = selectedNumbers.reduce((acc, index) => acc + numbers[index], 0)
    if (sum === target) {
      setScore(score + 10)
      setLevel(level + 1)
      generatePuzzle()
    } else {
      alert(`Incorrect ! La somme est ${sum}, mais la cible est ${target}`)
    }
  }

  const currentSum = selectedNumbers.reduce((acc, index) => acc + numbers[index], 0)

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Number Puzzle</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          Niveau: <span className="font-bold text-gray-800">{level}</span>
        </div>
        <div className="text-gray-600">
          Score: <span className="font-bold text-gray-800">{score}</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6 text-center">
        <p className="text-gray-600 mb-2">Cible à atteindre :</p>
        <div className="text-5xl font-bold text-blue-600">{target}</div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">Sélectionnez les nombres qui additionnent à la cible :</p>
        <div className="grid grid-cols-3 gap-4">
          {numbers.map((num, index) => (
            <motion.button
              key={index}
              onClick={() => toggleNumber(num, index)}
              className={`p-6 rounded-lg text-2xl font-bold border-4 transition-all ${
                selectedNumbers.includes(index)
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-600">Somme actuelle :</p>
          <div className="text-3xl font-bold text-gray-800">{currentSum}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <motion.button
          onClick={checkSolution}
          disabled={selectedNumbers.length === 0}
          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
        >
          Vérifier
        </motion.button>
        <motion.button
          onClick={generatePuzzle}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <RotateCcw size={18} />
          Nouveau
        </motion.button>
      </div>
    </div>
  )
}





