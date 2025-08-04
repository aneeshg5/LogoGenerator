"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { Search, Filter, Grid, List, MoreVertical, Download, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

// Mock data for user logos
const mockLogos = [
  {
    id: 1,
    name: "TechCorp Logo",
    createdAt: "2024-01-15",
    thumbnail: "/placeholder.svg?height=200&width=200&text=TechCorp",
    style: "minimal",
    industry: "technology",
  },
  {
    id: 2,
    name: "Cafe Delight",
    createdAt: "2024-01-14",
    thumbnail: "/placeholder.svg?height=200&width=200&text=Cafe+Delight",
    style: "vintage",
    industry: "food",
  },
  {
    id: 3,
    name: "Health Plus",
    createdAt: "2024-01-13",
    thumbnail: "/placeholder.svg?height=200&width=200&text=Health+Plus",
    style: "modern",
    industry: "healthcare",
  },
  {
    id: 4,
    name: "Creative Studio",
    createdAt: "2024-01-12",
    thumbnail: "/placeholder.svg?height=200&width=200&text=Creative+Studio",
    style: "abstract",
    industry: "creative",
  },
  {
    id: 5,
    name: "Finance Pro",
    createdAt: "2024-01-11",
    thumbnail: "/placeholder.svg?height=200&width=200&text=Finance+Pro",
    style: "geometric",
    industry: "finance",
  },
  {
    id: 6,
    name: "EduLearn",
    createdAt: "2024-01-10",
    thumbnail: "/placeholder.svg?height=200&width=200&text=EduLearn",
    style: "illustrative",
    industry: "education",
  },
]

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredLogos = mockLogos.filter((logo) => {
    const matchesSearch = logo.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || logo.industry === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Studio</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage and organize all your created logos</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Industries</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("technology")}>Technology</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("food")}>Food & Beverage</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("healthcare")}>Healthcare</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("creative")}>Creative</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("finance")}>Finance</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("education")}>Education</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {filteredLogos.length} of {mockLogos.length} logos
          </p>
        </div>

        {/* Logo Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLogos.map((logo) => (
              <Card key={logo.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={logo.thumbnail || "/placeholder.svg"}
                      alt={logo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{logo.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <div className="relative group">
                              <div className="flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </div>
                              <div className="absolute left-full top-0 ml-1 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[140px] z-50">
                                <Link
                                  href={`/canvas/${logo.id}`}
                                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  Canvas Editor
                                </Link>
                                <Link
                                  href={`/edit/${logo.id}`}
                                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  AI Editor
                                </Link>
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{logo.createdAt}</span>
                      <Badge variant="outline" className="text-xs">
                        {logo.style}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogos.map((logo) => (
              <Card key={logo.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={logo.thumbnail || "/placeholder.svg"}
                        alt={logo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{logo.name}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span>Created: {logo.createdAt}</span>
                        <Badge variant="outline" className="text-xs">
                          {logo.style}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {logo.industry}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <div className="relative group">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[140px] z-50">
                          <Link
                            href={`/canvas/${logo.id}`}
                            className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Canvas Editor
                          </Link>
                          <Link
                            href={`/edit/${logo.id}`}
                            className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            AI Editor
                          </Link>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredLogos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No logos found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first logo to get started"}
            </p>
            <Button>Create New Logo</Button>
          </div>
        )}
      </div>
    </div>
  )
}
