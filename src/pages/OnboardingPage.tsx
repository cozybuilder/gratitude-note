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
    // 뷰포트 전체 fixed + cream 배경 — PC에서 모바일 프레임 밖 여백 표시
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-[#2b1c13]">

      {/* ── 모바일 프레임 (최대 430px) ──────────────────────────── */}
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-[#FFF9F5]">

        {/* ── 이미지: cover로 화면 전체를 자연스럽게 채움 ──────────
            9:16 이미지를 9:19~20 뷰포트에서 표시할 때
            object-contain 을 사용하면 위아래에 크림 여백이 생겨
            이미지가 버튼 위에 올라오지 않습니다.
            object-cover 를 사용하면 좌우 ~4% 만 미세하게 크롭되며
            세로(중요 콘텐츠)는 완전히 보존됩니다.          ─── */}
        <img
          key={current}
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />

        {/* ── 버튼 / 인디케이터 오버레이 (이미지 위에 표시) ───── */}
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
