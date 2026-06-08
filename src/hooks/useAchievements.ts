import { useEffect, useRef, useState } from 'react'
import {
  checkAndSaveNewAchievements,
  type AchievementBadge,
} from '../utils/achievement'

/**
 * streak 변화 시 새 배지를 감지하고 축하 모달용 상태를 반환합니다.
 * - newBadge: 이번 세션에서 처음 획득한 최고 배지 (없으면 null)
 * - clearNewBadge: 모달 닫기 후 호출
 */
export function useAchievements(streak: number) {
  const [newBadge, setNewBadge] = useState<AchievementBadge | null>(null)
  const prevStreak = useRef<number | null>(null)

  useEffect(() => {
    // 앱 초기 로드 시에는 축하 모달 표시 안 함 (prevStreak === null)
    if (prevStreak.current === null) {
      prevStreak.current = streak
      // 그래도 저장 누락된 배지가 있으면 조용히 저장만 함
      checkAndSaveNewAchievements(streak)
      return
    }

    // streak이 실제로 증가했을 때만 체크
    if (streak > prevStreak.current) {
      const gained = checkAndSaveNewAchievements(streak)
      if (gained.length > 0) {
        // 가장 높은 배지 하나만 축하 (복수 달성 시 최고 배지 우선)
        // setTimeout으로 비동기 처리 — effect 내부 동기 setState 규칙 준수
        const badge = gained[gained.length - 1]
        setTimeout(() => setNewBadge(badge), 0)
      }
    }

    prevStreak.current = streak
  }, [streak])

  return {
    newBadge,
    clearNewBadge: () => setNewBadge(null),
  }
}
