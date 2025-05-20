"use client"
import { AuthForm } from "@/components/auth-form"
import { InfoPanel } from "@/components/info-panel"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { useAuth } from "@/hooks/useAuth"
import Spinner from "@/components/ui/spinner"

export default function AuthPage() {
  const { isLoading, isAuthenticated } = useAuth()
  useAuthGuard()
  if (isLoading || isAuthenticated) return <Spinner />
  return (
    <div className="flex min-h-screen flex-col md:flex-row scrollbar-hide">
      <div className="flex w-full flex-col justify-center px-4 py-12 md:w-1/2 md:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-md">
          <AuthForm />
        </div>
      </div>
      <InfoPanel />
    </div>
  )
}
