"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react"

interface TransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  startTransition: () => {},
})

export const usePageTransition = () => useContext(TransitionContext)

interface TransitionProviderProps {
  children: React.ReactNode
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsTransitioning(false)
  }, [pathname])

  const startTransition = () => {
    setIsTransitioning(true)
  }

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {children}
        
        {/* Global loading overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(2px)",
                zIndex: 50,
                pointerEvents: "none",
              }}
              className="dark:bg-black/20"
            />
          )}
        </AnimatePresence>
      </div>
    </TransitionContext.Provider>
  )
}
