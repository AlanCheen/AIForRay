'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

const emojis = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌟', '🎈', '🦋', '🐟', '🌸']

interface Question {
  emoji: string
  count: number
  options: number[]
}

function generateQuestion(): Question {
  const count = Math.floor(Math.random() * 10) + 1 // 1-10
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  
  // 生成选项（包含正确答案和干扰项）
  const optionsSet = new Set<number>([count])
  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * 5) - 2 // -2 到 2
    const option = Math.max(1, Math.min(10, count + offset))
    optionsSet.add(option)
  }
  
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5)
  
  return { emoji, count, options }
}

export default function CountingPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion())
    setShowError(false)
  }, [])

  useEffect(() => {
    nextQuestion()
  }, [nextQuestion])

  const handleAnswer = (answer: number) => {
    if (!question) return

    setTotalQuestions(t => t + 1)
    
    if (answer === question.count) {
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        nextQuestion()
      }, 1500)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 1000)
    }
  }

  if (!question) return null

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数数游戏 🎯
        </h1>
        <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
          {score} 分
        </div>
      </header>

      {/* 问题区域 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* 物品展示 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${question.emoji}-${question.count}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="card-kid w-full max-w-lg p-8"
          >
            <p className="text-center text-2xl font-bold text-gray-700 mb-6">
              数一数，有几个 {question.emoji}？
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {Array.from({ length: question.count }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="text-5xl md:text-6xl"
                >
                  {question.emoji}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 选项按钮 */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {question.options.map((option, index) => (
            <motion.button
              key={`${option}-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(option)}
              className={`btn-kid text-4xl font-extrabold transition-colors ${
                showError && option !== question.count
                  ? 'bg-gray-200 text-gray-400'
                  : index === 0
                  ? 'bg-candy-pink text-white'
                  : index === 1
                  ? 'bg-candy-blue text-white'
                  : index === 2
                  ? 'bg-candy-green text-white'
                  : 'bg-candy-purple text-white'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* 错误提示 */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl font-bold text-red-500"
            >
              再试一次！💪
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部统计 */}
      <div className="text-center mt-4 text-gray-600">
        已完成 {totalQuestions} 题
      </div>
    </div>
  )
}

