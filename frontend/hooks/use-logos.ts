import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export interface Logo {
  id: string
  name: string
  url: string
  prompt: string
  style?: string
  isPublic: boolean
  downloads: number
  createdAt: string
  updatedAt: string
}

interface CreateLogoData {
  name: string
  prompt: string
  style?: string
  settings?: Record<string, any>
}

interface UpdateLogoData {
  name?: string
  isPublic?: boolean
}

export function useLogos() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  // Fetch logos when user is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchLogos()
    } else if (status === "unauthenticated") {
      setLogos([])
      setIsLoading(false)
    }
  }, [status])

  const fetchLogos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch("/api/logos")
      if (!response.ok) {
        throw new Error("Failed to fetch logos")
      }
      
      const data = await response.json()
      setLogos(data.logos || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setLogos([])
    } finally {
      setIsLoading(false)
    }
  }

  const createLogo = async (logoData: CreateLogoData): Promise<Logo> => {
    const response = await fetch("/api/logos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logoData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create logo")
    }

    const data = await response.json()
    const newLogo = data.logo

    // Add to local state
    setLogos(prev => [newLogo, ...prev])
    
    return newLogo
  }

  const updateLogo = async (id: string, updateData: UpdateLogoData): Promise<Logo> => {
    const response = await fetch(`/api/logos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to update logo")
    }

    const data = await response.json()
    const updatedLogo = data.logo

    // Update local state
    setLogos(prev => prev.map(logo => logo.id === id ? updatedLogo : logo))
    
    return updatedLogo
  }

  const deleteLogo = async (id: string): Promise<void> => {
    const response = await fetch(`/api/logos/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to delete logo")
    }

    // Remove from local state
    setLogos(prev => prev.filter(logo => logo.id !== id))
  }

  return {
    logos,
    isLoading,
    error,
    fetchLogos,
    createLogo,
    updateLogo,
    deleteLogo,
  }
}
