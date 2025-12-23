'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { numbersData } from '@/data/numbers'
import { BackButton } from '@/components/ui/BackButton'
import { SuccessFeedback } from '@/components/ui/SuccessFeedback'

export default function NumbersPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const currentNumber = numbersData[currentIndex]

  const goNext = () => {
    if (currentIndex < numbersData.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowSuccess(true)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToNumber = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col">
      <SuccessFeedback show={showSuccess} onComplete={() => setShowSuccess(false)} />
      
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数字世界 🔢
        </h1>
        <div className="w-14" />
      </header>

      {/* 数字选择器 */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {numbersData.map((item, index) => (
          <motion.button
            key={item.number}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToNumber(index)}
            className={`w-12 h-12 rounded-xl font-bold text-xl transition-colors ${
              index === currentIndex
                ? 'bg-candy-blue text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            {item.number}
          </motion.button>
        ))}
      </div>

      {/* 主卡片区域 */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNumber.number}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="card-kid w-full max-w-lg p-8 flex flex-col items-center gap-6"
            style={{ backgroundColor: `${currentNumber.color}15` }}
          >
            {/* 大数字 */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex items-center gap-6"
            >
              <span
                className="font-display text-[10rem] leading-none font-extrabold"
                style={{ color: currentNumber.color }}
              >
                {currentNumber.number}
              </span>
            </motion.div>

            {/* 英文单词 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold text-gray-700"
            >
              {currentNumber.word}
            </motion.p>

            {/* 可视化数量 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mt-2"
            >
              {Array.from({ length: currentNumber.number }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="text-4xl"
                >
                  {currentNumber.items[i % currentNumber.items.length]}
                </motion.span>
              ))}
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
          className="btn-candy-purple disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⬅️ 上一个
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          disabled={currentIndex === numbersData.length - 1}
          className="btn-candy-orange disabled:opacity-40 disabled:cursor-not-allowed"
        >
          下一个 ➡️
        </motion.button>
      </div>

      {/* 进度指示 */}
      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} / {numbersData.length}
      </div>
    </div>
  )
}

