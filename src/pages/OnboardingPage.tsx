import { useState } from 'react'

// ── 슬라이드 데이터 ──────────────────────────────────────────────
const SLIDES = [
  {
    emoji: '🙏',
    bg: 'from-primary-400 to-primary-600',
    title: '하루 3가지 감사',
    desc: '작은 감사가 큰 행복을 만듭니다.',
  },
  {
    emoji: '📅',
    bg: 'from-brown-400 to-brown-600',
    title: '감사 습관 만들기',
    desc: '매일 기록하며 긍정적인 삶을 만들어보세요.',
  },
  {
    emoji: '📓',
    bg: 'from-primary-500 to-brown-500',
    title: '나만의 감사노트',
    desc: '기록하고 돌아보고 성장하세요.',
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
      {/* 상단 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-8 pt-16 text-center">
        {/* 아이콘 원 */}
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${slide.bg} text-6xl shadow-lg`}
        >
          {slide.emoji}
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[#3d2e26]">{slide.title}</h1>
          <p className="text-base leading-relaxed text-[#8a7570]">{slide.desc}</p>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="flex flex-col items-center gap-8 px-8 pb-14 pt-6">
        {/* 점 인디케이터 */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-primary-500'
                  : 'w-2 bg-warm-300'
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
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
            className="text-sm text-[#8a7570] hover:text-primary-500 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}
