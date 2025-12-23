import Dexie, { type EntityTable } from 'dexie'

// 学习进度记录
export interface LearningProgress {
  id?: number
  moduleId: string // 'alphabet' | 'words' | 'numbers' | 'counting'
  itemId: string // 具体学习项 如 'A', 'apple', '1'
  completedAt: Date
  score: number // 0-100
  timeSpent: number // 秒
}

// 成就记录
export interface Achievement {
  id?: number
  achievementId: string
  unlockedAt: Date
  notified: boolean
}

// 每日学习统计
export interface DailyStats {
  id?: number
  date: string // YYYY-MM-DD
  totalTime: number // 秒
  itemsLearned: number
  correctAnswers: number
  totalAnswers: number
}

class LearningDatabase extends Dexie {
  progress!: EntityTable<LearningProgress, 'id'>
  achievements!: EntityTable<Achievement, 'id'>
  dailyStats!: EntityTable<DailyStats, 'id'>

  constructor() {
    super('LearnWithFun')
    
    this.version(1).stores({
      progress: '++id, moduleId, itemId, completedAt',
      achievements: '++id, achievementId, unlockedAt',
      dailyStats: '++id, &date',
    })
  }
}

export const db = new LearningDatabase()

// 辅助函数
export async function recordProgress(
  moduleId: string,
  itemId: string,
  score: number,
  timeSpent: number
): Promise<void> {
  await db.progress.add({
    moduleId,
    itemId,
    completedAt: new Date(),
    score,
    timeSpent,
  })
  
  // 更新每日统计
  const today = new Date().toISOString().split('T')[0]
  const existing = await db.dailyStats.where('date').equals(today).first()
  
  if (existing) {
    await db.dailyStats.update(existing.id!, {
      totalTime: existing.totalTime + timeSpent,
      itemsLearned: existing.itemsLearned + 1,
      correctAnswers: existing.correctAnswers + (score >= 80 ? 1 : 0),
      totalAnswers: existing.totalAnswers + 1,
    })
  } else {
    await db.dailyStats.add({
      date: today,
      totalTime: timeSpent,
      itemsLearned: 1,
      correctAnswers: score >= 80 ? 1 : 0,
      totalAnswers: 1,
    })
  }
}

export async function getModuleProgress(moduleId: string): Promise<LearningProgress[]> {
  return db.progress.where('moduleId').equals(moduleId).toArray()
}

export async function getTodayStats(): Promise<DailyStats | undefined> {
  const today = new Date().toISOString().split('T')[0]
  return db.dailyStats.where('date').equals(today).first()
}

export async function getWeeklyStats(): Promise<DailyStats[]> {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = weekAgo.toISOString().split('T')[0]
  
  return db.dailyStats.where('date').above(weekAgoStr).toArray()
}

export async function unlockAchievement(achievementId: string): Promise<void> {
  const existing = await db.achievements
    .where('achievementId')
    .equals(achievementId)
    .first()
  
  if (!existing) {
    await db.achievements.add({
      achievementId,
      unlockedAt: new Date(),
      notified: false,
    })
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  return db.achievements.toArray()
}

