'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BackButton } from '@/components/ui/BackButton'

const games = [
  {
    id: 'compare',
    title: '比大小',
    emoji: '⚖️',
    color: 'bg-candy-pink',
    href: '/math/number-sense/compare',
    description: '哪个数字更大？',
  },
  {
    id: 'order',
    title: '数字排序',
    emoji: '🔢',
    color: 'bg-candy-blue',
    href: '/math/number-sense/order',
    description: '从小到大排列',
  },
  {
    id: 'subitizing',
    title: '瞬间识数',
    emoji: '⚡',
    color: 'bg-candy-yellow',
    href: '/math/number-sense/subitizing',
    description: '快速说出数量',
  },
  {
    id: 'decompose',
    title: '数字分解',
    emoji: '🧩',
    color: 'bg-candy-purple',
    href: '/math/number-sense/decompose',
    description: '一个数的组成',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function NumberSensePage() {
  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          数感游戏 🧠
        </h1>
        <div className="w-14" />
      </header>

      {/* 游戏列表 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 max-w-lg mx-auto w-full flex-1"
      >
        {games.map((game) => (
          <motion.div key={game.id} variants={itemVariants}>
            <Link href={game.href} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`card-kid h-full min-h-[160px] flex flex-col items-center justify-center gap-3 cursor-pointer ${game.color} !bg-opacity-20 hover:!bg-opacity-30 transition-colors`}
              >
                <span className="text-5xl">{game.emoji}</span>
                <div className="text-center">
                  <h2 className="font-display text-xl font-bold text-gray-800">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {game.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

