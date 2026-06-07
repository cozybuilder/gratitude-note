import type { Mood } from '../types/note'

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
