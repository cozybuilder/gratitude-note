const GRATITUDE_DAY_START_HOUR = 4 // 오전 04:00 기준

/**
 * 새벽 4시 기준 감사일 날짜를 반환합니다.
 * 00:00~03:59 → 전날 날짜
 * 04:00~23:59 → 당일 날짜
 */
export function getGratitudeDate(date: Date = new Date()): string {
  const adjusted = new Date(date)
  adjusted.setHours(adjusted.getHours() - GRATITUDE_DAY_START_HOUR)
  return adjusted.toISOString().slice(0, 10)
}

/** 현재 시각 기준 오늘의 감사일 날짜 */
export function getTodayGratitudeDate(): string {
  return getGratitudeDate(new Date())
}
