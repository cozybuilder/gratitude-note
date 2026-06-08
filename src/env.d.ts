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
  /**
   * AI 배지 축하 메시지 Serverless Function 엔드포인트 (v1.7.1)
   * 예: https://your-project.vercel.app/api/badge-celebration
   * 미설정 시 로컬 템플릿 fallback 사용.
   * OPENAI_API_KEY 는 서버 환경변수 — 이 값에 포함하지 마세요.
   */
  readonly VITE_BADGE_AI_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** AdSense 전역 배열 타입 */
interface Window {
  adsbygoogle?: unknown[]
}
