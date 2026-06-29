import QRCode from 'qrcode'
import type { Note, Mood } from '../types/note'
import { ACHIEVEMENT_BADGES } from './achievement'

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const W = 1080
const H = 1350
const SERVICE_URL    = 'cozybuilder.co.kr/programs/r'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cozybuilder.gratitudediary'

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

// ─── 폰트 ─────────────────────────────────────────────────────────────────────

const FONT = "'OnGel', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
let fontLoaded = false

async function ensureFont(): Promise<void> {
  if (fontLoaded) return
  try {
    const face = new FontFace('OnGel', 'url(/font/ongel.ttf) format("truetype")')
    await face.load()
    document.fonts.add(face)
    fontLoaded = true
  } catch {
    // 폰트 로드 실패 시 fallback으로 계속 진행
  }
}

// ─── 배지 헬퍼 ────────────────────────────────────────────────────────────────

interface ShareBadgeInfo {
  emoji: string
  label: string
  streakLine: string
  isLegend: boolean
}

function getBadgeForCard(streak: number): ShareBadgeInfo {
  const badge = [...ACHIEVEMENT_BADGES].reverse().find((b) => streak >= b.minStreak)
  if (!badge) {
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

function ellipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 0 && ctx.measureText(t + '…').width > maxWidth) {
    t = t.slice(0, -1)
  }
  return t + '…'
}

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
    let fit = 0
    for (let i = 1; i <= remaining.length; i++) {
      if (ctx.measureText(remaining.slice(0, i)).width <= maxWidth) fit = i
      else break
    }
    if (fit === 0) fit = 1
    if (lines.length === maxLines - 1) { lines.push(ellipsis(ctx, remaining, maxWidth)); break }
    lines.push(remaining.slice(0, fit))
    remaining = remaining.slice(fit)
  }
  return lines
}

async function generateQRCanvas(size: number): Promise<HTMLCanvasElement> {
  const qrCanvas = document.createElement('canvas')
  await QRCode.toCanvas(qrCanvas, PLAY_STORE_URL, {
    width: size,
    margin: 1,
    color: { dark: '#3d2e26', light: '#FFFCF5' },
  })
  return qrCanvas
}

// ─── 메인 생성 함수 ────────────────────────────────────────────────────────────

export async function generateShareCard(note: Note, streak = 0): Promise<Blob> {
  const [, [heroImg, iconImg], qrCanvas] = await Promise.all([
    ensureFont(),
    Promise.all([
      loadImage(SEASON_IMAGES[getCurrentSeason()]),
      loadImage('/icons/icon-192x192.png').catch(() => null as HTMLImageElement | null),
    ]),
    generateQRCanvas(144),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 1. Hero 배경 ─────────────────────────────────────────────────────────────
  const scale = Math.max(W / heroImg.width, H / heroImg.height)
  const sw = heroImg.width * scale, sh = heroImg.height * scale
  const sx = (W - sw) / 2, sy = (H - sh) / 2
  ctx.filter = 'blur(6px) brightness(1.04) saturate(1.08)'
  ctx.drawImage(heroImg, sx - 24, sy - 24, sw + 48, sh + 48)
  ctx.filter = 'none'

  // ── 2. 크림 오버레이 ──────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255, 248, 234, 0.38)'
  ctx.fillRect(0, 0, W, H)

  // ── 3. 상단/하단 그라데이션 ──────────────────────────────────────────────────
  const topG = ctx.createLinearGradient(0, 0, 0, 180)
  topG.addColorStop(0, 'rgba(255, 246, 228, 0.62)')
  topG.addColorStop(1, 'rgba(255, 246, 228, 0)')
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, 180)

  const botG = ctx.createLinearGradient(0, H - 180, 0, H)
  botG.addColorStop(0, 'rgba(255, 244, 220, 0)')
  botG.addColorStop(1, 'rgba(255, 240, 210, 0.70)')
  ctx.fillStyle = botG; ctx.fillRect(0, H - 180, W, 180)

  // ── 4. 카드 ──────────────────────────────────────────────────────────────────
  const CX = 44, CY = 60, CW = W - 88, CH = 1230, CR = 64
  ctx.save()
  ctx.shadowColor = 'rgba(110, 65, 25, 0.20)'; ctx.shadowBlur = 56; ctx.shadowOffsetY = 16
  roundRectPath(ctx, CX, CY, CW, CH, CR); ctx.fillStyle = C.cardBg; ctx.fill()
  ctx.restore()
  roundRectPath(ctx, CX, CY, CW, CH, CR)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.18)'; ctx.lineWidth = 1.5; ctx.stroke()

  const PAD = 70
  const cX = CX + PAD
  const cW = CW - PAD * 2

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. 앱 아이콘(좌) + QR코드(우) — 나란히
  // ─────────────────────────────────────────────────────────────────────────────
  const ICON_SIZE = 144, QR_SIZE = 144, PAIR_GAP = 40
  const PAIR_W = ICON_SIZE + PAIR_GAP + QR_SIZE   // 328
  const ICON_X = (W - PAIR_W) / 2                 // 376
  const QR_X   = ICON_X + ICON_SIZE + PAIR_GAP    // 560
  const PAIR_Y = CY + 44                          // 104

  if (iconImg) {
    ctx.save()
    roundRectPath(ctx, ICON_X, PAIR_Y, ICON_SIZE, ICON_SIZE, 28); ctx.clip()
    ctx.drawImage(iconImg, ICON_X, PAIR_Y, ICON_SIZE, ICON_SIZE)
    ctx.restore()
    roundRectPath(ctx, ICON_X, PAIR_Y, ICON_SIZE, ICON_SIZE, 28)
    ctx.strokeStyle = 'rgba(224, 123, 79, 0.22)'; ctx.lineWidth = 1.5; ctx.stroke()
  }

  ctx.save()
  roundRectPath(ctx, QR_X, PAIR_Y, QR_SIZE, QR_SIZE, 16)
  ctx.fillStyle = '#FFFCF5'; ctx.fill(); ctx.clip()
  ctx.drawImage(qrCanvas, QR_X, PAIR_Y, QR_SIZE, QR_SIZE)
  ctx.restore()
  roundRectPath(ctx, QR_X, PAIR_Y, QR_SIZE, QR_SIZE, 16)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.22)'; ctx.lineWidth = 1.5; ctx.stroke()

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. 상단 2줄 태그라인 (아이콘 아래)
  //    "오늘의 감사한 일을 공유해보세요."
  //    "작은 감사가 누군가의 하루를 따뜻하게 만듭니다."
  // ─────────────────────────────────────────────────────────────────────────────
  // PAIR_Y + ICON_SIZE = 248, 첫 줄 baseline = 248+28+36 = 312
  ctx.textAlign = 'center'
  ctx.fillStyle = C.orange
  ctx.font = `400 36px ${FONT}`
  ctx.fillText('오늘의 감사한 일을 공유해보세요.', W / 2, CY + 252)   // ≈ 312
  ctx.fillStyle = C.warmMid
  ctx.font = `400 32px ${FONT}`
  ctx.fillText('작은 감사가 누군가의 하루를 따뜻하게 만듭니다.', W / 2, CY + 292) // ≈ 352

  // ── 7. 장식 점 ───────────────────────────────────────────────────────────────
  ;[-20, 0, 20].forEach((dx) => {
    ctx.beginPath()
    ctx.arc(W / 2 + dx, CY + 316, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(224, 123, 79, 0.40)'; ctx.fill()
  })

  // ── 8. 날짜 pill ────────────────────────────────────────────────────────────
  const [y, m, d] = note.gratitudeDate.split('-').map(Number)
  const dateStr = '☀️  ' + new Date(y, m - 1, d).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  ctx.font = `400 34px ${FONT}`
  const dateW = ctx.measureText(dateStr).width + 64
  const pillX = (W - dateW) / 2
  const pillY = CY + 332   // ≈ 392

  roundRectPath(ctx, pillX, pillY, dateW, 54, 27)
  ctx.fillStyle = 'rgba(224, 123, 79, 0.09)'; ctx.fill()
  roundRectPath(ctx, pillX, pillY, dateW, 54, 27)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.20)'; ctx.lineWidth = 1.2; ctx.stroke()
  ctx.fillStyle = C.warmMid
  ctx.fillText(dateStr, W / 2, pillY + 35)

  // ── 9. 서브 슬로건 ───────────────────────────────────────────────────────────
  // (구 "오늘 감사한 일 3가지" 자리 → "하루 3개의 감사가 삶의 질을 바꿉니다")
  ctx.fillStyle = C.warmMute
  ctx.font = `500 38px ${FONT}`
  ctx.fillText('하루 3개의 감사가 삶의 질을 바꿉니다', W / 2, CY + 422) // ≈ 482

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. 감사 항목 3개
  // ─────────────────────────────────────────────────────────────────────────────
  const ROW_H    = 168
  const ROW_G    = 14
  const BRAD     = 28
  const BADGE_CX = cX + BRAD + 4
  const TEXT_X   = cX + BRAD * 2 + 28
  const TEXT_W   = cW - BRAD * 2 - 32
  const TEXT_FONT = 40
  const LINE_H   = 50

  const gratitudes = [note.gratitude1, note.gratitude2, note.gratitude3]
  let rowY = CY + 448   // ≈ 508

  for (let i = 0; i < gratitudes.length; i++) {
    const g = gratitudes[i].trim()
    if (!g) continue

    roundRectPath(ctx, cX, rowY, cW, ROW_H, 22)
    ctx.fillStyle = C.itemBg; ctx.fill()

    const bcy = rowY + ROW_H / 2
    const grad = ctx.createRadialGradient(BADGE_CX - 5, bcy - 5, 2, BADGE_CX, bcy, BRAD)
    grad.addColorStop(0, C.orangeL); grad.addColorStop(1, C.orange)
    ctx.beginPath(); ctx.arc(BADGE_CX, bcy, BRAD, 0, Math.PI * 2)
    ctx.fillStyle = grad; ctx.fill()

    ctx.fillStyle = '#FFFCF5'; ctx.textAlign = 'center'
    ctx.font = `600 30px ${FONT}`
    ctx.fillText(String(i + 1), BADGE_CX, bcy + 11)

    ctx.textAlign = 'left'
    ctx.font = `400 ${TEXT_FONT}px ${FONT}`
    const textLines = wrapLines(ctx, g, TEXT_W, 2)
    const totalTextH = (textLines.length - 1) * LINE_H
    const baseY = bcy - totalTextH / 2 + TEXT_FONT * 0.36
    ctx.fillStyle = C.warmDark
    textLines.forEach((line, li) => ctx.fillText(line, TEXT_X, baseY + li * LINE_H))

    rowY += ROW_H + ROW_G
  }

  // ── 11. 기분 pill ────────────────────────────────────────────────────────────
  const mood = MOOD_META[note.mood]
  const moodText = `오늘의 기분   ${mood.emoji}  ${mood.label}`
  const moodTop = rowY + 20

  ctx.font = `400 36px ${FONT}`
  const mpW = ctx.measureText(moodText).width + 76
  const mpX = (W - mpW) / 2
  roundRectPath(ctx, mpX, moodTop, mpW, 58, 29)
  ctx.fillStyle = 'rgba(224, 123, 79, 0.08)'; ctx.fill()
  roundRectPath(ctx, mpX, moodTop, mpW, 58, 29)
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.18)'; ctx.lineWidth = 1.2; ctx.stroke()
  ctx.fillStyle = C.warmMid; ctx.textAlign = 'center'
  ctx.fillText(moodText, W / 2, moodTop + 38)

  // ── 12. 구분선 ────────────────────────────────────────────────────────────────
  const cardBottom = CY + CH          // 1290
  const sepY = cardBottom - 185

  ctx.setLineDash([5, 9])
  ctx.strokeStyle = 'rgba(224, 123, 79, 0.24)'; ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.moveTo(cX + 24, sepY); ctx.lineTo(cX + cW - 24, sepY); ctx.stroke()
  ctx.setLineDash([])

  // ── 13. 배지 정보 ─────────────────────────────────────────────────────────────
  const badgeInfo = getBadgeForCard(streak)

  if (badgeInfo.isLegend) {
    const legendText = `${badgeInfo.emoji}  ${badgeInfo.label}`
    ctx.font = `600 42px ${FONT}`
    const lw = ctx.measureText(legendText).width + 72
    const lx = (W - lw) / 2, ly = sepY + 14
    roundRectPath(ctx, lx, ly, lw, 54, 27)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.20)'; ctx.fill()
    roundRectPath(ctx, lx, ly, lw, 54, 27)
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.40)'; ctx.lineWidth = 1.5; ctx.stroke()
    ctx.fillStyle = C.gold; ctx.textAlign = 'center'
    ctx.fillText(legendText, W / 2, ly + 36)
  } else {
    ctx.fillStyle = C.warmMid
    ctx.font = `600 44px ${FONT}`
    ctx.textAlign = 'center'
    ctx.fillText(`${badgeInfo.emoji}  ${badgeInfo.label}`, W / 2, sepY + 46)
  }

  // 연속 기록
  ctx.fillStyle = badgeInfo.isLegend ? C.goldLight : C.warmMute
  ctx.font = `400 32px ${FONT}`
  ctx.fillText(badgeInfo.streakLine, W / 2, sepY + 96)

  // ── 14. URL (크게, 충분한 여백) ──────────────────────────────────────────────
  ctx.fillStyle = C.warmMid
  ctx.font = `400 32px ${FONT}`
  ctx.fillText(SERVICE_URL, W / 2, sepY + 150)

  // ── 반환 ──────────────────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지 생성 실패'))),
      'image/png'
    )
  })
}
