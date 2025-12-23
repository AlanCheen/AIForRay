'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type Mode = 'display' | 'quiz' | 'make10'

const items = ['🍎', '🌟', '🔵', '❤️', '🍊', '🌸']

export default function TenFramePage() {
  const [mode, setMode] = useState<Mode>('display')
  const [count, setCount] = useState(5)
  const [currentItem, setCurrentItem] = useState('🍎')
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Quiz mode state
  const [quizCount, setQuizCount] = useState(0)
  const [showFrame, setShowFrame] = useState(true)
  const [options, setOptions] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const generateQuiz = useCallback(() => {
    const newCount = Math.floor(Math.random() * 10) + 1
    setQuizCount(newCount)
    setCurrentItem(items[Math.floor(Math.random() * items.length)])
    setShowFrame(true)
    setAnswered(false)
    
    // Generate options
    const opts = new Set<number>([newCount])
    while (opts.size < 4) {
      const opt = Math.max(1, Math.min(10, newCount + Math.floor(Math.random() * 5) - 2))
      opts.add(opt)
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5))
    
    // Hide after 2 seconds
    setTimeout(() => setShowFrame(false), 2000)
  }, [])

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuiz()
    }
  }, [mode, generateQuiz])

  const handleQuizAnswer = (answer: number) => {
    if (answered) return
    setAnswered(true)
    setShowFrame(true)
    
    if (answer === quizCount) {
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        generateQuiz()
      }, 1500)
    }
  }

  const handleMake10Answer = (answer: number) => {
    if (answer === 10 - count) {
      setShowSuccess(true)
      setTimeout(() => {
        setCount(Math.floor(Math.random() * 9) + 1)
        setCurrentItem(items[Math.floor(Math.random() * items.length)])
      }, 1500)
    }
  }

  const renderTenFrame = (frameCount: number, item: string, showItems: boolean = true) => (
    <div className="grid grid-cols-5 gap-2 p-4 bg-white/50 rounded-2xl">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={showItems && i < frameCount ? { scale: 0 } : {}}
          animate={showItems && i < frameCount ? { scale: 1 } : {}}
          transition={{ delay: i * 0.05 }}
          className={`
            aspect-square rounded-xl flex items-center justify-center text-3xl md:text-4xl
            ${i < frameCount && showItems
              ? 'bg-candy-yellow/30'
              : 'bg-gray-100 border-2 border-dashed border-gray-300'
            }
          `}
        >
          {i < frameCount && showItems ? item : ''}
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          十字框 🔲
        </h1>
        {mode === 'quiz' && (
          <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
            {score} 分
          </div>
        )}
        {mode !== 'quiz' && <div className="w-14" />}
      </header>

      {/* 模式选择 */}
      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'display' as Mode, label: '认识数量', emoji: '👀' },
          { id: 'quiz' as Mode, label: '快速识数', emoji: '⚡' },
          { id: 'make10' as Mode, label: '凑十练习', emoji: '🎯' },
        ].map((m) => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
              mode === m.id
                ? 'bg-candy-blue text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            {m.emoji} {m.label}
          </motion.button>
        ))}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* 展示模式 */}
        {mode === 'display' && (
          <>
            <div className="card-kid p-6 w-full max-w-md">
              {renderTenFrame(count, currentItem)}
              <div className="text-center mt-4">
                <span className="text-5xl font-bold text-candy-blue">{count}</span>
                <span className="text-2xl text-gray-600 ml-2">个 {currentItem}</span>
              </div>
            </div>
            
            {/* 数量选择 */}
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCount(n)}
                  className={`w-12 h-12 rounded-xl font-bold text-lg ${
                    count === n
                      ? 'bg-candy-blue text-white shadow-lg'
                      : 'bg-white/60 text-gray-600'
                  }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>

            {/* 物品选择 */}
            <div className="flex gap-2">
              {items.map((item) => (
                <motion.button
                  key={item}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentItem(item)}
                  className={`w-12 h-12 rounded-xl text-2xl ${
                    currentItem === item
                      ? 'bg-candy-pink/30 shadow-lg'
                      : 'bg-white/60'
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* 快速识数模式 */}
        {mode === 'quiz' && (
          <>
            <div className="card-kid p-6 w-full max-w-md">
              <AnimatePresence mode="wait">
                {showFrame ? (
                  <motion.div
                    key="frame"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {renderTenFrame(quizCount, currentItem)}
                  </motion.div>
                ) : (
                  <motion.div
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-40 flex items-center justify-center"
                  >
                    <span className="text-6xl">❓</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!showFrame && (
                <p className="text-center text-xl font-bold text-gray-700 mt-4">
                  刚才有几个 {currentItem}？
                </p>
              )}
            </div>

            {/* 答案选项 */}
            {!showFrame && (
              <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                {options.map((opt, i) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={answered}
                    className={`btn-kid text-3xl font-extrabold ${
                      answered && opt === quizCount
                        ? 'bg-candy-green text-white'
                        : answered && opt !== quizCount
                        ? 'bg-gray-200 text-gray-400'
                        : i === 0
                        ? 'bg-candy-pink text-white'
                        : i === 1
                        ? 'bg-candy-blue text-white'
                        : i === 2
                        ? 'bg-candy-yellow text-gray-800'
                        : 'bg-candy-purple text-white'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}

        {/* 凑十模式 */}
        {mode === 'make10' && (
          <>
            <div className="card-kid p-6 w-full max-w-md">
              {renderTenFrame(count, currentItem)}
              <p className="text-center text-xl font-bold text-gray-700 mt-4">
                有 <span className="text-candy-blue text-2xl">{count}</span> 个 {currentItem}，
                还需要几个凑成 <span className="text-candy-pink text-2xl">10</span>？
              </p>
            </div>

            {/* 答案选项 */}
            <div className="grid grid-cols-5 gap-2 w-full max-w-md">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <motion.button
                  key={n}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMake10Answer(n)}
                  className="btn-kid bg-candy-orange text-white text-2xl"
                >
                  {n}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

