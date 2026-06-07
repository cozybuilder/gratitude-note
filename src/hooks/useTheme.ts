import { useEffect, useState } from 'react'
import { type ThemeMode, applyTheme, getThemeMode, resolveIsDark } from '../utils/theme'

/**
 * 테마 모드를 관리하는 훅.
 * - mode: 현재 선택된 ThemeMode ('system' | 'light' | 'dark')
 * - setMode: 테마 변경 (localStorage 저장 + DOM 클래스 적용 + 상태 업데이트)
 * - isDark: 실제로 다크 모드가 활성화되어 있는지 여부
 */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(getThemeMode)

  function setMode(newMode: ThemeMode) {
    applyTheme(newMode)
    setModeState(newMode)
  }

  // system 모드일 때 OS 설정 변화 감지
  useEffect(() => {
    if (mode !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    function handleChange() {
      document.documentElement.classList.toggle('dark', mq.matches)
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [mode])

  return { mode, setMode, isDark: resolveIsDark(mode) }
}
