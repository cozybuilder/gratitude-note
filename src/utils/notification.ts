// ── PWA 감사일기 알림 유틸리티 ────────────────────────────────────
// 오늘 기록을 작성하지 않은 경우 18:00 / 22:00 KST 알림 발송

import { getTodayGratitudeDate } from './date'
import { getNotes } from './storage'

const SESSION_KEY = 'notif_scheduled_date' // 하루 1회만 스케줄 등록

// ── 알림 문구 (30가지 랜덤) ───────────────────────────────────────
const MESSAGES = [
  '오늘 감사한 일 3가지를 남겨보세요 🌱',
  '작은 감사가 큰 행복을 만듭니다 😊',
  '오늘 하루도 수고하셨습니다. 감사 한 줄 남겨볼까요?',
  '연속 기록이 끊어지기 전에 작성해보세요 🔥',
  '오늘의 감사가 내일의 행복이 됩니다.',
  '감사는 삶을 바꾸는 가장 작은 습관입니다.',
  '오늘 감사한 일을 떠올려보세요.',
  '행복은 감사에서 시작됩니다.',
  '당신의 감사 기록이 기다리고 있습니다.',
  '오늘도 감사의 씨앗을 심어보세요.',
  '지금 떠오르는 감사 한 가지는 무엇인가요?',
  '바쁜 하루 속에서도 감사는 남길 수 있습니다.',
  '감사할 이유를 찾는 순간 하루가 달라집니다.',
  '감사 습관은 인생 최고의 투자입니다.',
  '잠들기 전 감사 세 가지를 적어보세요.',
  '오늘의 행복을 기록으로 남겨보세요.',
  '감사의 힘은 생각보다 강합니다.',
  '좋은 하루의 마무리는 감사입니다.',
  '지금 이 순간도 감사할 이유가 있습니다.',
  '당신의 연속 기록을 응원합니다.',
  '감사 한 줄이 삶을 바꿀 수 있습니다.',
  '오늘도 감사 챌린지 성공에 도전해보세요.',
  '작은 행복을 놓치지 마세요.',
  '오늘 하루 가장 좋았던 순간은 언제였나요?',
  '감사를 기록하는 사람은 행복을 발견합니다.',
  '오늘도 스스로를 칭찬해 주세요.',
  '당신은 생각보다 많은 것을 이루고 있습니다.',
  '하루 1분, 감사로 채워보세요.',
  '행복을 찾지 말고 감사부터 적어보세요.',
  '오늘의 감사가 쌓여 인생의 자산이 됩니다.',
]

function randomMessage(): string {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
}

/** 오늘 이미 감사일기를 작성했는지 확인 */
function isTodayWritten(): boolean {
  const today = getTodayGratitudeDate()
  const notes = getNotes()
  return notes.some((n) => n.gratitudeDate === today)
}

/** 알림 1개 발송 */
function showNotification(): void {
  if (isTodayWritten()) return
  if (Notification.permission !== 'granted') return

  new Notification('감사일기 🌿', {
    body: randomMessage(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  })
}

/** ms 후 알림을 예약하는 setTimeout 래퍼 (0 이하면 무시) */
function scheduleAt(targetHour: number, targetMinute = 0): void {
  const now = new Date()
  const target = new Date(now)
  target.setHours(targetHour, targetMinute, 0, 0)

  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return // 이미 지난 시각

  setTimeout(showNotification, ms)
}

/**
 * 앱 마운트 시 호출.
 * - 오늘 날짜 기준으로 하루 1회만 스케줄 등록
 * - 18:00 / 22:00 KST (로컬 타임 기준)
 */
export function scheduleDailyReminders(): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  const today = getTodayGratitudeDate()
  const alreadyScheduled = sessionStorage.getItem(SESSION_KEY)
  if (alreadyScheduled === today) return

  sessionStorage.setItem(SESSION_KEY, today)
  scheduleAt(18, 0)
  scheduleAt(22, 0)
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
