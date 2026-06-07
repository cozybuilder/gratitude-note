import { Header } from '../components/layout/Header'
import { NoteCard } from '../components/note/NoteCard'
import { EmptyState } from '../components/common/EmptyState'
import { useNotes } from '../hooks/useNotes'
import { useStreak } from '../hooks/useStreak'

export function ListPage() {
  const { notes, editNote, removeNote } = useNotes()
  const streak = useStreak(notes)

  return (
    <div>
      <Header title="기록" streak={streak} />
      <div className="flex flex-col gap-3 px-5 pb-28">
        {notes.length === 0 ? (
          <EmptyState
            title="아직 작성한 기록이 없어요"
            description={'홈에서 오늘의 감사한 일을 기록해보세요 🌱'}
          />
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={editNote}
              onDelete={removeNote}
            />
          ))
        )}
      </div>
    </div>
  )
}
