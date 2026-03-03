"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MapPin, Building2, Loader2, Search, Trash2, Edit2, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from "@/lib/hooks/use-enterprise"

export default function BranchesPage() {
  const { data: branches, isLoading } = useBranches()
  const createBranchMutation = useCreateBranch()
  const updateBranchMutation = useUpdateBranch()
  const deleteBranchMutation = useDeleteBranch()

  const [isAdding, setIsAdding] = useState(false)
  const [editingBranch, setEditingBranch] = useState<any>(null)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [moderatorEmail, setModeratorEmail] = useState("")
  const [moderatorFullName, setModeratorFullName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null)

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address || !moderatorEmail || !moderatorFullName) {
      toast.error("Please fill in all fields including moderator details")
      return
    }

    createBranchMutation.mutate(
      { name, address, moderatorEmail, moderatorFullName },
      {
        onSuccess: () => {
          toast.success("Branch added successfully")
          setName("")
          setAddress("")
          setModeratorEmail("")
          setModeratorFullName("")
          setIsAdding(false)
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to add branch")
        }
      }
    )
  }

  const handleUpdateBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address) {
      toast.error("Please fill in fields")
      return
    }

    updateBranchMutation.mutate(
      { id: editingBranch._id, data: { name, address } },
      {
        onSuccess: () => {
          toast.success("Branch updated successfully")
          setEditingBranch(null)
          setName("")
          setAddress("")
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update branch")
        }
      }
    )
  }

  const handleDeleteBranch = (id: string, name: string) => {
    setDeleteConfirm({ id, name })
  }

  const confirmDelete = () => {
    if (!deleteConfirm) return
    
    deleteBranchMutation.mutate(deleteConfirm.id, {
      onSuccess: () => {
        toast.success("Branch deleted successfully")
        setDeleteConfirm(null)
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to delete branch")
      }
    })
  }

  const filteredBranches = branches?.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Branches</h1>
          <p className="text-gray-400 mt-1">Manage your enterprise business locations</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="gemrails-button flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="bg-gray-800/20 border border-gray-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search branches by name or address..."
            className="w-full bg-gray-900/40 border border-gray-700 focus:border-emerald-500 text-white pl-12 pr-4 py-3 rounded-xl transition-all outline-none"
          />
        </div>
      </div>

      <AnimatePresence>
        {(isAdding || editingBranch) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/40 border border-emerald-500/30 rounded-2xl p-6"
          >
            <form onSubmit={editingBranch ? handleUpdateBranch : handleAddBranch} className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {editingBranch ? <Edit2 className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                {editingBranch ? `Edit Branch: ${editingBranch.name}` : 'New Branch'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Branch Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lagos Island Branch"
                    className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full physical address"
                    className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                  />
                </div>
                {!editingBranch && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Moderator Full Name</label>
                      <input
                        type="text"
                        value={moderatorFullName}
                        onChange={(e) => setModeratorFullName(e.target.value)}
                        placeholder="e.g. Jane Smith"
                        className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Moderator Email</label>
                      <input
                        type="email"
                        value={moderatorEmail}
                        onChange={(e) => setModeratorEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                        required
                      />
                    </div>
                    <p className="text-xs text-emerald-500/80 md:col-span-2 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                      Moderators will receive an email invitation to set up their password and manage this branch.
                    </p>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false)
                    setEditingBranch(null)
                    setName("")
                    setAddress("")
                  }}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBranchMutation.isPending || updateBranchMutation.isPending}
                  className="gemrails-button px-8 flex items-center gap-2"
                >
                  {createBranchMutation.isPending || updateBranchMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>{editingBranch ? 'Save Changes' : 'Add Branch'}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-800/20 rounded-2xl animate-pulse" />
          ))
        ) : filteredBranches?.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Building2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No branches found</h3>
            <p className="text-gray-400 mt-2">Add your first branch to start setting up terminals.</p>
          </div>
        ) : (
          filteredBranches?.map((branch) => (
            <motion.div
              key={branch._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/40 border border-gray-700 hover:border-emerald-500/50 transition-all p-6 rounded-2xl group"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingBranch(branch)
                      setName(branch.name)
                      setAddress(branch.address)
                      setIsAdding(false)
                    }}
                    className="p-2 text-gray-500 hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteBranch(branch._id, branch.name)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-white text-lg">{branch.name}</h3>
                <div className="flex items-start gap-2 text-gray-400 mt-2 text-sm leading-relaxed">
                  <MapPin className="w-4 h-4 mt-1 shrink-0" />
                  <p>{branch.address}</p>
                </div>
              </div>
              <Link href={`/dashboard/enterprise/terminals?branchId=${branch._id}`} className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between group/link cursor-pointer">
                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Manage Terminals</span>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover/link:text-emerald-400 transition-colors" />
              </Link>
            </motion.div>
          ))
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Branch"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action is permanent and will also delete all associated terminals and moderators linked to this branch.`}
        confirmText="Delete Branch"
        variant="danger"
        isLoading={deleteBranchMutation.isPending}
      />
    </div>
  )
}
