import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { StatsView } from '../components/stats/StatsView'
import { StreakBadge } from '../components/stats/StreakBadge'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function StatsPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)
  const navigate = useNavigate()

  return (
    <div>
      <Header title="통계" streak={streak} />
      <div className="flex flex-col gap-4 px-5 pb-28 pt-2">
        {/* 연속 작성 배지 — 통계 페이지 최상단 */}
        <StreakBadge streak={streak} />

        {/* 명예의 전당 링크 */}
        <button
          type="button"
          onClick={() => navigate('/hall-of-fame')}
          className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 px-5 py-4 shadow-sm hover:from-amber-100 hover:to-yellow-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-700">명예의 전당</p>
              <p className="text-xs text-amber-600">365일 달성 레전드들의 기록</p>
            </div>
          </div>
          <span className="text-amber-500">›</span>
        </button>

        <StatsView notes={notes} streak={streak} />
      </div>
    </div>
  )
}
