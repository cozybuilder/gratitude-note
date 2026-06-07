import { useState, useCallback } from 'react'
import type { Note, Mood } from '../types/note'
import { getNotes, saveNote, updateNote, deleteNote, clearAllNotes } from '../utils/storage'
import { generateAiMessage } from '../utils/ai'
import { getGratitudeDate } from '../utils/date'

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => getNotes())

  const addNote = useCallback(
    (data: { gratitude1: string; gratitude2: string; gratitude3: string; mood: Mood }) => {
      const now = new Date().toISOString()
      const aiMessage = generateAiMessage(
        data.gratitude1,
        data.gratitude2,
        data.gratitude3,
        data.mood
      )
      const note: Note = {
        id: createId(),
        ...data,
        aiMessage,
        createdAt: now,
        updatedAt: now,
        gratitudeDate: getGratitudeDate(),
      }
      saveNote(note)
      setNotes(getNotes())
      return note
    },
    []
  )

  const editNote = useCallback(
    (id: string, data: { gratitude1: string; gratitude2: string; gratitude3: string; mood: Mood }) => {
      const existing = getNotes().find((n) => n.id === id)
      if (!existing) return
      const updated: Note = { ...existing, ...data, updatedAt: new Date().toISOString() }
      updateNote(updated)
      setNotes(getNotes())
    },
    []
  )

  const removeNote = useCallback((id: string) => {
    deleteNote(id)
    setNotes(getNotes())
  }, [])

  const clearNotes = useCallback(() => {
    clearAllNotes()
    setNotes([])
  }, [])

  return { notes, addNote, editNote, removeNote, clearNotes }
}
