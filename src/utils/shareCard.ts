import type { Note, Mood } from '../types/note'
import { ACHIEVEMENT_BADGES } from './achievement'

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const W = 1080
const H = 1350
const SERVICE_URL = 'gratitude-note-theta.vercel.app'

type Season = 'spring' | 'summer' | 'autumn' | 'winter'

const SEASON_IMAGES: Record<Season, string> = {
  spring: '/images/hero/spring-hero-banner-v1.png',
  summer: '/images/hero/summer-hero-banner-v1.png',
  autumn: '/images/hero/autumn-hero-banner-v1.png',
  winter: '/images/hero/winter-hero-banner-v1.png',
}

const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  great:    { emoji: '😄', label: '최고' },
  good:     { emoji: '🙂', label: '좋음' },
  neutral:  { emoji: '😐', label: '보통' },
  bad:      { emoji: '😔', label: '나쁨' },
  terrible: { emoji: '😢', label: '힘듦' },
}

// ─── 색상 팔레트 ───────────────────────────────────────────────────────────────

const C = {
  orange:     '#E07B4F',
  orangeL:    '#F2A07E',
  warmDark:   '#3d2e26',
  warmMid:    '#6b4c3b',
  warmMute:   '#9a7b6e',
  cardBg:     'rgba(255, 252, 245, 0.92)',
  itemBg:     'rgba(255, 242, 228, 0.75)',
  gold:       '#B45309',
  goldLight:  '#D97706',
}

// ─── 배지 헬퍼 ────────────────────────────────────────────────────────────────

interface ShareBadgeInfo {
  emoji: string
  label: string
  streakLine: string
  isLegend: boolean
}

function getBadgeForCard(streak: number): ShareBadgeInfo {
  // 높은 조건부터 탐색
  const badge = [...ACHIEVEMENT_BADGES].reverse().find((b) => streak >= b.minStreak)

  if (!badge) {
    return {
      emoji: '🌱',
      label: '감사 챌린저',
      streakLine: `${streak}일 연속 감사 기록`,
      isLegend: false,
    }
  }

  return {
    emoji: badge.emoji,
    label: badge.label,
    streakLine: badge.isLegend
      ? `${streak}일 연속 · 명예의 전당 입장 자격 달성`
      : `${streak}일 연속 감사 기록`,
    isLegend: badge.isLegend,
  }
}

// ─── 헬퍼 ─────────────────────────────────────────────────────────────────────

function getCurrentSeason(): Season {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`))
    img.src = src
  })
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// 1줄 말줄임 텍스트 반환
function ellipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 0 && ctx.measureText(t + '…').width > maxWidth) {
    t = t.slice(0, -1)
  }
  return t + '…'
}

// ─── 메인 생성 함수 ────────────────────────────────────────────────────────────

export async function generateShareCard(note: Note, streak = 0): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 1. Hero 배경 — 은은하게 블러 (이미지 보이게) ─────────────────────────────
  const heroImg = await loadImage(SEASON_IMAGES[getCurrentSeason()])
  const scale = Math.max(W / heroImg.width, H / heroImg.height)
  const sw = heroImg.width * scale
  const sh = heroImg.height * scale
  const sx = (W - sw) / 2
  const sy = (H - sh) / 2

  // blur 최소화 — 꽃/커피/창가가 은은하게 보이도록
  ctx.filter = 'blur(6px) brightness(1.04) saturate(1.08)'
  ctx.drawImage(heroImg, sx - 24, sy - 24, sw + 48, sh + 48)
  ctx.filter = 'none'

  // ── 2. 따뜻한 크림 오버레이 (텍스트 가독성 확보) ─────────────────────────────
  ctx.fillStyle = 'rgba(255, 248, 234, 0.38)'
  ctx.fillRect(0, 0, W, H)

  // ── 3. 상단 햇살 그라데이션 ──────────────────────────────────────────────────
  const topG = ctx.createLinearGradient(0, 0, 0, 180)
  topG.addColorStop(0, 'rgba(255, 246, 228, 0.62)')
  topG.addColorStop(1, 'rgba(255, 246, 228, 0)')
  ctx.fillStyle = topG
  ctx.fillRect(0, 0, W, 180)

  // ── 4. 하단 그라데이션 ───────────────────────────────────────────────────────
  const botG = ctx.createLinearGradient(0, H - 180, 0, H)
  botG.addColorStop(0, 'rgba(255, 244, 220, 0)')
  botG.addColorStop(1, 'rgba(255, 240, 210, 0.70)')
  ctx.fillStyle = botG
  ctx.fillRect(0, H - 180, W, 180)

  // ── 5. 카드 (그림자 + 크림 반투명) ──────────────────────────────────────────
  const CX = 44, CY = 60, CW = W - 88, CH = 1230, CR = 64

  ctx.save()
  ctx.shadowColor = 'rgba(110, 65, 25, 0.20)'
  ctx.shadowBlur = 56
  ctx.shadowOffsetY = 16
  roundRectPath(ctx, CX, CY, CW, CH, CR)
  ctx.fillStyle = C.cardBg
  ctx.fill()
  ctx.restore()

  roundRectPath(ctx, CX, CY, CW, CH, CR)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.18)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // ── 레이아웃 상수 ────────────────────────────────────────────────────────────
  const PAD = 70
  const cX = CX + PAD           // 콘텐츠 시작 x
  const cW = CW - PAD * 2       // 콘텐츠 폭

  // ── 6. 브랜드명 "감사노트" ───────────────────────────────────────────────────
  // 자연스러운 로고 느낌: 보통 자간, 오렌지, medium weight
  ctx.textAlign = 'center'
  ctx.fillStyle = C.orange
  ctx.font = `500 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.letterSpacing = '2px'
  ctx.fillText('감사일기', W / 2, CY + 82)
  ctx.letterSpacing = '0px'

  // 브랜드 하단 짧은 강조선
  ctx.strokeStyle = C.orange
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(W / 2 - 36, CY + 95)
  ctx.lineTo(W / 2 + 36, CY + 95)
  ctx.stroke()
  ctx.lineCap = 'butt'

  // ── 7. 메인 태그라인 ─────────────────────────────────────────────────────────
  ctx.fillStyle = C.warmDark
  ctx.font = `800 62px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('하루 3개의 감사가', W / 2, CY + 160)
  ctx.fillText('삶의 질을 바꾼다', W / 2, CY + 232)

  // ── 8. 장식 점 ───────────────────────────────────────────────────────────────
  ;[-20, 0, 20].forEach((dx) => {
    ctx.beginPath()
    ctx.arc(W / 2 + dx, CY + 272, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(224, 123, 79, 0.40)'
    ctx.fill()
  })

  // ── 9. 날짜 pill ────────────────────────────────────────────────────────────
  const [y, m, d] = note.gratitudeDate.split('-').map(Number)
  const dateStr = '☀️  ' + new Date(y, m - 1, d).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  ctx.font = `400 34px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  const dateW = ctx.measureText(dateStr).width + 64
  const pillX = (W - dateW) / 2
  const pillY = CY + 298

  roundRectPath(ctx, pillX, pillY, dateW, 56, 28)
  ctx.fillStyle = 'rgba(224, 123, 79, 0.09)'
  ctx.fill()
  roundRectPath(ctx, pillX, pillY, dateW, 56, 28)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.20)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.fillStyle = C.warmMid
  ctx.fillText(dateStr, W / 2, pillY + 37)

  // ── 10. 섹션 헤더 ────────────────────────────────────────────────────────────
  ctx.fillStyle = C.warmMute
  ctx.font = `500 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('오늘 감사한 일 3가지', W / 2, CY + 418)

  // ── 11. 감사 항목 row cards (h=120) ─────────────────────────────────────────
  const ROW_H  = 120
  const ROW_G  = 18
  const BRAD   = 28         // badge radius
  const BADGE_CX = cX + BRAD + 4
  const TEXT_X = cX + BRAD * 2 + 28
  const TEXT_W = cW - BRAD * 2 - 32

  const gratitudes = [note.gratitude1, note.gratitude2, note.gratitude3]
  let rowY = CY + 446

  for (let i = 0; i < gratitudes.length; i++) {
    const g = gratitudes[i].trim()
    if (!g) continue

    // row 배경
    roundRectPath(ctx, cX, rowY, cW, ROW_H, 22)
    ctx.fillStyle = C.itemBg
    ctx.fill()

    // 번호 뱃지 (그라데이션 원)
    const bcy = rowY + ROW_H / 2
    const grad = ctx.createRadialGradient(BADGE_CX - 5, bcy - 5, 2, BADGE_CX, bcy, BRAD)
    grad.addColorStop(0, C.orangeL)
    grad.addColorStop(1, C.orange)
    ctx.beginPath()
    ctx.arc(BADGE_CX, bcy, BRAD, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    ctx.fillStyle = '#FFFCF5'
    ctx.textAlign = 'center'
    ctx.font = `700 30px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    ctx.fillText(String(i + 1), BADGE_CX, bcy + 11)

    // 감사 텍스트 (44px, 1줄 말줄임)
    ctx.fillStyle = C.warmDark
    ctx.textAlign = 'left'
    ctx.font = `400 44px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    ctx.fillText(ellipsis(ctx, g, TEXT_W), TEXT_X, bcy + 16)

    rowY += ROW_H + ROW_G
  }

  // ── 12. 기분 pill ────────────────────────────────────────────────────────────
  const mood = MOOD_META[note.mood]
  const moodText = `오늘의 기분   ${mood.emoji}  ${mood.label}`
  const moodTop = rowY + 32

  ctx.font = `400 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  const mpW = ctx.measureText(moodText).width + 76
  const mpX = (W - mpW) / 2

  roundRectPath(ctx, mpX, moodTop, mpW, 62, 31)
  ctx.fillStyle = 'rgba(224, 123, 79, 0.08)'
  ctx.fill()
  roundRectPath(ctx, mpX, moodTop, mpW, 62, 31)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.18)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.fillStyle = C.warmMid
  ctx.textAlign = 'center'
  ctx.fillText(moodText, W / 2, moodTop + 41)

  // ── 13. 하단 구분 (카드 하단 고정 기준) ───────────────────────────────────────
  const cardBottom = CY + CH        // 1290
  const sepY       = cardBottom - 234

  // 점선 구분선
  ctx.setLineDash([5, 9])
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.24)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cX + 24, sepY)
  ctx.lineTo(cX + cW - 24, sepY)
  ctx.stroke()
  ctx.setLineDash([])

  // ── 14. 배지 정보 ─────────────────────────────────────────────────────────────
  const badgeInfo = getBadgeForCard(streak)

  // 레전드: 금색 배경 pill
  if (badgeInfo.isLegend) {
    const legendText = `${badgeInfo.emoji}  ${badgeInfo.label}`
    ctx.font = `600 40px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    const lw = ctx.measureText(legendText).width + 72
    const lx = (W - lw) / 2
    const ly = sepY + 14

    // 금색 pill 배경
    roundRectPath(ctx, lx, ly, lw, 56, 28)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.20)'
    ctx.fill()
    roundRectPath(ctx, lx, ly, lw, 56, 28)
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.40)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = C.gold
    ctx.textAlign = 'center'
    ctx.fillText(legendText, W / 2, ly + 38)
  } else {
    // 일반 배지: 텍스트만
    ctx.fillStyle = C.warmMid
    ctx.font = `600 40px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`${badgeInfo.emoji}  ${badgeInfo.label}`, W / 2, sepY + 48)
  }

  // 연속 기록 서브 텍스트
  ctx.fillStyle = badgeInfo.isLegend ? C.goldLight : C.warmMute
  ctx.font = `400 30px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText(badgeInfo.streakLine, W / 2, sepY + 92)

  // ── 15. CTA 메인 ─────────────────────────────────────────────────────────────
  ctx.fillStyle = C.orange
  ctx.font = `700 46px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('감사일기에서 나도 기록하기', W / 2, sepY + 112)

  // ── 16. URL ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = C.warmMute
  ctx.font = `400 28px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText(SERVICE_URL, W / 2, sepY + 162)

  // ── 17. 해시태그 ─────────────────────────────────────────────────────────────
  ctx.fillStyle = C.orangeL
  ctx.font = `400 28px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('#감사일기   #오늘의감사   #감사습관', W / 2, sepY + 208)

  // ── 반환 ──────────────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지 생성 실패'))),
      'image/png'
    )
  })
}
