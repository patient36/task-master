'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

export const useAuthGuard = () => {
  const { userData, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const path = usePathname()
  const { user } = userData || {}

  useEffect(() => {
    if (isLoading) return

    const protectedRoutes = ['/dashboard', '/settings']
    const requiresAuth = protectedRoutes.some(route => path.startsWith(route))

    // 1. Unauthed trying to access protected
    if (!isAuthenticated && requiresAuth) {
      if (path !== '/') router.replace('/')
    }

    // 2. Authed trying to access public root
    if (isAuthenticated && path === '/') {
      router.replace('/dashboard')
    }

    // 3. Authed trying to access /reset-password
    if (isAuthenticated && path === '/reset-password') {
      router.replace('/settings')
    }
  }, [isLoading, user, path, router,isAuthenticated])
}
