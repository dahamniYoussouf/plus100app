'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Zap } from 'lucide-react'

export default function ReactionTest() {
  const [waiting, setWaiting] = useState(false)
  const [ready, setReady] = useState(false)
  const [clickable, setClickable] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [times, setTimes] = useState<number[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const startTimeRef = useRef<number>(0)

  const startTest = () => {
    setGameStarted(true)
    setReady(true)
    setReactionTime(null)
    
    setTimeout(() => {
      setReady(false)
      setWaiting(true)
      
      const randomDelay = Math.random() * 3000 + 2000 // 2-5 seconds
      setTimeout(() => {
        setWaiting(false)
        setClickable(true)
        startTimeRef.current = Date.now()
      }, randomDelay)
    }, 2000)
  }

  const handleClick = () => {
    if (!clickable) {
      alert('Trop tôt ! Attendez le signal vert.')
      startTest()
      return
    }

    const time = Date.now() - startTimeRef.current
    setReactionTime(time)
    setTimes([...times, time])
    setClickable(false)
    setGameStarted(false)
  }

  const reset = () => {
    setTimes([])
    setReactionTime(null)
    setGameStarted(false)
    setReady(false)
    setWaiting(false)
    setClickable(false)
  }

  const averageTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const bestTime = times.length > 0 ? Math.min(...times) : 0

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Reaction Test</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{times.length}</div>
          <div className="text-sm text-gray-600">Essais</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{bestTime}ms</div>
          <div className="text-sm text-gray-600">Meilleur</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{averageTime}ms</div>
          <div className="text-sm text-gray-600">Moyenne</div>
        </div>
      </div>

      <div className="mb-6">
        <div
          className={`h-64 rounded-lg flex items-center justify-center text-4xl font-bold transition-all ${
            ready
              ? 'bg-yellow-100 text-yellow-600'
              : waiting
              ? 'bg-red-100 text-red-600'
              : clickable
              ? 'bg-green-100 text-green-600 cursor-pointer'
              : 'bg-gray-100 text-gray-400'
          }`}
          onClick={handleClick}
        >
          {!gameStarted && 'Cliquez pour commencer'}
          {ready && 'Préparez-vous...'}
          {waiting && 'ATTENDEZ...'}
          {clickable && 'CLIQUEZ MAINTENANT !'}
          {reactionTime !== null && !clickable && `${reactionTime}ms`}
        </div>
      </div>

      {reactionTime !== null && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 bg-blue-50 rounded-lg text-center"
        >
          <Zap className="inline-block text-blue-500 mb-2" size={32} />
          <p className="text-xl font-bold text-gray-800">
            Temps de réaction : {reactionTime}ms
          </p>
          <p className="text-gray-600 mt-2">
            {reactionTime < 200 ? 'Excellent ! 🏆' : reactionTime < 300 ? 'Très bien ! 👍' : 'Pas mal ! 😊'}
          </p>
        </motion.div>
      )}

      <div className="flex gap-4">
        {!gameStarted && (
          <motion.button
            onClick={startTest}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-bold"
            whileHover={{ scale: 1.05 }}
          >
            {times.length === 0 ? 'Commencer' : 'Essayer encore'}
          </motion.button>
        )}
        {times.length > 0 && (
          <motion.button
            onClick={reset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw size={18} />
            Réinitialiser
          </motion.button>
        )}
      </div>
    </div>
  )
}





