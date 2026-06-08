import { useEffect, useRef, useState } from 'react'
import {
  checkAndSaveNewAchievements,
  getAchievements,
  ACHIEVEMENT_BADGES,
  type AchievementBadge,
  type AchievementExtras,
} from '../utils/achievement'
import { generateBadgeCelebrationMessageWithApi } from '../utils/ai'
import type { Note } from '../types/note'

/**
 * streak 변화 시 새 배지를 감지하고 축하 모달용 상태를 반환합니다.
 * - newBadge: 이번 세션에서 처음 획득한 최고 배지 (없으면 null)
 * - celebrationMessage: 해당 배지에 대한 AI 특별 축하/회고 메시지
 * - clearNewBadge: 모달 닫기 후 호출
 */
export function useAchievements(streak: number, notes: Note[]) {
  const [newBadge, setNewBadge] = useState<AchievementBadge | null>(null)
  const [celebrationMessage, setCelebrationMessage] = useState<string>('')
  const prevStreak = useRef<number | null>(null)

  useEffect(() => {
    // 앱 초기 로드 시에는 축하 모달 표시 안 함 (prevStreak === null)
    if (prevStreak.current === null) {
      prevStreak.current = streak
      // 저장 누락된 배지가 있으면 조용히 저장만 함 (메시지 없이)
      checkAndSaveNewAchievements(streak)
      return
    }

    // streak이 실제로 증가했을 때만 체크
    if (streak > prevStreak.current) {
      // 새로 획득될 배지를 미리 파악 (extras 생성을 위해 저장 전 조회)
      const existingAchievements = getAchievements()
      const existingIds = new Set(existingAchievements.map((a) => a.badgeId))
      const willGain = ACHIEVEMENT_BADGES.filter(
        (b) => streak >= b.minStreak && !existingIds.has(b.id)
      )

      if (willGain.length > 0) {
        // 가장 높은 배지 하나만 축하 (복수 달성 시 최고 배지 우선)
        const badge = willGain[willGain.length - 1]

        // 이전 배지 획득 시각 (이미 저장된 배지 중 가장 최근)
        const previousBadgeEarnedAt =
          existingAchievements.length > 0
            ? existingAchievements[existingAchievements.length - 1].earnedAt
            : null

        // 이전 배지 이후 작성된 감사 기록 필터링
        const notesSinceLastBadge = previousBadgeEarnedAt
          ? notes.filter((n) => n.createdAt > previousBadgeEarnedAt)
          : [...notes]

        // ── v1.7.1: AI API 비동기 호출 후 extras 저장 ──────────────
        // cancelled 플래그: 컴포넌트 언마운트 시 setState 방지
        let cancelled = false

        const resolveAndSave = async () => {
          // extras 구성 — 신규 획득한 모든 배지에 각각 메시지 생성 후 저장
          // API 성공 시 AI 메시지, 실패/미설정 시 로컬 템플릿 fallback
          // (모달 표시는 최고 배지 1개만. 하위 배지도 나중에 BadgePage 등에서 활용 가능)
          const extras: AchievementExtras = {}
          for (const b of willGain) {
            const { message: celebrationMessage, source } = await generateBadgeCelebrationMessageWithApi({
              badge: b,
              streak,
              notesSinceLastBadge,
            })
            extras[b.id] = {
              celebrationMessage,
              analyzedNoteCount: notesSinceLastBadge.length,
              previousBadgeEarnedAt,
              source,
            }
          }

          if (cancelled) return

          // 모달 표시용 — 최고 배지의 메시지 별도 참조
          const msg = extras[badge.id]?.celebrationMessage ?? ''

          // 배지 저장 (extras 포함 — 1회만 저장, 중복 저장 방지는 내부에서 처리)
          checkAndSaveNewAchievements(streak, extras)

          setNewBadge(badge)
          setCelebrationMessage(msg)
        }

        resolveAndSave()

        // cleanup: 언마운트 시 setState 호출 방지
        return () => { cancelled = true }
      }
    }

    prevStreak.current = streak
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak])

  return {
    newBadge,
    celebrationMessage,
    clearNewBadge: () => {
      setNewBadge(null)
      setCelebrationMessage('')
    },
  }
}
