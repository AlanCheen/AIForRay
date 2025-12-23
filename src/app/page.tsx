'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const modules = [
  {
    id: 'alphabet',
    title: '字母乐园',
    emoji: '🔤',
    color: 'bg-candy-pink',
    href: '/english/alphabet',
    description: '学习 26 个字母',
  },
  {
    id: 'words',
    title: '单词卡片',
    emoji: '🖼️',
    color: 'bg-candy-purple',
    href: '/english/words',
    description: '看图学单词',
  },
  {
    id: 'numbers',
    title: '数字世界',
    emoji: '🔢',
    color: 'bg-candy-blue',
    href: '/math/numbers',
    description: '认识数字 1-10',
  },
  {
    id: 'counting',
    title: '数数游戏',
    emoji: '🎯',
    color: 'bg-candy-green',
    href: '/math/counting',
    description: '数一数有几个',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen min-h-dvh p-6 md:p-10 flex flex-col">
      {/* 顶部标题 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          <span className="inline-block animate-float">🌈</span>
          {' '}快乐学习乐园{' '}
          <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>⭐</span>
        </h1>
        <p className="text-gray-600 text-lg">选择你想要学习的内容</p>
      </motion.header>

      {/* 模块网格 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 flex-1 max-w-4xl mx-auto w-full"
      >
        {modules.map((module) => (
          <motion.div key={module.id} variants={itemVariants}>
            <Link href={module.href} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`card-kid h-full flex flex-col items-center justify-center gap-4 cursor-pointer ${module.color} !bg-opacity-20 hover:!bg-opacity-30 transition-colors`}
              >
                <span className="text-6xl md:text-7xl">{module.emoji}</span>
                <div className="text-center">
                  <h2 className="font-display text-xl md:text-2xl font-bold text-gray-800">
                    {module.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 hidden md:block">
                    {module.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* 底部导航 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex justify-center gap-6"
      >
        <Link href="/progress">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-icon bg-candy-yellow"
            aria-label="学习进度"
          >
            📊
          </motion.button>
        </Link>
        <Link href="/parent">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="nav-icon bg-candy-orange"
            aria-label="家长入口"
          >
            👨‍👩‍👧
          </motion.button>
        </Link>
      </motion.footer>
    </div>
  )
}

