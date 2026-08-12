import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuthStore from '@/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    clearError()
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex transition-colors duration-300">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden p-12">
        {/* Background decorations */}
        <motion.div
          className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400 rounded-full opacity-30"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-500 rounded-full opacity-20"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">Vertex</span>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight">
              Welcome back to
              <br />
              your workspace
            </h2>
            <p className="mt-4 text-blue-100 text-lg leading-relaxed">
              Your projects, tasks, and team — all in one place. Sign in to pick up where you left off.
            </p>
          </motion.div>

          {/* Mini feature cards */}
          <motion.div
            className="mt-10 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {[
              '🗂️  Manage unlimited projects',
              '👥  Collaborate with your team',
              '✅  Track subtasks in real-time',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 text-blue-100 text-sm italic">
          "Vertex cut our delivery time in half."
          <div className="mt-1 text-white/60 not-italic">— Engineering team, Acme Corp</div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
            {/* Mobile logo */}
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-xl">Vertex</span>
            </Link>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign in</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Create one
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-blue-500 rounded-xl pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  onClick={() => setShowPass((p) => !p)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-500 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
