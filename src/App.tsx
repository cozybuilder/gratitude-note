import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { HomePage } from './pages/HomePage'
import { ListPage } from './pages/ListPage'
import { CalendarPage } from './pages/CalendarPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
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
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
