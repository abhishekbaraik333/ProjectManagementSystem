import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Trash2,
  Plus,
  Check,
  X,
  Paperclip,
  CheckCircle2,
  Circle,
  Edit3,
  Save,
  User,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react'
import useTaskStore from '@/store/taskStore'

export default function TaskDetailModal({
  task,
  projectId,
  canEditDetails = true,
  canDelete = true,
  open,
  onOpenChange,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const fetchTaskById = useTaskStore((s) => s.fetchTaskById)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const createSubTask = useTaskStore((s) => s.createSubTask)
  const updateSubTask = useTaskStore((s) => s.updateSubTask)
  const deleteSubTask = useTaskStore((s) => s.deleteSubTask)
  const currentTask = useTaskStore((s) => s.currentTask)
  const isLoading = useTaskStore((s) => s.isLoading)

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (task && projectId && open) {
      fetchTaskById(projectId, task._id)
      setModalError('')
      setIsEditing(false)
      setShowAddSubtask(false)
      setConfirmDelete(false)
    }
  }, [task, projectId, open, fetchTaskById])

  useEffect(() => {
    if (currentTask) {
      setEditTitle(currentTask.title || '')
      setEditDescription(currentTask.description || '')
      setEditStatus(currentTask.status || 'todo')
    }
  }, [currentTask])

  const handleSave = async () => {
    if (!canEditDetails) return
    const result = await updateTask(projectId, currentTask._id, {
      title: editTitle,
      description: editDescription,
      status: editStatus,
    })
    if (result.success) {
      setIsEditing(false)
      onTaskUpdated?.()
    } else {
      setModalError(result.error)
    }
  }

  const handleQuickStatusChange = async (newStatus) => {
    setEditStatus(newStatus)
    const result = await updateTask(projectId, currentTask._id, { status: newStatus })
    if (result.success) {
      onTaskUpdated?.()
    } else {
      setModalError(result.error)
    }
  }

  const handleDelete = async () => {
    if (!canDelete) return
    const result = await deleteTask(projectId, currentTask._id)
    if (result.success) {
      onTaskDeleted?.()
    } else {
      setModalError(result.error)
    }
  }

  const handleAddSubtask = async () => {
    if (!canEditDetails || !newSubtaskTitle.trim()) return
    const result = await createSubTask(projectId, currentTask._id, { title: newSubtaskTitle.trim() })
    if (result.success) {
      setNewSubtaskTitle('')
      setShowAddSubtask(false)
      onTaskUpdated?.()
    } else {
      setModalError(result.error)
    }
  }

  const handleToggleSubtask = async (subtask) => {
    if (!canEditDetails) return
    const result = await updateSubTask(projectId, currentTask._id, subtask._id, {
      isCompleted: !subtask.isCompleted,
    })
    if (result.success) {
      onTaskUpdated?.()
    } else {
      setModalError(result.error)
    }
  }

  const handleDeleteSubtask = async (subtaskId) => {
    if (!canEditDetails) return
    const result = await deleteSubTask(projectId, currentTask._id, subtaskId)
    if (result.success) {
      onTaskUpdated?.()
    } else {
      setModalError(result.error)
    }
  }

  const displayTask = currentTask || task
  if (!displayTask) return null

  const subtasks = currentTask?.subtasks || []
  const completedCount = subtasks.filter((s) => s.isCompleted).length
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0

  const statusColors = {
    todo: 'bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    in_progress: 'bg-blue-50 text-blue-700 border border-blue-200/90 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60',
    done: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60',
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200/90 dark:border-slate-800 p-0 overflow-y-auto shadow-2xl"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="space-y-3">
            <div className="flex items-center justify-between">
              {/* Status picker for all project members */}
              <div className="flex items-center gap-2">
                <Select value={editStatus || displayTask.status} onValueChange={handleQuickStatusChange}>
                  <SelectTrigger className={`h-7 text-xs font-bold px-3 py-1 rounded-full capitalize border shadow-2xs ${statusColors[editStatus || displayTask.status]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                {canEditDetails && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-8 h-8 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    title="Edit task title and description"
                  >
                    <Edit3 size={15} />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmDelete(true)}
                    className="w-8 h-8 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                    title="Delete task"
                  >
                    <Trash2 size={15} />
                  </Button>
                )}
              </div>
            </div>

            {modalError && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs font-medium text-rose-700 dark:text-rose-300">
                {modalError}
              </div>
            )}

            {isEditing ? (
              <div className="space-y-3 pt-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-base font-bold bg-slate-50 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-2xs"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white resize-none rounded-xl shadow-2xs text-sm"
                />
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 rounded-lg font-semibold"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <SheetTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white text-left">
                  {displayTask.title}
                </SheetTitle>
                {displayTask.description ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                    {displayTask.description}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic text-left">
                    No description provided
                  </p>
                )}
              </>
            )}
          </SheetHeader>

          {/* Task Tracking Meta Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            {displayTask.createdBy && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <User size={13} />
                  Created by
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  @{displayTask.createdBy.username}
                </span>
              </div>
            )}
            {displayTask.lastMovedBy && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  <ArrowRightLeft size={13} />
                  Last moved by
                </span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  @{displayTask.lastMovedBy.username}
                  {displayTask.lastMovedAt && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 font-normal">
                      ({new Date(displayTask.lastMovedAt).toLocaleDateString()})
                    </span>
                  )}
                </span>
              </div>
            )}
            {displayTask.createdAt && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar size={13} />
                  Created on
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  {new Date(displayTask.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Assignee */}
          {displayTask.assignedTo && (
            <div className="space-y-2 pt-1">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assigned To
              </Label>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shadow-blue-500/20">
                  {(displayTask.assignedTo.username || displayTask.assignedTo.fullName || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {displayTask.assignedTo.fullName || displayTask.assignedTo.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">@{displayTask.assignedTo.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Subtasks {subtasks.length > 0 && `(${completedCount}/${subtasks.length})`}
              </Label>
              {canEditDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddSubtask(true)}
                  className="h-7 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-1 rounded-lg"
                >
                  <Plus size={13} />
                  Add
                </Button>
              )}
            </div>

            {/* Progress bar */}
            {subtasks.length > 0 && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-blue-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Subtask list */}
            <div className="space-y-1.5">
              <AnimatePresence>
                {subtasks.map((subtask) => (
                  <motion.div
                    key={subtask._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 transition-colors"
                  >
                    <button
                      disabled={!canEditDetails}
                      onClick={() => handleToggleSubtask(subtask)}
                      className={`flex-shrink-0 ${!canEditDetails ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {subtask.isCompleted ? (
                        <CheckCircle2
                          size={18}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                      ) : (
                        <Circle
                          size={18}
                          className={`text-slate-400 dark:text-slate-500 ${canEditDetails ? 'hover:text-blue-600' : ''} transition-colors`}
                        />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        subtask.isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {subtask.title}
                    </span>
                    {canEditDetails && (
                      <button
                        onClick={() => handleDeleteSubtask(subtask._id)}
                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-rose-600 transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add subtask input */}
              {showAddSubtask && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 shadow-xs">
                  <Circle size={18} className="text-slate-400 flex-shrink-0" />
                  <Input
                    placeholder="Subtask title..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask()
                      if (e.key === 'Escape') setShowAddSubtask(false)
                    }}
                    autoFocus
                    className="h-8 text-sm bg-transparent border-0 focus-visible:ring-0 text-slate-900 dark:text-white"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddSubtask}
                    className="w-7 h-7 text-blue-600 hover:bg-blue-50"
                  >
                    <Check size={14} />
                  </Button>
                </div>
              )}

              {subtasks.length === 0 && !showAddSubtask && (
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  No subtasks added yet
                </p>
              )}
            </div>
          </div>

          {/* Attachments */}
          {displayTask.attachments?.length > 0 && (
            <div className="space-y-3 pt-1">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Attachments ({displayTask.attachments.length})
              </Label>
              <div className="space-y-2">
                {displayTask.attachments.map((att, index) => (
                  <a
                    key={index}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Paperclip size={14} className="text-slate-400" />
                    <span className="flex-1 truncate">{att.url.split('/').pop()}</span>
                    {att.size && (
                      <span className="text-[10px] text-slate-400">
                        {(att.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Delete confirmation */}
          {confirmDelete && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                Are you sure you want to delete this task?
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="rounded-lg font-semibold"
                >
                  {isLoading ? <Loader2 size={13} className="animate-spin" /> : 'Yes, delete'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
