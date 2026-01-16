"use client"

import type React from "react"

// Legacy context removed; NextAuth SessionProvider is used instead
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuth() {
  throw new Error("useAuth is deprecated. Use useSession from next-auth/react instead.")
}
