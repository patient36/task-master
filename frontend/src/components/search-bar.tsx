"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchTasks } from "@/hooks/useTasks"
import { Task } from "@/lib/types"

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [debouncedQuery, setDebouncedQuery] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(searchQuery), 300)
        return () => clearTimeout(timeout)
    }, [searchQuery])

    const { data, isLoading } = useSearchTasks(debouncedQuery)
    const searchResults: Task[] = data?.tasks ?? []

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
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />

            {isSearchFocused && debouncedQuery.trim() && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full rounded-md border bg-background shadow-md z-10">
                    <div className="p-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h3>
                        <ul className="space-y-1">
                            {searchResults.map((result) => (
                                <li key={result.id}>
                                    <Link
                                        href={`/tasks/${result.id}`}
                                        className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => {
                                            setIsSearchFocused(false)
                                            setSearchQuery("")
                                        }}
                                    >
                                        <span>{result.title}</span>
                                        <span className="text-xs text-muted-foreground">{result.priority}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
