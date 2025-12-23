export interface WordData {
  word: string
  emoji: string
  category: 'animal' | 'food' | 'nature' | 'object' | 'body'
  color: string
}

export const wordsData: WordData[] = [
  // 动物
  { word: 'Cat', emoji: '🐱', category: 'animal', color: '#fbbf24' },
  { word: 'Dog', emoji: '🐶', category: 'animal', color: '#a78bfa' },
  { word: 'Bird', emoji: '🐦', category: 'animal', color: '#60a5fa' },
  { word: 'Fish', emoji: '🐟', category: 'animal', color: '#38bdf8' },
  { word: 'Bear', emoji: '🐻', category: 'animal', color: '#92400e' },
  { word: 'Lion', emoji: '🦁', category: 'animal', color: '#fbbf24' },
  { word: 'Duck', emoji: '🦆', category: 'animal', color: '#facc15' },
  { word: 'Pig', emoji: '🐷', category: 'animal', color: '#f9a8d4' },
  { word: 'Cow', emoji: '🐮', category: 'animal', color: '#1f2937' },
  { word: 'Rabbit', emoji: '🐰', category: 'animal', color: '#fce7f3' },
  
  // 食物
  { word: 'Apple', emoji: '🍎', category: 'food', color: '#ef4444' },
  { word: 'Banana', emoji: '🍌', category: 'food', color: '#facc15' },
  { word: 'Orange', emoji: '🍊', category: 'food', color: '#fb923c' },
  { word: 'Cake', emoji: '🎂', category: 'food', color: '#f472b6' },
  { word: 'Bread', emoji: '🍞', category: 'food', color: '#d97706' },
  { word: 'Egg', emoji: '🥚', category: 'food', color: '#fef3c7' },
  { word: 'Milk', emoji: '🥛', category: 'food', color: '#f8fafc' },
  { word: 'Rice', emoji: '🍚', category: 'food', color: '#f1f5f9' },
  { word: 'Water', emoji: '💧', category: 'food', color: '#60a5fa' },
  { word: 'Juice', emoji: '🧃', category: 'food', color: '#fb923c' },
  
  // 自然
  { word: 'Sun', emoji: '☀️', category: 'nature', color: '#fcd34d' },
  { word: 'Moon', emoji: '🌙', category: 'nature', color: '#fcd34d' },
  { word: 'Star', emoji: '⭐', category: 'nature', color: '#fbbf24' },
  { word: 'Tree', emoji: '🌳', category: 'nature', color: '#4ade80' },
  { word: 'Flower', emoji: '🌸', category: 'nature', color: '#f9a8d4' },
  { word: 'Rain', emoji: '🌧️', category: 'nature', color: '#60a5fa' },
  { word: 'Cloud', emoji: '☁️', category: 'nature', color: '#e2e8f0' },
  { word: 'Rainbow', emoji: '🌈', category: 'nature', color: '#f87171' },
  
  // 物品
  { word: 'Ball', emoji: '⚽', category: 'object', color: '#1f2937' },
  { word: 'Book', emoji: '📚', category: 'object', color: '#ef4444' },
  { word: 'Car', emoji: '🚗', category: 'object', color: '#ef4444' },
  { word: 'House', emoji: '🏠', category: 'object', color: '#f472b6' },
  { word: 'Phone', emoji: '📱', category: 'object', color: '#1f2937' },
  { word: 'Bag', emoji: '🎒', category: 'object', color: '#ef4444' },
  { word: 'Hat', emoji: '🧢', category: 'object', color: '#60a5fa' },
  { word: 'Shoe', emoji: '👟', category: 'object', color: '#f97316' },
  
  // 身体
  { word: 'Eye', emoji: '👁️', category: 'body', color: '#60a5fa' },
  { word: 'Ear', emoji: '👂', category: 'body', color: '#fcd9b6' },
  { word: 'Nose', emoji: '👃', category: 'body', color: '#fcd9b6' },
  { word: 'Hand', emoji: '✋', category: 'body', color: '#fcd9b6' },
  { word: 'Foot', emoji: '🦶', category: 'body', color: '#fcd9b6' },
]

export const categoryLabels: Record<WordData['category'], { label: string; emoji: string }> = {
  animal: { label: '动物', emoji: '🐾' },
  food: { label: '食物', emoji: '🍽️' },
  nature: { label: '自然', emoji: '🌿' },
  object: { label: '物品', emoji: '📦' },
  body: { label: '身体', emoji: '👤' },
}

