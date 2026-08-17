import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useProjectStore from '@/store/projectStore'
import useThemeStore from '@/store/themeStore'

export default function DashboardLayout({ onCreateProject }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const fetchProjects = useProjectStore((s) => s.fetchProjects)
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
    fetchProjects()
  }, [fetchProjects, initTheme])

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onCreateProject={onCreateProject}
          />
        </div>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[260px]">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onCreateProject={() => {
                setMobileOpen(false)
                onCreateProject?.()
              }}
            />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
