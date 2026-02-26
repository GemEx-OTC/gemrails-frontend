"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Building2, Check, X, Loader2 } from "lucide-react"

interface Bank {
  name: string
  code: string
}

interface BankSelectorProps {
  value: string
  onChange: (bankCode: string, bankName: string) => void
  banks: Bank[]
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}

export function BankSelector({ 
  value, 
  onChange, 
  banks = [], 
  isLoading = false,
  placeholder = "Search for your bank...", 
  disabled = false 
}: BankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter banks based on search
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banks
    const query = searchQuery.toLowerCase()
    return banks.filter(
      (bank) =>
        bank.name.toLowerCase().includes(query) ||
        bank.code.includes(query)
    )
  }, [banks, searchQuery])

  // Get selected bank
  const selectedBank = useMemo(() => {
    return banks.find((b) => b.code === value)
  }, [banks, value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (bank: Bank) => {
    onChange(bank.code, bank.name)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("", "")
    setSearchQuery("")
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.99 }}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all
          ${disabled || isLoading ? "bg-gray-800/50 cursor-not-allowed" : "bg-gray-800/50 hover:bg-gray-800 border-gray-700 cursor-pointer"}
          ${isOpen ? "ring-2 ring-emerald-500/50 border-emerald-500/50" : "border border-gray-700"}
          text-left`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          ) : (
            <Building2 className={`w-5 h-5 flex-shrink-0 ${selectedBank ? "text-emerald-400" : "text-gray-500"}`} />
          )}
          <span className={`truncate ${selectedBank ? "text-white" : "text-gray-400"}`}>
            {isLoading ? "Loading banks..." : selectedBank ? selectedBank.name : "Choose your bank"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedBank && !disabled && !isLoading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleClear}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </motion.div>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-[#12161c] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bank List */}
            <div className="max-h-64 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-800">
              {filteredBanks.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Building2 className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No banks found</p>
                </div>
              ) : (
                <div className="py-1">
                  {filteredBanks.map((bank) => {
                    const isSelected = bank.code === value
                    return (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => handleSelect(bank)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors
                          ${isSelected ? "bg-emerald-500/10" : "hover:bg-gray-800/50"}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${isSelected ? "bg-emerald-500/20" : "bg-gray-800"}`}>
                            <Building2 className={`w-4 h-4 ${isSelected ? "text-emerald-400" : "text-gray-500"}`} />
                          </div>
                          <p className={`text-sm font-medium truncate ${isSelected ? "text-emerald-400" : "text-white"}`}>
                            {bank.name}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-800 bg-gray-900/50">
              <p className="text-xs text-gray-500">
                {filteredBanks.length} banks available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
