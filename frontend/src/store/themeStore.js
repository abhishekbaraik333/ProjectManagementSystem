import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: nextTheme })
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      initTheme: () => {
        const currentTheme = get().theme
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

export default useThemeStore
