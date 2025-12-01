'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Trophy, Lightbulb } from 'lucide-react'

const codeChallenges = [
  {
    question: 'Quelle fonction JavaScript retourne un tableau filtré ?',
    code: 'const arr = [1, 2, 3, 4, 5];\nconst result = arr.???((x) => x > 3);',
    options: ['map', 'filter', 'reduce', 'forEach'],
    correct: 1,
    explanation: 'filter() crée un nouveau tableau avec les éléments qui passent le test.',
  },
  {
    question: 'Quelle méthode React est appelée après le premier rendu ?',
    code: 'useEffect(() => {\n  // Code ici\n}, ???);',
    options: ['[props]', '[state]', '[]', '[dependencies]'],
    correct: 2,
    explanation: 'Un tableau vide [] signifie que l\'effet ne s\'exécute qu\'une fois après le montage.',
  },
  {
    question: 'Comment déclarer une variable constante en JavaScript ?',
    code: '??? name = "Dahamni";',
    options: ['var', 'let', 'const', 'function'],
    correct: 2,
    explanation: 'const déclare une constante qui ne peut pas être réassignée.',
  },
]

export default function CodeMaster() {
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setSelectedAnswer(null)
    setShowResult(false)
    setShowHint(false)
  }, [currentChallenge])

  const handleAnswer = (index: number) => {
    if (showResult) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    if (index === codeChallenges[currentChallenge].correct) {
      setScore(score + 10)
    }

    setTimeout(() => {
      if (currentChallenge < codeChallenges.length - 1) {
        setCurrentChallenge(currentChallenge + 1)
      } else {
        setQuizFinished(true)
      }
    }, 3000)
  }

  const resetQuiz = () => {
    setCurrentChallenge(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizFinished(false)
    setShowHint(false)
  }

  if (quizFinished) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Master</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
        >
          <Trophy className="inline-block text-yellow-500 mb-4" size={48} />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quiz Terminé !</h3>
          <p className="text-xl text-gray-600 mb-2">
            Score: {score} / {codeChallenges.length * 10}
          </p>
          <p className="text-lg text-gray-500 mb-6">
            {score === codeChallenges.length * 10 ? 'Expert en code ! 🏆' : score >= codeChallenges.length * 5 ? 'Bon niveau ! 👍' : 'Continuez à coder ! 💻'}
          </p>
          <motion.button
            onClick={resetQuiz}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={18} />
            Rejouer
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const challenge = codeChallenges[currentChallenge]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Code Master</h2>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Question {currentChallenge + 1} / {codeChallenges.length}</span>
        <span className="text-gray-600">Score: <span className="font-bold">{score}</span></span>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <pre className="text-green-400 font-mono text-sm overflow-x-auto">
          {challenge.code}
        </pre>
      </div>

      <p className="text-gray-700 mb-4 font-medium">{challenge.question}</p>

      <div className="space-y-3 mb-6">
        {challenge.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === challenge.correct
          const showCorrect = showResult && isCorrect
          const showWrong = showResult && isSelected && !isCorrect

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-mono  DZD{
                showCorrect
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : showWrong
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : isSelected
                  ? 'bg-purple-100 border-purple-500'
                  : 'bg-white border-gray-300 hover:border-purple-300'
              }`}
              whileHover={!showResult ? { scale: 1.02 } : {}}
            >
              {option}
            </motion.button>
          )
        })}
      </div>

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 rounded-lg mb-6"
        >
          <div className="flex items-start gap-2">
            <Lightbulb className="text-blue-500 mt-1" size={20} />
            <div>
              <p className="text-blue-800 font-semibold mb-1">
                {selectedAnswer === challenge.correct ? 'Correct ! ✅' : 'Incorrect ❌'}
              </p>
              <p className="text-blue-700 text-sm">{challenge.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}





