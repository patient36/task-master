"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<{ id: string; title: string; category: string }[]>([])
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)

        // Mock search results - in a real app, this would be an API call or filtered data
        if (query.trim().length > 0) {
            setSearchResults(
                [
                    { id: "1", title: "Complete project proposal", category: "Work" },
                    { id: "2", title: "Review design mockups", category: "Design" },
                    { id: "3", title: "Schedule team meeting", category: "Meetings" },
                    { id: "4", title: "Prepare presentation", category: "Work" },
                ].filter(
                    (item) =>
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.category.toLowerCase().includes(query.toLowerCase()),
                ),
            )
        } else {
            setSearchResults([])
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
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                    // Delay hiding results to allow for clicking on them
                    setTimeout(() => setIsSearchFocused(false), 200)
                }}
            />

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && searchResults.length > 0 && (
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
                                        <span className="text-xs text-muted-foreground">{result.category}</span>
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
