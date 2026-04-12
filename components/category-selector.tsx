"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Check, X, Tag } from "lucide-react"

interface CategoryItem {
  value: string
  label: string
}

interface CategoryGroup {
  readonly group: string
  readonly items: readonly CategoryItem[]
}

interface CategorySelectorProps {
  value: string
  onChange: (value: string) => void
  categories: readonly CategoryGroup[]
  placeholder?: string
  disabled?: boolean
}

export function CategorySelector({ 
  value, 
  onChange, 
  categories = [], 
  placeholder = "Search business category...", 
  disabled = false 
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Flattened list for easier searching and finding selected
  const allItems = useMemo(() => {
    return categories.flatMap(group => group.items)
  }, [categories])

  // Filter categories based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    
    return categories.map(group => {
      // Check if group name matches
      const groupMatches = group.group.toLowerCase().includes(query)
      
      // Filter items that match or if group matches include all items
      const matchingItems = group.items.filter(item => 
        groupMatches || item.label.toLowerCase().includes(query)
      )

      if (matchingItems.length > 0) {
        return {
          ...group,
          items: matchingItems
        }
      }
      return null
    }).filter(group => group !== null) as CategoryGroup[]
  }, [categories, searchQuery])

  // Get selected category
  const selectedCategory = useMemo(() => {
    return allItems.find((item) => item.value === value)
  }, [allItems, value])

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

  const handleSelect = (item: CategoryItem) => {
    onChange(item.value)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setSearchQuery("")
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all
          ${disabled ? "bg-gray-800/50 cursor-not-allowed" : "bg-gray-800/50 hover:bg-gray-800 border-gray-700 cursor-pointer"}
          ${isOpen ? "ring-2 ring-purple-500/50 border-purple-500/50" : "border border-gray-800"}
          text-left`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Tag className={`w-5 h-5 shrink-0 ${selectedCategory ? "text-purple-400" : "text-gray-500"}`} />
          <span className={`truncate text-sm ${selectedCategory ? "text-white" : "text-gray-400"}`}>
            {selectedCategory ? selectedCategory.label : "Choose business category"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCategory && !disabled && (
            <div
              onClick={handleClear}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </div>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 focus:border-purple-500/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category List */}
            <div className="max-h-80 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-800 pb-2">
              {filteredGroups.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No categories found</p>
                </div>
              ) : (
                filteredGroups.map((group, groupIdx) => (
                  <div key={group.group} className={groupIdx > 0 ? "mt-2" : ""}>
                    <div className="px-4 py-2 text-xs font-bold text-purple-400/70 uppercase tracking-widest bg-gray-800/30">
                      {group.group}
                    </div>
                    <div className="mt-1">
                      {group.items.map((item) => {
                        const isSelected = item.value === value
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => handleSelect(item)}
                            className={`w-full flex items-center justify-between gap-3 px-6 py-2.5 text-left transition-colors
                              ${isSelected ? "bg-purple-500/10" : "hover:bg-gray-800/50"}`}
                          >
                            <span className={`text-sm ${isSelected ? "text-purple-400 font-semibold" : "text-gray-300"}`}>
                              {item.label}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-purple-500" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
