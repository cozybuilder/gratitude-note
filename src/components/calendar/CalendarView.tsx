import { useState } from 'react'
import type { Note } from '../../types/note'
import { getTodayGratitudeDate } from '../../utils/date'

interface CalendarViewProps {
  notes: Note[]
  selectedDate?: string
  onSelectDate?: (dateKey: string) => void
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function CalendarView({ notes, selectedDate, onSelectDate }: CalendarViewProps) {
  const todayGratitude = getTodayGratitudeDate() // "YYYY-MM-DD" 4시 기준
  const [todayY, todayM] = todayGratitude.split('-').map(Number)
  const [year, setYear] = useState(todayY)
  const [month, setMonth] = useState(todayM - 1) // 0-indexed

  // 작성된 날짜 Set (새벽 4시 기준 감사일)
  const writtenDays = new Set(notes.map((n) => n.gratitudeDate))

  // 이번 달 첫 날의 요일, 마지막 날
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  // 앞 빈칸 + 날짜 배열
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ]
  // 6행을 맞추기 위해 뒤 빈칸
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    const isAfterToday = year > todayY || (year === todayY && month >= todayM - 1)
    if (isAfterToday) return
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const isNextDisabled = year > todayY || (year === todayY && month >= todayM - 1)

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* 월 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a7570] hover:bg-warm-100 transition-colors"
          aria-label="이전 달"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-[#3d2e26]">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={isNextDisabled}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a7570] hover:bg-warm-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {WEEK_DAYS.map((d, i) => (
          <span
            key={d}
            className={[
              'text-xs font-medium py-1',
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-[#8a7570]',
            ].join(' ')}
          >
            {d}
          </span>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />

          const dateKey = toDateKey(year, month, day)
          const isToday    = dateKey === todayGratitude
          const hasNote    = writtenDays.has(dateKey)
          const isSelected = selectedDate === dateKey
          const col        = idx % 7 // 0=일, 6=토

          // ── 날짜 원 스타일 ─────────────────────────────────────────
          let circleClass =
            'relative flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all'

          if (isToday) {
            // 오늘: 주황 채움 — 선택 시 바깥 링 추가
            circleClass += isSelected
              ? ' bg-primary-500 font-semibold text-white ring-2 ring-primary-300'
              : ' bg-primary-500 font-semibold text-white'
          } else if (hasNote) {
            // 기록 있음: warm-200 채움 — 선택 시 primary 링
            circleClass += isSelected
              ? ' bg-warm-200 font-medium text-[#3d2e26] ring-2 ring-primary-500'
              : ' bg-warm-200 font-medium text-[#3d2e26]'
          } else if (isSelected) {
            // 기록 없음 + 선택: 연한 배경 + 회색 링
            const colText =
              col === 0 ? 'text-red-400' : col === 6 ? 'text-blue-400' : 'text-[#3d2e26]'
            circleClass += ` bg-warm-50 ${colText} ring-2 ring-[#c4b8b4]`
          } else {
            // 기본: 텍스트 색상만
            circleClass +=
              col === 0 ? ' text-red-400' : col === 6 ? ' text-blue-400' : ' text-[#3d2e26]'
          }

          return (
            <div key={dateKey} className="flex flex-col items-center py-0.5">
              <button
                type="button"
                onClick={() => onSelectDate?.(dateKey)}
                className="flex flex-col items-center focus:outline-none"
                aria-label={`${year}년 ${month + 1}월 ${day}일${hasNote ? ' (기록 있음)' : ''}`}
                aria-pressed={isSelected}
              >
                <div className={circleClass}>
                  {day}
                  {/* 작성 완료 점 (오늘이 아닐 때) */}
                  {hasNote && !isToday && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
