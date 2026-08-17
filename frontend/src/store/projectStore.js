import { create } from 'zustand'
import api from '../api/client'

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  members: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/projects')
      set({ projects: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch projects', isLoading: false })
    }
  },

  createProject: async ({ name, description }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post('/projects', { name, description })
      set((state) => ({
        projects: [...state.projects, res.data.data],
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  fetchProjectById: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/projects/${projectId}`)
      set({ currentProject: res.data.data, isLoading: false })
      return res.data.data
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch project', isLoading: false })
      return null
    }
  },

  updateProject: async (projectId, { name, description }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.put(`/projects/${projectId}`, { name, description })
      set((state) => ({
        projects: state.projects.map((p) =>
          (p._id || p.project?._id) === projectId ? { ...p, ...res.data.data } : p
        ),
        currentProject: res.data.data,
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update project'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  deleteProject: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/projects/${projectId}`)
      set((state) => ({
        projects: state.projects.filter((p) => (p._id || p.project?._id) !== projectId),
        currentProject: null,
        isLoading: false,
      }))
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete project'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  // Members
  fetchMembers: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/projects/${projectId}/members`)
      set({ members: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch members', isLoading: false })
    }
  },

  addMember: async (projectId, { email, role }) => {
    set({ isLoading: true, error: null })
    try {
      await api.post(`/projects/${projectId}/members`, { email, role })
      // Refetch members to get full user data
      await get().fetchMembers(projectId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add member'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  updateMemberRole: async (projectId, userId, newRole) => {
    set({ isLoading: true, error: null })
    try {
      await api.put(`/projects/${projectId}/members/${userId}`, { newRole })
      await get().fetchMembers(projectId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update role'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  removeMember: async (projectId, userId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`)
      set((state) => ({
        members: state.members.filter((m) => m.user?._id !== userId),
        isLoading: false,
      }))
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove member'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  clearError: () => set({ error: null }),
}))

export default useProjectStore
