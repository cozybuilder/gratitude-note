import { useState } from 'react'
import type { Note, Mood } from '../../types/note'
import { MoodSelector } from './MoodSelector'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'

const MOOD_LABEL: Record<Mood, string> = {
  great: '😄 최고',
  good: '🙂 좋음',
  neutral: '😐 보통',
  bad: '😔 나쁨',
  terrible: '😢 힘듦',
}

interface NoteCardProps {
  note: Note
  onEdit: (id: string, data: { gratitude1: string; gratitude2: string; gratitude3: string; mood: Mood }) => void
  onDelete: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editValues, setEditValues] = useState({
    gratitude1: note.gratitude1,
    gratitude2: note.gratitude2,
    gratitude3: note.gratitude3,
    mood: note.mood,
  })

  const gratitudes = [
    { key: 'gratitude1' as const, label: '1', value: editValues.gratitude1 },
    { key: 'gratitude2' as const, label: '2', value: editValues.gratitude2 },
    { key: 'gratitude3' as const, label: '3', value: editValues.gratitude3 },
  ]

  const displayGratitudes = [note.gratitude1, note.gratitude2, note.gratitude3].filter(
    (g) => g.trim() !== ''
  )

  const canSave = [editValues.gratitude1, editValues.gratitude2, editValues.gratitude3].some(
    (v) => v.trim() !== ''
  )

  function handleSave() {
    if (!canSave) return
    onEdit(note.id, editValues)
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditValues({
      gratitude1: note.gratitude1,
      gratitude2: note.gratitude2,
      gratitude3: note.gratitude3,
      mood: note.mood,
    })
    setIsEditing(false)
  }

  const [gy, gm, gd] = note.gratitudeDate.split('-').map(Number)
  const dateStr = new Date(gy, gm - 1, gd).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <>
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {/* 헤더 */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-[#8a7570]">{dateStr}</span>
          {!isEditing && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-[#8a7570] hover:text-primary-500 transition-colors"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-xs text-[#8a7570] hover:text-red-400 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          /* 수정 모드 */
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {gratitudes.map(({ key, label, value }) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
                    {label}
                  </span>
                  <textarea
                    value={value}
                    onChange={(e) =>
                      setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    rows={2}
                    className="w-full resize-none rounded-xl border border-warm-200 bg-warm-50 px-3 py-2 text-sm leading-relaxed text-[#3d2e26] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
                  />
                </div>
              ))}
            </div>
            <MoodSelector
              value={editValues.mood}
              onChange={(mood) => setEditValues((prev) => ({ ...prev, mood }))}
            />
            <div className="flex gap-2">
              <Button variant="secondary" fullWidth onClick={handleCancelEdit}>
                취소
              </Button>
              <Button variant="primary" fullWidth onClick={handleSave} disabled={!canSave}>
                저장
              </Button>
            </div>
          </div>
        ) : (
          /* 보기 모드 */
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5">
              {displayGratitudes.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warm-200 text-xs font-semibold text-primary-500">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[#3d2e26]">{g}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#8a7570]">기분</span>
              <span className="rounded-full bg-warm-100 px-2.5 py-0.5 text-xs text-[#3d2e26]">
                {MOOD_LABEL[note.mood]}
              </span>
            </div>

            {note.aiMessage && (
              <div className="rounded-xl bg-warm-100 px-3 py-2.5">
                <p className="text-xs leading-relaxed text-[#8a7570]">
                  <span className="mr-1">✨</span>
                  {note.aiMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showDeleteModal}
        title="기록을 삭제할까요?"
        message="삭제한 기록은 복구할 수 없습니다."
        confirmLabel="삭제"
        confirmVariant="danger"
        onConfirm={() => {
          onDelete(note.id)
          setShowDeleteModal(false)
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  )
}
