import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'secondary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export function Modal({
  isOpen,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
  children,
}: ModalProps) {
  // 모달 열릴 때 바디 스크롤 잠금
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* 모달 시트 — 하단에서 올라오는 방식 (모바일 친화적) */}
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-warm-50 px-5 pb-8 pt-6 shadow-xl">
        {/* 핸들 바 */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-warm-300" />

        <h2 className="mb-2 text-base font-semibold text-[#3d2e26]">{title}</h2>

        {message && (
          <p className="mb-5 text-sm leading-relaxed text-[#8a7570]">{message}</p>
        )}

        {children && <div className="mb-5">{children}</div>}

        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
