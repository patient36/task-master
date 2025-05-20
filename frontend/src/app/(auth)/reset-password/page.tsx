import { PasswordResetPortal } from "@/components/password-reset-portal"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 dark:bg-black bg-gray-50">
      <div className="w-full max-w-md">
        <PasswordResetPortal />
      </div>
    </main>
  )
}
