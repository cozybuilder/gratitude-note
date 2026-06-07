import type { Note } from '../types/note'

const STORAGE_KEY = 'gratitude_notes'

export function getNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Note[]) : []
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
