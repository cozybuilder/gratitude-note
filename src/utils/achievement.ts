// ── 영구 업적 배지 시스템 ─────────────────────────────────────────
// 한 번 획득하면 streak이 낮아져도 사라지지 않는 영구 배지

const ACHIEVEMENT_KEY = 'gratitude_achievements'

// ── 배지 정의 (낮은 조건 → 높은 조건 순) ────────────────────────
export interface AchievementBadge {
  id: string
  emoji: string
  label: string
  minStreak: number
  isLegend: boolean
}

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  { id: 'sprout',   emoji: '🌱', label: '감사 새싹',   minStreak: 7,   isLegend: false },
  { id: 'habit',    emoji: '🌿', label: '감사 습관가', minStreak: 30,  isLegend: false },
  { id: 'growth',   emoji: '🌳', label: '감사 성장가', minStreak: 60,  isLegend: false },
  { id: 'practice', emoji: '⭐', label: '감사 실천가', minStreak: 90,  isLegend: false },
  { id: 'master',   emoji: '🏆', label: '감사 마스터', minStreak: 180, isLegend: false },
  { id: 'legend',   emoji: '👑', label: '감사 레전드', minStreak: 365, isLegend: true  },
]

// ── 저장된 업적 ───────────────────────────────────────────────────
export interface Achievement {
  badgeId: string
  earnedAt: string // ISO 8601
}

export function getAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_KEY)
    return raw ? (JSON.parse(raw) as Achievement[]) : []
  } catch {
    return []
  }
}

function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(achievements))
}

/**
 * 현재 streak 기준으로 새로 획득된 배지를 저장하고 반환합니다.
 * 이미 저장된 배지는 중복 저장하지 않습니다.
 */
export function checkAndSaveNewAchievements(streak: number): AchievementBadge[] {
  const existing = getAchievements()
  const existingIds = new Set(existing.map((a) => a.badgeId))

  const newBadges = ACHIEVEMENT_BADGES.filter(
    (b) => streak >= b.minStreak && !existingIds.has(b.id)
  )

  if (newBadges.length > 0) {
    const now = new Date().toISOString()
    saveAchievements([
      ...existing,
      ...newBadges.map((b) => ({ badgeId: b.id, earnedAt: now })),
    ])
  }

  return newBadges
}

/** 현재 streak 기준 최고 배지 반환 */
export function getCurrentBadge(streak: number): AchievementBadge | null {
  return (
    [...ACHIEVEMENT_BADGES].reverse().find((b) => streak >= b.minStreak) ?? null
  )
}

/** 다음 목표 배지 반환 (최고 달성 시 null) */
export function getNextTargetBadge(streak: number): AchievementBadge | null {
  return ACHIEVEMENT_BADGES.find((b) => streak < b.minStreak) ?? null
}

/** 영구 획득된 모든 배지 정보 반환 (획득 시각 포함) */
export function getEarnedBadgeDetails(): { badge: AchievementBadge; earnedAt: string }[] {
  const achievements = getAchievements()
  const achievementMap = new Map(achievements.map((a) => [a.badgeId, a.earnedAt]))
  return ACHIEVEMENT_BADGES.filter((b) => achievementMap.has(b.id)).map((b) => ({
    badge: b,
    earnedAt: achievementMap.get(b.id)!,
  }))
}

/** 👑 감사 레전드 달성 여부 */
export function isLegendAchieved(): boolean {
  const achievements = getAchievements()
  return achievements.some((a) => a.badgeId === 'legend')
}
