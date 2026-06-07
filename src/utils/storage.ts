import type { Note } from '../types/note'
import { getGratitudeDate } from './date'

const STORAGE_KEY = 'gratitude_notes'

/** gratitudeDate 없는 기존 데이터를 보완 */
function migrate(notes: Note[]): Note[] {
  return notes.map((n) =>
    n.gratitudeDate
      ? n
      : { ...n, gratitudeDate: getGratitudeDate(new Date(n.createdAt)) }
  )
}

export function getNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Note[]
    const migrated = migrate(parsed)
    // 마이그레이션 결과가 바뀐 경우 즉시 저장
    if (migrated.some((n, i) => n.gratitudeDate !== (parsed[i] as Note).gratitudeDate)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    }
    return migrated
  } catch {
    return []
  }
}

export function saveNote(note: Note): void {
  const notes = getNotes()
  notes.unshift(note)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function updateNote(updated: Note): void {
  const notes = getNotes().map((n) =>
    n.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : n
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function deleteNote(id: string): void {
  const notes = getNotes().filter((n) => n.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function clearAllNotes(): void {
  localStorage.removeItem(STORAGE_KEY)
}

/** 전체 노트 배열을 한 번에 저장합니다 (백업 복원 전용) */
export function saveAllNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}
