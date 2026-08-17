import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  StickyNote,
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useNoteStore from '@/store/noteStore'
import useProjectStore from '@/store/projectStore'
import useAuthStore from '@/store/authStore'

const noteColors = [
  'from-blue-50/90 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200/90 dark:border-blue-900/60',
  'from-amber-50/90 to-yellow-50/70 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-200/90 dark:border-amber-900/60',
  'from-emerald-50/90 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/90 dark:border-emerald-900/60',
  'from-purple-50/90 to-pink-50/70 dark:from-purple-950/40 dark:to-pink-950/40 border-purple-200/90 dark:border-purple-900/60',
  'from-rose-50/90 to-orange-50/70 dark:from-rose-950/40 dark:to-orange-950/40 border-rose-200/90 dark:border-rose-900/60',
  'from-sky-50/90 to-cyan-50/70 dark:from-sky-950/40 dark:to-cyan-950/40 border-sky-200/90 dark:border-sky-900/60',
]

export default function NotesPage() {
  const { projectId } = useParams()
  const notes = useNoteStore((s) => s.notes)
  const fetchNotes = useNoteStore((s) => s.fetchNotes)
  const createNote = useNoteStore((s) => s.createNote)
  const updateNote = useNoteStore((s) => s.updateNote)
  const deleteNote = useNoteStore((s) => s.deleteNote)
  const fetchProjectById = useProjectStore((s) => s.fetchProjectById)
  const isLoading = useNoteStore((s) => s.isLoading)
  const currentUser = useAuthStore((s) => s.user)

  const [showCreate, setShowCreate] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
      fetchNotes(projectId)
    }
  }, [projectId, fetchProjectById, fetchNotes])

  const handleCreate = async () => {
    if (!newContent.trim()) return
    await createNote(projectId, newContent.trim())
    setNewContent('')
    setShowCreate(false)
  }

  const handleUpdate = async (noteId) => {
    if (!editContent.trim()) return
    await updateNote(projectId, noteId, editContent.trim())
    setEditingId(null)
    setEditContent('')
  }

  const handleDelete = async (noteId) => {
    await deleteNote(projectId, noteId)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Notes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quick notes, ideas, and scratchpad for this project.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
        >
          <Plus size={16} />
          New Note
        </Button>
      </div>

      {/* Create note */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
          >
            <Textarea
              placeholder="Write your note or idea here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              autoFocus
              className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white resize-none text-sm leading-relaxed"
            />
            <div className="flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCreate(false)
                  setNewContent('')
                }}
                className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isLoading || !newContent.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold shadow-xs shadow-blue-500/20 rounded-xl"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Save Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes grid */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, index) => {
            const colorClass = noteColors[index % noteColors.length]
            const isOwner = note.createdBy === currentUser?._id
            const isEditingThis = editingId === note._id

            return (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`group relative p-5 rounded-2xl border bg-gradient-to-br ${colorClass} transition-all hover:shadow-md shadow-2xs flex flex-col justify-between`}
              >
                {/* Actions */}
                {isOwner && !isEditingThis && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(note._id)
                        setEditContent(note.content)
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-600 hover:text-blue-600 dark:text-slate-300 shadow-2xs transition-colors"
                      title="Edit note"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-600 hover:text-rose-600 dark:text-slate-300 shadow-2xs transition-colors"
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}

                {/* Content */}
                {isEditingThis ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      autoFocus
                      className="bg-white/90 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 resize-none text-sm text-slate-900 dark:text-white rounded-xl"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        className="h-7 text-xs rounded-lg"
                      >
                        <X size={12} className="mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(note._id)}
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-2xs"
                      >
                        <Check size={12} className="mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                )}

                {/* Timestamp */}
                {!isEditingThis && (
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <Clock size={11} className="text-slate-400" />
                    {formatDate(note.createdAt)}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-4 shadow-xs">
            <StickyNote size={28} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No notes yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs">
            Add quick notes to capture ideas, meeting notes, and updates for this project.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
            size="sm"
          >
            <Plus size={14} />
            Create First Note
          </Button>
        </motion.div>
      )}
    </div>
  )
}
