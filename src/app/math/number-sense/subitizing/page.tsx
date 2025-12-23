'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type DisplayTime = 1000 | 1500 | 2000

const displayTimeOptions: { value: DisplayTime; label: string }[] = [
  { value: 2000, label: '2秒' },
  { value: 1500, label: '1.5秒' },
  { value: 1000, label: '1秒' },
]

const emojis = ['🔵', '⭐', '❤️', '🟢', '🟡']

// 生成随机位置的点
function generateDots(count: number): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = []
  const gridSize = 5 // 5x5 网格
  const positions = new Set<string>()
  
  while (dots.length < count) {
    const x = Math.floor(Math.random() * gridSize)
    const y = Math.floor(Math.random() * gridSize)
    const key = `${x},${y}`
    if (!positions.has(key)) {
      positions.add(key)
      dots.push({ x: x * 20 + 10, y: y * 20 + 10 }) // 转换为百分比位置
    }
  }
  
  return dots
}

export default function SubitizingPage() {
  const [displayTime, setDisplayTime] = useState<DisplayTime>(2000)
  const [count, setCount] = useState(0)
  const [dots, setDots] = useState<{ x: number; y: number }[]>([])
  const [emoji, setEmoji] = useState('🔵')
  const [phase, setPhase] = useState<'ready' | 'showing' | 'answering'>('ready')
  const [options, setOptions] = useState<number[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const startRound = useCallback(() => {
    const newCount = Math.floor(Math.random() * 9) + 1 // 1-9
    const newDots = generateDots(newCount)
    const newEmoji = emojis[Math.floor(Math.random() * emojis.length)]
    
    setCount(newCount)
    setDots(newDots)
    setEmoji(newEmoji)
    setPhase('showing')
    
    // 生成选项
    const opts = new Set<number>([newCount])
    while (opts.size < 4) {
      const opt = Math.max(1, Math.min(10, newCount + Math.floor(Math.random() * 5) - 2))
      opts.add(opt)
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5))
    
    // 显示时间后隐藏
    setTimeout(() => {
      setPhase('answering')
    }, displayTime)
  }, [displayTime])

  const handleAnswer = (answer: number) => {
    setTotal(t => t + 1)
    
    if (answer === count) {
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        startRound()
      }, 1200)
    } else {
      setShowError(true)
      setPhase('showing') // 显示正确答案
      setTimeout(() => {
        setShowError(false)
        startRound()
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />

      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/math/number-sense" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          瞬间识数 ⚡
        </h1>
        <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
          {score}/{total}
        </div>
      </header>

      {/* 显示时间选择 */}
      {phase === 'ready' && (
        <div className="flex justify-center gap-2 mb-6">
          {displayTimeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDisplayTime(opt.value)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                displayTime === opt.value ? 'bg-candy-blue text-white' : 'bg-white/60 text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* 主游戏区 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* 准备开始 */}
        {phase === 'ready' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <p className="text-xl font-bold text-gray-700 mb-6">
              屏幕会闪现一些图案
              <br />
              快速说出有几个！
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRound}
              className="btn-candy-green text-2xl px-12"
            >
              开始 🚀
            </motion.button>
          </motion.div>
        )}

        {/* 显示图案 */}
        {(phase === 'showing' || (phase === 'answering' && showError)) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-kid w-full max-w-md aspect-square relative"
          >
            {dots.map((dot, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="absolute text-4xl md:text-5xl"
                style={{ left: `${dot.x}%`, top: `${dot.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* 回答阶段 */}
        {phase === 'answering' && !showError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="card-kid aspect-square flex items-center justify-center mb-6">
              <span className="text-8xl">❓</span>
            </div>
            
            <p className="text-center text-xl font-bold text-gray-700 mb-4">
              刚才有几个 {emoji}？
            </p>

            <div className="grid grid-cols-2 gap-4">
              {options.map((opt, i) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt)}
                  className={`btn-kid text-3xl font-extrabold ${
                    i === 0 ? 'bg-candy-pink text-white' :
                    i === 1 ? 'bg-candy-blue text-white' :
                    i === 2 ? 'bg-candy-green text-white' :
                    'bg-candy-purple text-white'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 错误提示 */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-2xl font-bold text-red-500">
                是 <span className="text-4xl">{count}</span> 个哦！
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

