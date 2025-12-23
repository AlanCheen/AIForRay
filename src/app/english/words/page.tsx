'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wordsData, categoryLabels, type WordData } from '@/data/words'
import { BackButton } from '@/components/ui/BackButton'

type Category = WordData['category'] | 'all'

export default function WordsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredWords = useMemo(() => {
    if (selectedCategory === 'all') return wordsData
    return wordsData.filter(w => w.category === selectedCategory)
  }, [selectedCategory])

  const currentWord = filteredWords[currentIndex]

  const goNext = () => {
    setCurrentIndex((currentIndex + 1) % filteredWords.length)
  }

  const goPrev = () => {
    setCurrentIndex((currentIndex - 1 + filteredWords.length) % filteredWords.length)
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category)
    setCurrentIndex(0)
  }

  const categories: { key: Category; label: string; emoji: string }[] = [
    { key: 'all', label: '全部', emoji: '📚' },
    ...Object.entries(categoryLabels).map(([key, value]) => ({
      key: key as WordData['category'],
      ...value,
    })),
  ]

  if (!currentWord) return null

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          单词卡片 🖼️
        </h1>
        <div className="w-14" />
      </header>

      {/* 分类选择 */}
      <div className="overflow-x-auto pb-2 mb-4 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(cat.key)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${
                selectedCategory === cat.key
                  ? 'bg-candy-purple text-white shadow-lg'
                  : 'bg-white/60 text-gray-600 hover:bg-white/80'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 主卡片区域 */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.word}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="card-kid w-full max-w-md aspect-[4/5] flex flex-col items-center justify-center gap-6"
            style={{ backgroundColor: `${currentWord.color}15` }}
          >
            {/* 表情符号 */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="text-[8rem] md:text-[10rem]"
            >
              {currentWord.emoji}
            </motion.span>

            {/* 单词 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl md:text-6xl font-extrabold"
              style={{ color: currentWord.color }}
            >
              {currentWord.word}
            </motion.h2>

            {/* 分类标签 */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-1 bg-white/50 rounded-full text-gray-600 text-sm"
            >
              {categoryLabels[currentWord.category].emoji}{' '}
              {categoryLabels[currentWord.category].label}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部导航按钮 */}
      <div className="flex justify-center gap-8 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          className="btn-candy-pink"
        >
          ⬅️ 上一个
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          className="btn-candy-blue"
        >
          下一个 ➡️
        </motion.button>
      </div>

      {/* 进度指示 */}
      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} / {filteredWords.length}
      </div>
    </div>
  )
}

