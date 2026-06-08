import type { Mood, Note } from '../types/note'
import type { AchievementBadge } from './achievement'

const MESSAGE_POOL: Record<Mood, string[]> = {
  great: [
    '오늘 정말 빛나는 하루를 보내셨군요. 그 감사함이 내일도 이어지길 바랍니다. ✨',
    '좋은 일들을 알아채는 눈이 정말 아름답습니다. 오늘도 수고하셨어요.',
    '감사한 마음이 넘치는 하루였군요. 그 에너지가 주변까지 환하게 만들었을 거예요.',
  ],
  good: [
    '오늘 하루도 감사한 순간들을 찾아내셨군요. 그 작은 노력이 쌓여 큰 행복이 됩니다.',
    '작은 것에 감사할 줄 아는 마음이 가장 큰 힘이에요. 오늘도 잘 하셨습니다.',
    '평범한 하루 속에서 빛나는 것들을 발견하셨네요. 내일도 좋은 하루 되세요.',
  ],
  neutral: [
    '무덤덤한 날에도 감사함을 찾으셨군요. 그것만으로도 충분히 대단합니다.',
    '그저 그런 하루처럼 느껴져도, 기록하는 습관이 당신을 조금씩 바꿔가고 있어요.',
    '평온한 하루도 소중한 하루입니다. 오늘 감사 노트를 쓴 것만으로도 잘 하셨어요.',
  ],
  bad: [
    '힘든 날에도 감사함을 찾으셨군요. 그 용기가 정말 대단합니다.',
    '어려운 하루였지만, 그 안에서 빛을 찾으셨네요. 내일은 조금 더 가벼운 하루가 되길 바랍니다.',
    '오늘 고생 많으셨어요. 힘든 날에도 글을 쓰는 당신이 자랑스럽습니다.',
  ],
  terrible: [
    '정말 힘든 하루였을 텐데 여기까지 와 주셨군요. 오늘 하루 잘 버티셨습니다.',
    '가장 힘든 날에도 감사함을 찾으려 한 당신에게 박수를 보냅니다. 내일은 달라질 거예요.',
    '많이 지치셨겠지만, 이렇게 기록해 주셔서 고맙습니다. 오늘 밤은 푹 쉬세요.',
  ],
}

export function generateAiMessage(
  gratitude1: string,
  gratitude2: string,
  gratitude3: string,
  mood: Mood
): string {
  const pool = MESSAGE_POOL[mood]
  const base = pool[Math.floor(Math.random() * pool.length)]

  // 첫 번째 감사 내용을 메시지에 자연스럽게 반영
  const firstGratitude = [gratitude1, gratitude2, gratitude3].find((g) => g.trim() !== '')
  if (firstGratitude && firstGratitude.length <= 20) {
    return `'${firstGratitude}'에 감사함을 느끼셨군요. ${base}`
  }

  return base
}

// ── 배지 획득 특별 축하/회고 메시지 ──────────────────────────────

export interface BadgeCelebrationParams {
  badge: AchievementBadge
  streak: number
  notesSinceLastBadge: Note[]
}

// 배지별 로컬 응원 메시지 풀 (5가지 변형)
const BADGE_CELEBRATION_POOL: Record<string, string[]> = {
  sprout: [
    '일주일 동안 매일 감사함을 찾아내셨군요. 작은 습관 하나가 마음을 얼마나 따뜻하게 만드는지, 조금씩 느끼고 계시지 않나요? 처음 7일이 가장 어렵습니다. 그 고비를 넘기셨으니 앞으로의 여정이 더욱 기대됩니다. 🌱',
    '7일간의 감사 기록이 쌓였습니다. 바쁜 일상 속에서도 잠시 멈춰 감사를 찾는 시간을 만들어 오셨군요. 그 조용한 노력이 당신의 마음 안에 씨앗을 심고 있어요. 앞으로도 이 아름다운 습관을 이어가 주세요. 🌿',
    '7일, 첫 번째 이정표에 도착하셨습니다. 매일 감사를 찾는 일이 처음엔 어색했을 텐데, 여기까지 포기하지 않고 오셨군요. 이 작은 씨앗이 머지않아 커다란 나무로 자라날 거예요. 응원합니다! 🌱',
    '일주일간 하루도 빠짐없이 감사를 기록하셨어요. 그 꾸준함이 정말 소중합니다. 감사하는 마음은 근육과 같아서, 매일 쓸수록 더 강해진다고 해요. 당신은 지금 그 근육을 키우고 계십니다. 🌿',
    '7일이 지났습니다. 하루하루 감사를 찾는 연습이 쌓여 어느새 이 자리까지 오셨네요. 작은 것에도 감사할 줄 아는 눈을 갖게 되는 것, 그것이 이 여정에서 얻는 가장 큰 선물입니다. 🌱',
  ],
  habit: [
    '한 달 동안 하루도 빠짐없이 감사를 기록해 오셨어요. 처음엔 어색했던 이 습관이 이제 자연스러운 일상이 되었을 거예요. 감사하는 눈으로 세상을 바라보는 것, 그것이 가장 큰 변화입니다. 30일의 여정을 정말 수고 많으셨어요. 🍀',
    '30일이 지났습니다. 한 달 전의 당신과 지금의 당신, 분명히 무언가 달라졌을 거예요. 매일 세 가지 감사를 찾는 과정에서 작은 것들의 소중함이 더 크게 보이기 시작하셨나요? 이 습관이 앞으로도 오래오래 이어지길 바랍니다. ✨',
    '30일 연속, 진정한 습관의 시작입니다. 많은 사람들이 도전하지만 한 달을 채우는 건 쉽지 않아요. 당신은 해냈습니다. 이제 감사는 선택이 아닌 자연스러운 일상이 되어가고 있어요. 정말 자랑스럽습니다. 🍀',
    '한 달간의 감사 여정, 수고 많으셨습니다. 30번의 하루를 감사로 물들인 당신의 마음이 얼마나 따뜻해졌을지 느껴집니다. 주변 사람들도 분명히 달라진 당신을 느끼고 있을 거예요. 계속 이어가 주세요! ✨',
    '30일. 쉬운 날도, 힘든 날도 있었겠지만 모든 날을 기록으로 남기셨네요. 감사를 찾는 습관이 이제 당신의 하루 루틴이 된 것 같아요. 그 루틴이 앞으로의 삶을 조금씩 더 빛나게 만들어 줄 거예요. 🍀',
  ],
  growth: [
    '두 달간의 감사 기록, 정말 대단합니다. 감사의 씨앗이 이제 제법 뿌리를 내리고 있어요. 어떤 날은 힘들었을 테고, 어떤 날은 그 힘든 날에도 감사할 것을 찾아내셨겠죠. 60일 동안 그 과정을 이어온 당신이 참 자랑스럽습니다. 🌳',
    '60일째를 맞이하셨습니다. 감사를 기록하는 것이 처음엔 숙제처럼 느껴졌다면, 이제는 하루를 마무리하는 자연스러운 의식이 되었을 거예요. 그 변화가 작지 않습니다. 앞으로 남은 여정도 오늘처럼 꾸준히 이어가시길 응원합니다. 🌿',
    '60일, 두 달의 감사 기록이 완성됐습니다. 이 기간 동안 당신의 시선이 얼마나 달라졌는지 스스로 느끼시나요? 불평하던 순간에도 감사를 찾는 능력, 그것이 바로 성장의 증거입니다. 앞으로도 함께해요. 🌳',
    '두 달 동안 감사를 찾는 눈을 키워오셨어요. 작은 것에도 아름다움을 발견하는 능력이 생겼을 거예요. 그 능력은 평생 당신 곁에 남을 소중한 선물입니다. 60일간의 여정, 정말 대단합니다. 🌿',
    '60일이 지났습니다. 처음 시작할 때 이 자리까지 올 거라 상상했나요? 꾸준히 자신을 믿고 나아온 당신이 정말 멋집니다. 감사의 뿌리가 깊어질수록 삶은 더 풍요로워집니다. 앞으로도 함께 성장해요. 🌳',
  ],
  practice: [
    '3개월, 90일간의 감사 실천을 완주하셨습니다. 90일이면 새로운 습관이 삶에 깊이 새겨진다고 해요. 이제 감사는 당신의 일부가 되었습니다. 스스로에게 충분히 박수를 보내 주세요. 정말 대단하십니다. ⭐',
    '90일 동안 자신을 믿고 꾸준히 걸어오셨군요. 힘든 날도, 바쁜 날도, 기분이 좋지 않은 날도 있었겠지만 그 모든 날들을 기록으로 남기셨네요. 그 성실함이 당신 삶의 든든한 기반이 되고 있습니다. 앞으로도 함께 걸어가요. 🌟',
    '90일, 3개월. 이 숫자가 얼마나 의미 있는지 아시나요? 새로운 습관이 완전히 몸에 배는 데 딱 이만큼의 시간이 필요하다고 해요. 이제 감사는 당신의 본능이 되었습니다. 정말 수고 많으셨어요. ⭐',
    '세 달 동안 단 하루도 포기하지 않으셨군요. 그 의지와 성실함이 정말 대단합니다. 감사를 실천하는 삶이 어떤 것인지, 이제 누구보다 잘 아시는 분이 되셨어요. 앞으로의 여정이 더욱 기대됩니다. 🌟',
    '90일간의 감사 실천, 진심으로 축하드립니다. 이 여정을 통해 당신의 마음속에 얼마나 많은 것들이 변화했을지 궁금합니다. 감사하는 삶은 더 행복한 삶으로 이어집니다. 그 증거가 바로 지금의 당신이에요. ⭐',
  ],
  master: [
    '6개월, 180일의 감사 여정을 이어오셨습니다. 반년 동안 매일 감사를 찾는 삶을 사신 거예요. 이제 당신의 눈은 삶의 긍정적인 면을 더 자연스럽게 바라보고 있을 거라 믿습니다. 이 여정을 함께한 것이 정말 영광입니다. 🏆',
    '180일. 그 숫자가 얼마나 대단한 것인지 아시나요? 많은 사람들이 꿈꾸지만 해내지 못하는 걸 당신은 해내셨습니다. 감사하는 마음이 이제 당신의 본성이 되었습니다. 남은 여정도 오늘처럼, 천천히 그리고 꾸준히. 🌿',
    '반년간의 감사 마스터. 이 타이틀이 얼마나 값진지 아시나요? 365일 중 180일을 감사로 채운 당신은 이미 삶을 바라보는 방식이 달라져 있습니다. 그 변화는 당신 주변의 모든 것에 영향을 미치고 있어요. 🏆',
    '6개월 동안 꾸준히 감사를 기록해 오셨군요. 힘든 날에도 감사할 것을 찾는 능력, 그것이 바로 진정한 마스터의 자격입니다. 당신은 이미 더 나은 삶을 살아가는 방법을 터득하셨어요. 🏆',
    '180일. 단순한 숫자가 아닙니다. 당신이 매일 자신과의 약속을 지켜온 180번의 증거입니다. 그 진심 어린 노력이 지금의 당신을 만들었어요. 앞으로 남은 여정도 오늘처럼 빛나길 바랍니다. 🌿',
  ],
  legend: [
    '1년, 365일. 당신은 해냈습니다. 365번의 하루를 감사로 채워오셨군요. 그 모든 날들이 모여 지금의 당신을 만들었습니다. 감사일기를 선택하고 이 길을 끝까지 걸어온 당신에게 온 마음으로 축하와 감사를 전합니다. 👑',
    '365일간의 감사 기록이 완성되었습니다. 일 년 전 처음 감사일기를 시작할 때를 기억하시나요? 그때와 지금, 당신은 분명히 달라졌습니다. 감사를 통해 삶을 더 깊이 사랑하게 된 당신을 진심으로 축하드립니다. 이것은 끝이 아닌 새로운 시작입니다. 🌟',
    '365일, 1년. 이 위업을 이룬 당신은 이제 진정한 레전드입니다. 매일 세 가지 감사를 찾는 일이 당신의 삶에 얼마나 깊이 스며들었을지, 상상만 해도 경이롭습니다. 당신의 이야기가 다른 누군가에게 큰 용기가 될 거예요. 👑',
    '1년 동안 단 하루도 포기하지 않으셨군요. 그 꾸준함과 의지는 정말 놀랍습니다. 감사하는 삶이 무엇인지를 몸소 증명해 보이신 당신은 이미 레전드입니다. 앞으로의 두 번째 해도 함께하기를 진심으로 바랍니다. 🌟',
    '365번의 감사, 365번의 성장. 1년 전 첫 기록을 남겼을 때와 지금, 당신의 마음은 완전히 달라졌을 거예요. 일상의 작은 것들에서 기쁨을 찾는 능력, 그것이 가장 큰 선물입니다. 진심으로 축하드립니다. 👑',
  ],
}

/**
 * 배지 획득 시 1회 생성하는 특별 축하/회고 메시지.
 * 이전 배지 이후 작성된 감사 기록을 참고해 개인화합니다.
 * 외부 API 없이 로컬 템플릿 기반으로 동작합니다.
 * v1.7.1: generateBadgeCelebrationMessageWithApi 의 fallback으로 사용됩니다.
 */
export function generateBadgeCelebrationMessage(
  params: BadgeCelebrationParams
): string {
  const { badge, notesSinceLastBadge } = params

  const pool = BADGE_CELEBRATION_POOL[badge.id]
  // 풀이 없는 경우 방어 처리 (미래 배지 추가 대비)
  if (!pool || pool.length === 0) {
    return `${badge.emoji} ${badge.label} 배지를 획득하셨습니다. 꾸준한 감사의 습관을 이어오신 당신을 진심으로 응원합니다.`
  }

  const base = pool[Math.floor(Math.random() * pool.length)]

  // 감사 기록에서 짧고 의미 있는 내용 1개 추출 (15자 이하)
  const gratitudeItems = notesSinceLastBadge
    .flatMap((n) => [n.gratitude1, n.gratitude2, n.gratitude3])
    .filter((g) => g.trim().length > 0 && g.trim().length <= 15)

  if (gratitudeItems.length > 0) {
    // 최근 기록 중 랜덤 선택
    const pick = gratitudeItems[Math.floor(Math.random() * Math.min(gratitudeItems.length, 10))]
    return `'${pick}' 같은 소중한 순간들을 기억하며 이 자리에 오셨군요. ${base}`
  }

  return base
}

// ── v1.7.1: Serverless Function 경유 AI 메시지 생성 ──────────────
// VITE_BADGE_AI_ENDPOINT 가 설정된 경우 API 호출 시도.
// 미설정이거나 호출 실패 시 generateBadgeCelebrationMessage 로 fallback.
//
// ── AI API 사용 여부 플래그 ───────────────────────────────────────
// false(기본): endpoint 설정 여부와 무관하게 로컬 템플릿만 사용 → source: 'local'
// true: VITE_BADGE_AI_ENDPOINT 설정 시 API 호출 시도
const ENABLE_BADGE_AI_API = false

interface BadgeCelebrationApiResponse {
  message?: string
  source?: string
  error?: string
}

/** generateBadgeCelebrationMessageWithApi 반환 타입 */
export interface BadgeCelebrationResult {
  message: string
  source: 'ai' | 'local'
}

/**
 * 배지 획득 축하/회고 메시지를 생성합니다.
 *
 * - ENABLE_BADGE_AI_API = false(기본): 항상 로컬 템플릿 사용 → source: 'local'
 * - ENABLE_BADGE_AI_API = true + VITE_BADGE_AI_ENDPOINT 설정 시: API 경유 → source: 'ai'
 * - API 미설정 / 호출 실패 / 타임아웃(5초): 로컬 템플릿 fallback → source: 'local'
 * - OPENAI_API_KEY 는 서버 환경변수에만 존재, 프론트 번들에 포함되지 않습니다.
 */
export async function generateBadgeCelebrationMessageWithApi(
  params: BadgeCelebrationParams
): Promise<BadgeCelebrationResult> {
  // AI API 비활성화 플래그 → 즉시 로컬 템플릿 반환
  if (!ENABLE_BADGE_AI_API) {
    return { message: generateBadgeCelebrationMessage(params), source: 'local' }
  }

  const endpoint = import.meta.env.VITE_BADGE_AI_ENDPOINT

  // endpoint 미설정 → 즉시 로컬 fallback
  if (!endpoint || !endpoint.trim()) {
    return { message: generateBadgeCelebrationMessage(params), source: 'local' }
  }

  const { badge, streak, notesSinceLastBadge } = params

  // 감사 내용 샘플 추출 (최대 5개, 15자 이하)
  const sampleGratitudes = notesSinceLastBadge
    .flatMap((n) => [n.gratitude1, n.gratitude2, n.gratitude3])
    .filter((g) => g.trim().length > 0 && g.trim().length <= 15)
    .slice(0, 5)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        badgeId: badge.id,
        badgeLabel: badge.label,
        badgeEmoji: badge.emoji,
        streak,
        analyzedNoteCount: notesSinceLastBadge.length,
        sampleGratitudes,
        lang: 'ko',
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      return { message: generateBadgeCelebrationMessage(params), source: 'local' }
    }

    const data = (await res.json()) as BadgeCelebrationApiResponse
    if (typeof data.message === 'string' && data.message.trim()) {
      return { message: data.message.trim(), source: 'ai' }
    }

    return { message: generateBadgeCelebrationMessage(params), source: 'local' }
  } catch {
    clearTimeout(timeoutId)
    return { message: generateBadgeCelebrationMessage(params), source: 'local' }
  }
}
