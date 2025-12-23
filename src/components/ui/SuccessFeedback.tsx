'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface SuccessFeedbackProps {
  show: boolean
  message?: string // 可选的自定义消息，默认 "太棒了！"
  onComplete?: () => void
}

export function SuccessFeedback({ show, message = '太棒了！', onComplete }: SuccessFeedbackProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.()
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30 
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                     px-6 py-3 rounded-2xl shadow-lg
                     bg-gradient-to-r from-candy-green to-emerald-400
                     text-white font-bold text-lg
                     pointer-events-none"
        >
          🎉 {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
