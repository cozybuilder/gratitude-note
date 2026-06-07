/**
 * AdBanner — 배너 광고 컴포넌트
 *
 * 현재는 플레이스홀더로 동작합니다.
 * 실제 광고 연동 시 아래 TODO를 참고하세요.
 *
 * TODO (광고 연동):
 *   1. Google AdSense 스크립트를 index.html <head>에 추가
 *      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 *   2. 아래 SHOW_AD_PLACEHOLDER를 false로 변경
 *   3. 주석 처리된 <ins> 태그의 data-ad-client / data-ad-slot 값을 실제 값으로 교체
 */

// 개발 환경 또는 광고 미연동 시 true
const SHOW_AD_PLACEHOLDER = true

export function AdBanner() {
  if (SHOW_AD_PLACEHOLDER) {
    return (
      <div className="flex h-[50px] w-full items-center justify-center border-t border-warm-200 bg-warm-100">
        <span className="text-xs text-[#8a7570]">광고 영역</span>
      </div>
    )
  }

  // ── 실제 AdSense 광고 (연동 시 활성화) ───────────────────────────
  // return (
  //   <div className="flex h-[50px] w-full items-center justify-center overflow-hidden">
  //     <ins
  //       className="adsbygoogle"
  //       style={{ display: 'inline-block', width: '320px', height: '50px' }}
  //       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // TODO: 실제 publisher ID
  //       data-ad-slot="XXXXXXXXXX"                  // TODO: 실제 ad unit ID
  //     />
  //   </div>
  // )

  return null
}
