'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type Range = '1-10' | '1-20' | '1-100'
type DisplayMode = 'numbers' | 'items'

const emojis = ['🍎', '⭐', '🌸', '🔵', '❤️']

interface Question {
  left: number
  right: number
  emoji: string
}

function generateQuestion(range: Range): Question {
  const max = range === '1-10' ? 10 : range === '1-20' ? 20 : 100
  let left = Math.floor(Math.random() * max) + 1
  let right = Math.floor(Math.random() * max) + 1
  // 确保不相等
  while (right === left) {
    right = Math.floor(Math.random() * max) + 1
  }
  return {
    left,
    right,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }
}

export default function ComparePage() {
  const [range, setRange] = useState<Range>('1-10')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('numbers')
  const [question, setQuestion] = useState<Question | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(range))
    setShowError(false)
  }, [range])

  useEffect(() => {
    nextQuestion()
  }, [nextQuestion])

  const handleAnswer = (answer: 'left' | 'right') => {
    if (!question) return

    const correct = answer === 'left' 
      ? question.left > question.right 
      : question.right > question.left

    setTotal(t => t + 1)

    if (correct) {
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        nextQuestion()
      }, 1200)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 1000)
    }
  }

  if (!question) return null

  const renderItems = (count: number, emoji: string) => {
    // 限制显示数量，超过 20 个只显示数字
    if (count > 20) {
      return <span className="text-6xl font-bold text-gray-700">{count}</span>
    }
    return (
      <div className="flex flex-wrap justify-center gap-1 max-w-[200px]">
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="text-2xl md:text-3xl"
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />

      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/math/number-sense" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          比大小 ⚖️
        </h1>
        <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
          {score}/{total}
        </div>
      </header>

      {/* 设置栏 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <div className="flex gap-1 bg-white/50 rounded-xl p-1">
          {(['1-10', '1-20', '1-100'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRange(r); nextQuestion() }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                range === r ? 'bg-candy-blue text-white' : 'text-gray-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white/50 rounded-xl p-1">
          <button
            onClick={() => setDisplayMode('numbers')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              displayMode === 'numbers' ? 'bg-candy-pink text-white' : 'text-gray-600'
            }`}
          >
            🔢 数字
          </button>
          <button
            onClick={() => setDisplayMode('items')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              displayMode === 'items' ? 'bg-candy-pink text-white' : 'text-gray-600'
            }`}
          >
            🍎 物品
          </button>
        </div>
      </div>

      {/* 主游戏区 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <p className="text-center text-xl font-bold text-gray-700 mb-6">
            点击更大的那个！
          </p>

          <div className="flex items-center justify-center gap-4">
            {/* 左边 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('left')}
              className="card-kid flex-1 min-h-[200px] flex items-center justify-center cursor-pointer hover:bg-candy-blue/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`left-${question.left}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {displayMode === 'numbers' ? (
                    <span className="text-7xl md:text-8xl font-bold text-candy-blue">
                      {question.left}
                    </span>
                  ) : (
                    renderItems(question.left, question.emoji)
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* VS */}
            <div className="text-4xl font-bold text-gray-400">VS</div>

            {/* 右边 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer('right')}
              className="card-kid flex-1 min-h-[200px] flex items-center justify-center cursor-pointer hover:bg-candy-pink/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`right-${question.right}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {displayMode === 'numbers' ? (
                    <span className="text-7xl md:text-8xl font-bold text-candy-pink">
                      {question.right}
                    </span>
                  ) : (
                    renderItems(question.right, question.emoji)
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* 错误提示 */}
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mt-6 text-2xl font-bold text-red-500"
              >
                再想想！💪
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

