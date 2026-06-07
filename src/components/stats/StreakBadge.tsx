import { BADGES, getEarnedBadge, getNextBadge } from '../../utils/badge'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const earned = getEarnedBadge(streak)
  const next = getNextBadge(streak)

  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
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
            <p className="text-base font-bold text-[#3d2e26]">
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

      {/* 배지 진행 막대 */}
      <div className="flex items-end justify-between gap-1">
        {[...BADGES].reverse().map((badge) => {
          const achieved = streak >= badge.minStreak
          return (
            <div
              key={badge.label}
              className={`flex flex-1 flex-col items-center gap-1 transition-opacity ${
                achieved ? 'opacity-100' : 'opacity-25'
              }`}
            >
              <span className="text-xl leading-none">{badge.emoji}</span>
              <span className="text-[10px] leading-tight text-[#8a7570]">
                {badge.minStreak}일
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
