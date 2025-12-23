'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface BackButtonProps {
  href?: string
}

export function BackButton({ href }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-2xl"
      aria-label="返回"
    >
      ←
    </motion.button>
  )
}

