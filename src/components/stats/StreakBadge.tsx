import { BADGES, getEarnedBadge, getNextBadge } from '../../utils/badge'
import { getEarnedBadgeDetails } from '../../utils/achievement'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const earned = getEarnedBadge(streak)
  const next = getNextBadge(streak)
  const earnedDetails = getEarnedBadgeDetails()
  const earnedIds = new Set(earnedDetails.map((d) => d.badge.id))

  const isLegend = earned?.label === '감사 레전드'

  return (
    <div
      className={[
        'rounded-2xl px-5 py-4 shadow-sm',
        isLegend
          ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200'
          : 'bg-white',
      ].join(' ')}
    >
      <p className="mb-3 text-sm font-semibold text-[#3d2e26]">연속 작성 배지</p>

      {/* 현재 기록 + 획득 배지 */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#8a7570]">현재 연속 기록</p>
          <p className="text-xl font-bold text-[#3d2e26]">
            🔥 {streak}
            <span className="ml-1 text-sm font-normal text-[#8a7570]">일</span>
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#8a7570]">획득 배지</p>
          {earned ? (
            <p className={[
              'text-base font-bold',
              isLegend ? 'text-amber-600' : 'text-[#3d2e26]',
            ].join(' ')}>
              {earned.emoji} {earned.label}
            </p>
          ) : (
            <p className="text-sm text-[#8a7570]">아직 없음</p>
          )}
        </div>
      </div>

      {/* 다음 목표 안내 */}
      {next && (
        <div className="mb-3 rounded-xl bg-warm-100 px-3 py-2">
          <p className="text-xs text-[#8a7570]">
            다음 배지:{' '}
            <span className="font-medium text-[#3d2e26]">
              {next.emoji} {next.label}
            </span>
            {' '}({next.minStreak}일 연속)
            {streak > 0 && (
              <span className="text-primary-500">
                {' '}— {next.minStreak - streak}일 남았어요!
              </span>
            )}
          </p>
        </div>
      )}

      {isLegend && (
        <div className="mb-3 rounded-xl bg-amber-100 border border-amber-200 px-3 py-2">
          <p className="text-xs text-center text-amber-700 font-medium">
            👑 명예의 전당 입성 완료!
          </p>
        </div>
      )}

      {/* 배지 진행 막대 (6단계) */}
      <div className="flex items-end justify-between gap-1">
        {BADGES.map((badge) => {
          const achieved = streak >= badge.minStreak
          const badgeIds = ['sprout', 'habit', 'growth', 'practice', 'master', 'legend']
          const permanent = earnedIds.has(badgeIds[BADGES.indexOf(badge)])
          return (
            <div
              key={badge.label}
              className={[
                'flex flex-1 flex-col items-center gap-1 transition-opacity',
                achieved ? 'opacity-100' : 'opacity-25',
              ].join(' ')}
            >
              <span className="text-xl leading-none">{badge.emoji}</span>
              <span className="text-[9px] leading-tight text-[#8a7570]">
                {badge.minStreak}일
              </span>
              {permanent && (
                <span className="text-[8px] text-primary-400 font-semibold">✓</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
