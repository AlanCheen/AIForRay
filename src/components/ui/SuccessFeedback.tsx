'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SuccessFeedbackProps {
  show: boolean
  onComplete?: () => void
}

const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '👏', '💪', '🏆']

export function SuccessFeedback({ show, onComplete }: SuccessFeedbackProps) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([])

  useEffect(() => {
    if (show) {
      // 生成随机粒子
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        onComplete?.()
      }, 1500)

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
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {/* 中心大表情 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl"
          >
            🎉
          </motion.div>

          {/* 飘散的粒子 */}
          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              initial={{
                x: '50vw',
                y: '50vh',
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${particle.x}vw`,
                y: `${particle.y}vh`,
                scale: 1,
                opacity: 0,
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
              }}
              className="absolute text-4xl"
            >
              {particle.emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

