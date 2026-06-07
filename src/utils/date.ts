const GRATITUDE_DAY_START_HOUR = 4 // 오전 04:00 기준

/**
 * 새벽 4시 기준 감사일 날짜를 반환합니다.
 * 00:00~03:59 → 전날 날짜
 * 04:00~23:59 → 당일 날짜
 *
 * ⚠️ toISOString()은 UTC 기준이므로 KST(UTC+9)에서 날짜가 밀립니다.
 *    로컬 날짜 컴포넌트(getFullYear/getMonth/getDate)를 사용합니다.
 */
export function getGratitudeDate(date: Date = new Date()): string {
  const adjusted = new Date(date)
  adjusted.setHours(adjusted.getHours() - GRATITUDE_DAY_START_HOUR)
  // 로컬 타임존 기준 날짜 포매팅 (KST 보장)
  const y = adjusted.getFullYear()
  const m = String(adjusted.getMonth() + 1).padStart(2, '0')
  const d = String(adjusted.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 현재 시각 기준 오늘의 감사일 날짜 */
export function getTodayGratitudeDate(): string {
  return getGratitudeDate(new Date())
}
