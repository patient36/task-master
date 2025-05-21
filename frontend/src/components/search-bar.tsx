"use client"

import { useState, useEffect } from "react"
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, ArrowRight, ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchTasks } from "@/hooks/useTasks"
import type { Task } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SearchBarProps {
  onViewTask: (task: Task) => void
}

export function SearchBar({ onViewTask }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const { data, isLoading } = useSearchTasks(debouncedQuery)
  const searchResults: Task[] = data?.tasks ?? []

  const getPriorityIcon = (priority: string | undefined) => {
    if (!priority) return <ArrowRight className="h-4 w-4 text-muted-foreground" />

    switch (priority) {
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "NORMAL":
        return <ArrowRight className="h-4 w-4 text-amber-500" />
      case "LOW":
        return <ArrowDown className="h-4 w-4 text-green-500" />
      default:
        return <ArrowRight className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "OVERDUE":
        return <Clock className="h-4 w-4 text-red-500" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 dark:text-slate-300 text-slate-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search tasks..."
        className="w-full bg-background pl-8 md:w-[300px] lg:w-[350px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
      />

      {isSearchFocused && debouncedQuery.trim() && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-background shadow-md z-10">
          <div className="p-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {isLoading ? "Searching..." : `Search Results (${searchResults.length})`}
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <ul className="space-y-1 max-h-[300px] overflow-y-auto">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      className="flex w-full items-center justify-between rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setIsSearchFocused(false)
                        setSearchQuery("")
                        onViewTask(result)
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                      }}
                    >
                      <span className="flex-1 truncate">{result.title}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <span>{getPriorityIcon(result.priority)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Priority: {result.priority || "None"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <span>{getStatusIcon(result.status)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Status: {result.status}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
