import { useEffect, useRef, useState } from 'react'
import type { Note } from '../../types/note'
import { generateShareCard } from '../../utils/shareCard'

interface ShareCardModalProps {
  note: Note
  streak?: number
  onClose: () => void
}

type Status = 'generating' | 'ready' | 'error'
type CopyState = 'idle' | 'copied'
type ShareNotice = null | string

const SERVICE_URL = 'https://gratitude-note-theta.vercel.app/'

export function ShareCardModal({ note, streak = 0, onClose }: ShareCardModalProps) {
  const [status, setStatus] = useState<Status>('generating')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [shareNotice, setShareNotice] = useState<ShareNotice>(null)
  const blobRef = useRef<Blob | null>(null)
  const previewUrl = useRef<string | null>(null)
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  // 모달 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // 카드 생성
  useEffect(() => {
    let cancelled = false
    generateShareCard(note, streak)
      .then((blob) => {
        if (cancelled) return
        blobRef.current = blob
        const url = URL.createObjectURL(blob)
        previewUrl.current = url
        setImgUrl(url)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
    }
  }, [note, streak])

  // ── 공유 액션 ─────────────────────────────────────────────────────────────────

  async function handleShare() {
    const blob = blobRef.current
    if (!blob) return

    const file = new File([blob], `감사일기-${note.gratitudeDate}.png`, { type: 'image/png' })
    const shareData = { files: [file], title: '감사일기', text: '오늘의 감사 일기를 공유합니다 🌿' }

    if (navigator.canShare?.(shareData)) {
      // 파일 공유 지원 (모바일 브라우저)
      try {
        await navigator.share(shareData)
        setShareNotice(null)
      } catch {
        // 사용자 취소 — 무시
      }
    } else {
      // 파일 공유 미지원 (데스크탑 등) — 안내 메시지 표시
      setShareNotice('현재 브라우저에서는 이미지 직접 공유를 지원하지 않습니다. 이미지 저장 후 공유해주세요.')
    }
  }

  function handleSave() {
    const blob = blobRef.current
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `감사일기-${note.gratitudeDate}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(SERVICE_URL)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      // clipboard 미지원 시 무시
    }
  }

  // ── 렌더 ──────────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 바텀 시트 */}
      <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-warm-50 pb-8 pt-5 shadow-2xl">
        {/* 핸들 */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-warm-300" />

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-base font-semibold text-[#3d2e26]">공유 카드 미리보기</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a7570] hover:bg-warm-200 transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 이미지 미리보기 영역 */}
        <div className="mx-5 mb-5 overflow-hidden rounded-2xl bg-warm-200 shadow-inner" style={{ aspectRatio: '4/5' }}>
          {status === 'generating' && (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                {/* 스피너 */}
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-warm-300 border-t-primary-500" />
                <p className="text-sm text-[#8a7570]">카드 생성 중...</p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-[#8a7570]">카드 생성에 실패했습니다.</p>
            </div>
          )}
          {status === 'ready' && imgUrl && (
            <img
              src={imgUrl}
              alt="공유 카드 미리보기"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* 액션 버튼 */}
        {status === 'ready' && (
          <div className="flex flex-col gap-2 px-5">
            {/* 이미지 공유 — 항상 표시 */}
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
            >
              <span>📤</span>
              이미지 공유
            </button>

            {/* 미지원 안내 메시지 */}
            {shareNotice && (
              <p className="rounded-xl bg-warm-100 px-4 py-2.5 text-xs leading-relaxed text-[#8a7570]">
                ℹ️ {shareNotice}
              </p>
            )}

            <div className="flex gap-2">
              {/* 이미지 저장 */}
              <button
                type="button"
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-warm-300 bg-warm-50 py-3 text-sm font-medium text-[#3d2e26] hover:bg-warm-100 transition-colors"
              >
                <span>⬇️</span>
                이미지 저장
              </button>

              {/* 링크 복사 */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-warm-300 bg-warm-50 py-3 text-sm font-medium text-[#3d2e26] hover:bg-warm-100 transition-colors"
              >
                <span>{copyState === 'copied' ? '✅' : '🔗'}</span>
                {copyState === 'copied' ? '복사됨' : '링크 복사'}
              </button>
            </div>
          </div>
        )}

        {/* 생성 중 / 오류 시 닫기 버튼 */}
        {status !== 'ready' && (
          <div className="px-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-warm-300 bg-warm-50 py-3 text-sm font-medium text-[#3d2e26] hover:bg-warm-100 transition-colors"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
