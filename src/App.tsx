import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { HomePage } from './pages/HomePage'
import { ListPage } from './pages/ListPage'
import { CalendarPage } from './pages/CalendarPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { BadgePage } from './pages/BadgePage'
import {
  scheduleDailyReminders,
  requestNotificationPermission,
  getNotificationPermissionAsync,
} from './utils/notification'
import { initBackButton } from './utils/backButton'

const ONBOARDING_KEY = 'onboarding_done'

function App() {
  const [onboardingDone, setOnboardingDone] = useState<boolean>(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true'
  )

  // Android 뒤로가기 버튼 글로벌 핸들러 초기화
  useEffect(() => {
    return initBackButton()
  }, [])

  // 알림 초기화:
  // - 권한 이미 허용된 경우 → 즉시 스케줄 등록
  // - 권한 미결정(default) 상태 → 최초 1회 자동 권한 요청
  // - Android/Web 모두 비동기로 처리
  useEffect(() => {
    getNotificationPermissionAsync().then((perm) => {
      if (perm === 'granted') {
        scheduleDailyReminders()
      } else if (perm === 'default') {
        requestNotificationPermission()
      }
    })
  }, [])

  if (!onboardingDone) {
    return (
      <div className="mx-auto flex w-full max-w-md min-h-svh flex-col bg-warm-50">
        <OnboardingPage
          onComplete={() => {
            localStorage.setItem(ONBOARDING_KEY, 'true')
            setOnboardingDone(true)
          }}
        />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="mx-auto flex w-full max-w-md min-h-svh flex-col bg-warm-50">
        <main className="flex-1">
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/list"        element={<ListPage />} />
            <Route path="/calendar"    element={<CalendarPage />} />
            <Route path="/stats"       element={<StatsPage />} />
            <Route path="/settings"    element={<SettingsPage />} />
            <Route path="/privacy"     element={<PrivacyPage />} />
            <Route path="/badges"       element={<BadgePage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
