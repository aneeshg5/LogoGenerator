"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Loader2 } from "lucide-react"

interface SaveModalProps {
  logoSrc: string
  onSave: (data: { name: string; description?: string }) => Promise<void>
}

export default function SaveModal({ logoSrc, onSave }: SaveModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSave = async () => {
    if (!name.trim()) return

    setIsSaving(true)
    try {
      await onSave({ name: name.trim(), description: description.trim() || undefined })
      setIsOpen(false)
      setName("")
      setDescription("")
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Logo</DialogTitle>
          <DialogDescription>Give your logo a name and save it to your library</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Logo Preview */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <img
                src={logoSrc || "/placeholder.svg"}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-name">Logo Name *</Label>
              <Input
                id="logo-name"
                placeholder="Enter logo name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-description">Description (Optional)</Label>
              <Textarea
                id="logo-description"
                placeholder="Add a description for your logo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isSaving ? (
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
