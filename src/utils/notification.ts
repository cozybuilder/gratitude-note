// ── PWA 감사일기 알림 유틸리티 ────────────────────────────────────
// 오늘 기록을 작성하지 않은 경우 18:00 / 22:00 KST 알림 발송

import { getTodayGratitudeDate } from './date'
import { getNotes } from './storage'

// ── localStorage 키 ────────────────────────────────────────────────
const SESSION_KEY    = 'notif_scheduled_date' // 하루 1회만 스케줄 등록

/** 저녁 6시 알림 ON/OFF (기본값 true) */
export const NOTIF_6PM_KEY  = 'notif_6pm'
/** 저녁 10시 알림 ON/OFF (기본값 true) */
export const NOTIF_10PM_KEY = 'notif_10pm'

// ── 시간대별 알림 문구 ─────────────────────────────────────────────
/** 18:00 알림 문구 */
const MESSAGES_6PM = [
  '오늘 감사한 일 3가지를 적어보셨나요?',
  '작은 감사가 행복을 만듭니다.',
  '지금 잠깐 감사일기를 열어보세요.',
]

/** 22:00 알림 문구 */
const MESSAGES_10PM = [
  '오늘 하루 감사했던 순간은 무엇인가요?',
  '하루를 마무리하며 감사를 남겨보세요.',
  '오늘의 행복을 기록해보세요.',
]

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── 알림 ON/OFF 설정 헬퍼 ─────────────────────────────────────────

/** 저녁 6시 알림 활성 여부 (기본 ON) */
export function get6pmEnabled(): boolean {
  const v = localStorage.getItem(NOTIF_6PM_KEY)
  return v === null ? true : v === 'true'
}

/** 저녁 10시 알림 활성 여부 (기본 ON) */
export function get10pmEnabled(): boolean {
  const v = localStorage.getItem(NOTIF_10PM_KEY)
  return v === null ? true : v === 'true'
}

export function set6pmEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_6PM_KEY, String(enabled))
  // 설정 변경 시 당일 스케줄 재등록
  sessionStorage.removeItem(SESSION_KEY)
  scheduleDailyReminders()
}

export function set10pmEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_10PM_KEY, String(enabled))
  sessionStorage.removeItem(SESSION_KEY)
  scheduleDailyReminders()
}

// ── 알림 발송 ─────────────────────────────────────────────────────

/** 오늘 이미 감사일기를 작성했는지 확인 */
function isTodayWritten(): boolean {
  const today = getTodayGratitudeDate()
  const notes = getNotes()
  return notes.some((n) => n.gratitudeDate === today)
}

/** 알림 1개 발송 */
function showNotification(messages: string[]): void {
  if (isTodayWritten()) return
  if (Notification.permission !== 'granted') return

  new Notification('감사일기 🌿', {
    body: pick(messages),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  })
}

/** ms 후 알림을 예약하는 setTimeout 래퍼 (0 이하면 무시) */
function scheduleAt(targetHour: number, messages: string[]): void {
  const now    = new Date()
  const target = new Date(now)
  target.setHours(targetHour, 0, 0, 0)

  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return // 이미 지난 시각

  setTimeout(() => showNotification(messages), ms)
}

/**
 * 앱 마운트 시 호출.
 * - 오늘 날짜 기준으로 하루 1회만 스케줄 등록
 * - 각 시간대 알림 ON/OFF 설정 반영
 */
export function scheduleDailyReminders(): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  const today = getTodayGratitudeDate()
  const alreadyScheduled = sessionStorage.getItem(SESSION_KEY)
  if (alreadyScheduled === today) return

  sessionStorage.setItem(SESSION_KEY, today)

  if (get6pmEnabled())  scheduleAt(18, MESSAGES_6PM)
  if (get10pmEnabled()) scheduleAt(22, MESSAGES_10PM)
}

/** 알림 권한 요청 → 허용되면 즉시 스케줄 등록 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied'

  const perm = await Notification.requestPermission()
  if (perm === 'granted') {
    sessionStorage.removeItem(SESSION_KEY) // 강제 재등록
    scheduleDailyReminders()
  }
  return perm
}

/** 현재 권한 상태 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}
