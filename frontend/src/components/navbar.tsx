"use client"

import { ChevronDown, Menu, User2 } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"
import { SearchBar } from './search-bar'
import { user } from "@/lib/data"

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0">
                            <SheetTitle>
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    <span className="hidden font-bold sm:inline-block">Task Master</span>
                                </Link>
                            </SheetTitle>
                            <Sidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
                        </SheetContent>
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="hidden font-bold sm:inline-block">Task Master</span>
                        </Link>
                    </Sheet>
                </div>
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 pl-2 pr-1">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback>
                                        <User2 className="h-4 w-4 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <span
                                    className="hidden truncate text-sm font-medium md:inline-block max-w-[100px]"
                                    title={user.name}
                                >
                                    {user.name}
                                </span>

                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Link href="/profile">Settings</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
