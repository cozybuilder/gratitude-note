import { useState } from 'react'

// ── 슬라이드 데이터 ──────────────────────────────────────────────
// 이미지: public/images/onboarding/ 에 저장된 PNG 파일을 사용합니다.
const SLIDES = [
  {
    image: '/images/onboarding/onboarding-01.png',
    title: '하루 3가지 감사',
    desc: '작은 감사가 큰 행복을 만듭니다.',
  },
  {
    image: '/images/onboarding/onboarding-02.png',
    title: '따뜻한 응원',
    desc: '기록한 감사의 순간을 바탕으로\n당신에게 힘이 되는 메시지를 전해드려요.',
  },
  {
    image: '/images/onboarding/onboarding-03.png',
    title: '작은 습관의 힘',
    desc: '매일 3가지를 기록하며\n더 행복한 나를 만들어가요.',
  },
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

      {/* ── 이미지 영역 (화면 상단 55%) ──────────────────────────── */}
      <div className="flex h-[55vh] w-full items-center justify-center overflow-hidden">
        <img
          key={current}
          src={slide.image}
          alt={slide.title}
          className="h-full w-full object-contain"
          draggable={false}
        />
      </div>

      {/* ── 하단 콘텐츠 영역 ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center px-8 pb-14 pt-6">

        {/* 제목 + 설명 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold text-[#3d2e26]">{slide.title}</h1>
          <p className="whitespace-pre-line text-base leading-relaxed text-[#8a7570]">
            {slide.desc}
          </p>
        </div>

        {/* 점 인디케이터 */}
        <div className="mb-6 flex gap-2">
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
          className="w-full max-w-xs rounded-2xl bg-primary-500 py-4 text-base font-semibold text-white shadow-md hover:bg-primary-600 active:scale-[0.98] transition-all"
        >
          {isLast ? '시작하기 🌿' : '다음'}
        </button>

        {/* 건너뛰기 (마지막 슬라이드에서는 숨김) */}
        {!isLast && (
          <button
            type="button"
            onClick={onComplete}
            className="mt-5 text-sm text-[#8a7570] hover:text-primary-500 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}
