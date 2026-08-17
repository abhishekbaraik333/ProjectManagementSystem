import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Loader2,
  Paperclip,
  ListChecks,
  User,
  Shield,
  ShieldCheck,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useTaskStore from '@/store/taskStore'
import useProjectStore from '@/store/projectStore'
import useAuthStore from '@/store/authStore'
import TaskDetailModal from '@/components/TaskDetailModal'

const columns = [
  {
    id: 'todo',
    label: 'To Do',
    icon: Clock,
    color: 'text-slate-700 dark:text-slate-300',
    dotColor: 'bg-slate-400',
    bgColor: 'bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: Loader2,
    color: 'text-blue-700 dark:text-blue-400',
    dotColor: 'bg-blue-600',
    bgColor: 'bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/90 dark:border-blue-900/40',
  },
  {
    id: 'done',
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-700 dark:text-emerald-400',
    dotColor: 'bg-emerald-600',
    bgColor: 'bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100/90 dark:border-emerald-900/40',
  },
]

export default function ProjectBoardPage() {
  const { projectId } = useParams()
  const tasks = useTaskStore((s) => s.tasks)
  const fetchTasks = useTaskStore((s) => s.fetchTasks)
  const createTask = useTaskStore((s) => s.createTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)
  const fetchProjectById = useProjectStore((s) => s.fetchProjectById)
  const fetchMembers = useProjectStore((s) => s.fetchMembers)
  const members = useProjectStore((s) => s.members)
  const currentUser = useAuthStore((s) => s.user)
  const isLoading = useTaskStore((s) => s.isLoading)

  const [selectedTask, setSelectedTask] = useState(null)
  const [addingTo, setAddingTo] = useState(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
      fetchMembers(projectId)
      fetchTasks(projectId)
    }
  }, [projectId, fetchProjectById, fetchMembers, fetchTasks])

  const currentMember = members.find((m) => m.user?._id === currentUser?._id)
  const currentUserRole = currentMember?.role || 'member'
  const isMemberOnly = currentUserRole === 'member'
  const canCreateOrDelete = currentUserRole === 'admin' || currentUserRole === 'project_admin'

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status)

  const handleQuickAdd = async (status) => {
    if (!canCreateOrDelete) {
      setActionError('Only admins and project admins can create new tasks.')
      setAddingTo(null)
      return
    }
    if (!newTaskTitle.trim()) {
      setAddingTo(null)
      return
    }
    const result = await createTask(projectId, { title: newTaskTitle.trim(), status })
    if (!result.success) {
      setActionError(result.error)
    }
    setNewTaskTitle('')
    setAddingTo(null)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await updateTask(projectId, taskId, { status: newStatus })
    if (!result.success) {
      setActionError(result.error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!canCreateOrDelete) {
      setActionError('Only admins and project admins can delete tasks.')
      return
    }
    const result = await deleteTask(projectId, taskId)
    if (!result.success) {
      setActionError(result.error)
    } else {
      setSelectedTask(null)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board header */}
      <div className="px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80 bg-white/50 dark:bg-transparent">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Task Board</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2">
          {currentUserRole === 'admin' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60">
              <ShieldCheck size={13} />
              Admin
            </span>
          )}
          {currentUserRole === 'project_admin' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
              <Shield size={13} />
              Project Admin
            </span>
          )}
          {isMemberOnly && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60">
              <User size={13} />
              Member (Active Contributor)
            </span>
          )}
        </div>
      </div>

      {/* Member helper info banner */}
      {isMemberOnly && (
        <div className="px-6 md:px-8 py-2.5 bg-blue-50/80 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
            <Sparkles size={14} className="flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <span>As a project member, you can move tasks across <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Done</strong>. Task creation and editing are managed by project admins.</span>
          </div>
        </div>
      )}

      {/* Action error banner */}
      {actionError && (
        <div className="px-6 md:px-8 py-2 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between">
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{actionError}</p>
          <button onClick={() => setActionError('')} className="text-xs text-rose-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Kanban columns */}
      <div className="flex-1 overflow-x-auto p-6 md:p-8">
        <div className="flex gap-5 h-full min-w-[820px]">
          {columns.map((column) => {
            const columnTasks = getColumnTasks(column.id)

            return (
              <div
                key={column.id}
                className={`flex-1 flex flex-col rounded-2xl ${column.bgColor} min-w-[270px] shadow-2xs`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                    <h3 className={`text-sm font-bold ${column.color}`}>
                      {column.label}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      {columnTasks.length}
                    </span>
                  </div>
                  {canCreateOrDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAddingTo(column.id)
                        setNewTaskTitle('')
                      }}
                      className="w-7 h-7 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <Plus size={15} />
                    </Button>
                  )}
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5">
                  <AnimatePresence>
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        canDelete={canCreateOrDelete}
                        onClick={() => setSelectedTask(task)}
                        onStatusChange={handleStatusChange}
                        onDelete={() => handleDeleteTask(task._id)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Quick add */}
                  {canCreateOrDelete && addingTo === column.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-1"
                    >
                      <Input
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleQuickAdd(column.id)
                          if (e.key === 'Escape') setAddingTo(null)
                        }}
                        onBlur={() => handleQuickAdd(column.id)}
                        autoFocus
                        className="h-9 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-xs"
                      />
                    </motion.div>
                  )}

                  {/* Empty column */}
                  {columnTasks.length === 0 && addingTo !== column.id && (
                    canCreateOrDelete ? (
                      <button
                        onClick={() => {
                          setAddingTo(column.id)
                          setNewTaskTitle('')
                        }}
                        className="w-full py-8 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl border-2 border-dashed border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-white/60 dark:hover:bg-slate-900/40"
                      >
                        <Plus size={20} />
                        <span className="text-xs font-semibold">Add a task</span>
                      </button>
                    ) : (
                      <div className="w-full py-8 flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 rounded-xl border-2 border-dashed border-slate-200/60 dark:border-slate-800/60">
                        <Clock size={18} className="opacity-40" />
                        <span className="text-xs">No tasks</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Task detail modal */}
      <TaskDetailModal
        task={selectedTask}
        projectId={projectId}
        canEditDetails={canCreateOrDelete}
        canDelete={canCreateOrDelete}
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) setSelectedTask(null)
        }}
        onTaskUpdated={() => fetchTasks(projectId)}
        onTaskDeleted={() => {
          setSelectedTask(null)
          fetchTasks(projectId)
        }}
      />
    </div>
  )
}

function TaskCard({ task, canDelete = true, onClick, onStatusChange, onDelete }) {
  const subtaskCount = task.subtasks?.length || 0
  const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted)?.length || 0
  const attachmentCount = task.attachments?.length || 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700/60 shadow-xs hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Title row */}
      <div className="flex items-start justify-between mb-1.5">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pr-2 leading-snug">
          {task.title}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0"
              title="Move or manage task"
            >
              <MoreHorizontal size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {task.status !== 'todo' && (
              <DropdownMenuItem onClick={() => onStatusChange(task._id, 'todo')}>
                Move to To Do
              </DropdownMenuItem>
            )}
            {task.status !== 'in_progress' && (
              <DropdownMenuItem onClick={() => onStatusChange(task._id, 'in_progress')}>
                Move to In Progress
              </DropdownMenuItem>
            )}
            {task.status !== 'done' && (
              <DropdownMenuItem onClick={() => onStatusChange(task._id, 'done')}>
                Move to Done
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                onClick={onDelete}
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tracking info */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-2.5 space-y-0.5">
        {task.createdBy && (
          <p className="truncate">
            Created by <span className="font-medium text-slate-600 dark:text-slate-400">@{task.createdBy.username}</span>
          </p>
        )}
        {task.lastMovedBy && (
          <p className="truncate flex items-center gap-1 text-blue-600/80 dark:text-blue-400/80">
            <ArrowRightLeft size={10} />
            <span>Moved by @{task.lastMovedBy.username}</span>
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {subtaskCount > 0 && (
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-[11px]">
              <ListChecks size={12} className="text-slate-400" />
              {completedSubtasks}/{subtaskCount}
            </span>
          )}
          {attachmentCount > 0 && (
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-[11px]">
              <Paperclip size={12} className="text-slate-400" />
              {attachmentCount}
            </span>
          )}
        </div>

        {/* Assignee avatar */}
        {task.assignedTo && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-xs shadow-blue-500/20"
               title={`Assigned to ${task.assignedTo.username || task.assignedTo.fullName}`}
          >
            {(task.assignedTo.username || task.assignedTo.fullName || 'U')
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>
    </motion.div>
  )
}
