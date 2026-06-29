// ── AdBanner — 홈 화면 인라인 광고 영역 ──────────────────────────
// WebView DOM 흐름 안에 배치되는 in-flow 광고 컨테이너.
// @capacitor-community/admob showBanner(overlay) 미사용.
// 실제 광고 수익화는 Google AdSense 도입 시 이 컴포넌트에 연결.

export function AdBanner() {
  return (
    <div
      className="mx-5 flex items-center justify-center rounded-2xl bg-warm-100"
      style={{ minHeight: 60 }}
      aria-label="광고 영역"
    >
      <span className="text-xs text-[#c4b0a8]">AD</span>
    </div>
  )
}
