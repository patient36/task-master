"use client"

import { ChevronDown, Menu, Search } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"

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
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full bg-background pl-8 md:w-[300px] lg:w-[350px]"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ModeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 pl-2 pr-1">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <span
                                    className="hidden truncate text-sm font-medium md:inline-block max-w-[100px]"
                                    title="Hubert Blaine Wolfeschlegelsteinhausenbergerdorff"
                                >
                                    Hubert Blaine Wolfeschlegelsteinhausenbergerdorff
                                </span>

                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
