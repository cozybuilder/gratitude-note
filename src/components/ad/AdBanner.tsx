// ── AdBanner — Capacitor AdMob 배너 광고 ────────────────────────
// Android Native 환경에서만 표시. Web/PWA에서는 아무것도 렌더링하지 않음.
//
// 광고 ID 설정 (.env.local):
//   VITE_ADMOB_APP_ID   — AdMob App ID (ca-app-pub-XXXXX~XXXXX)
//   VITE_ADMOB_BANNER_ID — Banner Ad Unit ID (ca-app-pub-XXXXX/XXXXX)
//
// 미설정 시 Google 공식 테스트 광고 ID를 사용합니다.

import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'

const isNative = Capacitor.isNativePlatform()

// 환경변수 미설정 시 Google 공식 테스트 ID 사용
const ADMOB_BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID ?? 'ca-app-pub-3940256099942544/6300978111'
const IS_TESTING      = !import.meta.env.VITE_ADMOB_BANNER_ID // 환경변수 미설정이면 테스트 모드

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
      margin: 0, // 화면 최하단 고정 — BottomNav가 광고 위에 위치
      isTesting: IS_TESTING,
    })
  } catch {
    // 배너 로드 실패 시 조용히 무시 — 앱 기능에 영향 없음
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

  useEffect(() => {
    if (!isNative) return
    if (initialized.current) return
    initialized.current = true

    initAdMob().then(() => showBanner())

    return () => {
      hideBanner()
    }
  }, [])

  // Web/PWA에서는 아무것도 렌더링하지 않음
  if (!isNative) return null

  // Android Native: AdMob이 네이티브 레이어에 배너를 직접 렌더링하므로
  // 배너 높이만큼 여백을 확보하는 placeholder만 렌더링
  return <div style={{ height: '60px' }} aria-hidden="true" />
}
