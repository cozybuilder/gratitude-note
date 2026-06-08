import { BADGES, getEarnedBadge, getNextBadge } from '../../utils/badge'

// 씨앗 단계 포함 전체 로드맵 (표시용)
const ROADMAP = [
  { emoji: '🌰', label: '감사 씨앗',  minStreak: 0 },
  ...BADGES,
]

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const earned  = getEarnedBadge(streak)   // null if streak < 7
  const next    = getNextBadge(streak)
  const isLegend = earned?.label === '감사 레전드'

  // 현재 단계 index (로드맵 기준)
  const currentIdx = earned
    ? ROADMAP.findIndex((b) => b.label === earned.label)
    : 0  // 씨앗 단계

  const currentBadge = ROADMAP[currentIdx]

  return (
    <div
      className={[
        'rounded-2xl px-5 py-4 shadow-sm',
        isLegend
          ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200'
          : 'bg-white',
      ].join(' ')}
    >
      {/* ── 현재 배지 + 연속 기록 ─────────────────────────────── */}
      <div className="mb-3">
        <p className={[
          'text-base font-bold',
          isLegend ? 'text-amber-600' : 'text-[#3d2e26]',
        ].join(' ')}>
          {currentBadge.emoji} {currentBadge.label}
        </p>
        <p className="mt-0.5 text-xs text-[#8a7570]">
          현재 {streak}일 연속 기록 중
        </p>
      </div>

      {/* ── 다음 배지 ─────────────────────────────────────────── */}
      {next && (
        <div className="mb-4 rounded-xl bg-warm-100 px-3 py-2">
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

      {isLegend && (
        <div className="mb-4 rounded-xl bg-amber-100 border border-amber-200 px-3 py-2">
          <p className="text-xs text-center text-amber-700 font-medium">
            👑 명예의 전당 입성 완료!
          </p>
        </div>
      )}

      {/* ── 배지 로드맵 한 줄 ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-1">
        {ROADMAP.map((badge, idx) => {
          const isCurrent = idx === currentIdx
          const isPast    = idx < currentIdx

          return (
            <div
              key={badge.label}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              {/* 이모지 */}
              <span
                className={[
                  'leading-none transition-all',
                  isCurrent ? 'text-2xl' : isPast ? 'text-base opacity-60' : 'text-base opacity-20',
                ].join(' ')}
              >
                {badge.emoji}
              </span>

              {/* 현재 단계 강조 점 */}
              <span
                className={[
                  'h-1 w-1 rounded-full',
                  isCurrent ? 'bg-primary-500' : 'bg-transparent',
                ].join(' ')}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
