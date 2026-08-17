import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  StickyNote,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  Layers,
  Folder,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import ThemeToggle from '@/components/ThemeToggle'
import useAuthStore from '@/store/authStore'
import useProjectStore from '@/store/projectStore'

const projectNavItems = [
  { icon: FolderKanban, label: 'Board', path: '' },
  { icon: Users, label: 'Members', path: '/members' },
  { icon: StickyNote, label: 'Notes', path: '/notes' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar({ collapsed, onToggle, onCreateProject }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { projectId } = useParams()
  const logout = useAuthStore((s) => s.logout)
  const projects = useProjectStore((s) => s.projects)
  const user = useAuthStore((s) => s.user)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen sticky top-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
            <Layers size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap overflow-hidden"
              >
                Vertex
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        {/* All Projects link */}
        <SidebarLink
          to="/dashboard"
          icon={LayoutDashboard}
          label="All Projects"
          active={location.pathname === '/dashboard'}
          collapsed={collapsed}
          fullWidth
        />

        {/* New project button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onCreateProject}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 border border-dashed border-blue-200/80 dark:border-blue-900/60 transition-all ${
                collapsed ? 'justify-center px-0' : ''
              }`}
            >
              <Plus size={17} className="flex-shrink-0" />
              {!collapsed && <span>New Project</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">New Project</TooltipContent>}
        </Tooltip>

        {/* Divider */}
        <div className="pt-3 pb-1">
          {!collapsed && (
            <div className="flex items-center justify-between px-3">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Projects
              </p>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                {projects.length}
              </span>
            </div>
          )}
          <div className="mt-2 border-t border-slate-100 dark:border-slate-800/80" />
        </div>

        {/* Project list */}
        <div className="space-y-1">
          {projects.map((item) => {
            const project = item.project || item
            const id = project._id
            const isCurrentProject = projectId === id

            return (
              <div key={id} className="w-full flex flex-col items-start">
                <SidebarLink
                  to={`/dashboard/project/${id}`}
                  icon={Folder}
                  label={project.name}
                  active={isCurrentProject}
                  collapsed={collapsed}
                />

                {/* Sub-nav for active project (fitted strictly to text width) */}
                <AnimatePresence>
                  {isCurrentProject && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden flex flex-col items-start w-full ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-0.5 my-1"
                    >
                      {projectNavItems.map((nav) => (
                        <SidebarLink
                          key={nav.path}
                          to={`/dashboard/project/${id}${nav.path}`}
                          icon={nav.icon}
                          label={nav.label}
                          active={
                            nav.path === ''
                              ? location.pathname === `/dashboard/project/${id}`
                              : location.pathname === `/dashboard/project/${id}${nav.path}`
                          }
                          collapsed={false}
                          small
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {projects.length === 0 && !collapsed && (
            <p className="px-3 py-6 text-xs text-slate-400 dark:text-slate-500 text-center italic">
              No projects yet
            </p>
          )}
        </div>
      </div>

      {/* Bottom User & Settings section */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 p-3 space-y-2 bg-slate-50/50 dark:bg-transparent">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-1`}>
          {!collapsed && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
          )}
          <ThemeToggle />
        </div>

        {/* User profile card */}
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shadow-blue-500/20 flex-shrink-0">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {user.fullName || user.username}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              }`}
            >
              <LogOut size={16} className="flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </motion.aside>
  )
}

function SidebarLink({ to, icon: Icon, label, active, collapsed, small = false, fullWidth = false }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className={`inline-flex items-center gap-2.5 rounded-xl transition-all ${
            small ? 'px-2.5 py-1.5 text-[13px]' : 'px-3 py-2 text-sm'
          } font-medium ${
            active
              ? 'bg-blue-50/90 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 font-semibold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
          } ${collapsed ? 'justify-center w-9 h-9 p-0' : fullWidth ? 'w-full' : 'w-fit max-w-full'}`}
        >
          <Icon
            size={small ? 14 : 17}
            className={`flex-shrink-0 ${
              active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          />
          {!collapsed && <span className="truncate text-left">{label}</span>}
        </Link>
      </TooltipTrigger>
      {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  )
}
