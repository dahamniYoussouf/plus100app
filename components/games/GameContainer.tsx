'use client'

import { useState } from 'react'
import MemoryChallenge from './MemoryChallenge'
import CodeBreaker from './CodeBreaker'
import SpeedTyping from './SpeedTyping'
import TechQuiz from './TechQuiz'
import ColorMatch from './ColorMatch'
import NumberPuzzle from './NumberPuzzle'
import WordScramble from './WordScramble'
import ReactionTest from './ReactionTest'
import PatternMaster from './PatternMaster'
import CodeMaster from './CodeMaster'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface GameContainerProps {
  gameId: number
  onClose: () => void
}

export default function GameContainer({ gameId, onClose }: GameContainerProps) {
  const renderGame = () => {
    switch (gameId) {
      case 1:
        return <MemoryChallenge />
      case 2:
        return <CodeBreaker />
      case 3:
        return <SpeedTyping />
      case 4:
        return <TechQuiz />
      case 5:
        return <ColorMatch />
      case 6:
        return <NumberPuzzle />
      case 7:
        return <WordScramble />
      case 8:
        return <ReactionTest />
      case 9:
        return <PatternMaster />
      case 10:
        return <CodeMaster />
      default:
        return <div>Jeu non trouvé</div>
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center z-10 transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>
          <div className="p-6">{renderGame()}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}




