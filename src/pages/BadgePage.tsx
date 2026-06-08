import { useNavigate } from 'react-router-dom'
import { getEarnedBadgeDetails } from '../utils/achievement'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

// 씨앗 포함 전체 로드맵
const ROADMAP = [
  { id: 'seed',     emoji: '🌰', label: '감사 씨앗',   minStreak: 0,   desc: '감사 여정의 시작. 첫 감사일기를 작성하면 자동 부여됩니다.' },
  { id: 'sprout',   emoji: '🌱', label: '감사 새싹',   minStreak: 7,   desc: '7일 연속 감사 기록 달성. 습관의 씨앗이 싹트고 있습니다.' },
  { id: 'habit',    emoji: '🍀', label: '감사 습관가', minStreak: 30,  desc: '30일 연속 달성. 감사가 일상의 일부가 되었습니다.' },
  { id: 'growth',   emoji: '🌳', label: '감사 성장가', minStreak: 60,  desc: '60일 연속 달성. 감사의 나무가 깊이 뿌리내리고 있습니다.' },
  { id: 'practice', emoji: '⭐', label: '감사 실천가', minStreak: 90,  desc: '90일 연속 달성. 3개월의 꾸준한 실천이 삶을 바꿉니다.' },
  { id: 'master',   emoji: '🏆', label: '감사 마스터', minStreak: 180, desc: '180일 연속 달성. 감사가 당신의 본성이 되었습니다.' },
  { id: 'legend',   emoji: '👑', label: '감사 레전드', minStreak: 365, desc: '365일 연속 달성. 1년간의 감사 여정을 완주한 전설적인 기록입니다.' },
]

export function BadgePage() {
  const navigate = useNavigate()
  const { notes } = useNotes()
  const streak = useStreak(notes)

  const earnedDetails = getEarnedBadgeDetails()
  const earnedIds = new Set(earnedDetails.map((d) => d.badge.id))

  // 씨앗은 항상 보유
  const isEarned = (id: string) => id === 'seed' || earnedIds.has(id)
  // 현재 단계 index
  const currentIdx = (() => {
    for (let i = ROADMAP.length - 1; i >= 0; i--) {
      if (streak >= ROADMAP[i].minStreak) return i
    }
    return 0
  })()

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
        <h1 className="text-base font-semibold text-[#3d2e26]">배지</h1>
      </header>

      <div className="flex flex-col gap-5 px-5 py-5 pb-28">

        {/* ── 1. 내 업적 배지 ───────────────────────────────────── */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-[#3d2e26]">🏅 내 업적 배지</h2>
          <div className="flex flex-col gap-2">
            {ROADMAP.map((badge) => {
              const earned = isEarned(badge.id)
              const isLegend = badge.id === 'legend'
              const isCurrent = ROADMAP.indexOf(badge) === currentIdx

              return (
                <div
                  key={badge.id}
                  className={[
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-opacity',
                    earned ? 'opacity-100' : 'opacity-35',
                    isLegend && earned
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'
                      : isCurrent
                      ? 'bg-primary-50 border border-primary-200'
                      : 'bg-warm-50',
                  ].join(' ')}
                >
                  <div className={[
                    'flex h-10 w-10 items-center justify-center rounded-full text-xl shrink-0',
                    isLegend && earned
                      ? 'bg-gradient-to-br from-yellow-300 to-amber-400'
                      : isCurrent
                      ? 'bg-primary-100'
                      : 'bg-warm-200',
                  ].join(' ')}>
                    {badge.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={[
                        'text-sm font-semibold',
                        isLegend && earned ? 'text-amber-700' : 'text-[#3d2e26]',
                      ].join(' ')}>
                        {badge.label}
                      </p>
                      {isCurrent && (
                        <span className="rounded-full bg-primary-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          현재
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8a7570]">
                      {badge.minStreak === 0 ? '시작 배지' : `${badge.minStreak}일 연속`}
                      {!earned && badge.minStreak > 0 && (
                        <span className="ml-1 text-primary-400">
                          · {badge.minStreak - streak}일 남음
                        </span>
                      )}
                    </p>
                  </div>
                  {earned && (
                    <span className="text-xs font-semibold text-primary-400 shrink-0">획득 ✓</span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 2. 배지 로드맵 ────────────────────────────────────── */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[#3d2e26]">🗺️ 배지 로드맵</h2>
          <div className="flex items-center justify-between px-1">
            {ROADMAP.map((badge, idx) => {
              const isCurr = idx === currentIdx
              const isPast = idx < currentIdx
              return (
                <div key={badge.id} className="flex flex-1 flex-col items-center gap-1">
                  {/* 연결선 (첫 번째 제외) */}
                  <div className="flex w-full items-center">
                    {idx > 0 && (
                      <div className={[
                        'h-px flex-1',
                        isPast || isCurr ? 'bg-primary-300' : 'bg-warm-200',
                      ].join(' ')} />
                    )}
                    <span className={[
                      'leading-none transition-all',
                      isCurr ? 'text-2xl' : isPast ? 'text-base' : 'text-sm opacity-30',
                    ].join(' ')}>
                      {badge.emoji}
                    </span>
                    {idx < ROADMAP.length - 1 && (
                      <div className={[
                        'h-px flex-1',
                        isPast ? 'bg-primary-300' : 'bg-warm-200',
                      ].join(' ')} />
                    )}
                  </div>
                  {/* 현재 단계 점 */}
                  <div className={[
                    'h-1.5 w-1.5 rounded-full',
                    isCurr ? 'bg-primary-500' : 'bg-transparent',
                  ].join(' ')} />
                </div>
              )
            })}
          </div>
          {/* 현재 단계 안내 */}
          <p className="mt-3 text-center text-xs text-[#8a7570]">
            현재{' '}
            <span className="font-semibold text-[#3d2e26]">
              {ROADMAP[currentIdx].emoji} {ROADMAP[currentIdx].label}
            </span>
            {currentIdx < ROADMAP.length - 1 && (
              <> · 다음 <span className="text-primary-500 font-semibold">{ROADMAP[currentIdx + 1].emoji} {ROADMAP[currentIdx + 1].label}</span>까지 {ROADMAP[currentIdx + 1].minStreak - streak}일</>
            )}
          </p>
        </section>

        {/* ── 3. 배지 설명 ──────────────────────────────────────── */}
        <section className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-[#3d2e26]">📖 배지 설명</h2>
          <div className="flex flex-col divide-y divide-warm-100">
            {ROADMAP.map((badge) => (
              <div key={badge.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 shrink-0 text-xl">{badge.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-[#3d2e26]">
                    {badge.label}
                    <span className="ml-2 text-xs font-normal text-[#8a7570]">
                      {badge.minStreak === 0 ? '시작 배지' : `${badge.minStreak}일 연속`}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#8a7570]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
