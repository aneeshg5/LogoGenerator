"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useLogos } from "@/hooks/use-logos"

interface SaveLogoModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    name?: string
    prompt?: string
    style?: string
  }
}

const logoStyles = [
  { value: "modern", label: "Modern" },
  { value: "minimalist", label: "Minimalist" },
  { value: "vintage", label: "Vintage" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "bold", label: "Bold" },
  { value: "creative", label: "Creative" },
]

export function SaveLogoModal({ isOpen, onClose, initialData }: SaveLogoModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    prompt: initialData?.prompt || "",
    style: initialData?.style || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { createLogo } = useLogos()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.prompt.trim()) {
      setError("Name and prompt are required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createLogo({
        name: formData.name.trim(),
        prompt: formData.prompt.trim(),
        style: formData.style || undefined,
        settings: {
          // Add any additional settings here
          timestamp: new Date().toISOString(),
        },
      })

      // Reset form and close modal
      setFormData({ name: "", prompt: "", style: "" })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save logo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: "", prompt: "", style: "" })
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Logo to Studio
          </DialogTitle>
          <DialogDescription>
            Save this logo to your personal studio. You can edit the details or make it public later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Logo Name *</Label>
            <Input
              id="name"
              placeholder="My Awesome Logo"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt *</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you wanted to create..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              disabled={isLoading}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a style (optional)" />
              </SelectTrigger>
              <SelectContent>
                {logoStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Logo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
