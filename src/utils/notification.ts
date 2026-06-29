// ── 감사일기 알림 유틸리티 ────────────────────────────────────────
// Android 앱: @capacitor/local-notifications (앱 종료 후에도 OS가 발송)
// Web/PWA:    Web Notification API (앱 실행 중에만 동작)

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { getTodayGratitudeDate } from './date'
import { getNotes } from './storage'

// ── 플랫폼 감지 ───────────────────────────────────────────────────
const isNative = Capacitor.isNativePlatform()

// ── localStorage 키 ───────────────────────────────────────────────
const SESSION_KEY    = 'notif_scheduled_date' // 하루 1회만 스케줄 등록 (Web 전용)

/** 저녁 6시 알림 ON/OFF (기본값 true) */
export const NOTIF_6PM_KEY  = 'notif_6pm'
/** 저녁 10시 알림 ON/OFF (기본값 true) */
export const NOTIF_10PM_KEY = 'notif_10pm'

// ── 알림 ID 상수 ──────────────────────────────────────────────────
const NOTIF_ID_6PM  = 601
const NOTIF_ID_10PM = 1001

// ── Web 전용: 시간대별 알림 문구 ─────────────────────────────────
const WEB_MESSAGES_6PM = [
  '오늘 감사한 일 3가지를 적어보셨나요?',
  '작은 감사가 행복을 만듭니다.',
  '지금 잠깐 감사일기를 열어보세요.',
]
const WEB_MESSAGES_10PM = [
  '오늘 하루 감사했던 순간은 무엇인가요?',
  '하루를 마무리하며 감사를 남겨보세요.',
  '오늘의 행복을 기록해보세요.',
]

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── 설정 헬퍼 ────────────────────────────────────────────────────

export function get6pmEnabled(): boolean {
  const v = localStorage.getItem(NOTIF_6PM_KEY)
  return v === null ? true : v === 'true'
}

export function get10pmEnabled(): boolean {
  const v = localStorage.getItem(NOTIF_10PM_KEY)
  return v === null ? true : v === 'true'
}

export function set6pmEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_6PM_KEY, String(enabled))
  sessionStorage.removeItem(SESSION_KEY)
  scheduleDailyReminders()
}

export function set10pmEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIF_10PM_KEY, String(enabled))
  sessionStorage.removeItem(SESSION_KEY)
  scheduleDailyReminders()
}

// ── 오늘 기록 여부 확인 ───────────────────────────────────────────
function isTodayWritten(): boolean {
  const today = getTodayGratitudeDate()
  return getNotes().some((n) => n.gratitudeDate === today)
}

// ─────────────────────────────────────────────────────────────────
// Android Native: Capacitor Local Notifications
// ─────────────────────────────────────────────────────────────────

async function scheduleNativeReminders(): Promise<void> {
  // 기존 예약 알림 전부 취소 후 재등록 (설정 변경 반영)
  try {
    const pending = await LocalNotifications.getPending()
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications })
    }
  } catch {
    // 취소 실패 무시
  }

  const toSchedule: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = []

  if (get6pmEnabled()) {
    toSchedule.push({
      id: NOTIF_ID_6PM,
      title: '오늘의 감사일기',
      body: '오늘 감사했던 일 3가지를 기록해보세요.',
      schedule: {
        // Exact Alarm 미사용 — 매일 반복 방식
        on: { hour: 18, minute: 0 },
        allowWhileIdle: true,
      },
      channelId: 'gratitude-reminder',
    })
  }

  if (get10pmEnabled()) {
    toSchedule.push({
      id: NOTIF_ID_10PM,
      title: '잠들기 전 감사',
      body: '오늘 하루를 따뜻하게 마무리해보세요.',
      schedule: {
        on: { hour: 22, minute: 0 },
        allowWhileIdle: true,
      },
      channelId: 'gratitude-reminder',
    })
  }

  if (toSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications: toSchedule })
    } catch {
      // 스케줄 실패 무시 (권한 없음 등)
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// Web/PWA: Web Notification API (앱 실행 중에만 동작)
// ─────────────────────────────────────────────────────────────────

function showWebNotification(messages: string[]): void {
  if (isTodayWritten()) return
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  new Notification('감사일기 🌿', {
    body: pick(messages),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
  })
}

function scheduleWebAt(targetHour: number, messages: string[]): void {
  const now    = new Date()
  const target = new Date(now)
  target.setHours(targetHour, 0, 0, 0)

  const ms = target.getTime() - now.getTime()
  if (ms <= 0) return

  setTimeout(() => showWebNotification(messages), ms)
}

function scheduleWebReminders(): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  const today = getTodayGratitudeDate()
  const alreadyScheduled = sessionStorage.getItem(SESSION_KEY)
  if (alreadyScheduled === today) return

  sessionStorage.setItem(SESSION_KEY, today)

  if (get6pmEnabled())  scheduleWebAt(18, WEB_MESSAGES_6PM)
  if (get10pmEnabled()) scheduleWebAt(22, WEB_MESSAGES_10PM)
}

// ─────────────────────────────────────────────────────────────────
// 공통 인터페이스
// ─────────────────────────────────────────────────────────────────

/**
 * 앱 마운트 시 호출.
 * - Android: Capacitor LocalNotifications 스케줄 등록
 * - Web/PWA: setTimeout 기반 스케줄 등록
 */
export function scheduleDailyReminders(): void {
  if (isNative) {
    scheduleNativeReminders()
  } else {
    scheduleWebReminders()
  }
}

/**
 * 알림 권한 요청.
 * - Android: LocalNotifications.requestPermissions()
 * - Web/PWA: Notification.requestPermission()
 * 권한 허용 후 즉시 스케줄 등록.
 */
export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (isNative) {
    try {
      const result = await LocalNotifications.requestPermissions()
      const granted = result.display === 'granted'
      if (granted) {
        await scheduleNativeReminders()
      }
      return granted ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  } else {
    if (typeof Notification === 'undefined') return 'denied'
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      sessionStorage.removeItem(SESSION_KEY)
      scheduleWebReminders()
    }
    return perm
  }
}

/**
 * 현재 알림 권한 상태.
 * - Android: LocalNotifications.checkPermissions()
 * - Web/PWA: Notification.permission (또는 'unsupported')
 */
export type NotifPermStatus = 'granted' | 'denied' | 'default' | 'unsupported'

export async function getNotificationPermissionAsync(): Promise<NotifPermStatus> {
  if (isNative) {
    try {
      const result = await LocalNotifications.checkPermissions()
      if (result.display === 'granted') return 'granted'
      if (result.display === 'denied')  return 'denied'
      return 'default'
    } catch {
      return 'denied'
    }
  } else {
    if (typeof Notification === 'undefined') return 'unsupported'
    return Notification.permission as NotifPermStatus
  }
}

/** 동기 버전 (초기 렌더 전용, Web only fallback) */
export function getNotificationPermission(): NotifPermStatus {
  if (isNative) return 'default' // 비동기로 실제 값 확인 필요
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission as NotifPermStatus
}

/** Android Native 여부 (SettingsPage 등에서 플랫폼 분기 용도) */
export const isNativePlatform = isNative

/**
 * [진단용] 1분 뒤 테스트 알림 예약.
 * Android Native 전용. 배포 후에는 버튼을 숨김 처리.
 */
export async function scheduleTestNotification(): Promise<void> {
  if (!isNative) return
  const at = new Date(Date.now() + 60 * 1000)
  try {
    await LocalNotifications.schedule({
      notifications: [{
        id: 9999,
        title: '감사일기 테스트 알림',
        body: '알림이 정상적으로 동작합니다 🌿',
        schedule: { at, allowWhileIdle: true },
        channelId: 'gratitude-reminder',
      }],
    })
  } catch {
    // 권한 없음 또는 스케줄 실패 무시
  }
}
