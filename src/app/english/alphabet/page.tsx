'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alphabetData } from '@/data/alphabet'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

export default function AlphabetPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const currentLetter = alphabetData[currentIndex]

  const goNext = () => {
    if (currentIndex < alphabetData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowSuccess(true)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToLetter = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          字母乐园 🔤
        </h1>
        <div className="w-14" /> {/* 占位 */}
      </header>

      {/* 字母选择器 */}
      <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {alphabetData.map((item, index) => (
            <motion.button
              key={item.letter}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToLetter(index)}
              className={`w-10 h-10 rounded-xl font-bold text-lg transition-colors ${
                index === currentIndex
                  ? 'bg-candy-pink text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white/80'
              }`}
            >
              {item.letter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 主卡片区域 */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLetter.letter}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="card-kid w-full max-w-md aspect-square flex flex-col items-center justify-center gap-4"
            style={{ backgroundColor: `${currentLetter.color}20` }}
          >
            {/* 大写字母 */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex items-baseline gap-4"
            >
              <span
                className="font-display text-9xl font-extrabold"
                style={{ color: currentLetter.color }}
              >
                {currentLetter.upper}
              </span>
              <span
                className="font-display text-7xl font-bold opacity-60"
                style={{ color: currentLetter.color }}
              >
                {currentLetter.lower}
              </span>
            </motion.div>

            {/* 示例单词和表情 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mt-4"
            >
              <span className="text-6xl">{currentLetter.emoji}</span>
              <span className="font-display text-3xl font-bold text-gray-700">
                {currentLetter.word}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部导航按钮 */}
      <div className="flex justify-center gap-8 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="btn-candy-blue disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⬅️ 上一个
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          disabled={currentIndex === alphabetData.length - 1}
          className="btn-candy-green disabled:opacity-40 disabled:cursor-not-allowed"
        >
          下一个 ➡️
        </motion.button>
      </div>

      {/* 进度指示 */}
      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} / {alphabetData.length}
      </div>
    </div>
  )
}

