"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import type React from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)
    
    // Reset visibility for new page
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20 
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { duration: isVisible ? 0.4 : 0.2 }
      }}
      style={{
        width: "100%",
        minHeight: "100vh"
      }}
    >
      {children}
    </motion.div>
  )
}
