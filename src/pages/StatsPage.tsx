import { useNavigate } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'
import { StatsView } from '../components/stats/StatsView'
import { StreakBadge } from '../components/stats/StreakBadge'

export function StatsPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)
  const navigate = useNavigate()

  return (
    <div>
      {/* 헤더 — 배지 버튼 우측 상단 */}
      <header className="flex items-center justify-between px-5 py-4">
        <h1 className="text-lg font-semibold text-[#3d2e26]">통계</h1>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1">
              <span className="text-base leading-none">🔥</span>
              <span className="text-xs font-medium text-primary-500">{streak}일 연속</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate('/badges')}
            className="flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1 hover:bg-warm-200 transition-colors"
          >
            <span className="text-base leading-none">🏅</span>
            <span className="text-xs font-medium text-[#3d2e26]">배지란?</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-4 px-5 pb-28 pt-0">
        <StreakBadge streak={streak} />
        <StatsView notes={notes} streak={streak} />
      </div>
    </div>
  )
}
