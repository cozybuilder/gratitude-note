// Vercel Serverless Function (Edge Runtime)
// 프론트엔드 → 이 함수 → OpenAI API 순서로 중계합니다.
// OPENAI_API_KEY 는 Vercel 대시보드 환경변수에만 설정합니다.
// 프론트엔드 번들에는 절대 포함되지 않습니다.

export const config = { runtime: 'edge' }

// ── 타입 ─────────────────────────────────────────────────────────

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

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// ── 핸들러 ───────────────────────────────────────────────────────

export default async function handler(req: Request): Promise<Response> {
  // Preflight (브라우저 CORS 사전 요청)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  // API 키 확인 (서버 환경변수)
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured' }, 500)
  }

  // 요청 바디 파싱
  let body: BadgeCelebrationRequest
  try {
    body = (await req.json()) as BadgeCelebrationRequest
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const { badgeId, badgeLabel, badgeEmoji, streak, sampleGratitudes } = body

  // 필수값 검증
  if (!badgeId || typeof streak !== 'number') {
    return jsonResponse({ error: 'Missing required fields: badgeId, streak' }, 400)
  }

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
      return jsonResponse({ error: 'OpenAI API error' }, 502)
    }

    const data = (await openaiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const message = data.choices?.[0]?.message?.content?.trim()
    if (!message) {
      return jsonResponse({ error: 'Empty response from AI' }, 502)
    }

    return jsonResponse({ message, source: 'ai' }, 200)
  } catch {
    return jsonResponse({ error: 'Internal server error' }, 500)
  }
}
