export type Mood = 'great' | 'good' | 'neutral' | 'bad' | 'terrible'

export interface Note {
  id: string
  gratitude1: string
  gratitude2: string
  gratitude3: string
  mood: Mood
  aiMessage: string
  createdAt: string
  updatedAt: string
  gratitudeDate: string  // 새벽 4시 기준 감사일 (YYYY-MM-DD)
}
