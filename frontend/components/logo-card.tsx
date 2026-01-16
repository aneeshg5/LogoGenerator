"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Globe, Lock, MoreVertical, Pencil, Trash2 } from "lucide-react"
import type { Logo } from "@/hooks/use-logos"

interface LogoCardProps {
  logo: Logo
  onEdit?: (logo: Logo) => void
  onDelete?: (logoId: string) => void
  onTogglePublic?: (logoId: string, isPublic: boolean) => void
  onDownload?: (logo: Logo) => void
}

export function LogoCard({ logo, onEdit, onDelete, onTogglePublic, onDownload }: LogoCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleTogglePublic = async () => {
    if (!onTogglePublic) return
    
    setIsLoading(true)
    try {
      await onTogglePublic(logo.id, !logo.isPublic)
    } catch (error) {
      console.error("Failed to toggle public status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    
    if (window.confirm("Are you sure you want to delete this logo? This action cannot be undone.")) {
      setIsLoading(true)
      try {
        await onDelete(logo.id)
      } catch (error) {
        console.error("Failed to delete logo:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload(logo)
    }
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          {!imageError ? (
            <Image
              src={logo.url}
              alt={logo.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {logo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">Logo Preview</p>
              </div>
            </div>
          )}
          
          {/* Overlay with actions - visible on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm truncate flex-1">{logo.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(logo)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePublic} disabled={isLoading}>
                {logo.isPublic ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    Make Public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isLoading} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {logo.prompt}
        </p>

        <div className="flex items-center gap-2">
          <Badge variant={logo.isPublic ? "default" : "secondary"} className="text-xs">
            {logo.isPublic ? (
              <>
                <Globe className="mr-1 h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="mr-1 h-3 w-3" />
                Private
              </>
            )}
          </Badge>
          {logo.downloads > 0 && (
            <Badge variant="outline" className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              {logo.downloads}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 text-xs text-gray-500">
        Created {new Date(logo.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}
