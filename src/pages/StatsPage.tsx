import { Header } from '../components/layout/Header'
import { StatsView } from '../components/stats/StatsView'
import { StreakBadge } from '../components/stats/StreakBadge'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function StatsPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)

  return (
    <div>
      <Header title="통계" streak={streak} />
      <div className="flex flex-col gap-4 px-5 pb-28 pt-2">
        {/* 연속 작성 배지 — 통계 페이지 최상단 */}
        <StreakBadge streak={streak} />
        <StatsView notes={notes} streak={streak} />
      </div>
    </div>
  )
}
