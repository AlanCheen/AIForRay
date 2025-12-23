'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SuccessFeedbackProps {
  show: boolean
  message?: string // 可选的自定义消息，默认 "太棒了！"
  onComplete?: () => void
}

const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '👏', '💪', '🏆']

export function SuccessFeedback({ show, message = '太棒了！', onComplete }: SuccessFeedbackProps) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([])

  useEffect(() => {
    if (show) {
      // 生成随机粒子（减少数量，更柔和）
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: 20 + Math.random() * 60, // 限制在中心区域
        y: 20 + Math.random() * 60,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        onComplete?.()
      }, 1200) // 缩短持续时间

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center"
        >
          {/* 柔和的背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"
          />

          {/* 中心内容 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 25,
              duration: 0.3 
            }}
            className="relative z-10 text-center"
          >
            <span className="text-7xl block">🎉</span>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-candy-green mt-3"
              >
                {message}
              </motion.p>
            )}
          </motion.div>

          {/* 飘散的粒子 */}
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              initial={{
                left: '50%',
                top: '50%',
                scale: 0,
                opacity: 0.8,
              }}
              animate={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                scale: 1,
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
              }}
              className="absolute text-3xl -translate-x-1/2 -translate-y-1/2"
            >
              {particle.emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
