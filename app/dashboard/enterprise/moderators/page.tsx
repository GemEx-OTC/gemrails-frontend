"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, Building2, Loader2, Search, Trash2, Mail, ShieldCheck, UserMinus } from "lucide-react"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { useModerators, useDeleteModerator, useBranches } from "@/lib/hooks/use-enterprise"
import { enterpriseApi, Moderator } from "@/lib/api/enterprise"

export default function ModeratorsPage() {
  const { data: moderators, isLoading: moderatorsLoading } = useModerators()
  const { data: branches } = useBranches()
  const deleteModeratorMutation = useDeleteModerator()

  const [isAdding, setIsAdding] = useState(false)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, email: string } | null>(null)

  const handleInviteModerator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !selectedBranch) {
      toast.error("Please fill in all fields")
      return
    }

    setIsInviting(true)
    try {
      await enterpriseApi.inviteModerator({ branchId: selectedBranch, email, fullName })
      toast.success("Invitation sent successfully")
      setEmail("")
      setFullName("")
      setSelectedBranch("")
      setIsAdding(false)
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation")
    } finally {
      setIsInviting(false)
    }
  }

  const handleDeleteModerator = (id: string, email: string) => {
    setDeleteConfirm({ id, email })
  }

  const confirmDelete = () => {
    if (!deleteConfirm) return
    
    deleteModeratorMutation.mutate(deleteConfirm.id, {
      onSuccess: () => {
        toast.success("Moderator removed successfully")
        setDeleteConfirm(null)
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to remove moderator")
      }
    })
  }

  const filteredModerators = moderators?.filter((m: Moderator) => 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.branchId?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Moderators</h1>
          <p className="text-gray-400 mt-1">Manage staff access to your business branches</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="gemrails-button flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Invite Moderator</span>
        </button>
      </div>

      <div className="bg-gray-800/20 border border-gray-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search moderators by email or branch..."
            className="w-full bg-gray-900/40 border border-gray-700 focus:border-emerald-500 text-white pl-12 pr-4 py-3 rounded-xl transition-all outline-none"
          />
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/40 border border-emerald-500/30 rounded-2xl p-6"
          >
            <form onSubmit={handleInviteModerator} className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Invite New Moderator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white pl-11 pr-4 py-3 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="moderator@example.com"
                      className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white pl-11 pr-4 py-3 rounded-xl outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Assigned Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                  >
                    <option value="">Select a branch</option>
                    {branches?.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="gemrails-button px-8 flex items-center gap-2"
                >
                  {isInviting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Send Invitation</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-800/20 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-800/40 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Moderator</th>
                <th className="px-6 py-4">Assigned Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {moderatorsLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-6"><div className="h-4 bg-gray-800 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredModerators?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400">No moderators found</p>
                  </td>
                </tr>
              ) : (
                filteredModerators?.map((mod: Moderator) => (
                  <tr key={mod._id} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white lowercase">{mod.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        {mod.branchId?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleDeleteModerator(mod._id, mod.email)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Remove Moderator">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Remove Moderator"
        message={`Are you sure you want to remove ${deleteConfirm?.email} as a moderator? They will lose access to the assigned branch immediately.`}
        confirmText="Remove Moderator"
        variant="danger"
        isLoading={deleteModeratorMutation.isPending}
      />
    </div>
  )
}
