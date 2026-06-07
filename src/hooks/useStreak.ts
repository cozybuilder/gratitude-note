import { useMemo } from 'react'
import type { Note } from '../types/note'
import { calcStreak } from '../utils/streak'

export function useStreak(notes: Note[]): number {
  return useMemo(() => calcStreak(notes), [notes])
}
