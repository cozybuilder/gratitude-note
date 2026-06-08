import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { NoteForm } from '../components/note/NoteForm'
import { AiMessageCard } from '../components/note/AiMessageCard'
import { ShareCardModal } from '../components/note/ShareCardModal'
import { AdBanner } from '../components/ad/AdBanner'
import { BadgeCelebrationModal } from '../components/badge/BadgeCelebrationModal'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'
import { useAchievements } from '../hooks/useAchievements'
import { getCurrentBadge, getNextTargetBadge } from '../utils/achievement'
import { HeroBanner } from '../components/note/HeroBanner'
import type { Note, Mood } from '../types/note'
import { getTodayGratitudeDate } from '../utils/date'

const MOOD_LABEL: Record<string, string> = {
  great: '😄 최고',
  good: '🙂 좋음',
  neutral: '😐 보통',
  bad: '😔 나쁨',
  terrible: '😢 힘듦',
}

function findTodayNote(notes: Note[]): Note | undefined {
  const today = getTodayGratitudeDate()
  return notes.find((n) => n.gratitudeDate === today)
}

export function HomePage() {
  const { notes, addNote, editNote } = useNotes()
  const streak = useStreak(notes)
  const { newBadge, clearNewBadge } = useAchievements(streak)
  const navigate = useNavigate()

  const todayNote = findTodayNote(notes)
  const [isEditing, setIsEditing] = useState(false)
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  function handleSubmit(data: {
    gratitude1: string
    gratitude2: string
    gratitude3: string
    mood: Mood
  }) {
    if (todayNote && isEditing) {
      editNote(todayNote.id, data)
      setIsEditing(false)
    } else {
      const note = addNote(data)
      setAiMessage(note.aiMessage)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const today = new Date()
  const dateStr = '☀️ ' + today.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const gratitudes = todayNote
    ? [todayNote.gratitude1, todayNote.gratitude2, todayNote.gratitude3].filter(
        (g) => g.trim() !== ''
      )
    : []

  const showTodayCard = !!todayNote && !isEditing

  return (
    <div className="flex flex-col">
      <Header title="오늘의 감사" streak={streak} />

      {/* 홈 하단 고정 배너 광고 (BottomNav 위) */}
      <div className="fixed bottom-16 inset-x-0 z-30 mx-auto w-full max-w-md">
        <AdBanner />
      </div>

      {/* Hero 배너 — 오늘 기록 없을 때만 표시 */}
      {!todayNote && <HeroBanner />}

      <div className="flex flex-col px-5 pb-36">
        {/* AI 응원 메시지 카드 */}
        {aiMessage && (
          <div className="mt-4">
            <AiMessageCard
              message={aiMessage}
              onClose={() => setAiMessage(null)}
            />
          </div>
        )}

        {/* ── 날짜 + 현재 배지 (한 줄) ── */}
        {(() => {
          const current = getCurrentBadge(streak)
          const next = getNextTargetBadge(streak)
          const badgeLabel = current
            ? `${current.emoji} ${current.label}`
            : '🌰 감사 씨앗'
          const isLegend = current?.isLegend ?? false
          return (
            <>
              <div className="mb-3 mt-2 flex items-center justify-between">
                <p className="text-sm font-medium text-[#3d2e26]">{dateStr}</p>
                <p className={`text-sm font-semibold ${isLegend ? 'text-amber-600' : 'text-[#3d2e26]'}`}>
                  {badgeLabel}
                </p>
              </div>

              {/* 다음 배지 한 줄 카드 */}
              {next && (
                <div className="mb-4 rounded-xl bg-warm-100 px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#8a7570]">
                      다음 배지{' '}
                      <span className="font-medium text-[#3d2e26]">
                        {next.emoji} {next.label}
                      </span>
                    </p>
                    <span className="text-xs font-semibold text-primary-500">
                      {next.minStreak - streak}일 남음
                    </span>
                  </div>
                </div>
              )}
            </>
          )
        })()}

        {showTodayCard ? (
          /* ── 오늘 기록 카드 ── */
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3d2e26]">오늘의 감사 기록</h2>
              <span className="rounded-full bg-warm-100 px-2.5 py-0.5 text-xs text-[#3d2e26]">
                {MOOD_LABEL[todayNote.mood]}
              </span>
            </div>

            <ul className="mb-4 flex flex-col gap-2">
              {gratitudes.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warm-200 text-xs font-semibold text-primary-500">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-[#3d2e26]">{g}</span>
                </li>
              ))}
            </ul>

            {todayNote.aiMessage && (
              <div className="mb-4 rounded-xl bg-warm-100 px-3 py-2.5">
                <p className="text-xs leading-relaxed text-[#8a7570]">
                  <span className="mr-1">✨</span>
                  {todayNote.aiMessage}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 rounded-xl border border-warm-300 bg-warm-50 py-2.5 text-sm font-medium text-[#3d2e26] hover:bg-warm-100 transition-colors"
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={() => navigate('/list')}
                className="flex-1 rounded-xl bg-primary-500 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
              >
                기록 보기
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-primary-400 py-2.5 text-sm font-medium text-primary-500 hover:bg-primary-50 transition-colors"
            >
              <span>✨</span>
              공유 카드 만들기
            </button>
          </section>
        ) : (
          /* ── 작성 폼 ── */
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3d2e26]">
                {isEditing ? '오늘 기록 수정' : '오늘 감사한 일 3가지'}
              </h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-[#8a7570] hover:text-primary-500 transition-colors"
                >
                  취소
                </button>
              )}
            </div>
            <NoteForm
              onSubmit={handleSubmit}
              initialValues={
                isEditing && todayNote
                  ? {
                      gratitude1: todayNote.gratitude1,
                      gratitude2: todayNote.gratitude2,
                      gratitude3: todayNote.gratitude3,
                      mood: todayNote.mood,
                    }
                  : undefined
              }
            />
          </section>
        )}
      </div>

      {/* 공유 카드 모달 */}
      {showShareModal && todayNote && (
        <ShareCardModal note={todayNote} streak={streak} onClose={() => setShowShareModal(false)} />
      )}

      {/* 배지 획득 축하 모달 */}
      {newBadge && (
        <BadgeCelebrationModal
          badge={newBadge}
          streak={streak}
          onClose={clearNewBadge}
        />
      )}
    </div>
  )
}
