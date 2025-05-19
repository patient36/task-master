"use client"

import { Home, LayoutDashboard, User } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps {
    closeMobileMenu?: () => void
}

export function Sidebar({ closeMobileMenu }: SidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            active: pathname === "/dashboard",
        },
        {
            label: "Settings",
            icon: User,
            href: "/settings",
            active: pathname === "/settings",
        }
    ]

    return (
        <aside className="flex h-full w-[240px] flex-col border-r bg-background">
            <div className="flex h-14 items-center border-b px-4">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold"
                    onClick={closeMobileMenu}
                >
                    <Home className="h-5 w-5" />
                    <span>TaskMaster</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 px-2 py-4">
                <nav className="flex flex-col gap-1">
                    {routes.map((route) => (
                        <Button
                            key={route.href}
                            variant={route.active ? "secondary" : "ghost"}
                            className="justify-start"
                            asChild
                        >
                            <Link href={route.href} onClick={closeMobileMenu}>
                                <route.icon className="mr-2 h-4 w-4" />
                                {route.label}
                            </Link>
                        </Button>
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    )
}
