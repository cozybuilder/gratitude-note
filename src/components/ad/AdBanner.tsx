/**
 * AdBanner — 배너 광고 컴포넌트
 *
 * 환경변수 설정 방법 (.env.local):
 *   VITE_ADMOB_APP_ID=ca-pub-XXXXXXXXXXXXXXXX   ← Google AdSense Publisher ID
 *   VITE_ADMOB_BANNER_ID=XXXXXXXXXX              ← Ad Unit ID (슬롯 ID)
 *
 * 두 값이 모두 설정된 경우 → 실제 AdSense 배너 렌더링
 * 미설정 시 → "광고 영역" 플레이스홀더 표시
 */

import { useEffect } from 'react'

const APP_ID = import.meta.env.VITE_ADMOB_APP_ID
const BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID
const isAdConfigured = Boolean(APP_ID && BANNER_ID)

export function AdBanner() {
  useEffect(() => {
    if (!isAdConfigured) return

    // AdSense 스크립트 동적 주입 (중복 방지)
    const SCRIPT_ATTR = 'data-admob-injected'
    if (!document.querySelector(`script[${SCRIPT_ATTR}]`)) {
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${APP_ID}`
      script.async = true
      script.crossOrigin = 'anonymous'
      script.setAttribute(SCRIPT_ATTR, 'true')
      document.head.appendChild(script)
    }

    // 광고 슬롯 초기화
    try {
      window.adsbygoogle = window.adsbygoogle ?? []
      window.adsbygoogle.push({})
    } catch {
      // 초기화 실패 무시 (개발 환경 등)
    }
  }, [])

  if (!isAdConfigured) {
    // ── 플레이스홀더 (환경변수 미설정 시) ──────────────────────────
    return (
      <div className="flex h-[50px] w-full items-center justify-center border-t border-warm-200 bg-warm-100">
        <span className="text-xs text-[#8a7570]">광고 영역</span>
      </div>
    )
  }

  // ── 실제 AdSense 배너 ────────────────────────────────────────────
  return (
    <div className="flex w-full items-center justify-center overflow-hidden border-t border-warm-200 bg-warm-100">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '320px', height: '50px' }}
        data-ad-client={APP_ID}
        data-ad-slot={BANNER_ID}
      />
    </div>
  )
}
