import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Modal } from '../components/common/Modal'
import { useNotes } from '../hooks/useNotes'

const APP_VERSION = '1.0.0'

export function SettingsPage() {
  const { notes, clearNotes } = useNotes()
  const [showClearModal, setShowClearModal] = useState(false)
  const [cleared, setCleared] = useState(false)

  function handleClear() {
    clearNotes()
    setShowClearModal(false)
    setCleared(true)
  }

  return (
    <div>
      <Header title="설정" />
      <div className="flex flex-col gap-4 px-5 pb-28">

        {/* 데이터 관리 */}
        <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-warm-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7570]">데이터 관리</p>
          </div>
          <button
            type="button"
            onClick={() => { setCleared(false); setShowClearModal(true) }}
            className="flex w-full items-center justify-between px-5 py-4 hover:bg-warm-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">🗑️</span>
              <div className="text-left">
                <p className="text-sm font-medium text-red-500">모든 기록 초기화</p>
                <p className="text-xs text-[#8a7570]">저장된 감사 일기 {notes.length}개를 모두 삭제합니다</p>
              </div>
            </div>
            <span className="text-[#8a7570]">›</span>
          </button>
        </section>

        {/* 완료 안내 */}
        {cleared && (
          <div className="rounded-2xl bg-warm-100 px-5 py-3">
            <p className="text-sm text-[#8a7570]">✅ 모든 기록이 초기화되었습니다.</p>
          </div>
        )}

        {/* 앱 정보 */}
        <section className="rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-warm-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8a7570]">앱 정보</p>
          </div>
          <div className="divide-y divide-warm-100">
            <SettingsRow label="앱 이름" value="감사노트" />
            <SettingsRow label="버전" value={APP_VERSION} />
            <SettingsRow label="저장 방식" value="기기 내 저장 (LocalStorage)" />
            <SettingsRow label="서버 연결" value="없음" />
          </div>
        </section>

        {/* 안내 문구 */}
        <p className="text-center text-xs leading-relaxed text-[#8a7570]">
          감사노트는 서버 없이 기기에만 데이터를 저장합니다.{'\n'}
          앱을 삭제하거나 브라우저 데이터를 지우면 기록이 사라질 수 있습니다.
        </p>

      </div>

      {/* 초기화 확인 모달 */}
      <Modal
        isOpen={showClearModal}
        title="모든 기록을 초기화할까요?"
        message={`감사 일기 ${notes.length}개가 모두 삭제됩니다.\n삭제한 기록은 복구할 수 없습니다.`}
        confirmLabel="초기화"
        confirmVariant="danger"
        onConfirm={handleClear}
        onCancel={() => setShowClearModal(false)}
      />
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
