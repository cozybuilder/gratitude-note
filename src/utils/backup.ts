// ── JSON 백업 / 복원 유틸리티 ─────────────────────────────────────
// 파일명: gratitude-note-backup.json
// 형식: { version, exportedAt, notes, settings }

import type { Note } from '../types/note'
import { getNotes, saveAllNotes, clearAllNotes } from './storage'
import { getThemeMode } from './theme'
import type { ThemeMode } from './theme'

const BACKUP_VERSION = '1.6.0'
const VALID_MOODS = new Set(['great', 'good', 'neutral', 'bad', 'terrible'])

// ── 타입 ─────────────────────────────────────────────────────────

export interface BackupData {
  version: string
  exportedAt: string
  notes: Note[]
  settings: {
    themeMode: ThemeMode
  }
}

export type ImportResult =
  | { ok: true; count: number }
  | { ok: false; error: string }

// ── 내보내기 ─────────────────────────────────────────────────────

export function exportBackup(): void {
  const data: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    notes: getNotes(),
    settings: { themeMode: getThemeMode() },
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gratitude-note-backup.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── 유효성 검사 ───────────────────────────────────────────────────

function isValidNote(n: unknown): n is Note {
  if (!n || typeof n !== 'object') return false
  const note = n as Record<string, unknown>
  return (
    typeof note.id === 'string' &&
    typeof note.gratitude1 === 'string' &&
    typeof note.gratitude2 === 'string' &&
    typeof note.gratitude3 === 'string' &&
    typeof note.mood === 'string' &&
    VALID_MOODS.has(note.mood) &&
    typeof note.createdAt === 'string'
  )
}

export function validateBackup(obj: unknown): obj is BackupData {
  if (!obj || typeof obj !== 'object') return false
  const data = obj as Record<string, unknown>
  if (!Array.isArray(data.notes)) return false
  return data.notes.every(isValidNote)
}

// ── 불러오기 ─────────────────────────────────────────────────────

export async function importBackup(file: File): Promise<ImportResult> {
  try {
    const text = await file.text()
    let parsed: unknown
    try {
      parsed = JSON.parse(text) as unknown
    } catch {
      return { ok: false, error: 'JSON 파싱에 실패했습니다. 올바른 백업 파일인지 확인해 주세요.' }
    }

    if (!validateBackup(parsed)) {
      return { ok: false, error: '올바른 감사일기 백업 파일이 아닙니다.' }
    }

    clearAllNotes()
    saveAllNotes(parsed.notes)
    return { ok: true, count: parsed.notes.length }
  } catch {
    return { ok: false, error: '파일을 읽는 중 오류가 발생했습니다.' }
  }
}
