'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'

// Numberblocks 配色方案
const numberColors: Record<number, { bg: string; border: string }> = {
  1: { bg: 'bg-red-500', border: 'border-red-600' },
  2: { bg: 'bg-orange-500', border: 'border-orange-600' },
  3: { bg: 'bg-yellow-400', border: 'border-yellow-500' },
  4: { bg: 'bg-green-500', border: 'border-green-600' },
  5: { bg: 'bg-cyan-500', border: 'border-cyan-600' },
  6: { bg: 'bg-purple-500', border: 'border-purple-600' },
  7: { bg: 'bg-orange-600', border: 'border-orange-700' },
  8: { bg: 'bg-pink-500', border: 'border-pink-600' },
  9: { bg: 'bg-blue-600', border: 'border-blue-700' },
  10: { bg: 'bg-gradient-to-br from-white to-amber-100', border: 'border-amber-300' },
  // 11-20 使用渐变
  11: { bg: 'bg-gradient-to-br from-red-400 to-red-600', border: 'border-red-700' },
  12: { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', border: 'border-orange-700' },
  13: { bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500', border: 'border-yellow-600' },
  14: { bg: 'bg-gradient-to-br from-green-400 to-green-600', border: 'border-green-700' },
  15: { bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600', border: 'border-cyan-700' },
  16: { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', border: 'border-purple-700' },
  17: { bg: 'bg-gradient-to-br from-orange-500 to-orange-700', border: 'border-orange-800' },
  18: { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', border: 'border-pink-700' },
  19: { bg: 'bg-gradient-to-br from-blue-500 to-blue-700', border: 'border-blue-800' },
  20: { bg: 'bg-gradient-to-br from-amber-200 to-amber-400', border: 'border-amber-500' },
}

// 积木排列规则 [cols, rows] 或特殊排列
const blockLayouts: Record<number, { cols: number; rows: number; extra?: number }> = {
  1: { cols: 1, rows: 1 },
  2: { cols: 1, rows: 2 },
  3: { cols: 1, rows: 3 },
  4: { cols: 2, rows: 2 },
  5: { cols: 2, rows: 2, extra: 1 }, // 2x2 + 顶部1个
  6: { cols: 2, rows: 3 },
  7: { cols: 2, rows: 3, extra: 1 },
  8: { cols: 2, rows: 4 },
  9: { cols: 3, rows: 3 },
  10: { cols: 2, rows: 5 },
}

// 单个方块组件
function Block({ 
  hasEyes = false, 
  color, 
  delay = 0 
}: { 
  hasEyes?: boolean
  color: { bg: string; border: string }
  delay?: number
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 15,
        delay 
      }}
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
        rounded-lg border-2 ${color.bg} ${color.border}
        flex items-center justify-center
        shadow-md relative
      `}
    >
      {hasEyes && (
        <div className="flex gap-1.5">
          <div className="w-2.5 h-3 sm:w-3 sm:h-3.5 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-800 rounded-full" />
          </div>
          <div className="w-2.5 h-3 sm:w-3 sm:h-3.5 bg-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-800 rounded-full" />
          </div>
        </div>
      )}
      {/* 方块高光效果 */}
      <div className="absolute top-1 left-1 w-3 h-3 bg-white/30 rounded-sm" />
    </motion.div>
  )
}

// 积木组合组件
function NumberBlock({ number }: { number: number }) {
  const color = numberColors[number] || numberColors[1]
  
  // 对于 11-20，分成两部分显示
  if (number > 10) {
    const remainder = number - 10
    return (
      <div className="flex items-end gap-4">
        {/* 10 的部分 */}
        <div className="flex flex-col-reverse gap-1">
          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <Block 
                key={`ten-${i}`} 
                color={numberColors[10]} 
                hasEyes={i === 8 || i === 9} // 顶部两个有眼睛
                delay={i * 0.03}
              />
            ))}
          </div>
        </div>
        {/* + 号 */}
        <span className="text-3xl font-bold text-gray-400 mb-8">+</span>
        {/* 余数部分 */}
        <NumberBlockSmall number={remainder} />
      </div>
    )
  }

  const layout = blockLayouts[number]
  if (!layout) return null

  const { cols, rows, extra } = layout
  const baseBlocks = cols * rows
  const totalBlocks = extra ? baseBlocks + extra : number

  // 确定哪个是顶部方块（带眼睛）
  const getBlockIndex = (row: number, col: number) => {
    return row * cols + col
  }

  return (
    <div className="flex flex-col-reverse items-center gap-1">
      {/* 额外的顶部方块 */}
      {extra && (
        <div className="flex justify-center gap-1 mb-1">
          {Array.from({ length: extra }).map((_, i) => (
            <Block 
              key={`extra-${i}`} 
              color={color} 
              hasEyes={true}
              delay={(baseBlocks + i) * 0.05}
            />
          ))}
        </div>
      )}
      
      {/* 主体方块网格 */}
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: Math.min(baseBlocks, number - (extra || 0)) }).map((_, i) => {
          const row = Math.floor(i / cols)
          const isTopRow = row === rows - 1
          const isTopBlock = !extra && isTopRow
          return (
            <Block 
              key={i} 
              color={color} 
              hasEyes={isTopBlock && (cols === 1 || i >= baseBlocks - cols)}
              delay={i * 0.05}
            />
          )
        })}
      </div>
    </div>
  )
}

// 小型积木组件（用于 11-20 的余数部分）
function NumberBlockSmall({ number }: { number: number }) {
  const color = numberColors[number]
  const layout = blockLayouts[number]
  if (!layout) return null

  const { cols, rows, extra } = layout
  const baseBlocks = cols * rows

  return (
    <div className="flex flex-col-reverse items-center gap-1">
      {extra && (
        <div className="flex justify-center gap-1 mb-1">
          {Array.from({ length: extra }).map((_, i) => (
            <Block 
              key={`extra-${i}`} 
              color={color} 
              hasEyes={true}
              delay={0.5 + (baseBlocks + i) * 0.05}
            />
          ))}
        </div>
      )}
      
      <div 
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: Math.min(baseBlocks, number - (extra || 0)) }).map((_, i) => {
          const row = Math.floor(i / cols)
          const isTopRow = row === rows - 1
          const isTopBlock = !extra && isTopRow
          return (
            <Block 
              key={i} 
              color={color} 
              hasEyes={isTopBlock && (cols === 1 || i >= baseBlocks - cols)}
              delay={0.5 + i * 0.05}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function NumberBlocksPage() {
  const [selectedNumber, setSelectedNumber] = useState(5)

  const handleNumberClick = (num: number) => {
    setSelectedNumber(num)
    // 语音播报
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(num.toString())
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-6 flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-4">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数字积木 🧱
        </h1>
        <div className="w-14" />
      </header>

      {/* 积木展示区域 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="card-kid p-6 md:p-8 min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <NumberBlock number={selectedNumber} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 当前数字显示 */}
        <motion.div 
          key={selectedNumber}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mt-6 text-center"
        >
          <span className="text-5xl md:text-6xl font-bold" style={{ 
            color: selectedNumber <= 10 
              ? `var(--tw-${numberColors[selectedNumber]?.bg.split('-')[1]}-500, #666)` 
              : '#666' 
          }}>
            {selectedNumber}
          </span>
          <p className="text-gray-500 mt-1">
            {selectedNumber} 个方块
          </p>
        </motion.div>
      </div>

      {/* 数字选择器 */}
      <div className="mt-6 space-y-3">
        {/* 1-10 */}
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num)}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-lg
                transition-all shadow-md
                ${selectedNumber === num 
                  ? `${numberColors[num].bg} text-white ring-2 ring-offset-2 ring-gray-400` 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
                }
              `}
            >
              {num}
            </motion.button>
          ))}
        </div>
        
        {/* 11-20 */}
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 11).map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num)}
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-lg
                transition-all shadow-md
                ${selectedNumber === num 
                  ? `${numberColors[num].bg} text-white ring-2 ring-offset-2 ring-gray-400` 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
                }
              `}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

