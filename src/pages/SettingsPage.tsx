import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Modal } from '../components/common/Modal'
import { useNotes } from '../hooks/useNotes'
import { useTheme } from '../hooks/useTheme'
import type { ThemeMode } from '../utils/theme'

const APP_VERSION = '1.5.0'
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

  function handleReset() {
    clearNotes()
    // 설정값(테마)도 초기화 → 시스템 설정으로 복원
    setThemeMode('system')
    setShowResetModal(false)
    setResetDone(true)
  }

  return (
    <div>
      <Header title="설정" />
      <div className="flex flex-col gap-4 px-5 pb-28 pt-2">

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

        {/* ── 정보 ───────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="정보" />
          <div className="divide-y divide-warm-100">
            {/* 개인정보처리방침 */}
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

            {/* 문의하기 */}
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
          <SectionHeader label="데이터" />
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

        {/* 초기화 완료 안내 */}
        {resetDone && (
          <div className="rounded-2xl bg-warm-100 px-5 py-3">
            <p className="text-sm text-[#8a7570]">✅ 모든 데이터가 초기화되었습니다.</p>
          </div>
        )}

        {/* ── 앱 버전 ───────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <SectionHeader label="앱 정보" />
          <div className="divide-y divide-warm-100">
            <SettingsRow label="버전" value={APP_VERSION} />
            <SettingsRow label="저장 방식" value="기기 내 저장 (LocalStorage)" />
            <SettingsRow label="서버 연결" value="없음" />
            <SettingsRow label="하루 기준" value="오전 4시 ~ 다음날 오전 3시 59분" />
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="text-center text-xs leading-relaxed text-[#8a7570]">
          감사노트는 서버 없이 기기에만 데이터를 저장합니다.{'\n'}
          앱 삭제 또는 브라우저 데이터를 지우면 기록이 사라질 수 있습니다.
        </p>
      </div>

      {/* 초기화 확인 모달 */}
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
