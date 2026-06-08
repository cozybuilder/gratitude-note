import { getCurrentBadge, getNextTargetBadge } from '../../utils/achievement'

interface Props {
  streak: number
}

export function BadgeStatusCard({ streak }: Props) {
  const current = getCurrentBadge(streak)
  const next = getNextTargetBadge(streak)

  // 연속 기록이 없고 배지도 없으면 최소 안내만 표시
  if (streak === 0 && !current) {
    return (
      <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold text-[#8a7570] mb-3">나의 배지</p>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-100 text-2xl">
            🌱
          </div>
          <div>
            <p className="text-sm font-medium text-[#3d2e26]">첫 감사부터 시작해보세요</p>
            <p className="text-xs text-[#8a7570]">7일 연속 작성 시 첫 배지 획득!</p>
          </div>
        </div>
      </div>
    )
  }

  const isLegend = current?.isLegend ?? false

  return (
    <div
      className={[
        'rounded-2xl px-5 py-4 shadow-sm',
        isLegend
          ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200'
          : 'bg-white',
      ].join(' ')}
    >
      <p className="mb-3 text-xs font-semibold text-[#8a7570]">나의 배지</p>

      <div className="grid grid-cols-2 gap-3">
        {/* 현재 배지 */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#8a7570]">현재 배지</p>
          {current ? (
            <div className="flex items-center gap-2">
              <span
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-full text-xl shrink-0',
                  isLegend
                    ? 'bg-gradient-to-br from-yellow-300 to-amber-400'
                    : 'bg-warm-100',
                ].join(' ')}
              >
                {current.emoji}
              </span>
              <span
                className={[
                  'text-sm font-semibold leading-tight',
                  isLegend ? 'text-amber-700' : 'text-[#3d2e26]',
                ].join(' ')}
              >
                {current.label}
              </span>
            </div>
          ) : (
            <p className="text-sm text-[#8a7570]">아직 없음</p>
          )}
        </div>

        {/* 연속 기록 */}
        <div className="flex flex-col gap-1">
          <p className="text-xs text-[#8a7570]">연속 기록</p>
          <p className="text-xl font-bold text-[#3d2e26]">
            🔥 {streak}
            <span className="ml-0.5 text-sm font-normal text-[#8a7570]">일</span>
          </p>
        </div>
      </div>

      {/* 다음 배지 */}
      {next && (
        <div className="mt-3 rounded-xl bg-warm-100 px-3 py-2">
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

      {/* 레전드 달성 */}
      {!next && isLegend && (
        <div className="mt-3 rounded-xl bg-amber-100 px-3 py-2 border border-amber-200">
          <p className="text-xs text-amber-700 font-medium text-center">
            👑 명예의 전당 입성 완료!
          </p>
        </div>
      )}
    </div>
  )
}
