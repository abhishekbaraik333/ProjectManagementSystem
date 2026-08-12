import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Zap,
  Users,
  BarChart3,
  ArrowRight,
  Play,
  Star,
  Shield,
  Layers,
  ChevronRight,
  Paperclip,
  CheckSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ThemeToggle from '@/components/ThemeToggle'

// Floating animated background blobs
const AnimatedBlob = ({ className }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 dark:opacity-10 ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      x: [0, 30, 0],
      y: [0, -20, 0],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
  />
)

const features = [
  {
    icon: Layers,
    title: 'Project Boards',
    description: 'Organize work visually with customizable Kanban boards and task pipelines.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite members, assign roles, and keep everyone aligned on project goals.',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400',
  },
  {
    icon: Zap,
    title: 'Smart Subtasks',
    description: 'Break down complex tasks into subtasks with progress tracking and ownership.',
    color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400',
  },
  {
    icon: BarChart3,
    title: 'Progress Insights',
    description: 'Track team performance with real-time dashboards and status reports.',
    color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400',
  },
  {
    icon: Shield,
    title: 'Role-based Access',
    description: 'Control who can view, edit, or manage with granular permission controls.',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  {
    icon: CheckCircle,
    title: 'Notes & Comments',
    description: 'Add context to any project with collaborative notes and activity logs.',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  },
]

const stats = [
  { value: '10K+', label: 'Active Projects' },
  { value: '50K+', label: 'Team Members' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'User Rating' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-[#E4ECFC] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Vertex</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#stats" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none">
                Get Started
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Blobs */}
        <AnimatedBlob className="w-[600px] h-[600px] bg-blue-400 -top-32 -right-48" />
        <AnimatedBlob className="w-[400px] h-[400px] bg-indigo-400 -bottom-24 -left-32" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 text-sm font-medium">
              ✦ Now with subtask tracking & team notes
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Manage projects
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent">
              without the chaos
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Vertex gives your team a single source of truth — from high-level roadmaps to
            granular subtasks, all in one beautifully simple workspace.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base shadow-lg shadow-blue-200 dark:shadow-blue-900/40 rounded-xl"
              >
                Start for free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/80 h-12 px-8 text-base rounded-xl transition-colors"
            >
              <Play size={16} className="mr-2 fill-blue-600 dark:fill-blue-400 text-blue-600 dark:text-blue-400" />
              Watch demo
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1">Loved by 50,000+ developers and teams</span>
          </motion.div>
        </div>

        {/* Hero Dashboard Mockup */}
        <motion.div
          className="max-w-6xl mx-auto mt-16 relative z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E4ECFC] dark:border-slate-800 shadow-2xl shadow-blue-100/60 dark:shadow-slate-950/80 overflow-hidden transition-colors">
            {/* Window Topbar */}
            <div className="bg-slate-900 dark:bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-3 px-3 py-1 bg-slate-800/80 dark:bg-slate-900/90 rounded-md flex items-center gap-2 text-xs text-slate-400 font-mono border border-slate-700/50">
                  <span className="text-slate-500">https://</span>
                  <span className="text-slate-200">vertex.app/projects/p-102/board</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/90 dark:bg-slate-900/90 text-slate-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700/50">
                  <Search size={13} className="text-slate-400" />
                  <span>Search tasks (⌘K)...</span>
                </div>
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">AK</div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">SL</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">DR</div>
                </div>
              </div>
            </div>

            {/* App Subheader */}
            <div className="bg-slate-50/70 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm font-bold text-sm">
                  v2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Mobile App Redesign V2.0</h3>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-[11px] px-2 py-0">Active</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">17 of 25 tasks completed • Updated 12m ago</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-2xs">
                  <button className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-semibold shadow-2xs">Board</button>
                  <button className="px-2.5 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">List</button>
                  <button className="px-2.5 py-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">Notes</button>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 rounded-lg px-3 shadow-xs">
                  <Plus size={14} className="mr-1" /> Add Task
                </Button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="p-6 bg-slate-50/30 dark:bg-slate-950/60 grid grid-cols-1 md:grid-cols-3 gap-5 transition-colors">
              
              {/* ── Column 1: TO DO ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">To Do</span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <MoreHorizontal size={15} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
                </div>

                {/* Task Card 1 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 text-[10px] font-semibold px-2 py-0">High</Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#TSK-104</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">Implement OAuth2 & Refresh Token</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><CheckSquare size={12} className="text-blue-500" /> Subtasks</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">3/4</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"><Paperclip size={12} /> 2</span>
                      <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"><Clock size={12} /> Aug 15</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">AK</div>
                  </div>
                </motion.div>

                {/* Task Card 2 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 text-[10px] font-semibold px-2 py-0">Medium</Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#TSK-108</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">Design Dark Mode Color Tokens</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><CheckSquare size={12} className="text-amber-500" /> Subtasks</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">1/2</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"><Paperclip size={12} /> 4</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">SL</div>
                  </div>
                </motion.div>
              </div>

              {/* ── Column 2: IN PROGRESS ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">In Progress</span>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/70 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <MoreHorizontal size={15} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
                </div>

                {/* Featured Glowing Task Card 3 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 border-2 border-blue-400/80 dark:border-blue-500/80 rounded-xl p-4 shadow-md shadow-blue-100 dark:shadow-blue-950/40 hover:shadow-lg transition-all cursor-pointer space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <Badge className="bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 text-[10px] font-bold px-2 py-0">Backend</Badge>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">#TSK-101</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">Subtask API & Cascade Deletion</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Ensure subtasks automatically delete when parent task is removed.</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span className="flex items-center gap-1"><CheckSquare size={12} className="text-blue-600 dark:text-blue-400" /> Subtask Progress</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">4/5 (80%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                        animate={{ width: ['70%', '80%', '75%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium"><Paperclip size={12} /> 3</span>
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium"><Clock size={12} /> Today</span>
                    </div>
                    <div className="relative">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">DR</div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5" />
                    </div>
                  </div>
                </motion.div>

                {/* Task Card 4 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/60 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 text-[10px] font-semibold px-2 py-0">Frontend</Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#TSK-106</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">Framer Motion Drag & Drop Animations</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><CheckSquare size={12} className="text-sky-500" /> Subtasks</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">2/3</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '66%' }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300"><Paperclip size={12} /> 1</span>
                    <div className="w-6 h-6 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">EL</div>
                  </div>
                </motion.div>
              </div>

              {/* ── Column 3: COMPLETED ── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Completed</span>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <MoreHorizontal size={15} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" />
                </div>

                {/* Task Card 5 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold px-2 py-0">Completed</Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#TSK-098</span>
                  </div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-400 text-sm line-through">Relational Ownership Verification</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="flex items-center gap-1"><CheckCircle size={12} /> All done</span>
                      <span>3/3</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Done yesterday</span>
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">DR</div>
                  </div>
                </motion.div>

                {/* Task Card 6 */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold px-2 py-0">Completed</Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">#TSK-092</span>
                  </div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-400 text-sm line-through">Setup Vite + Tailwind v4 & Shadcn</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="flex items-center gap-1"><CheckCircle size={12} /> All done</span>
                      <span>5/5</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Done 2 days ago</span>
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">SL</div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-16 bg-white dark:bg-slate-900 border-y border-[#E4ECFC] dark:border-slate-800 transition-colors">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={itemVariants} className="text-center">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{s.value}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 border-blue-200 mb-4">Everything you need</Badge>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Built for modern teams</h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              All the tools to keep your projects moving, your team aligned, and your deadlines met.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(37,99,235,0.15)' }}
                  className="bg-white dark:bg-slate-900 border border-[#E4ECFC] dark:border-slate-800 rounded-2xl p-6 cursor-pointer transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative bg-gradient-to-br from-blue-600 to-blue-500 dark:from-blue-700 dark:to-indigo-800 rounded-3xl p-12 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white rounded-full" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to streamline your workflow?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of teams already shipping faster with Vertex.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 h-12 rounded-xl shadow-lg"
              >
                Create free account
                <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-[#E4ECFC] dark:border-slate-800 text-center transition-colors">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          © 2025 Vertex. Built with ❤️ for developers.
        </p>
      </footer>
    </div>
  )
}
