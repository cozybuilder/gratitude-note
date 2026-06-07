// ── 테마 설정 유틸리티 ────────────────────────────────────────────
// LocalStorage key: 'theme_mode'
// document.documentElement에 .dark 클래스를 토글해 전체 앱 테마를 전환합니다.

export type ThemeMode = 'system' | 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme_mode'

/** 시스템 다크 모드 여부 */
function systemIsDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** ThemeMode → 실제 isDark 계산 */
export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark')  return true
  if (mode === 'light') return false
  return systemIsDark()
}

/** 저장된 테마를 읽어옵니다 (없으면 'system') */
export function getThemeMode(): ThemeMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
  return saved ?? 'system'
}

/**
 * 테마를 저장하고 DOM에 즉시 적용합니다.
 * React 렌더 전(main.tsx)에서도 호출 가능합니다.
 */
export function applyTheme(mode: ThemeMode): void {
  localStorage.setItem(THEME_STORAGE_KEY, mode)
  document.documentElement.classList.toggle('dark', resolveIsDark(mode))
}

/**
 * 앱 시작 시 한 번 호출 — FOUC 방지.
 * React 렌더링 전 main.tsx에서 호출해야 합니다.
 */
export function initTheme(): void {
  const mode = getThemeMode()
  document.documentElement.classList.toggle('dark', resolveIsDark(mode))
}
