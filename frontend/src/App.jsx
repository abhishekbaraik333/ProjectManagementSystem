import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './components/layout/DashboardLayout'
import ProjectListPage from './pages/dashboard/ProjectListPage'
import ProjectBoardPage from './pages/dashboard/ProjectBoardPage'
import MembersPage from './pages/dashboard/MembersPage'
import NotesPage from './pages/dashboard/NotesPage'
import ProjectSettingsPage from './pages/dashboard/ProjectSettingsPage'
import CreateProjectModal from './components/CreateProjectModal'
import useAuthStore from './store/authStore'
import useThemeStore from './store/themeStore'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onCreateProject={() => setCreateModalOpen(true)} />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProjectListPage onCreateProject={() => setCreateModalOpen(true)} />} />
          <Route path="project/:projectId" element={<ProjectBoardPage />} />
          <Route path="project/:projectId/members" element={<MembersPage />} />
          <Route path="project/:projectId/notes" element={<NotesPage />} />
          <Route path="project/:projectId/settings" element={<ProjectSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global create project modal */}
      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </BrowserRouter>
  )
}
