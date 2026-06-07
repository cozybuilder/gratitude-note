import type { Note } from '../types/note'

function toDateString(iso: string): string {
  return iso.slice(0, 10) // 'YYYY-MM-DD'
}

function getDaysBefore(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export function calcStreak(notes: Note[]): number {
  if (notes.length === 0) return 0

  const writtenDays = new Set(notes.map((n) => toDateString(n.createdAt)))
  const today = new Date().toISOString().slice(0, 10)

  // 오늘 또는 어제부터 역산
  const startDay = writtenDays.has(today) ? today : getDaysBefore(today, 1)
  if (!writtenDays.has(startDay)) return 0

  let streak = 0
  let cursor = startDay
  while (writtenDays.has(cursor)) {
    streak++
    cursor = getDaysBefore(cursor, 1)
  }

  return streak
}
