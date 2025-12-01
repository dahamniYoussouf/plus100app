'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react'

const questions = [
  {
    question: 'Quel framework React est utilisé pour le SSR ?',
    options: ['Angular', 'Next.js', 'Vue.js', 'Svelte'],
    correct: 1,
  },
  {
    question: 'Quel langage est un sur-ensemble de JavaScript ?',
    options: ['Python', 'TypeScript', 'Java', 'C++'],
    correct: 1,
  },
  {
    question: 'Quelle plateforme est utilisée pour la gestion de la relation client ?',
    options: ['WordPress', 'Salesforce', 'Shopify', 'Magento'],
    correct: 1,
  },
  {
    question: 'Quel est le système de gestion de base de données le plus populaire ?',
    options: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
    correct: 1,
  },
  {
    question: 'Quel outil est utilisé pour le versioning de code ?',
    options: ['Git', 'SVN', 'Mercurial', 'Perforce'],
    correct: 0,
  },
]

export default function TechQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizFinished, setQuizFinished] = useState(false)

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizFinished(true)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuizFinished(false)
  }

  if (quizFinished) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tech Quiz</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quiz Terminé !</h3>
          <p className="text-xl text-gray-600 mb-2">
            Score: {score} / {questions.length}
          </p>
          <p className="text-lg text-gray-500 mb-6">
            {score === questions.length ? 'Parfait ! 🏆' : score >= questions.length / 2 ? 'Bien joué ! 👍' : 'Continuez à apprendre ! 📚'}
          </p>
          <motion.button
            onClick={resetQuiz}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={18} />
            Rejouer
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Tech Quiz</h2>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Question {currentQuestion + 1} / {questions.length}</span>
          <span className="text-gray-600">Score: <span className="font-bold">{score}</span></span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: ` DZD{((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correct
            const showCorrect = showResult && isCorrect
            const showWrong = showResult && isSelected && !isCorrect

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all  DZD{
                  showCorrect
                    ? 'bg-green-100 border-green-500'
                    : showWrong
                    ? 'bg-red-100 border-red-500'
                    : isSelected
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-300 hover:border-blue-300'
                }`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800">{option}</span>
                  {showCorrect && <CheckCircle className="text-green-500" size={20} />}
                  {showWrong && <XCircle className="text-red-500" size={20} />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}





