import { Header } from '../components/layout/Header'
import { CalendarView } from '../components/calendar/CalendarView'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function CalendarPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)

  return (
    <div>
      <Header title="캘린더" streak={streak} />
      <div className="flex flex-col gap-4 px-5 pb-28">
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
        <CalendarView notes={notes} />

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
        </div>
      </div>
    </div>
  )
}
