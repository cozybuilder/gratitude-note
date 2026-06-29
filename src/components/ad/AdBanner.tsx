// ── AdBanner — Capacitor AdMob 배너 광고 ────────────────────────
// Android Native 환경에서만 표시. Web/PWA에서는 아무것도 렌더링하지 않음.
//
// 광고 ID 설정 (.env.local):
//   VITE_ADMOB_APP_ID   — AdMob App ID (ca-app-pub-XXXXX~XXXXX)
//   VITE_ADMOB_BANNER_ID — Banner Ad Unit ID (ca-app-pub-XXXXX/XXXXX)
//
// 미설정 시 Google 공식 테스트 광고 ID를 사용합니다.

import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from '@capacitor-community/admob'

const isNative = Capacitor.isNativePlatform()

// 환경변수 미설정 시 Google 공식 테스트 ID 사용
const ADMOB_BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID ?? 'ca-app-pub-3940256099942544/6300978111'
const IS_TESTING      = !import.meta.env.VITE_ADMOB_BANNER_ID // 환경변수 미설정이면 테스트 모드

// CSS 변수명 — BottomNav와 페이지 padding에서 공유
export const ADMOB_CSS_VAR = '--admob-h'

// 실제 배너 높이를 CSS 변수로 전파
function setAdHeight(px: number) {
  document.documentElement.style.setProperty(ADMOB_CSS_VAR, `${px}px`)
}

async function initAdMob() {
  try {
    await AdMob.initialize()
  } catch {
    // 초기화 실패 무시 (에뮬레이터 등)
  }
}

async function showBanner() {
  try {
    await AdMob.showBanner({
      adId: ADMOB_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0, // 화면 최하단 고정
      isTesting: IS_TESTING,
    })
  } catch {
    // 배너 로드 실패 시 조용히 무시
  }
}

async function hideBanner() {
  try {
    await AdMob.hideBanner()
  } catch {
    // 무시
  }
}

export function AdBanner() {
  const initialized = useRef(false)
  const [adHeight, setAdHeightState] = useState(0)

  useEffect(() => {
    if (!isNative) return
    if (initialized.current) return
    initialized.current = true

    // 실제 배너 높이를 이벤트로 수신 → CSS 변수 및 state 갱신
    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (info) => {
      const h = info.height ?? 60
      setAdHeightState(h)
      setAdHeight(h)
    })

    // 배너 로드 실패 시 높이 0으로 초기화
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
      setAdHeightState(0)
      setAdHeight(0)
    })

    initAdMob().then(() => showBanner())

    return () => {
      hideBanner()
      setAdHeight(0)
    }
  }, [])

  // Web/PWA에서는 아무것도 렌더링하지 않음
  if (!isNative) return null

  // Android Native: AdMob 네이티브 배너가 차지하는 높이만큼 WebView 여백 확보
  // 실제 높이가 수신되기 전까지는 0px (레이아웃 점프 최소화)
  return <div style={{ height: adHeight > 0 ? adHeight : 60 }} aria-hidden="true" />
}
