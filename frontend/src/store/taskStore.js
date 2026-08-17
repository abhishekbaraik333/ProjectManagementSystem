import { create } from 'zustand'
import api from '../api/client'

const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/tasks/${projectId}`)
      set({ tasks: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch tasks', isLoading: false })
    }
  },

  fetchTaskById: async (projectId, taskId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/tasks/${projectId}/${taskId}`)
      // Backend returns array from aggregation
      const task = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
      set({ currentTask: task, isLoading: false })
      return task
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch task', isLoading: false })
      return null
    }
  },

  createTask: async (projectId, taskData) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post(`/tasks/${projectId}`, taskData)
      set((state) => ({
        tasks: [...state.tasks, res.data.data],
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  updateTask: async (projectId, taskId, taskData) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.put(`/tasks/${projectId}/${taskId}`, taskData)
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? res.data.data : t)),
        currentTask: state.currentTask?._id === taskId ? res.data.data : state.currentTask,
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  deleteTask: async (projectId, taskId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/tasks/${projectId}/${taskId}`)
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== taskId),
        currentTask: state.currentTask?._id === taskId ? null : state.currentTask,
        isLoading: false,
      }))
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  // Subtasks
  createSubTask: async (projectId, taskId, { title }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post(`/tasks/${projectId}/${taskId}/subtasks`, { title })
      // Refetch the full task to get updated subtasks
      await get().fetchTaskById(projectId, taskId)
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create subtask'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  updateSubTask: async (projectId, taskId, subTaskId, data) => {
    set({ isLoading: true, error: null })
    try {
      await api.put(`/tasks/${projectId}/${taskId}/subtasks/${subTaskId}`, data)
      // Refetch the full task to get updated subtask state
      await get().fetchTaskById(projectId, taskId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update subtask'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  deleteSubTask: async (projectId, taskId, subTaskId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/tasks/${projectId}/${taskId}/subtasks/${subTaskId}`)
      await get().fetchTaskById(projectId, taskId)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete subtask'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  setCurrentTask: (task) => set({ currentTask: task }),
  clearCurrentTask: () => set({ currentTask: null }),
  clearError: () => set({ error: null }),
}))

export default useTaskStore
