import { useState } from 'react'
import type { Mood } from '../../types/note'
import { MoodSelector } from './MoodSelector'
import { Button } from '../common/Button'

interface NoteFormData {
  gratitude1: string
  gratitude2: string
  gratitude3: string
  mood: Mood
}

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void
  initialValues?: NoteFormData
  isSubmitting?: boolean
}

// 공유카드 텍스트 영역(764px) 기준 — 36px 폰트 한글 2줄 안전 최대값
export const GRATITUDE_MAX_CHARS = 40

const PLACEHOLDERS = [
  '오늘 감사했던 일을 적어보세요',
  '또 다른 감사한 순간이 있었나요?',
  '마지막으로 하나 더 떠올려 보세요',
]

export function NoteForm({ onSubmit, initialValues, isSubmitting = false }: NoteFormProps) {
  const [values, setValues] = useState({
    gratitude1: initialValues?.gratitude1 ?? '',
    gratitude2: initialValues?.gratitude2 ?? '',
    gratitude3: initialValues?.gratitude3 ?? '',
  })
  const [mood, setMood] = useState<Mood>(initialValues?.mood ?? 'good')

  const gratitudes = [
    { key: 'gratitude1', value: values.gratitude1 },
    { key: 'gratitude2', value: values.gratitude2 },
    { key: 'gratitude3', value: values.gratitude3 },
  ] as const

  const canSubmit = [values.gratitude1, values.gratitude2, values.gratitude3].some(
    (v) => v.trim() !== ''
  )

  function handleChange(key: keyof typeof values, v: string) {
    // 최대 글자 수 초과 시 잘라냄 — 붙여넣기 포함
    setValues((prev) => ({ ...prev, [key]: v.slice(0, GRATITUDE_MAX_CHARS) }))
  }

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({ ...values, mood })
    setValues({ gratitude1: '', gratitude2: '', gratitude3: '' })
    setMood('good')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 감사 입력 3개 */}
      <div className="flex flex-col gap-3">
        {gratitudes.map(({ key, value }, i) => (
          <div key={key} className="flex items-start gap-3">
            <span className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white">
              {i + 1}
            </span>
            <textarea
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={PLACEHOLDERS[i]}
              maxLength={GRATITUDE_MAX_CHARS}
              rows={2}
              className={[
                'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-[#3d2e26]',
                'placeholder:text-[#c4b8b4] outline-none transition-colors',
                'focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20',
                'border-warm-200',
              ].join(' ')}
            />
          </div>
        ))}
      </div>

      {/* 기분 선택 */}
      <div>
        <p className="mb-2.5 text-sm font-medium text-[#3d2e26]">오늘의 기분</p>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      {/* 저장 버튼 */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? '저장 중…' : '감사 일기 저장'}
      </Button>
    </div>
  )
}
