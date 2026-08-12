import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/client'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/register', userData)
          set({ isLoading: false })
          return { success: true, data: res.data }
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed'
          set({ isLoading: false, error: message })
          return { success: false, error: message }
        }
      },

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/login', credentials)
          const { user, accessToken } = res.data.data
          localStorage.setItem('accessToken', accessToken)
          set({ user, accessToken, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed'
          set({ isLoading: false, error: message })
          return { success: false, error: message }
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout')
        } finally {
          localStorage.removeItem('accessToken')
          set({ user: null, accessToken: null, isAuthenticated: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
