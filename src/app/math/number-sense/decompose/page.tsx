'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

type Mode = 'learn' | 'quiz'

// 生成一个数字的所有分解方式
function getDecompositions(n: number): [number, number][] {
  const result: [number, number][] = []
  for (let i = 0; i <= Math.floor(n / 2); i++) {
    result.push([i, n - i])
  }
  return result
}

export default function DecomposePage() {
  const [mode, setMode] = useState<Mode>('learn')
  const [targetNumber, setTargetNumber] = useState(5)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Quiz mode
  const [quizNumber, setQuizNumber] = useState(5)
  const [part1, setPart1] = useState(0)
  const [selectedPart2, setSelectedPart2] = useState<number | null>(null)
  const [options, setOptions] = useState<number[]>([])
  const [score, setScore] = useState(0)

  const decompositions = getDecompositions(targetNumber)

  const generateQuiz = useCallback(() => {
    const num = Math.floor(Math.random() * 9) + 2 // 2-10
    const p1 = Math.floor(Math.random() * num) // 0 到 num-1
    const correctAnswer = num - p1
    
    setQuizNumber(num)
    setPart1(p1)
    setSelectedPart2(null)
    
    // 生成选项
    const opts = new Set<number>([correctAnswer])
    while (opts.size < 4) {
      const opt = Math.max(0, Math.min(10, correctAnswer + Math.floor(Math.random() * 5) - 2))
      opts.add(opt)
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5))
  }, [])

  useEffect(() => {
    if (mode === 'quiz') {
      generateQuiz()
    }
  }, [mode, generateQuiz])

  const handleQuizAnswer = (answer: number) => {
    setSelectedPart2(answer)
    
    if (answer === quizNumber - part1) {
      setScore(s => s + 1)
      setShowSuccess(true)
      setTimeout(() => {
        generateQuiz()
      }, 1200)
    }
  }

  const renderBlocks = (count: number, color: string) => (
    <div className="flex flex-wrap justify-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${color}`}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />

      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/math/number-sense" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数字分解 🧩
        </h1>
        {mode === 'quiz' && (
          <div className="bg-candy-yellow px-4 py-2 rounded-2xl font-bold text-gray-800">
            {score} 分
          </div>
        )}
        {mode === 'learn' && <div className="w-14" />}
      </header>

      {/* 模式切换 */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setMode('learn')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            mode === 'learn' ? 'bg-candy-blue text-white' : 'bg-white/60 text-gray-600'
          }`}
        >
          📖 学习模式
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            mode === 'quiz' ? 'bg-candy-pink text-white' : 'bg-white/60 text-gray-600'
          }`}
        >
          ✏️ 练习模式
        </button>
      </div>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* 学习模式 */}
        {mode === 'learn' && (
          <>
            {/* 数字选择 */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTargetNumber(n)}
                  className={`w-12 h-12 rounded-xl font-bold text-lg ${
                    targetNumber === n
                      ? 'bg-candy-purple text-white shadow-lg'
                      : 'bg-white/60 text-gray-600'
                  }`}
                >
                  {n}
                </motion.button>
              ))}
            </div>

            {/* 分解展示 */}
            <div className="card-kid p-6 w-full max-w-lg">
              <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
                <span className="text-candy-purple text-4xl">{targetNumber}</span> 可以分成
              </h2>

              <div className="space-y-4">
                {decompositions.map(([a, b], index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-center gap-4 p-3 bg-white/50 rounded-xl"
                  >
                    <div className="text-center">
                      {renderBlocks(a, 'bg-candy-pink')}
                      <span className="text-xl font-bold text-candy-pink">{a}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-400">+</span>
                    <div className="text-center">
                      {renderBlocks(b, 'bg-candy-blue')}
                      <span className="text-xl font-bold text-candy-blue">{b}</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-400">=</span>
                    <span className="text-3xl font-bold text-candy-purple">{targetNumber}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 练习模式 */}
        {mode === 'quiz' && (
          <>
            <div className="card-kid p-6 w-full max-w-lg">
              <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
                <span className="text-candy-purple text-4xl">{quizNumber}</span> 可以分成
              </h2>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  {renderBlocks(part1, 'bg-candy-pink')}
                  <span className="text-3xl font-bold text-candy-pink">{part1}</span>
                </div>
                <span className="text-3xl font-bold text-gray-400">+</span>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-xl border-4 border-dashed border-candy-blue flex items-center justify-center">
                    {selectedPart2 !== null ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-candy-blue"
                      >
                        {selectedPart2}
                      </motion.span>
                    ) : (
                      <span className="text-4xl text-gray-300">?</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-center text-lg text-gray-600 mb-4">
                {part1} + ? = {quizNumber}
              </p>

              {/* 选项 */}
              <div className="grid grid-cols-4 gap-3">
                {options.map((opt, i) => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={selectedPart2 !== null}
                    className={`btn-kid text-2xl font-extrabold ${
                      selectedPart2 === opt && opt === quizNumber - part1
                        ? 'bg-candy-green text-white'
                        : selectedPart2 === opt && opt !== quizNumber - part1
                        ? 'bg-red-400 text-white'
                        : selectedPart2 !== null && opt === quizNumber - part1
                        ? 'bg-candy-green text-white'
                        : i % 4 === 0 ? 'bg-candy-pink text-white'
                        : i % 4 === 1 ? 'bg-candy-blue text-white'
                        : i % 4 === 2 ? 'bg-candy-yellow text-gray-800'
                        : 'bg-candy-purple text-white'
                    }`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 下一题按钮 */}
            {selectedPart2 !== null && selectedPart2 !== quizNumber - part1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateQuiz}
                className="btn-candy-purple"
              >
                下一题 →
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

