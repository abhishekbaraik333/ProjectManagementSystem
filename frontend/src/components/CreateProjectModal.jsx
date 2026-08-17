import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, FolderPlus } from 'lucide-react'
import useProjectStore from '@/store/projectStore'

export default function CreateProjectModal({ open, onOpenChange }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const createProject = useProjectStore((s) => s.createProject)
  const isLoading = useProjectStore((s) => s.isLoading)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Project name is required')
      return
    }

    const result = await createProject({ name: name.trim(), description: description.trim() })
    if (result.success) {
      setName('')
      setDescription('')
      onOpenChange(false)
    } else {
      setError(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xl rounded-2xl p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-slate-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FolderPlus size={18} />
            </div>
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Give your project a name and optional description to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div className="space-y-1.5">
            <Label htmlFor="project-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Project Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="project-name"
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-2xs"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </Label>
            <Textarea
              id="project-desc"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white resize-none rounded-xl shadow-2xs text-sm"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
