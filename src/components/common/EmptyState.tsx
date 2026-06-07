interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl">🌱</div>
      <p className="text-base font-medium text-[#3d2e26]">{title}</p>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-[#8a7570]">{description}</p>
      )}
    </div>
  )
}
