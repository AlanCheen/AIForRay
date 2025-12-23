'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'

export default function ParentPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [pin, setPin] = useState('')

  const handlePinSubmit = () => {
    // 简单的家长验证（实际应用中可以更复杂）
    if (pin === '1234' || pin.length >= 4) {
      setIsUnlocked(true)
    }
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen min-h-dvh p-4 md:p-8 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-kid max-w-sm w-full text-center"
        >
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">
            家长入口
          </h1>
          <p className="text-gray-600 mb-6">
            请输入4位数字密码
          </p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                  pin.length > i ? 'border-candy-purple bg-candy-purple/10' : 'border-gray-300'
                }`}
              >
                {pin[i] ? '●' : ''}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((num, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (num === '←') {
                    setPin(pin.slice(0, -1))
                  } else if (num !== '' && pin.length < 4) {
                    const newPin = pin + num
                    setPin(newPin)
                    if (newPin.length === 4) {
                      setTimeout(() => {
                        if (newPin === '1234' || newPin.length >= 4) {
                          setIsUnlocked(true)
                        } else {
                          setPin('')
                        }
                      }, 300)
                    }
                  }
                }}
                className={`w-14 h-14 rounded-xl font-bold text-xl ${
                  num === '' 
                    ? 'invisible' 
                    : num === '←'
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-candy-blue/20 text-gray-800 active:bg-candy-blue/40'
                }`}
              >
                {num}
              </motion.button>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-6">
            提示：默认密码 1234
          </p>
        </motion.div>
        
        <div className="mt-8">
          <BackButton href="/" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          家长仪表盘 👨‍👩‍👧
        </h1>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsUnlocked(false)}
          className="w-14 h-14 rounded-2xl bg-white/80 shadow-lg flex items-center justify-center text-xl"
        >
          🔒
        </motion.button>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* 学习概览 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4">
            📊 学习概览
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-candy-pink/20 to-candy-pink/10 rounded-2xl p-4">
              <p className="text-sm text-gray-600">总学习天数</p>
              <p className="text-3xl font-bold text-candy-pink">7 天</p>
            </div>
            <div className="bg-gradient-to-br from-candy-blue/20 to-candy-blue/10 rounded-2xl p-4">
              <p className="text-sm text-gray-600">总学习时间</p>
              <p className="text-3xl font-bold text-candy-blue">2.5 小时</p>
            </div>
            <div className="bg-gradient-to-br from-candy-green/20 to-candy-green/10 rounded-2xl p-4">
              <p className="text-sm text-gray-600">掌握字母</p>
              <p className="text-3xl font-bold text-candy-green">10 / 26</p>
            </div>
            <div className="bg-gradient-to-br from-candy-purple/20 to-candy-purple/10 rounded-2xl p-4">
              <p className="text-sm text-gray-600">掌握数字</p>
              <p className="text-3xl font-bold text-candy-purple">5 / 10</p>
            </div>
          </div>
        </motion.section>

        {/* 学习建议 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4">
            💡 学习建议
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-3 bg-yellow-50 rounded-xl">
              <span className="text-2xl">⏰</span>
              <div>
                <p className="font-medium text-gray-800">建议每天学习15-20分钟</p>
                <p className="text-sm text-gray-600">短时高频比长时低频效果更好</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="font-medium text-gray-800">多玩数数游戏</p>
                <p className="text-sm text-gray-600">游戏化学习能提高孩子兴趣</p>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-medium text-gray-800">鼓励跟读发音</p>
                <p className="text-sm text-gray-600">多听多说有助于语言习得</p>
              </div>
            </li>
          </ul>
        </motion.section>

        {/* 设置 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4">
            ⚙️ 设置
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">音效</span>
              <button className="w-12 h-7 bg-candy-green rounded-full relative">
                <span className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">每日提醒</span>
              <button className="w-12 h-7 bg-gray-300 rounded-full relative">
                <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-700">清除学习数据</span>
              <button className="px-4 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                清除
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

