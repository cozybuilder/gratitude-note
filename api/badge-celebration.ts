// Vercel Serverless Function (Node.js Runtime)
// 프론트엔드 → 이 함수 → OpenAI API 순서로 중계합니다.
// OPENAI_API_KEY 는 Vercel 대시보드 환경변수에만 설정합니다.
// 프론트엔드 번들에는 절대 포함되지 않습니다.
//
// ※ Edge Runtime은 process 타입 미지원으로 Node.js Runtime 사용

// ── 타입 ─────────────────────────────────────────────────────────
// @vercel/node 미설치 → Vercel Node.js 함수 최소 인터페이스 직접 정의
// (Vercel은 Express 호환 req/res를 제공합니다)

interface Req {
  method?: string
  body?: unknown
}

interface Res {
  status(code: number): Res
  json(body: unknown): void
  setHeader(name: string, value: string): Res
  end(): void
}

interface BadgeCelebrationRequest {
  badgeId: string
  badgeLabel: string
  badgeEmoji: string
  streak: number
  analyzedNoteCount: number
  sampleGratitudes: string[]
  lang: string
}

// ── CORS 헤더 ────────────────────────────────────────────────────
// Android Capacitor WebView, PWA, 브라우저 모두 허용

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function setCors(res: Res): void {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value)
  }
}

// ── 핸들러 ───────────────────────────────────────────────────────

export default async function handler(req: Req, res: Res): Promise<void> {
  setCors(res)

  // Preflight (브라우저 CORS 사전 요청)
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // API 키 확인 (서버 환경변수 — Node.js Runtime에서 process.env 정상 동작)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'API key not configured' })
    return
  }

  // 요청 바디 파싱 (Vercel Node.js 함수는 JSON body를 자동 파싱)
  const body = req.body as BadgeCelebrationRequest

  // 필수값 검증
  if (!body?.badgeId || typeof body?.streak !== 'number') {
    res.status(400).json({ error: 'Missing required fields: badgeId, streak' })
    return
  }

  const { badgeId, badgeLabel, badgeEmoji, streak, sampleGratitudes } = body

  // 프롬프트 구성
  const gratitudeExamples =
    Array.isArray(sampleGratitudes) && sampleGratitudes.length > 0
      ? `\n감사 기록 예시: ${sampleGratitudes.slice(0, 5).join(', ')}`
      : ''

  const userPrompt =
    `${streak}일 연속 감사일기를 작성하여 "${badgeEmoji} ${badgeLabel}" 배지를 획득했습니다.` +
    gratitudeExamples +
    `\n\n이 사람의 꾸준한 노력을 진심으로 축하하고, 지금까지의 여정을 따뜻하게 회고하는 메시지를 3~5문장으로 작성해주세요.`

  // OpenAI API 호출
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              '당신은 감사일기 앱의 따뜻한 코치입니다. ' +
              '사용자의 꾸준한 감사 기록 습관을 진심으로 축하하고 회고하는 한국어 메시지를 작성합니다. ' +
              '메시지는 따뜻하고 개인적이며, 과하지 않게 3~5문장으로 작성하세요.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    })

    if (!openaiRes.ok) {
      res.status(502).json({ error: 'OpenAI API error' })
      return
    }

    const data = (await openaiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const message = data.choices?.[0]?.message?.content?.trim()
    if (!message) {
      res.status(502).json({ error: 'Empty response from AI' })
      return
    }

    res.status(200).json({ message, source: 'ai' })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
}
