interface AiMessageCardProps {
  message: string
  onClose: () => void
}

export function AiMessageCard({ message, onClose }: AiMessageCardProps) {
  return (
    <div className="animate-fade-in rounded-2xl bg-gradient-to-br from-primary-500 to-brown-500 p-5 text-white shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">✨</span>
          <span className="text-sm font-semibold">오늘의 응원 메시지</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-white hover:bg-white/30"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
      <p className="text-sm leading-relaxed opacity-95">{message}</p>
    </div>
  )
}
