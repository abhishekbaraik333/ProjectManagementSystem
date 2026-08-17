import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, Users, Plus, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useProjectStore from '@/store/projectStore'

export default function ProjectListPage({ onCreateProject }) {
  const projects = useProjectStore((s) => s.projects)
  const isLoading = useProjectStore((s) => s.isLoading)
  const fetchProjects = useProjectStore((s) => s.fetchProjects)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and organize all your projects in one place.
          </p>
        </div>
        <Button
          onClick={onCreateProject}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
        >
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {/* Loading */}
      {isLoading && projects.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse shadow-xs"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 shadow-xs">
            <FolderKanban size={30} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
            No projects yet
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Create your first project to start organizing tasks, collaborating with your team, and tracking progress.
          </p>
          <Button
            onClick={onCreateProject}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/25 rounded-xl"
          >
            <Plus size={16} />
            Create Your First Project
          </Button>
        </motion.div>
      )}

      {/* Project grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((item, index) => {
            const project = item.project || item
            const id = project._id
            const role = item.role

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/dashboard/project/${id}`}
                  className="group flex flex-col justify-between h-full p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-700/60 shadow-xs hover:shadow-md hover:shadow-blue-500/5 transition-all duration-200"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shadow-blue-500/20">
                        {project.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-all">
                        <ArrowRight
                          size={15}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>

                    {/* Name & description */}
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.description || 'No description provided'}
                    </p>
                  </div>

                  {/* Footer meta */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      {project.members != null && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users size={13} className="text-slate-400" />
                          {project.members} {project.members === 1 ? 'member' : 'members'}
                        </span>
                      )}
                      {role && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 font-semibold text-[11px] capitalize">
                          {role.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
