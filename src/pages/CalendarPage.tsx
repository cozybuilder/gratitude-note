import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { CalendarView } from '../components/calendar/CalendarView'
import { SelectedDayCard } from '../components/calendar/SelectedDayCard'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'
import type { Note } from '../types/note'

export function CalendarPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // 선택한 날짜의 기록 조회
  const selectedNote: Note | null = selectedDate
    ? (notes.find((n) => n.gratitudeDate === selectedDate) ?? null)
    : null

  // 같은 날짜 재클릭 시 선택 해제 (토글)
  function handleSelectDate(dateKey: string) {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey))
  }

  return (
    <div>
      <Header title="캘린더" streak={streak} />
      <div className="flex flex-col gap-4 px-5 pb-32">

        {/* 연속 작성일 요약 */}
        <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <span className="text-2xl leading-none">🔥</span>
          <div>
            <p className="text-xs text-[#8a7570]">현재 연속 작성일</p>
            <p className="text-lg font-semibold text-[#3d2e26]">
              {streak > 0 ? `${streak}일 연속` : '아직 기록이 없어요'}
            </p>
          </div>
        </div>

        {/* 캘린더 */}
        <CalendarView
          notes={notes}
          selectedDate={selectedDate ?? undefined}
          onSelectDate={handleSelectDate}
        />

        {/* 선택한 날짜 기록 카드 */}
        {selectedDate && (
          <SelectedDayCard dateKey={selectedDate} note={selectedNote} />
        )}

        {/* 범례 */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary-500" />
            <span className="text-xs text-[#8a7570]">오늘</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-warm-200" />
            <span className="text-xs text-[#8a7570]">기록 완료</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full border-2 border-[#c4b8b4]" />
            <span className="text-xs text-[#8a7570]">선택</span>
          </div>
        </div>

      </div>
    </div>
  )
}
