import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  User,
  Users,
  Loader2,
  Trash2,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useProjectStore from '@/store/projectStore'
import useAuthStore from '@/store/authStore'

const roleIcons = {
  admin: ShieldCheck,
  project_admin: Shield,
  member: User,
}

const roleColors = {
  admin: 'bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60',
  project_admin: 'bg-amber-50 text-amber-800 border border-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60',
  member: 'bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
}

export default function MembersPage() {
  const { projectId } = useParams()
  const members = useProjectStore((s) => s.members)
  const fetchMembers = useProjectStore((s) => s.fetchMembers)
  const addMember = useProjectStore((s) => s.addMember)
  const updateMemberRole = useProjectStore((s) => s.updateMemberRole)
  const removeMember = useProjectStore((s) => s.removeMember)
  const fetchProjectById = useProjectStore((s) => s.fetchProjectById)
  const isLoading = useProjectStore((s) => s.isLoading)
  const currentUser = useAuthStore((s) => s.user)

  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [error, setError] = useState('')

  const currentMember = members.find((m) => m.user?._id === currentUser?._id)
  const currentUserRole = currentMember?.role
  const isCurrentAdmin = currentUserRole === 'admin'
  const canManageMembers = isCurrentAdmin || currentUserRole === 'project_admin'

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
      fetchMembers(projectId)
    }
  }, [projectId, fetchProjectById, fetchMembers])

  const handleInvite = async (e) => {
    e.preventDefault()
    setError('')

    if (!inviteEmail.trim()) {
      setError('Email is required')
      return
    }

    const result = await addMember(projectId, {
      email: inviteEmail.trim(),
      role: inviteRole,
    })

    if (result.success) {
      setInviteEmail('')
      setInviteRole('member')
      setShowInvite(false)
    } else {
      setError(result.error)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateMemberRole(projectId, userId, newRole)
    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  const handleRemove = async (userId) => {
    const result = await removeMember(projectId, userId)
    if (!result.success && result.error) {
      setError(result.error)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your project team and their permissions.
          </p>
        </div>
        {canManageMembers && (
          <Button
            onClick={() => setShowInvite(!showInvite)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm shadow-blue-500/20 rounded-xl"
          >
            <UserPlus size={16} />
            Invite Member
          </Button>
        )}
      </div>

      {/* Invite form */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleInvite}
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Mail size={15} />
                </div>
                Invite a new team member
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 focus:bg-white text-slate-900 dark:text-white rounded-xl shadow-2xs"
                  />
                </div>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-full sm:w-44 bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="project_admin">Project Admin</SelectItem>
                    {isCurrentAdmin && <SelectItem value="admin">Admin</SelectItem>}
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs shadow-blue-500/20 rounded-xl"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Send Invite'}
                </Button>
              </div>
              {error && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members list */}
      <div className="space-y-2.5">
        {members.map((member, index) => {
          const RoleIcon = roleIcons[member.role] || User
          const isCurrentUser = member.user?._id === currentUser?._id
          const isTargetAdmin = member.role === 'admin'
          // A project_admin cannot modify or remove an admin
          const canModifyThisMember = !isCurrentUser && canManageMembers && (!isTargetAdmin || isCurrentAdmin)

          return (
            <motion.div
              key={member.user?._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3.5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shadow-blue-500/20 flex-shrink-0">
                  {(member.user?.username || member.user?.fullName || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {member.user?.fullName || member.user?.username || 'Unknown'}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 font-semibold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    @{member.user?.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Role badge */}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full capitalize ${roleColors[member.role]}`}
                >
                  <RoleIcon size={12} />
                  {member.role?.replace('_', ' ')}
                </span>

                {/* Actions (Only if allowed to modify this member) */}
                {canModifyThisMember && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg"
                    >
                      {isCurrentAdmin && member.role !== 'admin' && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.user?._id, 'admin')}
                        >
                          Make Admin
                        </DropdownMenuItem>
                      )}
                      {member.role !== 'project_admin' && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.user?._id, 'project_admin')}
                        >
                          Make Project Admin
                        </DropdownMenuItem>
                      )}
                      {member.role !== 'member' && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(member.user?._id, 'member')}
                        >
                          Make Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                        onClick={() => handleRemove(member.user?._id)}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </motion.div>
          )
        })}

        {members.length === 0 && (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Users size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No members found</p>
          </div>
        )}
      </div>
    </div>
  )
}
