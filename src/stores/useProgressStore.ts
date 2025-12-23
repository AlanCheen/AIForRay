import { create } from 'zustand'

interface ProgressState {
  // 当前学习会话
  currentModule: string | null
  currentItem: string | null
  sessionStartTime: number | null
  
  // 动作
  startSession: (moduleId: string, itemId: string) => void
  endSession: () => { moduleId: string; itemId: string; duration: number } | null
  
  // 成就通知
  pendingAchievement: string | null
  setPendingAchievement: (id: string | null) => void
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  currentModule: null,
  currentItem: null,
  sessionStartTime: null,
  pendingAchievement: null,

  startSession: (moduleId, itemId) => {
    set({
      currentModule: moduleId,
      currentItem: itemId,
      sessionStartTime: Date.now(),
    })
  },

  endSession: () => {
    const { currentModule, currentItem, sessionStartTime } = get()
    if (!currentModule || !currentItem || !sessionStartTime) return null

    const duration = Math.floor((Date.now() - sessionStartTime) / 1000)
    
    set({
      currentModule: null,
      currentItem: null,
      sessionStartTime: null,
    })

    return { moduleId: currentModule, itemId: currentItem, duration }
  },

  setPendingAchievement: (id) => set({ pendingAchievement: id }),
}))

