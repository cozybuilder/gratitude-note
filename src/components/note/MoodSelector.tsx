import type { Mood } from '../../types/note'

interface MoodOption {
  value: Mood
  emoji: string
  label: string
}

const MOODS: MoodOption[] = [
  { value: 'great',   emoji: '😄', label: '최고' },
  { value: 'good',    emoji: '🙂', label: '좋음' },
  { value: 'neutral', emoji: '😐', label: '보통' },
  { value: 'bad',     emoji: '😔', label: '나쁨' },
  { value: 'terrible',emoji: '😢', label: '힘듦' },
]

interface MoodSelectorProps {
  value: Mood
  onChange: (mood: Mood) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex justify-between gap-1">
      {MOODS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={[
            'flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 transition-colors',
            value === m.value
              ? 'bg-primary-500 text-white'
              : 'bg-warm-100 text-[#8a7570] hover:bg-warm-200',
          ].join(' ')}
        >
          <span className="text-xl leading-none">{m.emoji}</span>
          <span className="text-xs font-medium">{m.label}</span>
        </button>
      ))}
    </div>
  )
}
