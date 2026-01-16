"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"

export default function OnboardingPage() {
  const { data, update } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect users who already have a username
  useEffect(() => {
    if (data?.user && (data.user as any).username) {
      router.push("/generate")
    }
  }, [data, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Failed to set username")
      } else {
        // Update the session to refresh username from DB
        await update()
        router.push("/generate")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Choose a username</CardTitle>
            <CardDescription>This will be shown publicly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
              <Button type="submit" disabled={isLoading}>Continue</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

