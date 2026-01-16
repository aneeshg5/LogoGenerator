"use client"

import { useState, useEffect } from "react"

interface Logo {
  id: string
  name: string
  url: string
  createdAt: string
  settings: any
}

export function useLogoStorage() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load logos from localStorage
    const savedLogos = localStorage.getItem("user-logos")
    if (savedLogos) {
      setLogos(JSON.parse(savedLogos))
    }
    setIsLoading(false)
  }, [])

  const saveLogo = (logo: Logo) => {
    const updatedLogos = [...logos, logo]
    setLogos(updatedLogos)
    localStorage.setItem("user-logos", JSON.stringify(updatedLogos))
  }

  const deleteLogo = (id: string) => {
    const updatedLogos = logos.filter((logo) => logo.id !== id)
    setLogos(updatedLogos)
    localStorage.setItem("user-logos", JSON.stringify(updatedLogos))
  }

  const updateLogo = (id: string, updates: Partial<Logo>) => {
    const updatedLogos = logos.map((logo) => (logo.id === id ? { ...logo, ...updates } : logo))
    setLogos(updatedLogos)
    localStorage.setItem("user-logos", JSON.stringify(updatedLogos))
  }

  return {
    logos,
    isLoading,
    saveLogo,
    deleteLogo,
    updateLogo,
  }
}
