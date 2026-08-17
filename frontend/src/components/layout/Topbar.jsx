import { useParams, Link, useLocation } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useProjectStore from '@/store/projectStore'

export default function Topbar({ onMenuClick }) {
  const { projectId } = useParams()
  const location = useLocation()
  const currentProject = useProjectStore((s) => s.currentProject)

  // Determine the current page name from the URL
  const getPageName = () => {
    if (!projectId) return null
    const path = location.pathname
    if (path.endsWith('/members')) return 'Members'
    if (path.endsWith('/notes')) return 'Notes'
    if (path.endsWith('/settings')) return 'Settings'
    return 'Board'
  }

  const pageName = getPageName()

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden w-9 h-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            to="/dashboard"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
          {projectId && currentProject && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <Link
                to={`/dashboard/project/${projectId}`}
                className={`transition-colors ${
                  pageName === 'Board'
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {currentProject.name}
              </Link>
              {pageName && pageName !== 'Board' && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{pageName}</span>
                </>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Right: search */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 rounded-lg w-60 text-sm text-slate-500 dark:text-slate-400 shadow-xs">
          <Search size={15} className="text-slate-400 dark:text-slate-500" />
          <span className="text-xs">Search projects, tasks...</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 font-mono shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>
    </header>
  )
}
