import { useState } from 'react'

// ── 슬라이드 데이터 ──────────────────────────────────────────────
// 이미지 자체가 완성형 화면이므로 별도 텍스트 없이 이미지만 사용합니다.
const SLIDES = [
  { image: '/images/onboarding/onboarding-01.png' },
  { image: '/images/onboarding/onboarding-02.png' },
  { image: '/images/onboarding/onboarding-03.png' },
] as const

interface OnboardingPageProps {
  onComplete: () => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]
  const isLast = current === SLIDES.length - 1

  function handleNext() {
    if (isLast) {
      onComplete()
    } else {
      setCurrent((c) => c + 1)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-warm-50">

      {/* ── 이미지 영역 (flex-1 — 버튼 영역 제외한 전체) ─────────── */}
      <div className="min-h-0 flex-1 w-full overflow-hidden">
        <img
          key={current}
          src={slide.image}
          alt=""
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>

      {/* ── 하단 버튼 영역 (전체 화면의 약 15~20%) ──────────────── */}
      <div className="flex flex-col items-center gap-3 px-8 pb-10 pt-4">

        {/* 점 인디케이터 */}
        <div className="flex gap-2 pb-1">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary-500' : 'w-2 bg-warm-300'
              }`}
            />
          ))}
        </div>

        {/* 다음 / 시작하기 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-2xl bg-primary-500 py-4 text-base font-semibold text-white shadow-md hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          {isLast ? '시작하기 🌿' : '다음'}
        </button>

        {/* 건너뛰기 (마지막 슬라이드에서는 숨김) */}
        {!isLast ? (
          <button
            type="button"
            onClick={onComplete}
            className="py-1 text-sm text-[#8a7570] hover:text-primary-500 transition-colors"
          >
            건너뛰기
          </button>
        ) : (
          // 마지막 슬라이드 — 건너뛰기 공간 유지로 레이아웃 안정
          <div className="h-7" />
        )}
      </div>
    </div>
  )
}
