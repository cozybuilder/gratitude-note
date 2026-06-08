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
  // 높은 조건부터 탐색 (ACHIEVEMENT_BADGES 는 7일부터 시작)
  const badge = [...ACHIEVEMENT_BADGES].reverse().find((b) => streak >= b.minStreak)

  if (!badge) {
    // streak < 7 → 씨앗 단계 (배지 시스템과 동일한 시작 배지)
    return {
      emoji: '🌰',
      label: '감사 씨앗',
      streakLine: streak > 0 ? `${streak}일 연속 감사 기록` : '감사 여정을 시작했습니다',
      isLegend: false,
    }
  }

  return {
    emoji: badge.emoji,
    label: badge.label,
    streakLine: badge.isLegend
      ? `${streak}일 연속 · 전설적인 기록 달성`
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

/**
 * 텍스트를 maxWidth 기준으로 최대 maxLines 줄로 래핑.
 * 마지막 줄이 넘치면 말줄임 처리.
 */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const lines: string[] = []
  let remaining = text.trim()

  while (remaining.length > 0 && lines.length < maxLines) {
    if (ctx.measureText(remaining).width <= maxWidth) {
      lines.push(remaining)
      break
    }
    // 들어갈 수 있는 최대 문자 수를 선형 탐색
    let fit = 0
    for (let i = 1; i <= remaining.length; i++) {
      if (ctx.measureText(remaining.slice(0, i)).width <= maxWidth) {
        fit = i
      } else {
        break
      }
    }
    if (fit === 0) fit = 1 // 최소 1글자

    if (lines.length === maxLines - 1) {
      // 마지막 줄 — 남은 전체를 말줄임
      lines.push(ellipsis(ctx, remaining, maxWidth))
      break
    }
    lines.push(remaining.slice(0, fit))
    remaining = remaining.slice(fit)
  }

  return lines
}

// ─── 메인 생성 함수 ────────────────────────────────────────────────────────────

export async function generateShareCard(note: Note, streak = 0): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 1. Hero 배경 ─────────────────────────────────────────────────────────────
  const heroImg = await loadImage(SEASON_IMAGES[getCurrentSeason()])
  const scale = Math.max(W / heroImg.width, H / heroImg.height)
  const sw = heroImg.width * scale
  const sh = heroImg.height * scale
  const sx = (W - sw) / 2
  const sy = (H - sh) / 2

  ctx.filter = 'blur(6px) brightness(1.04) saturate(1.08)'
  ctx.drawImage(heroImg, sx - 24, sy - 24, sw + 48, sh + 48)
  ctx.filter = 'none'

  // ── 2. 따뜻한 크림 오버레이 ──────────────────────────────────────────────────
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

  // ── 5. 카드 ──────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 상단 섹션 — 여백 압축 (기존 대비 ~60px 절감)
  // ─────────────────────────────────────────────────────────────────────────────

  // ── 6. 브랜드명 ─────────────────────────────────────────────────────────────
  ctx.textAlign = 'center'
  ctx.fillStyle = C.orange
  ctx.font = `500 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.letterSpacing = '2px'
  ctx.fillText('감사일기', W / 2, CY + 68)        // 기존 +82 → +68
  ctx.letterSpacing = '0px'

  ctx.strokeStyle = C.orange
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(W / 2 - 36, CY + 80)               // 기존 +95 → +80
  ctx.lineTo(W / 2 + 36, CY + 80)
  ctx.stroke()
  ctx.lineCap = 'butt'

  // ── 7. 메인 태그라인 ─────────────────────────────────────────────────────────
  ctx.fillStyle = C.warmDark
  ctx.font = `800 62px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('하루 3개의 감사가', W / 2, CY + 138)  // 기존 +160 → +138
  ctx.fillText('삶의 질을 바꾼다',  W / 2, CY + 202)  // 기존 +232 → +202

  // ── 8. 장식 점 ───────────────────────────────────────────────────────────────
  ;[-20, 0, 20].forEach((dx) => {
    ctx.beginPath()
    ctx.arc(W / 2 + dx, CY + 232, 4, 0, Math.PI * 2) // 기존 +272 → +232
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
  const pillY = CY + 252                            // 기존 +298 → +252

  roundRectPath(ctx, pillX, pillY, dateW, 54, 27)
  ctx.fillStyle = 'rgba(224, 123, 79, 0.09)'
  ctx.fill()
  roundRectPath(ctx, pillX, pillY, dateW, 54, 27)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.20)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.fillStyle = C.warmMid
  ctx.fillText(dateStr, W / 2, pillY + 35)

  // ── 10. 섹션 헤더 ────────────────────────────────────────────────────────────
  ctx.fillStyle = C.warmMute
  ctx.font = `500 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('오늘 감사한 일 3가지', W / 2, CY + 358) // 기존 +418 → +358

  // ─────────────────────────────────────────────────────────────────────────────
  // 감사 항목 — ROW_H 120→160, 폰트 44→36px, 최대 2줄 래핑
  // ─────────────────────────────────────────────────────────────────────────────

  const ROW_H  = 160                // 기존 120 → 160 (+40px)
  const ROW_G  = 12                 // 기존 18  → 12
  const BRAD   = 28
  const BADGE_CX = cX + BRAD + 4
  const TEXT_X   = cX + BRAD * 2 + 28
  const TEXT_W   = cW - BRAD * 2 - 32
  const TEXT_FONT = 36              // 기존 44  → 36 (-18%)
  const LINE_H   = 44              // 줄 간격 (36px 폰트 기준)

  const gratitudes = [note.gratitude1, note.gratitude2, note.gratitude3]
  let rowY = CY + 386               // 기존 +446 → +386

  for (let i = 0; i < gratitudes.length; i++) {
    const g = gratitudes[i].trim()
    if (!g) continue

    // row 배경
    roundRectPath(ctx, cX, rowY, cW, ROW_H, 22)
    ctx.fillStyle = C.itemBg
    ctx.fill()

    // 번호 뱃지
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

    // 감사 텍스트 — 최대 2줄 래핑
    ctx.textAlign = 'left'
    ctx.font = `400 ${TEXT_FONT}px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    const textLines = wrapLines(ctx, g, TEXT_W, 2)

    // 줄 수에 따라 수직 중앙 정렬
    const totalTextH = (textLines.length - 1) * LINE_H
    const baseY = bcy - totalTextH / 2 + TEXT_FONT * 0.36

    ctx.fillStyle = C.warmDark
    textLines.forEach((line, li) => {
      ctx.fillText(line, TEXT_X, baseY + li * LINE_H)
    })

    rowY += ROW_H + ROW_G
  }

  // ── 12. 기분 pill ────────────────────────────────────────────────────────────
  const mood = MOOD_META[note.mood]
  const moodText = `오늘의 기분   ${mood.emoji}  ${mood.label}`
  const moodTop = rowY + 18                         // 기존 rowY+32 → rowY+18

  ctx.font = `400 36px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  const mpW = ctx.measureText(moodText).width + 76
  const mpX = (W - mpW) / 2

  roundRectPath(ctx, mpX, moodTop, mpW, 58, 29)    // 기존 h=62 → 58
  ctx.fillStyle = 'rgba(224, 123, 79, 0.08)'
  ctx.fill()
  roundRectPath(ctx, mpX, moodTop, mpW, 58, 29)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.18)'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.fillStyle = C.warmMid
  ctx.textAlign = 'center'
  ctx.fillText(moodText, W / 2, moodTop + 38)

  // ── 13. 하단 구분선 (카드 하단 고정 기준) ─────────────────────────────────────
  const cardBottom = CY + CH           // 1290
  const sepY       = cardBottom - 220  // 기존 -234 → -220 (하단 압축)

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

  if (badgeInfo.isLegend) {
    const legendText = `${badgeInfo.emoji}  ${badgeInfo.label}`
    ctx.font = `600 40px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    const lw = ctx.measureText(legendText).width + 72
    const lx = (W - lw) / 2
    const ly = sepY + 12

    roundRectPath(ctx, lx, ly, lw, 54, 27)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.20)'
    ctx.fill()
    roundRectPath(ctx, lx, ly, lw, 54, 27)
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.40)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = C.gold
    ctx.textAlign = 'center'
    ctx.fillText(legendText, W / 2, ly + 36)
  } else {
    ctx.fillStyle = C.warmMid
    ctx.font = `600 40px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(`${badgeInfo.emoji}  ${badgeInfo.label}`, W / 2, sepY + 44) // 기존 +48 → +44
  }

  // 연속 기록 서브 텍스트
  ctx.fillStyle = badgeInfo.isLegend ? C.goldLight : C.warmMute
  ctx.font = `400 30px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText(badgeInfo.streakLine, W / 2, sepY + 82)  // 기존 +92 → +82

  // ── 15. 감성 문구 ────────────────────────────────────────────────────────────
  ctx.fillStyle = C.orange
  ctx.font = `700 44px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`
  ctx.fillText('작은 감사가 행복을 만듭니다', W / 2, sepY + 130)  // 기존 +148 → +130

  // ── 16. URL (문구 아래 작게) ─────────────────────────────────────────────────
  ctx.fillStyle = C.warmMute
  ctx.font = `400 24px 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif` // 기존 28px → 24px
  ctx.fillText(SERVICE_URL, W / 2, sepY + 170)  // 기존 +196 → +170

  // ── 반환 ──────────────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지 생성 실패'))),
      'image/png'
    )
  })
}
