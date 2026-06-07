import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { HomePage } from './pages/HomePage'
import { ListPage } from './pages/ListPage'
import { CalendarPage } from './pages/CalendarPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PrivacyPage } from './pages/PrivacyPage'

const ONBOARDING_KEY = 'onboarding_done'

function App() {
  // 온보딩 완료 여부 — LocalStorage에서 초기화
  const [onboardingDone, setOnboardingDone] = useState<boolean>(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true'
  )

  // 첫 실행 시 온보딩 표시 (BottomNav 없이 풀스크린)
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
            <Route path="/"         element={<HomePage />} />
            <Route path="/list"     element={<ListPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats"    element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacy"  element={<PrivacyPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
