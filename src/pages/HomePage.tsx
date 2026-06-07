import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { NoteForm } from '../components/note/NoteForm'
import { AiMessageCard } from '../components/note/AiMessageCard'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'
import type { Mood } from '../types/note'

export function HomePage() {
  const { notes, addNote } = useNotes()
  const streak = useStreak(notes)
  const [aiMessage, setAiMessage] = useState<string | null>(null)

  function handleSubmit(data: {
    gratitude1: string
    gratitude2: string
    gratitude3: string
    mood: Mood
  }) {
    const note = addNote(data)
    setAiMessage(note.aiMessage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col">
      <Header title="오늘의 감사" streak={streak} />

      <div className="flex flex-col gap-4 px-5 pb-28">
        {/* AI 응원 메시지 카드 */}
        {aiMessage && (
          <AiMessageCard
            message={aiMessage}
            onClose={() => setAiMessage(null)}
          />
        )}

        {/* 날짜 표시 */}
        <p className="text-xs text-[#8a7570]">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })}
        </p>

        {/* 감사 입력 폼 */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-[#3d2e26]">
            오늘 감사한 일 3가지
          </h2>
          <NoteForm onSubmit={handleSubmit} />
        </section>
      </div>
    </div>
  )
}
