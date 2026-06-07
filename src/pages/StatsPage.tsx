import { Header } from '../components/layout/Header'
import { StatsView } from '../components/stats/StatsView'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function StatsPage() {
  const { notes } = useNotes()
  const streak = useStreak(notes)

  return (
    <div>
      <Header title="통계" streak={streak} />
      <div className="px-5 pb-28">
        <StatsView notes={notes} streak={streak} />
      </div>
    </div>
  )
}
