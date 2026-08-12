import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, ArrowRight, Loader2, CheckCircle2, User, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuthStore from '@/store/authStore'
import ThemeToggle from '@/components/ThemeToggle'

const strengthLevels = [
  { label: 'Weak', color: 'bg-red-400', width: 'w-1/4' },
  { label: 'Fair', color: 'bg-orange-400', width: 'w-2/4' },
  { label: 'Good', color: 'bg-yellow-400', width: 'w-3/4' },
  { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' },
]

function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score - 1
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [showPass, setShowPass] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const strengthIndex = form.password ? getPasswordStrength(form.password) : -1
  const strength = strengthIndex >= 0 ? strengthLevels[strengthIndex] : null

  const handleChange = (e) => {
    clearError()
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form)
    if (result.success) {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex transition-colors duration-300">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 relative overflow-hidden p-12">
        <motion.div
          className="absolute top-20 right-12 w-64 h-64 bg-blue-500 rounded-full opacity-10"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-16 left-8 w-80 h-80 bg-blue-400 rounded-full opacity-10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-blue-500/30 backdrop-blur flex items-center justify-center">
            <Zap size={16} className="text-blue-300" />
          </div>
          <span className="font-bold text-white text-xl">Vertex</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your new command
              <br />
              center awaits
            </h2>
            <p className="mt-4 text-blue-200 text-lg leading-relaxed">
              Set up your free account in seconds and start collaborating with your team today.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: CheckCircle2, text: 'Free to start — no credit card required' },
              { icon: CheckCircle2, text: 'Unlimited projects and tasks' },
              { icon: CheckCircle2, text: 'Role-based access for team members' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-blue-100 text-sm">
                <Icon size={16} className="text-blue-400 shrink-0" />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Minimal avatar row */}
          <motion.div
            className="mt-12 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex -space-x-2">
              {['bg-blue-400', 'bg-indigo-500', 'bg-sky-400', 'bg-violet-500'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-slate-900`} />
              ))}
            </div>
            <p className="text-blue-200 text-xs">Join 50,000+ teams already on board</p>
          </motion.div>
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
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-xl">Vertex</span>
            </Link>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 size={36} className="text-emerald-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account created!</h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                    Check your email to verify your account, then sign in.
                  </p>
                  <Link to="/login" className="mt-6 inline-block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
                      Go to Sign In
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 dark:text-slate-200 font-medium">Username</Label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="johndoe"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-blue-500 rounded-xl pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium">Email</Label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-blue-500 rounded-xl pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium">Password</Label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min. 8 chars, uppercase & symbol"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="h-11 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:border-blue-500 rounded-xl pl-9 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        onClick={() => setShowPass((p) => !p)}
                      >
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.password && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${strength?.color || ''}`}
                            initial={{ width: 0 }}
                            animate={{ width: strength?.width || '0%' }}
                            transition={{ duration: 0.3 }}
                            style={{ width: strength?.width?.replace('w-', '') === 'full' ? '100%' : strength?.width?.replace('w-', '').replace('/', '/100 * 100%') }}
                          />
                        </div>
                        {strength && (
                          <p className={`text-xs font-medium ${strengthIndex === 3 ? 'text-emerald-600' : strengthIndex >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {strength.label} password
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                  By creating an account you agree to our{' '}
                  <a href="#" className="text-blue-500 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
