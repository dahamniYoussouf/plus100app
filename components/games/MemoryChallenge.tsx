'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'

const cards = [
  { id: 1, tech: 'React', icon: '⚛️' },
  { id: 2, tech: 'Next.js', icon: '▲' },
  { id: 3, tech: 'Node.js', icon: '🟢' },
  { id: 4, tech: 'TypeScript', icon: '📘' },
  { id: 5, tech: 'WordPress', icon: '📝' },
  { id: 6, tech: 'Salesforce', icon: '☁️' },
]

export default function MemoryChallenge() {
  const [gameCards, setGameCards] = useState<Array<{ id: number; tech: string; icon: string; flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const pairs = cards.slice(0, 4)
    const newCards: Array<{ id: number; tech: string; icon: string; flipped: boolean; matched: boolean }> = []
    
    pairs.forEach((card) => {
      newCards.push({ ...card, id: card.id * 2, flipped: false, matched: false })
      newCards.push({ ...card, id: card.id * 2 + 1, flipped: false, matched: false })
    })
    
    const shuffled = newCards.sort(() => Math.random() - 0.5)
    setGameCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setGameWon(false)
  }

  useEffect(() => {
    if (gameCards.length > 0 && gameCards.every(card => card.matched)) {
      setGameWon(true)
    }
  }, [gameCards])

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || gameCards[index].flipped || gameCards[index].matched) return

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)
    
    const newCards = [...gameCards]
    newCards[index].flipped = true
    setGameCards(newCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstIndex, secondIndex] = newFlippedCards
      
      if (gameCards[firstIndex].tech === gameCards[secondIndex].tech) {
        setTimeout(() => {
          setGameCards(prev => prev.map(card => 
            card.tech === gameCards[firstIndex].tech ? { ...card, matched: true, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      } else {
        setTimeout(() => {
          setGameCards(prev => prev.map((card, i) => 
            i === firstIndex || i === secondIndex ? { ...card, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Memory Challenge</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">Mouvements: <span className="font-bold text-gray-800">{moves}</span></div>
        <motion.button
          onClick={initializeGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <RotateCcw size={18} />
          Recommencer
        </motion.button>
      </div>

      {gameWon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center"
        >
          <Trophy className="inline-block text-yellow-500 mb-2" size={32} />
          <p className="text-green-800 font-bold text-lg">Félicitations ! Vous avez gagné en {moves} mouvements !</p>
        </motion.div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {gameCards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`aspect-square rounded-xl cursor-pointer relative overflow-hidden  DZD{
              card.matched ? 'opacity-50' : ''
            }`}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ rotateY: card.flipped || card.matched ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {card.flipped || card.matched ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-4">
                <div className="text-4xl mb-2">{card.icon}</div>
                <div className="text-sm font-bold">{card.tech}</div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-4xl">?</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}







