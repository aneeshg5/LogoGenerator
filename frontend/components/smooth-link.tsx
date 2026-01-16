"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePageTransition } from "./transition-provider"
import type React from "react"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}

export function SmoothLink({ href, children, onClick, ...props }: SmoothLinkProps) {
  const router = useRouter()
  const { startTransition } = usePageTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (onClick) onClick()
    
    // Start transition effect
    startTransition()
    
    // Small delay to let the transition start
    setTimeout(() => {
      router.push(href)
    }, 100)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
