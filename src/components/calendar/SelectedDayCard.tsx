import type { Note } from '../../types/note'

// ── 기분 메타 ────────────────────────────────────────────────────────
const MOOD_META: Record<string, { emoji: string; label: string }> = {
  great:    { emoji: '😄', label: '최고' },
  good:     { emoji: '🙂', label: '좋음' },
  neutral:  { emoji: '😐', label: '보통' },
  bad:      { emoji: '😔', label: '나쁨' },
  terrible: { emoji: '😢', label: '힘듦' },
}

interface SelectedDayCardProps {
  dateKey: string   // "YYYY-MM-DD"
  note: Note | null
}

export function SelectedDayCard({ dateKey, note }: SelectedDayCardProps) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const dateLabel = new Date(y, m - 1, d).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  // ── 기록 없는 날 ────────────────────────────────────────────────────
  if (!note) {
    return (
      <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-[#3d2e26]">{dateLabel}</p>
        <p className="text-sm text-[#8a7570]">이 날은 아직 감사 기록이 없어요.</p>
      </div>
    )
  }

  // ── 기록 있는 날 ────────────────────────────────────────────────────
  const gratitudes = [note.gratitude1, note.gratitude2, note.gratitude3].filter(
    (g) => g.trim() !== ''
  )
  const mood = MOOD_META[note.mood] ?? { emoji: '🙂', label: '좋음' }

  return (
    <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
      {/* 날짜 헤더 */}
      <p className="mb-4 text-sm font-semibold text-[#3d2e26]">{dateLabel}</p>

      {/* 감사 목록 */}
      <div className="mb-4 flex flex-col gap-2.5">
        {gratitudes.map((g, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-[#3d2e26]">{g}</p>
          </div>
        ))}
      </div>

      {/* 기분 pill */}
      <div className="flex items-center gap-2 rounded-xl bg-warm-50 px-4 py-2.5">
        <span className="text-xs text-[#8a7570]">오늘의 기분</span>
        <span className="text-base leading-none">{mood.emoji}</span>
        <span className="text-sm font-medium text-[#3d2e26]">{mood.label}</span>
      </div>

      {/* AI 응원 메시지 */}
      {note.aiMessage && (
        <div className="mt-3 rounded-xl bg-warm-50 px-4 py-3">
          <p className="text-xs leading-relaxed text-[#8a7570]">{note.aiMessage}</p>
        </div>
      )}
    </div>
  )
}
