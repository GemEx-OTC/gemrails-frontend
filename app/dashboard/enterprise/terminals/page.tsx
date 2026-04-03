"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MonitorDot, Building2, Loader2, Search, Trash2, Edit2, QrCode, CreditCard, ChevronDown, Check, X, Hash, UserCheck, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { 
  useBranches, 
  useTerminals, 
  useCreateTerminal, 
  useToggleTerminal, 
  useUpdateTerminal,
  useBanks,
  useVerifyAccount
} from "@/lib/hooks/use-enterprise"
import { TerminalQRCodeModal } from "@/components/terminal-qr-modal"
import { BankSelector } from "@/components/bank-selector"
import { Terminal } from "@/lib/api/enterprise"

export default function TerminalsPage() {
  const { user } = useAuth()
  const { data: branches, isLoading: branchesLoading } = useBranches()
  const [selectedBranch, setSelectedBranch] = useState<string>(user?.branchId || "")
  const { data: terminals, isLoading: terminalsLoading } = useTerminals(selectedBranch)
  const createTerminalMutation = useCreateTerminal()
  const toggleStatusMutation = useToggleTerminal()
  const updateTerminalMutation = useUpdateTerminal()
  const { data: banks } = useBanks()
  const verifyAccountMutation = useVerifyAccount()

  const [isAdding, setIsAdding] = useState(false)
  const [editingTerminal, setEditingTerminal] = useState<Terminal | null>(null)
  const [name, setName] = useState("")
  const [merchantId, setMerchantId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [qrTerminal, setQrTerminal] = useState<Terminal | null>(null)
  const [bankAccount, setBankAccount] = useState({
    bankCode: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  })
  const [statusConfirm, setStatusConfirm] = useState<{ id: string, name: string, isActive: boolean } | null>(null)

  const handleVerifyAccount = () => {
    if (!bankAccount.accountNumber || !bankAccount.bankCode) {
      toast.error("Please provide account number and select a bank")
      return
    }

    if (bankAccount.accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits")
      return
    }

    verifyAccountMutation.mutate(
      { accountNumber: bankAccount.accountNumber, bankCode: bankAccount.bankCode },
      {
        onSuccess: (data: any) => {
          setBankAccount(prev => ({ ...prev, accountName: data.accountName }))
          toast.success("Account verified successfully")
        },
        onError: (err: any) => {
          toast.error(err.message || "Account verification failed")
        }
      }
    )
  }

  const handleAddTerminal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !selectedBranch) {
      toast.error("Please provide a terminal name")
      return
    }

    createTerminalMutation.mutate(
      { 
        branchId: selectedBranch, 
        name, 
        bankAccount: bankAccount.accountNumber ? bankAccount : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Terminal added successfully")
          setName("")
          setMerchantId("")
          setBankAccount({ bankCode: "044", bankName: "Access Bank", accountNumber: "", accountName: "" })
          setIsAdding(false)
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to add terminal")
        }
      }
    )
  }

  const handleUpdateTerminal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTerminal || !name || !bankAccount.accountNumber) {
      toast.error("Please fill in required fields")
      return
    }

    updateTerminalMutation.mutate(
      { 
        id: editingTerminal._id,
        data: { name, bankAccount }
      },
      {
        onSuccess: () => {
          toast.success("Terminal updated successfully")
          setEditingTerminal(null)
          setName("")
          setBankAccount({ bankCode: "044", bankName: "Access Bank", accountNumber: "", accountName: "" })
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update terminal")
        }
      }
    )
  }

  const handleToggleStatus = (id: string, name: string, currentStatus: boolean) => {
    if (currentStatus) {
      // If disabling, ask for confirmation
      setStatusConfirm({ id, name, isActive: false })
    } else {
      // If enabling, just do it
      toggleStatusMutation.mutate({ id, isActive: true }, {
        onSuccess: () => toast.success("Terminal enabled successfully"),
        onError: (err: any) => toast.error(err.message || "Failed to enable terminal")
      })
    }
  }

  const confirmToggleStatus = () => {
    if (!statusConfirm) return
    
    toggleStatusMutation.mutate(
      { id: statusConfirm.id, isActive: statusConfirm.isActive },
      {
        onSuccess: () => {
          toast.success(`Terminal ${statusConfirm.isActive ? 'enabled' : 'disabled'} successfully`)
          setStatusConfirm(null)
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update terminal status")
        }
      }
    )
  }

  const filteredTerminals = terminals?.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.merchantId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Terminals</h1>
          <p className="text-gray-400 mt-1">Manage payment terminals and QR codes across locations</p>
        </div>
        <button
          onClick={() => {
            if (!branches?.length) {
              toast.error("Please create a branch first")
              return
            }
            if (!selectedBranch && branches?.length) {
              setSelectedBranch(user?.branchId || branches[0]._id)
            }
            setIsAdding(true)
          }}
          className="gemrails-button flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Terminal</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-800/20 border border-gray-800 rounded-2xl p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by terminal name or ID..."
              className="w-full bg-gray-900/40 border border-gray-700 focus:border-emerald-500 text-white pl-12 pr-4 py-3 rounded-xl transition-all outline-none"
            />
          </div>
        </div>
        <div className="w-full md:w-64 bg-gray-800/20 border border-gray-800 rounded-2xl p-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            disabled={user?.role === 'branch_mod'}
            className="w-full bg-gray-900/40 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Branches</option>
            {branches?.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
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
            <form onSubmit={handleAddTerminal} className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                New Terminal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    disabled={user?.role === 'branch_mod'}
                    className="w-full bg-gray-900/60 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none disabled:opacity-50"
                  >
                    {branches?.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Terminal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Checkout 1"
                    className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Terminal Bank Account (For direct payouts)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Select Bank</label>
                    <BankSelector
                      value={bankAccount.bankCode}
                      onChange={(code, name) => setBankAccount({ ...bankAccount, bankCode: code, bankName: name })}
                      banks={banks || []}
                      placeholder="Search bank..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Number</label>
                    <div className="flex bg-gray-900/60 border border-gray-700 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                      <div className="pl-3 flex items-center">
                        <Hash className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        value={bankAccount.accountNumber}
                        onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                        placeholder="10 digits"
                        className="flex-1 min-w-0 bg-transparent text-white px-2 py-2.5 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAccount}
                        disabled={verifyAccountMutation.isPending || bankAccount.accountNumber.length !== 10}
                        className="px-4 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-500/20 disabled:opacity-50 transition-all border-l border-gray-800"
                      >
                        {verifyAccountMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Verify"}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Name</label>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                      bankAccount.accountName 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-gray-900/40 border-gray-800 opacity-60"
                    }`}>
                      <UserCheck className={`w-4 h-4 ${bankAccount.accountName ? "text-emerald-400" : "text-gray-600"}`} />
                      <span className={`text-sm truncate font-medium ${bankAccount.accountName ? "text-white" : "text-gray-500"}`}>
                        {bankAccount.accountName || "Verify account number to see name"}
                      </span>
                      {bankAccount.accountName && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTerminalMutation.isPending}
                  className="gemrails-button px-8 flex items-center gap-2"
                >
                  {createTerminalMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Add Terminal</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTerminal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800/40 border border-emerald-500/30 rounded-2xl p-6"
          >
            <form onSubmit={handleUpdateTerminal} className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-400" />
                Edit Terminal: {editingTerminal.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Terminal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Checkout 1"
                    className="w-full bg-gray-900/60 border border-gray-700 focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-2 opacity-50">
                  <label className="text-sm font-medium text-gray-400">QR ID (Cannot be changed)</label>
                  <input
                    type="text"
                    value={editingTerminal.merchantId}
                    disabled
                    className="w-full bg-gray-900/60 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Terminal Bank Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Select Bank</label>
                    <BankSelector
                      value={bankAccount.bankCode}
                      onChange={(code, name) => setBankAccount({ ...bankAccount, bankCode: code, bankName: name })}
                      banks={banks || []}
                      placeholder="Search bank..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Number</label>
                    <div className="flex bg-gray-900/60 border border-gray-700 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                      <div className="pl-3 flex items-center">
                        <Hash className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        maxLength={10}
                        value={bankAccount.accountNumber}
                        onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                        placeholder="10 digits"
                        className="flex-1 min-w-0 bg-transparent text-white px-2 py-2.5 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAccount}
                        disabled={verifyAccountMutation.isPending || bankAccount.accountNumber.length !== 10}
                        className="px-4 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-500/20 disabled:opacity-50 transition-all border-l border-gray-800"
                      >
                        {verifyAccountMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Verify"}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Account Name</label>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                      bankAccount.accountName 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-gray-900/40 border-gray-800 opacity-60"
                    }`}>
                      <UserCheck className={`w-4 h-4 ${bankAccount.accountName ? "text-emerald-400" : "text-gray-600"}`} />
                      <span className={`text-sm truncate font-medium ${bankAccount.accountName ? "text-white" : "text-gray-500"}`}>
                        {bankAccount.accountName || "Verify account number to see name"}
                      </span>
                      {bankAccount.accountName && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTerminal(null)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateTerminalMutation.isPending}
                  className="gemrails-button px-8 flex items-center gap-2"
                >
                  {updateTerminalMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Save Changes</span>
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
                <th className="px-6 py-4">Terminal Name</th>
                <th className="px-6 py-4">Merchant ID (QR)</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bank Account</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {terminalsLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6"><div className="h-4 bg-gray-800 rounded w-full" /></td>
                  </tr>
                ))
              ) : filteredTerminals?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <MonitorDot className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400">No terminals found matching your criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTerminals?.map((terminal) => (
                  <tr key={terminal._id} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                          <MonitorDot className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white">{terminal.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-400">{terminal.merchantId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building2 className="w-3 h-3 text-gray-500" />
                        {typeof terminal.branchId === 'object' ? terminal.branchId.name : "Main"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${
                        terminal.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${terminal.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {terminal.isActive ? "Active" : "Disabled"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {terminal.bankAccount?.accountNumber ? (
                        <div className="text-xs">
                          <p className="text-white font-medium">{terminal.bankAccount.accountNumber}</p>
                          <p className="text-gray-500">{terminal.bankAccount.bankName}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingTerminal(terminal)
                            setName(terminal.name)
                            setBankAccount(terminal.bankAccount)
                          }}
                          className="p-2 text-gray-500 hover:text-white transition-colors" title="Edit Terminal">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(terminal._id, terminal.name, terminal.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                          terminal.isActive ? "text-red-400 hover:bg-red-500/10" : "text-emerald-400 hover:bg-emerald-500/10"
                        }`} title={terminal.isActive ? "Disable" : "Enable"}>
                          {terminal.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setQrTerminal(terminal)}
                          className="p-2 text-gray-500 hover:text-white transition-colors" title="Manage QR">
                          <QrCode className="w-4 h-4" />
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

      <TerminalQRCodeModal 
        terminal={qrTerminal} 
        onClose={() => setQrTerminal(null)} 
      />

      <ConfirmationModal
        isOpen={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={confirmToggleStatus}
        title="Disable Terminal"
        message={`Are you sure you want to disable ${statusConfirm?.name}? It will no longer be able to receive payments via QR code until it is re-enabled.`}
        confirmText="Disable Terminal"
        variant="warning"
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  )
}
