import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Modal } from '../components/common/Modal'
import { useNotes } from '../hooks/useNotes'
import { useTheme } from '../hooks/useTheme'
import type { ThemeMode } from '../utils/theme'
import { exportBackup, importBackup } from '../utils/backup'
import type { ImportResult } from '../utils/backup'
import {
  requestNotificationPermission,
  getNotificationPermissionAsync,
  get6pmEnabled,
  get10pmEnabled,
  set6pmEnabled,
  set10pmEnabled,
} from '../utils/notification'
import type { NotifPermStatus } from '../utils/notification'

const APP_VERSION = '1.8.0'
const CONTACT_EMAIL = 'cozybuilder.studio@gmail.com'

// ── 테마 옵션 ─────────────────────────────────────────────────────
const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'system', label: '시스템 설정 사용', icon: '🖥️' },
  { mode: 'light',  label: '라이트 모드',      icon: '☀️' },
  { mode: 'dark',   label: '다크 모드',         icon: '🌙' },
]

export function SettingsPage() {
  const { notes, clearNotes } = useNotes()
  const { mode: themeMode, setMode: setThemeMode } = useTheme()
  const navigate = useNavigate()

  const [showResetModal, setShowResetModal] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [notifPerm, setNotifPerm] = useState<NotifPermStatus>('default')
  const [notif6pm,  setNotif6pm]  = useState(() => get6pmEnabled())
  const [notif10pm, setNotif10pm] = useState(() => get10pmEnabled())

  // 비동기로 실제 권한 상태 확인 (Android/Web 모두)
  useEffect(() => {
    getNotificationPermissionAsync().then(setNotifPerm)
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleReset() {
    clearNotes()
    setThemeMode('system')
    setShowResetModal(false)
    setResetDone(true)
  }

  function handleExport() {
    exportBackup()
  }

  function handleImportClick() {
    setImportResult(null)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = ''

    setIsImporting(true)
    setImportResult(null)
    const result = await importBackup(file)
    setImportResult(result)
    setIsImporting(false)

    if (result.ok) {
      // 복원 완료 후 1.5초 뒤 리로드하여 notes 상태 갱신
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <div>
      <Header title="설정" />
      <div className="flex flex-col gap-4 px-5 pb-32 pt-2">

        {/* ── 테마 설정 ──────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="테마 설정" />
          <div className="divide-y divide-warm-100">
            {THEME_OPTIONS.map(({ mode, label, icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setResetDone(false); setThemeMode(mode) }}
                className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg leading-none">{icon}</span>
                  <span className="text-sm font-medium text-[#3d2e26]">{label}</span>
                </div>
                <span className={`text-lg leading-none ${
                  themeMode === mode ? 'text-primary-500' : 'text-[#8a7570]'
                }`}>
                  {themeMode === mode ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 알림 설정 ──────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="알림 설정" />

          {/* 권한 상태 행 */}
          <div className="flex items-center justify-between border-b border-warm-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">🔔</span>
              <div>
                <p className="text-sm font-medium text-[#3d2e26]">감사일기 리마인더</p>
                <p className="text-xs text-[#8a7570]">
                  {notifPerm === 'granted'
                    ? '미작성 시 아래 설정 시간에 알림을 발송합니다'
                    : notifPerm === 'denied'
                    ? '기기 설정에서 감사일기 알림을 허용해주세요'
                    : notifPerm === 'unsupported'
                    ? '이 환경에서는 알림이 지원되지 않습니다'
                    : '알림을 허용하면 매일 감사 리마인더를 받을 수 있습니다'}
                </p>
              </div>
            </div>
            {notifPerm === 'granted' ? (
              <span className="rounded-full bg-warm-100 px-2.5 py-0.5 text-xs font-medium text-primary-500">
                허용됨
              </span>
            ) : notifPerm === 'default' ? (
              <button
                type="button"
                onClick={async () => {
                  const perm = await requestNotificationPermission()
                  setNotifPerm(perm as NotifPermStatus)
                }}
                className="rounded-full bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600 transition-colors"
              >
                허용하기
              </button>
            ) : null}
          </div>

          {/* 시간대별 체크박스 */}
          <div className="divide-y divide-warm-100">
            {/* 저녁 6시 알림 */}
            <label className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">🌇</span>
                <div>
                  <p className="text-sm font-medium text-[#3d2e26]">저녁 6시 알림</p>
                  <p className="text-xs text-[#8a7570]">오후 6:00 — 저녁 감사 리마인더</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notif6pm}
                disabled={notifPerm !== 'granted'}
                onChange={(e) => {
                  setNotif6pm(e.target.checked)
                  set6pmEnabled(e.target.checked)
                }}
                className="h-5 w-5 cursor-pointer accent-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </label>

            {/* 저녁 10시 알림 */}
            <label className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">🌙</span>
                <div>
                  <p className="text-sm font-medium text-[#3d2e26]">저녁 10시 알림</p>
                  <p className="text-xs text-[#8a7570]">오후 10:00 — 취침 전 감사 리마인더</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notif10pm}
                disabled={notifPerm !== 'granted'}
                onChange={(e) => {
                  setNotif10pm(e.target.checked)
                  set10pmEnabled(e.target.checked)
                }}
                className="h-5 w-5 cursor-pointer accent-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </label>
          </div>

          <p className="px-5 pb-4 pt-2 text-xs leading-relaxed text-[#8a7570]">
            ℹ️ 오늘 이미 기록을 작성한 경우 알림은 발송되지 않습니다.
          </p>
        </section>

        {/* ── 데이터 관리 (백업/복원) ────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="데이터 관리" />
          <div className="divide-y divide-warm-100">

            {/* 백업 내보내기 */}
            <button
              type="button"
              onClick={handleExport}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">📤</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#3d2e26]">백업 내보내기</p>
                  <p className="text-xs text-[#8a7570]">
                    감사 기록 {notes.length}개를 JSON 파일로 저장합니다
                  </p>
                </div>
              </div>
              <span className="text-[#8a7570]">›</span>
            </button>

            {/* 백업 불러오기 */}
            <button
              type="button"
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">📥</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#3d2e26]">백업 불러오기</p>
                  <p className="text-xs text-[#8a7570]">
                    {isImporting ? '복원 중...' : 'JSON 파일을 선택해 기록을 복원합니다'}
                  </p>
                </div>
              </div>
              <span className="text-[#8a7570]">›</span>
            </button>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </section>

        {/* 백업 불러오기 결과 */}
        {importResult && (
          <div className={`rounded-2xl px-5 py-3 ${
            importResult.ok ? 'bg-warm-100' : 'bg-red-50'
          }`}>
            {importResult.ok ? (
              <p className="text-sm text-[#8a7570]">
                ✅ 감사 기록 {importResult.count}개가 복원되었습니다. 앱을 다시 불러오는 중…
              </p>
            ) : (
              <p className="text-sm text-red-500">⚠️ {importResult.error}</p>
            )}
          </div>
        )}

        {/* ── 정보 ───────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="정보" />
          <div className="divide-y divide-warm-100">
            <button
              type="button"
              onClick={() => navigate('/privacy')}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">📋</span>
                <span className="text-sm font-medium text-[#3d2e26]">개인정보처리방침</span>
              </div>
              <span className="text-[#8a7570]">›</span>
            </button>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">✉️</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-[#3d2e26]">문의하기</p>
                  <p className="text-xs text-[#8a7570]">{CONTACT_EMAIL}</p>
                </div>
              </div>
              <span className="text-[#8a7570]">›</span>
            </a>
          </div>
        </section>

        {/* ── 데이터 초기화 ──────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="데이터 초기화" />
          <button
            type="button"
            onClick={() => { setResetDone(false); setShowResetModal(true) }}
            className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">🗑️</span>
              <div className="text-left">
                <p className="text-sm font-medium text-red-500">데이터 초기화</p>
                <p className="text-xs text-[#8a7570]">
                  감사 기록 {notes.length}개 및 설정값을 모두 삭제합니다
                </p>
              </div>
            </div>
            <span className="text-[#8a7570]">›</span>
          </button>
        </section>

        {resetDone && (
          <div className="rounded-2xl bg-warm-100 px-5 py-3">
            <p className="text-sm text-[#8a7570]">✅ 모든 데이터가 초기화되었습니다.</p>
          </div>
        )}

        {/* ── 앱 정보 ───────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="앱 정보" />
          <div className="divide-y divide-warm-100">
            <SettingsRow label="버전" value={APP_VERSION} />
            <SettingsRow label="저장 방식" value="기기 내 저장 (LocalStorage)" />
            <SettingsRow label="서버 연결" value="없음" />
            <SettingsRow label="하루 기준" value="오전 4시 ~ 다음날 오전 3시 59분" />
          </div>
        </section>

        <p className="text-center text-xs leading-relaxed text-[#8a7570]">
          감사일기는 서버 없이 기기에만 데이터를 저장합니다.{'\n'}
          앱 삭제 또는 브라우저 데이터를 지우면 기록이 사라질 수 있습니다.
        </p>
      </div>

      <Modal
        isOpen={showResetModal}
        title="정말 삭제하시겠습니까?"
        message={`감사 기록 ${notes.length}개와 설정값이 모두 삭제됩니다.\n삭제한 데이터는 복구할 수 없습니다.`}
        confirmLabel="삭제"
        cancelLabel="취소"
        confirmVariant="danger"
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}

// ── 서브 컴포넌트 ─────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="border-b border-warm-100 px-5 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7570]">{label}</p>
    </div>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <span className="text-sm text-[#3d2e26]">{label}</span>
      <span className="text-sm text-[#8a7570]">{value}</span>
    </div>
  )
}
