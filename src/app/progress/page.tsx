'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/ui/BackButton'
import { getTodayStats, getWeeklyStats, type DailyStats } from '@/lib/db'

const achievements = [
  { id: 'first_letter', emoji: '🔤', title: '字母新手', desc: '学习第一个字母' },
  { id: 'all_letters', emoji: '🏆', title: '字母大师', desc: '学完全部字母' },
  { id: 'first_number', emoji: '🔢', title: '数字入门', desc: '学习第一个数字' },
  { id: 'all_numbers', emoji: '🎯', title: '数学新星', desc: '学完1-10' },
  { id: 'first_word', emoji: '📖', title: '单词学徒', desc: '学习第一个单词' },
  { id: 'streak_3', emoji: '🔥', title: '三日连学', desc: '连续学习3天' },
  { id: 'streak_7', emoji: '⭐', title: '一周冠军', desc: '连续学习7天' },
  { id: 'count_10', emoji: '🧮', title: '数数高手', desc: '完成10道数数题' },
]

export default function ProgressPage() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([])
  const [unlockedIds] = useState<Set<string>>(new Set(['first_letter', 'first_number'])) // 模拟已解锁

  useEffect(() => {
    async function loadStats() {
      const today = await getTodayStats()
      const weekly = await getWeeklyStats()
      if (today) setTodayStats(today)
      setWeeklyStats(weekly)
    }
    loadStats()
  }, [])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    const mins = Math.floor(seconds / 60)
    return `${mins}分钟`
  }

  return (
    <div className="min-h-screen min-h-dvh p-4 md:p-8">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between mb-6">
        <BackButton href="/" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800">
          学习进度 📊
        </h1>
        <div className="w-14" />
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* 今日统计 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📅</span> 今日学习
          </h2>
          
          {todayStats ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-candy-blue/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-candy-blue">
                  {formatTime(todayStats.totalTime)}
                </p>
                <p className="text-gray-600">学习时间</p>
              </div>
              <div className="bg-candy-green/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-candy-green">
                  {todayStats.itemsLearned}
                </p>
                <p className="text-gray-600">学习项目</p>
              </div>
              <div className="bg-candy-yellow/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {todayStats.correctAnswers}
                </p>
                <p className="text-gray-600">正确答题</p>
              </div>
              <div className="bg-candy-pink/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-candy-pink">
                  {todayStats.totalAnswers > 0 
                    ? Math.round((todayStats.correctAnswers / todayStats.totalAnswers) * 100) 
                    : 0}%
                </p>
                <p className="text-gray-600">正确率</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-6xl mb-4">🌱</p>
              <p>今天还没有学习记录</p>
              <p className="text-sm mt-2">快去开始学习吧！</p>
            </div>
          )}
        </motion.section>

        {/* 本周统计 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📈</span> 本周学习
          </h2>
          
          <div className="flex justify-between items-end h-32 gap-1">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => {
              const dayStats = weeklyStats[i]
              const height = dayStats ? Math.min(100, (dayStats.totalTime / 1800) * 100) : 5
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full bg-candy-purple rounded-t-lg min-h-[8px]"
                  />
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* 成就墙 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-kid"
        >
          <h2 className="font-display text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏅</span> 成就收集
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((ach) => {
              const unlocked = unlockedIds.has(ach.id)
              
              return (
                <motion.div
                  key={ach.id}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-colors ${
                    unlocked 
                      ? 'bg-candy-yellow/30' 
                      : 'bg-gray-200/50'
                  }`}
                >
                  <span className={`text-3xl ${unlocked ? '' : 'grayscale opacity-30'}`}>
                    {ach.emoji}
                  </span>
                  <span className={`text-xs mt-1 text-center font-medium ${
                    unlocked ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {ach.title}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

