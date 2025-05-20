"use client"
import { PasswordResetPortal } from "@/components/password-reset-portal"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useAuth } from "@/hooks/useAuth"
import Spinner from "@/components/ui/spinner"

export default function Home() {
  const { isLoading, isAuthenticated } = useAuth()
  useAuthGuard()
  if (isLoading || isAuthenticated) return <Spinner />
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 dark:bg-black bg-gray-50">
      <div className="w-full max-w-md">
        <PasswordResetPortal />
      </div>
    </main>
  )
}
