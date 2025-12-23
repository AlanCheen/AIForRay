'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, Reorder } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type Difficulty = 'easy' | 'medium' | 'hard'

const difficultyConfig: Record<Difficulty, { count: number; max: number; label: string }> = {
  easy: { count: 3, max: 10, label: '简单 (3个)' },
  medium: { count: 4, max: 20, label: '中等 (4个)' },
  hard: { count: 5, max: 50, label: '困难 (5个)' },
}

function generateNumbers(count: number, max: number): number[] {
  const nums = new Set<number>()
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * max) + 1)
  }
  return Array.from(nums).sort(() => Math.random() - 0.5)
}

export default function OrderPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [numbers, setNumbers] = useState<number[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const pendingOrderRef = useRef<number[]>([])

  const config = difficultyConfig[difficulty]

  const nextRound = useCallback(() => {
    setNumbers(generateNumbers(config.count, config.max))
    setIsCorrect(false)
  }, [config])

  useEffect(() => {
    nextRound()
  }, [nextRound])

  const checkOrder = (items: number[]) => {
    const sorted = [...items].sort((a, b) => a - b)
    return items.every((n, i) => n === sorted[i])
  }

  // 拖动过程中只更新顺序，不检查
  const handleReorder = (newOrder: number[]) => {
    setNumbers(newOrder)
    pendingOrderRef.current = newOrder
  }

  // 拖动结束后才检查是否正确
  const handleDragEnd = () => {
    setIsDragging(false)
    
    if (checkOrder(pendingOrderRef.current) && !isCorrect) {
      setIsCorrect(true)
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        nextRound()
      }, 1200)
    }
  }

  const colors = ['bg-candy-pink', 'bg-candy-blue', 'bg-candy-green', 'bg-candy-yellow', 'bg-candy-purple']

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />

      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/math/number-sense" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数字排序 🔢
        </h1>
        <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
          {score} 分
        </div>
      </header>

      {/* 难度选择 */}
      <div className="flex justify-center gap-2 mb-6">
        {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); setScore(0) }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              difficulty === d ? 'bg-candy-blue text-white' : 'bg-white/60 text-gray-600'
            }`}
          >
            {difficultyConfig[d].label}
          </button>
        ))}
      </div>

      {/* 主游戏区 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="card-kid p-6 w-full max-w-lg">
          <p className="text-center text-xl font-bold text-gray-700 mb-6">
            拖动数字，从小到大排列！
          </p>

          <Reorder.Group
            axis="x"
            values={numbers}
            onReorder={handleReorder}
            className="flex justify-center items-center gap-3"
          >
            {numbers.map((num, index) => (
              <Reorder.Item
                key={num}
                value={num}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.1}
                whileHover={{ scale: isDragging ? 1 : 1.05 }}
                whileDrag={{ scale: 1.1, zIndex: 50 }}
                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-2xl
                  flex items-center justify-center
                  text-2xl md:text-3xl font-bold text-white shadow-lg
                  cursor-grab active:cursor-grabbing select-none
                  ${colors[index % colors.length]}
                  ${isCorrect ? 'ring-4 ring-candy-green ring-offset-2' : ''}
                  ${isDragging ? '' : 'transition-transform'}
                `}
              >
                {num}
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {/* 排序箭头提示 */}
          <div className="flex justify-center items-center gap-2 mt-6 text-gray-400">
            <span className="text-sm">小</span>
            <div className="flex-1 h-0.5 bg-gray-300 max-w-[200px]" />
            <span className="text-2xl">→</span>
            <div className="flex-1 h-0.5 bg-gray-300 max-w-[200px]" />
            <span className="text-sm">大</span>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextRound}
          className="btn-candy-purple"
        >
          🔄 换一组
        </motion.button>
      </div>
    </div>
  )
}

