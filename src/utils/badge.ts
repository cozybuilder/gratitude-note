// ── 연속 작성 배지 유틸리티 ──────────────────────────────────────
// StreakBadge 컴포넌트(통계 페이지)에서 사용하는 표시용 배지
// 영구 업적 배지는 src/utils/achievement.ts 참고

export interface BadgeInfo {
  emoji: string
  label: string
  minStreak: number
}

/** 배지 목록 (낮은 조건 → 높은 조건 순) */
export const BADGES: BadgeInfo[] = [
  { emoji: '🌱', label: '감사 새싹',   minStreak: 7   },
  { emoji: '🍀', label: '감사 습관가', minStreak: 30  },
  { emoji: '🌳', label: '감사 성장가', minStreak: 60  },
  { emoji: '⭐', label: '감사 실천가', minStreak: 90  },
  { emoji: '🏆', label: '감사 마스터', minStreak: 180 },
  { emoji: '👑', label: '감사 레전드', minStreak: 365 },
]

/** 현재 streak에서 획득한 최고 배지 반환 (없으면 null) */
export function getEarnedBadge(streak: number): BadgeInfo | null {
  return [...BADGES].reverse().find((b) => streak >= b.minStreak) ?? null
}

/** 다음 달성 목표 배지 반환 (이미 최고 배지면 null) */
export function getNextBadge(streak: number): BadgeInfo | null {
  return BADGES.find((b) => streak < b.minStreak) ?? null
}
