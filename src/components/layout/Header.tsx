interface HeaderProps {
  title: string
  streak?: number
}

export function Header({ title, streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <h1 className="text-lg font-semibold text-[#3d2e26]">{title}</h1>
      {streak !== undefined && streak > 0 && (
        <div className="flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1">
          <span className="text-base leading-none">🔥</span>
          <span className="text-xs font-medium text-primary-500">{streak}일 연속</span>
        </div>
      )}
    </header>
  )
}
