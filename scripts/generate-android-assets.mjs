/**
 * Android 아이콘 & 스플래시 생성 스크립트
 * 소스: public/icons/app-icon-1024.png
 * 실행: node scripts/generate-android-assets.mjs
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const SOURCE  = 'public/icons/app-icon-1024.png'
const RES     = 'android/app/src/main/res'
const BRAND   = { r: 255, g: 249, b: 245, alpha: 1 }  // #FFF9F5

// ── 1. 일반 아이콘 (ic_launcher.png) ──────────────────────────────
const MIPMAP = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
}

// ── 2. Adaptive 포그라운드 (ic_launcher_foreground.png) ──────────
// 전체 캔버스 크기: mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432
// 아이콘은 중앙 60% 영역에 배치 (구글 safe zone 권장)
const FOREGROUND = {
  'mipmap-mdpi':    108,
  'mipmap-hdpi':    162,
  'mipmap-xhdpi':   216,
  'mipmap-xxhdpi':  324,
  'mipmap-xxxhdpi': 432,
}

// ── 3. 스플래시 (splash.png) ─────────────────────────────────────
const SPLASH = {
  'drawable':              { w: 1280, h: 1920 },
  'drawable-port-mdpi':    { w: 320,  h: 480  },
  'drawable-port-hdpi':    { w: 480,  h: 800  },
  'drawable-port-xhdpi':   { w: 720,  h: 1280 },
  'drawable-port-xxhdpi':  { w: 960,  h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
  'drawable-land-mdpi':    { w: 480,  h: 320  },
  'drawable-land-hdpi':    { w: 800,  h: 480  },
  'drawable-land-xhdpi':   { w: 1280, h: 720  },
  'drawable-land-xxhdpi':  { w: 1600, h: 960  },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
}

// ── 헬퍼: 원형 마스크 버퍼 ───────────────────────────────────────
function circleSvg(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
  )
}

async function run() {
  const srcBuf = fs.readFileSync(SOURCE)
  let count = 0

  // ── 1. 일반 아이콘 + 원형 아이콘 ──────────────────────────────
  console.log('▶ 아이콘 생성 중...')
  for (const [folder, size] of Object.entries(MIPMAP)) {
    const dir = path.join(RES, folder)

    // ic_launcher.png (정사각형)
    await sharp(srcBuf)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'))
    count++

    // ic_launcher_round.png (원형)
    const resized = await sharp(srcBuf).resize(size, size).png().toBuffer()
    await sharp(resized)
      .composite([{ input: circleSvg(size), blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'))
    count++

    console.log(`  ✅ ${folder}: ic_launcher ${size}px, ic_launcher_round ${size}px`)
  }

  // ── 2. Adaptive 포그라운드 ────────────────────────────────────
  console.log('\n▶ Adaptive 포그라운드 생성 중...')
  for (const [folder, total] of Object.entries(FOREGROUND)) {
    const dir  = path.join(RES, folder)
    const icon = Math.round(total * 0.6)   // 60% 영역 사용
    const pad  = Math.round((total - icon) / 2)

    const iconBuf = await sharp(srcBuf).resize(icon, icon).png().toBuffer()

    await sharp({
      create: { width: total, height: total, channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 } }
    })
      .composite([{ input: iconBuf, left: pad, top: pad }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'))

    count++
    console.log(`  ✅ ${folder}: foreground ${total}px (icon ${icon}px)`)
  }

  // ── 3. 스플래시 ───────────────────────────────────────────────
  console.log('\n▶ 스플래시 생성 중...')
  for (const [folder, { w, h }] of Object.entries(SPLASH)) {
    const dir     = path.join(RES, folder)
    const shorter = Math.min(w, h)
    const logoSz  = Math.round(shorter * 0.28)   // 짧은 변의 28%
    const logoBuf = await sharp(srcBuf).resize(logoSz, logoSz).png().toBuffer()

    await sharp({
      create: { width: w, height: h, channels: 4, background: BRAND }
    })
      .composite([{
        input: logoBuf,
        left:  Math.round((w - logoSz) / 2),
        top:   Math.round((h - logoSz) / 2),
      }])
      .png()
      .toFile(path.join(dir, 'splash.png'))

    count++
    console.log(`  ✅ ${folder}: ${w}x${h} (logo ${logoSz}px)`)
  }

  console.log(`\n✅ 완료 — 총 ${count}개 파일 생성`)
}

run().catch(err => { console.error('❌ 오류:', err); process.exit(1) })
