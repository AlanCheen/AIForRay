'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type PatternType = 'none' | 'odd' | 'mult2' | 'mult3' | 'mult4' | 'mult5' | 'mult6' | 'mult7' | 'mult8' | 'mult9' | 'mult10'
type Mode = 'explore' | 'quiz'
type Difficulty = 'easy' | 'medium' | 'hard'

const patterns: { id: PatternType; label: string; emoji: string; check: (n: number) => boolean }[] = [
  { id: 'none', label: '无', emoji: '⬜', check: () => false },
  { id: 'odd', label: '奇数', emoji: '🔹', check: (n) => n % 2 !== 0 },
  { id: 'mult2', label: '2的倍数', emoji: '2️⃣', check: (n) => n % 2 === 0 },
  { id: 'mult3', label: '3的倍数', emoji: '3️⃣', check: (n) => n % 3 === 0 },
  { id: 'mult4', label: '4的倍数', emoji: '4️⃣', check: (n) => n % 4 === 0 },
  { id: 'mult5', label: '5的倍数', emoji: '5️⃣', check: (n) => n % 5 === 0 },
  { id: 'mult6', label: '6的倍数', emoji: '6️⃣', check: (n) => n % 6 === 0 },
  { id: 'mult7', label: '7的倍数', emoji: '7️⃣', check: (n) => n % 7 === 0 },
  { id: 'mult8', label: '8的倍数', emoji: '8️⃣', check: (n) => n % 8 === 0 },
  { id: 'mult9', label: '9的倍数', emoji: '9️⃣', check: (n) => n % 9 === 0 },
  { id: 'mult10', label: '10的倍数', emoji: '🔟', check: (n) => n % 10 === 0 },
]

const difficultyConfig: Record<Difficulty, { label: string; hiddenCount: number }> = {
  easy: { label: '简单 (10个)', hiddenCount: 10 },
  medium: { label: '中等 (20个)', hiddenCount: 20 },
  hard: { label: '困难 (30个)', hiddenCount: 30 },
}

export default function HundredChartPage() {
  const [mode, setMode] = useState<Mode>('explore')
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [pattern, setPattern] = useState<PatternType>('none')
  const [showAnimation, setShowAnimation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Quiz mode state
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [hiddenNumbers, setHiddenNumbers] = useState<Set<number>>(new Set())
  const [answeredNumbers, setAnsweredNumbers] = useState<Set<number>>(new Set())
  const [selectedHidden, setSelectedHidden] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')

  const currentPattern = patterns.find(p => p.id === pattern)!

  const generateQuiz = useCallback(() => {
    const count = difficultyConfig[difficulty].hiddenCount
    const hidden = new Set<number>()
    while (hidden.size < count) {
      hidden.add(Math.floor(Math.random() * 100) + 1)
    }
    setHiddenNumbers(hidden)
    setAnsweredNumbers(new Set())
    setSelectedHidden(null)
    setInputValue('')
  }, [difficulty])

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuiz()
    }
  }, [mode, generateQuiz])

  const handleNumberClick = (num: number) => {
    if (mode === 'explore') {
      setSelectedNumber(num)
      // 使用 Web Speech API 朗读数字
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(num.toString())
        utterance.lang = 'en-US'
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    }
  }

  const handleHiddenClick = (num: number) => {
    if (answeredNumbers.has(num)) return
    setSelectedHidden(num)
    setInputValue('')
  }

  const handleInputSubmit = () => {
    if (!selectedHidden || !inputValue) return
    
    if (parseInt(inputValue) === selectedHidden) {
      setAnsweredNumbers(prev => new Set([...prev, selectedHidden]))
      setSelectedHidden(null)
      setInputValue('')
      
      // 检查是否全部完成
      if (answeredNumbers.size + 1 === hiddenNumbers.size) {
        setShowSuccess(true)
      }
    } else {
      // 错误反馈 - 抖动效果通过 CSS 实现
    }
  }

  const handlePatternChange = (newPattern: PatternType) => {
    setPattern(newPattern)
    if (newPattern !== 'none') {
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 1000)
    }
  }

  const isHighlighted = (num: number) => {
    if (pattern === 'none') return false
    return currentPattern.check(num)
  }

  const isInSameRow = (num: number) => {
    if (!selectedNumber) return false
    return Math.ceil(num / 10) === Math.ceil(selectedNumber / 10)
  }

  const isInSameCol = (num: number) => {
    if (!selectedNumber) return false
    return (num - 1) % 10 === (selectedNumber - 1) % 10
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          百数板 📊
        </h1>
        <div className="w-14" />
      </header>

      {/* 模式切换 */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setMode('explore')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            mode === 'explore' ? 'bg-candy-blue text-white' : 'bg-white/60 text-gray-600'
          }`}
        >
          🔍 探索模式
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            mode === 'quiz' ? 'bg-candy-pink text-white' : 'bg-white/60 text-gray-600'
          }`}
        >
          ✏️ 填空练习
        </button>
      </div>

      {/* 探索模式 - 规律选择器 */}
      {mode === 'explore' && (
        <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {patterns.map((p) => (
              <motion.button
                key={p.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePatternChange(p.id)}
                className={`px-3 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-1 ${
                  pattern === p.id
                    ? 'bg-candy-purple text-white shadow-lg'
                    : 'bg-white/60 text-gray-600 hover:bg-white/80'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 填空模式 - 难度选择 */}
      {mode === 'quiz' && (
        <div className="flex justify-center gap-2 mb-4">
          {(Object.keys(difficultyConfig) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); generateQuiz() }}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                difficulty === d ? 'bg-candy-purple text-white' : 'bg-white/60 text-gray-600'
              }`}
            >
              {difficultyConfig[d].label}
            </button>
          ))}
          <button
            onClick={generateQuiz}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-candy-green text-white"
          >
            🔄 重新开始
          </button>
        </div>
      )}

      {/* 百数板 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="card-kid p-3 md:p-4 w-full max-w-lg">
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
              const highlighted = isHighlighted(num)
              const selected = selectedNumber === num
              const sameRow = isInSameRow(num)
              const sameCol = isInSameCol(num)
              
              // Quiz mode
              const isHidden = hiddenNumbers.has(num)
              const isAnswered = answeredNumbers.has(num)
              const isSelectedHidden = selectedHidden === num

              if (mode === 'quiz' && isHidden && !isAnswered) {
                return (
                  <motion.button
                    key={num}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleHiddenClick(num)}
                    className={`
                      aspect-square rounded-lg font-bold text-xs md:text-sm
                      flex items-center justify-center transition-all
                      ${isSelectedHidden
                        ? 'bg-candy-pink text-white ring-2 ring-candy-pink ring-offset-2'
                        : 'bg-gray-200 border-2 border-dashed border-gray-400 text-gray-400'
                      }
                    `}
                  >
                    ?
                  </motion.button>
                )
              }

              return (
                <motion.button
                  key={num}
                  initial={showAnimation && highlighted ? { scale: 0 } : false}
                  animate={showAnimation && highlighted ? { scale: 1 } : {}}
                  transition={{ delay: (num % 10) * 0.02 + Math.floor(num / 10) * 0.05 }}
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleNumberClick(num)}
                  className={`
                    aspect-square rounded-lg font-bold text-xs md:text-sm
                    flex items-center justify-center transition-all
                    ${selected
                      ? 'bg-candy-pink text-white shadow-lg ring-2 ring-candy-pink ring-offset-2'
                      : highlighted
                      ? 'bg-candy-purple text-white'
                      : sameRow || sameCol
                      ? 'bg-candy-yellow/30 text-gray-700'
                      : mode === 'quiz' && isAnswered
                      ? 'bg-candy-green/30 text-candy-green'
                      : 'bg-white/80 text-gray-700 hover:bg-candy-blue/20'
                    }
                  `}
                >
                  {num}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 探索模式 - 选中数字显示 */}
      {mode === 'explore' && selectedNumber && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <span className="text-6xl font-bold text-candy-pink">{selectedNumber}</span>
          <div className="text-gray-600 mt-2">
            第 {Math.ceil(selectedNumber / 10)} 行，第 {((selectedNumber - 1) % 10) + 1} 列
          </div>
        </motion.div>
      )}

      {/* 探索模式 - 规律说明 */}
      {mode === 'explore' && pattern !== 'none' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 p-3 bg-candy-purple/10 rounded-2xl"
        >
          <span className="text-lg">
            {currentPattern.emoji} 高亮的是 <strong>{currentPattern.label}</strong>
          </span>
          <span className="text-gray-600 ml-2">
            (共 {Array.from({ length: 100 }, (_, i) => i + 1).filter(currentPattern.check).length} 个)
          </span>
        </motion.div>
      )}

      {/* 填空模式 - 输入区 */}
      {mode === 'quiz' && selectedHidden && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center gap-4"
        >
          <p className="text-lg font-bold text-gray-700">
            这个位置应该是什么数字？
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
              className="w-24 h-14 text-center text-2xl font-bold rounded-xl border-2 border-candy-pink focus:outline-none focus:ring-2 focus:ring-candy-pink"
              autoFocus
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInputSubmit}
              className="btn-candy-green"
            >
              确定
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 填空模式 - 进度 */}
      {mode === 'quiz' && (
        <div className="text-center mt-4 text-gray-600">
          已完成 {answeredNumbers.size} / {hiddenNumbers.size}
        </div>
      )}
    </div>
  )
}
