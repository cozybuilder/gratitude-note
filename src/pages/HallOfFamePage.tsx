import { useNavigate } from 'react-router-dom'
import { ACHIEVEMENT_BADGES, getEarnedBadgeDetails, isLegendAchieved } from '../utils/achievement'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function HallOfFamePage() {
  const navigate = useNavigate()
  const { notes } = useNotes()
  const streak = useStreak(notes)
  const legendAchieved = isLegendAchieved()
  const earnedDetails = getEarnedBadgeDetails()

  return (
    <div className="flex min-h-svh flex-col bg-warm-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-warm-100 px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-warm-200 transition-colors"
          aria-label="뒤로가기"
        >
          <span className="text-lg text-[#3d2e26]">‹</span>
        </button>
        <h1 className="text-base font-semibold text-[#3d2e26]">명예의 전당</h1>
      </header>

      <div className="flex flex-col gap-5 px-5 py-6 pb-28">

        {/* 타이틀 배너 */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 px-5 py-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">👑</div>
          <h2 className="mb-1 text-lg font-bold text-amber-700">명예의 전당</h2>
          <p className="text-sm leading-relaxed text-amber-600">
            365일 동안 감사 습관을 이어간{'\n'}
            전설의 감사인들이 이곳에 기록됩니다.
          </p>
        </div>

        {/* 레전드 달성 현황 */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[#3d2e26]">
            👑 감사 레전드 달성 현황
          </h3>
          {legendAchieved ? (
            <div className="rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 px-4 py-4 text-center">
              <p className="text-2xl mb-2">🎊</p>
              <p className="text-sm font-bold text-amber-700">당신이 첫 번째 감사 레전드입니다!</p>
              <p className="mt-1 text-xs text-amber-600">365일 연속 감사 기록을 달성했습니다.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-warm-50 border border-warm-200 px-4 py-4 text-center">
              <p className="text-2xl mb-2">🌱</p>
              <p className="text-sm text-[#8a7570]">
                아직 첫 번째 감사 레전드가{'\n'}탄생하지 않았습니다.
              </p>
              <p className="mt-2 text-xs text-primary-500 font-medium">
                현재 {streak}일 연속 — {Math.max(0, 365 - streak)}일 남았습니다
              </p>
            </div>
          )}
        </section>

        {/* 내 업적 배지 */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[#3d2e26]">🏅 내 업적 배지</h3>
          {earnedDetails.length === 0 ? (
            <p className="text-sm text-center text-[#8a7570] py-3">
              아직 획득한 배지가 없습니다.{'\n'}
              7일 연속 작성으로 첫 배지를 획득하세요!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {earnedDetails.map(({ badge, earnedAt }) => {
                const date = new Date(earnedAt).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })
                return (
                  <div
                    key={badge.id}
                    className={[
                      'flex items-center gap-3 rounded-xl px-4 py-3',
                      badge.isLegend
                        ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                        : 'bg-warm-50',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex h-10 w-10 items-center justify-center rounded-full text-xl shrink-0',
                        badge.isLegend
                          ? 'bg-gradient-to-br from-yellow-300 to-amber-400'
                          : 'bg-warm-200',
                      ].join(' ')}
                    >
                      {badge.emoji}
                    </div>
                    <div className="flex-1">
                      <p
                        className={[
                          'text-sm font-semibold',
                          badge.isLegend ? 'text-amber-700' : 'text-[#3d2e26]',
                        ].join(' ')}
                      >
                        {badge.label}
                      </p>
                      <p className="text-xs text-[#8a7570]">{badge.minStreak}일 연속 · {date} 획득</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* 전체 배지 로드맵 */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-[#3d2e26]">🗺️ 배지 로드맵</h3>
          <div className="flex flex-col gap-2">
            {ACHIEVEMENT_BADGES.map((badge) => {
              const achieved = earnedDetails.some((d) => d.badge.id === badge.id)
              return (
                <div
                  key={badge.id}
                  className={[
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-opacity',
                    achieved ? 'opacity-100' : 'opacity-40',
                    badge.isLegend && achieved
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                      : 'bg-warm-50',
                  ].join(' ')}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#3d2e26]">{badge.label}</p>
                    <p className="text-xs text-[#8a7570]">{badge.minStreak}일 연속</p>
                  </div>
                  {achieved && (
                    <span className="text-xs font-semibold text-primary-500">획득 ✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
