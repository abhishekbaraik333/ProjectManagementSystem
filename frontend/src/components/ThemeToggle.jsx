import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useThemeStore from '@/store/themeStore'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, initTheme } = useThemeStore()

  useEffect(() => {
    initTheme()
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon size={18} className="text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      ) : (
        <Sun size={18} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
