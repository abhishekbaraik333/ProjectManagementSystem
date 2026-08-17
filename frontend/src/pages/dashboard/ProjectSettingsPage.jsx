import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Trash2,
  Loader2,
  Save,
  AlertTriangle,
  ShieldCheck,
  Shield,
  Eye,
  Lock,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import useProjectStore from '@/store/projectStore'
import useAuthStore from '@/store/authStore'

export default function ProjectSettingsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const currentProject = useProjectStore((s) => s.currentProject)
  const fetchProjectById = useProjectStore((s) => s.fetchProjectById)
  const fetchMembers = useProjectStore((s) => s.fetchMembers)
  const members = useProjectStore((s) => s.members)
  const updateProject = useProjectStore((s) => s.updateProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)
  const currentUser = useAuthStore((s) => s.user)
  const isLoading = useProjectStore((s) => s.isLoading)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
      fetchMembers(projectId)
    }
  }, [projectId, fetchProjectById, fetchMembers])

  useEffect(() => {
    if (currentProject) {
      setName(currentProject.name || '')
      setDescription(currentProject.description || '')
    }
  }, [currentProject])

  const currentMember = members.find((m) => m.user?._id === currentUser?._id)
  const currentUserRole = currentMember?.role || 'member'
  const isAdmin = currentUserRole === 'admin'
  const isProjectAdmin = currentUserRole === 'project_admin'
  const isMemberOnly = currentUserRole === 'member'
  const canEditSettings = isAdmin || isProjectAdmin
  const canDeleteProject = isAdmin

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    if (!canEditSettings) {
      setError('You do not have permission to update project settings.')
      return
    }

    const result = await updateProject(projectId, {
      name: name.trim(),
      description: description.trim(),
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      setError(result.error || 'Failed to update project settings')
    }
  }

  const handleDelete = async () => {
    if (!canDeleteProject) {
      setError('Only the Project Owner (Admin) can delete this project.')
      return
    }

    const result = await deleteProject(projectId)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Failed to delete project')
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Settings size={18} />
            </div>
            Project Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your project details, metadata, and configuration.
          </p>
        </div>

        {/* Role badge */}
        <div>
          {isAdmin && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60">
              <ShieldCheck size={13} />
              Admin
            </span>
          )}
          {isProjectAdmin && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
              <Shield size={13} />
              Project Admin
            </span>
          )}
          {isMemberOnly && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-700">
              <Eye size={13} />
              View Only
            </span>
          )}
        </div>
      </div>

      {/* Permission alert for members */}
      {isMemberOnly && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
          <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <p className="font-semibold">View-Only Access</p>
            <p className="leading-relaxed text-blue-700 dark:text-blue-400">
              You are viewing this project as a <strong>Member</strong>. Project metadata, name, and settings can only be edited by Project Admins and Admins.
            </p>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-between">
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{error}</p>
          <button onClick={() => setError('')} className="text-xs text-rose-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* General settings */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">General Information</h3>
            {isMemberOnly && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                Read Only
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-name" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Project Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="project-name"
              disabled={!canEditSettings || isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-desc" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description
            </Label>
            <Textarea
              id="project-desc"
              disabled={!canEditSettings || isLoading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:bg-white resize-none shadow-2xs text-sm leading-relaxed disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>

          {canEditSettings && (
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </Button>
              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 px-2.5 py-1 rounded-md"
                  >
                    ✓ Changes saved successfully!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-8 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />
          <h3 className="font-bold text-rose-800 dark:text-rose-300 text-base">Danger Zone</h3>
        </div>
        <p className="text-sm text-rose-700/90 dark:text-rose-400/90 leading-relaxed">
          Deleting this project will permanently remove all associated tasks, subtasks, notes, and member permissions. This action cannot be undone.
        </p>

        {canDeleteProject ? (
          !showDelete ? (
            <Button
              variant="outline"
              onClick={() => setShowDelete(true)}
              className="border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/40 font-semibold rounded-xl"
            >
              <Trash2 size={14} className="mr-2" />
              Delete this project
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 pt-2"
            >
              <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold">
                Type <span className="underline select-all">{currentProject?.name}</span> to confirm deletion:
              </p>
              <Input
                placeholder="Type exact project name"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                className="bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-900 rounded-xl"
              />
              <div className="flex gap-2 pt-1">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteConfirmName !== currentProject?.name || isLoading}
                  className="gap-2 font-semibold rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Permanently Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDelete(false)
                    setDeleteConfirmName('')
                  }}
                  className="border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 px-3.5 py-2.5 rounded-xl">
            <Lock size={14} className="flex-shrink-0" />
            <span>
              {isProjectAdmin
                ? 'Project Admins cannot delete projects. Only the Project Owner (Admin) can permanently delete this project.'
                : 'Project deletion is restricted exclusively to the Project Owner (Admin).'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
