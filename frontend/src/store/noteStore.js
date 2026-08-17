import { create } from 'zustand'
import api from '../api/client'

const useNoteStore = create((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get(`/notes/${projectId}`)
      set({ notes: res.data.data, isLoading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch notes', isLoading: false })
    }
  },

  createNote: async (projectId, content) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.post(`/notes/${projectId}`, { content })
      set((state) => ({
        notes: [res.data.data, ...state.notes],
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create note'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  updateNote: async (projectId, noteId, content) => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.put(`/notes/${projectId}/${noteId}`, { content })
      set((state) => ({
        notes: state.notes.map((n) => (n._id === noteId ? res.data.data : n)),
        isLoading: false,
      }))
      return { success: true, data: res.data.data }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update note'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  deleteNote: async (projectId, noteId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/notes/${projectId}/${noteId}`)
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== noteId),
        isLoading: false,
      }))
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete note'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  clearError: () => set({ error: null }),
}))

export default useNoteStore
