import { useEffect } from 'react'
import type { AchievementBadge } from '../../utils/achievement'
import { useAndroidBack } from '../../hooks/useAndroidBack'

interface Props {
  badge: AchievementBadge
  streak: number
  onClose: () => void
  /** AI 특별 축하/회고 메시지. 없으면 기존 고정 문구만 표시. */
  celebrationMessage?: string
}

export function BadgeCelebrationModal({ badge, streak, onClose, celebrationMessage }: Props) {
  useAndroidBack(onClose)

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const isLegend = badge.isLegend

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 시트 */}
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-warm-50 px-5 pb-10 pt-6 shadow-xl">
        {/* 핸들 바 */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-warm-300" />

        {/* 배지 아이콘 */}
        <div className="mb-4 flex justify-center">
          <div
            className={[
              'flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-md',
              isLegend
                ? 'bg-gradient-to-br from-yellow-300 to-amber-400'
                : 'bg-gradient-to-br from-primary-100 to-warm-200',
            ].join(' ')}
          >
            {badge.emoji}
          </div>
        </div>

        {/* 제목 */}
        <p className="mb-1 text-center text-xs font-medium uppercase tracking-widest text-[#8a7570]">
          새 배지 획득!
        </p>
        <h2
          className={[
            'mb-1 text-center text-2xl font-bold',
            isLegend ? 'text-amber-600' : 'text-[#3d2e26]',
          ].join(' ')}
        >
          {badge.label}
        </h2>
        <p className="mb-5 text-center text-sm text-[#8a7570]">
          {streak}일 연속 감사 기록 달성 🎉
        </p>

        {/* 레전드 특별 문구 */}
        {isLegend && (
          <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-center text-sm leading-relaxed text-amber-700">
              👑 365일 동안 감사의 습관을 이어온 당신은{'\n'}
              이미 삶을 바라보는 시선이 달라지고 있습니다.{'\n'}
              명예의 전당에 입성하신 것을 축하드립니다!
            </p>
          </div>
        )}

        {/* 일반 축하 문구 */}
        {!isLegend && (
          <div className="mb-5 rounded-xl bg-warm-100 px-4 py-3">
            <p className="text-center text-sm leading-relaxed text-[#8a7570]">
              ✨ 꾸준한 감사의 습관이{'\n'}
              당신의 삶을 조금씩 바꾸고 있습니다.
            </p>
          </div>
        )}

        {/* AI 특별 축하/회고 메시지 */}
        {celebrationMessage && (
          <div
            className={[
              'mb-5 rounded-xl border px-4 py-3',
              isLegend
                ? 'border-amber-200 bg-amber-50'
                : 'border-primary-100 bg-primary-50',
            ].join(' ')}
          >
            <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-widest text-[#c4b8b4]">
              AI 회고 메시지
            </p>
            <p
              className={[
                'text-center text-sm leading-relaxed',
                isLegend ? 'text-amber-700' : 'text-[#6b5b53]',
              ].join(' ')}
            >
              {celebrationMessage}
            </p>
          </div>
        )}

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className={[
            'w-full rounded-2xl py-4 text-base font-semibold text-white transition-colors',
            isLegend
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-primary-500 hover:bg-primary-600',
          ].join(' ')}
        >
          감사합니다 🌿
        </button>
      </div>
    </div>
  )
}
