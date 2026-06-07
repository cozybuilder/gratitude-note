import type { Note, Mood } from '../../types/note'
import { EmptyState } from '../common/EmptyState'

interface MoodMeta {
  emoji: string
  label: string
  barColor: string
}

const MOOD_META: Record<Mood, MoodMeta> = {
  great:   { emoji: '😄', label: '최고',  barColor: 'bg-orange-400' },
  good:    { emoji: '🙂', label: '좋음',  barColor: 'bg-primary-500' },
  neutral: { emoji: '😐', label: '보통',  barColor: 'bg-warm-300' },
  bad:     { emoji: '😔', label: '나쁨',  barColor: 'bg-brown-400' },
  terrible:{ emoji: '😢', label: '힘듦',  barColor: 'bg-brown-500' },
}

const MOOD_ORDER: Mood[] = ['great', 'good', 'neutral', 'bad', 'terrible']

interface StatsViewProps {
  notes: Note[]
  streak: number
}

export function StatsView({ notes, streak }: StatsViewProps) {
  if (notes.length === 0) {
    return (
      <EmptyState
        title="아직 통계를 낼 기록이 없어요"
        description="홈에서 감사한 일을 기록하면 통계가 쌓여요 🌱"
      />
    )
  }

  // 기분별 카운트
  const moodCount = MOOD_ORDER.reduce<Record<Mood, number>>(
    (acc, m) => ({ ...acc, [m]: 0 }),
    {} as Record<Mood, number>
  )
  for (const note of notes) moodCount[note.mood]++

  const maxCount = Math.max(...Object.values(moodCount), 1)

  // 가장 많이 선택한 기분
  const topMood = MOOD_ORDER.reduce((a, b) => (moodCount[a] >= moodCount[b] ? a : b))

  return (
    <div className="flex flex-col gap-4">
      {/* 요약 카드 2개 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-xs text-[#8a7570]">총 작성 횟수</p>
          <p className="text-2xl font-bold text-[#3d2e26]">{notes.length}<span className="ml-1 text-sm font-normal text-[#8a7570]">회</span></p>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm">
          <p className="text-xs text-[#8a7570]">연속 작성일</p>
          <p className="text-2xl font-bold text-[#3d2e26]">{streak}<span className="ml-1 text-sm font-normal text-[#8a7570]">일</span></p>
        </div>
      </div>

      {/* 가장 많이 선택한 기분 */}
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <span className="text-3xl leading-none">{MOOD_META[topMood].emoji}</span>
        <div>
          <p className="text-xs text-[#8a7570]">가장 많이 선택한 기분</p>
          <p className="text-base font-semibold text-[#3d2e26]">{MOOD_META[topMood].label}</p>
        </div>
      </div>

      {/* 기분별 막대 그래프 */}
      <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-[#3d2e26]">기분별 기록 수</p>
        <div className="flex flex-col gap-3">
          {MOOD_ORDER.map((mood) => {
            const count = moodCount[mood]
            const pct = Math.round((count / maxCount) * 100)
            const { emoji, label, barColor } = MOOD_META[mood]
            return (
              <div key={mood} className="flex items-center gap-3">
                <span className="w-6 text-center text-base leading-none">{emoji}</span>
                <span className="w-8 shrink-0 text-xs text-[#8a7570]">{label}</span>
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-warm-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: count === 0 ? '0%' : `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-xs font-medium text-[#3d2e26]">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
