/// <reference types="vite/client" />

/**
 * 커스텀 환경변수 타입 선언
 * 실제 값은 .env.local에 입력하세요 (Git에 커밋되지 않습니다).
 * 예시 파일: .env.example
 */
interface ImportMetaEnv {
  /** Google AdSense Publisher ID (예: ca-pub-0000000000000000) */
  readonly VITE_ADMOB_APP_ID?: string
  /** AdSense Ad Unit ID (배너 광고 슬롯 ID) */
  readonly VITE_ADMOB_BANNER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** AdSense 전역 배열 타입 */
interface Window {
  adsbygoogle?: unknown[]
}
