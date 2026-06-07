/**
 * 계절별 Hero 배너 이미지 매핑
 * - v1.2: 특별 이벤트 배너 (크리스마스, 설날, 추석 등) 추가 예정
 * - 이벤트 배너는 SEASON_IMAGES 위에 우선순위 레이어로 확장
 */
type Season = 'spring' | 'summer' | 'autumn' | 'winter'

const SEASON_IMAGES: Record<Season, string> = {
  spring: '/images/hero/spring-hero-banner-v1.png',
  summer: '/images/hero/summer-hero-banner-v1.png',
  autumn: '/images/hero/autumn-hero-banner-v1.png',
  winter: '/images/hero/winter-hero-banner-v1.png',
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1 // 1~12
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

export function HeroBanner() {
  const src = SEASON_IMAGES[getCurrentSeason()]

  return (
    <div className="mx-5 overflow-hidden rounded-2xl bg-warm-100 shadow-md">
      <img
        src={src}
        alt="오늘의 감사 배너"
        className="block w-full"
      />
    </div>
  )
}
