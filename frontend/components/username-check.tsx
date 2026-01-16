"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export function UsernameCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Pages that should not redirect to onboarding
  const excludedPaths = ["/onboarding", "/auth/login", "/auth/signup", "/api"]

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any
      // Skip redirect for excluded paths
      const isExcluded = excludedPaths.some(path => pathname.startsWith(path))
      
      // If user is authenticated but has no username, redirect to onboarding
      if (!user.username && !isExcluded) {
        router.push("/onboarding")
      }
    }
  }, [session, status, router, pathname])

  // Don't render children if we're redirecting (except for excluded paths)
  const isExcluded = excludedPaths.some(path => pathname.startsWith(path))
  if (status === "authenticated" && session?.user && !(session.user as any).username && !isExcluded) {
    return null
  }

  return <>{children}</>
}
