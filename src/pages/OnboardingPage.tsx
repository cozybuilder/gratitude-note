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
    /**
     * 외부: fixed inset-0, 뷰포트 전체, bg-[#FFF9F5]
     * 이미지보다 기기 화면이 세로로 더 길 때 남는 상하 여백을
     * 이미지 배경색과 동일한 크림으로 채워 자연스럽게 처리.
     */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF9F5]">

      {/**
       * 모바일 프레임
       * - w-full / max-w-[430px]  : 좌우 최대 폭 제한
       * - aspectRatio 941/1672    : 이미지 원본 비율 고정
       *   → object-contain 이 컨테이너를 딱 맞게 채우므로 letterbox 없음
       *   → 버튼이 항상 이미지 위에 overlay
       * - maxHeight 100dvh        : 화면보다 긴 컨테이너 방지
       * - overflow-hidden         : 안전 클립
       */}
      <div
        className="relative w-full max-w-[430px] overflow-hidden"
        style={{ aspectRatio: '941 / 1672', maxHeight: '100dvh' }}
      >

        {/* 이미지: 잘림 없이 원본 전체 표시 */}
        <img
          key={current}
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center"
          draggable={false}
        />

        {/* 버튼 / 인디케이터 — 이미지 위 overlay */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex flex-col items-center gap-3 px-6">

          {/* 점 인디케이터 */}
          <div className="flex gap-2 pb-1">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-primary-500' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* 다음 / 시작하기 버튼 */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-2xl bg-primary-500 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
          >
            {isLast ? '시작하기 🌿' : '다음'}
          </button>

          {/* 건너뛰기 (마지막 슬라이드에서는 숨김) */}
          {!isLast ? (
            <button
              type="button"
              onClick={onComplete}
              className="py-1 text-sm text-white/80 hover:text-white transition-colors drop-shadow"
            >
              건너뛰기
            </button>
          ) : (
            <div className="h-7" />
          )}
        </div>
      </div>
    </div>
  )
}
