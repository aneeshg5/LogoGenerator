"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { LogoCard } from "@/components/logo-card"
import { useLogos } from "@/hooks/use-logos"
import { Search, Filter, Sparkles, Zap } from "lucide-react"

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  
  const { data: session, status } = useSession()
  const { logos, isLoading, error, updateLogo, deleteLogo } = useLogos()

  // Filter logos based on search and filter criteria
  const filteredLogos = logos.filter((logo) => {
    const matchesSearch = logo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         logo.prompt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || 
                         (selectedFilter === "public" && logo.isPublic) ||
                         (selectedFilter === "private" && !logo.isPublic) ||
                         (logo.style && logo.style.toLowerCase() === selectedFilter)
    return matchesSearch && matchesFilter
  })

  const handleTogglePublic = async (logoId: string, isPublic: boolean) => {
    try {
      await updateLogo(logoId, { isPublic })
    } catch (error) {
      console.error("Failed to toggle public status:", error)
    }
  }

  const handleDeleteLogo = async (logoId: string) => {
    try {
      await deleteLogo(logoId)
    } catch (error) {
      console.error("Failed to delete logo:", error)
    }
  }

  const handleDownloadLogo = (logo: any) => {
    // TODO: Implement actual download functionality
    console.log("Downloading logo:", logo.name)
  }

  const handleEditLogo = (logo: any) => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Editing logo:", logo.name)
  }

  // Show authentication required state
  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to access your studio
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Create an account or sign in to save and manage your logos
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Studio</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and organize all your created logos</p>
          </div>
          <Button asChild>
            <Link href="/generate" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Generate New Logo
            </Link>
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logos and prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Logos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("public")}>Public</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("private")}>Private</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("modern")}>Modern Style</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("minimalist")}>Minimalist</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("vintage")}>Vintage</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading your logos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error loading logos</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {filteredLogos.length} of {logos.length} logos
            </p>
          </div>
        )}

        {/* Logo Grid */}
        {!isLoading && !error && filteredLogos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLogos.map((logo) => (
              <LogoCard
                key={logo.id}
                logo={logo}
                onEdit={handleEditLogo}
                onDelete={handleDeleteLogo}
                onTogglePublic={handleTogglePublic}
                onDownload={handleDownloadLogo}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredLogos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              {searchTerm ? (
                <Search className="h-12 w-12 text-gray-400" />
              ) : (
                <Sparkles className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? "No logos found" : logos.length === 0 ? "No logos yet" : "No matching logos"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms or filters" 
                : logos.length === 0
                ? "Create your first logo to get started"
                : "Try different search terms or filters"
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/generate">
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Your First Logo
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
