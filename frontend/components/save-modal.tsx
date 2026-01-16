"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface SaveModalProps {
  logoSrc: string
  onSave: (data: { name: string; description?: string }) => Promise<void>
}

export default function SaveModal({ logoSrc, onSave }: SaveModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()

  console.log("SaveModal render - isOpen:", isOpen, "saveState:", saveState)

  const handleSave = async () => {
    console.log("Save button clicked!", { name: name.trim(), description: description.trim() })
    
    if (!name.trim()) {
      console.log("No name provided, returning early")
      return
    }

    console.log("Starting save process...")
    setIsSaving(true)
    setSaveState('saving')
    setErrorMessage("")

    try {
      console.log("Calling onSave with data:", { name: name.trim(), description: description.trim() || undefined })
      await onSave({ name: name.trim(), description: description.trim() || undefined })
      console.log("Save successful!")
      setSaveState('success')
      
      // Auto-close and redirect after success
      setTimeout(() => {
        setIsOpen(false)
        setName("")
        setDescription("")
        setSaveState('idle')
        router.push('/library')
      }, 1500)
    } catch (error) {
      console.error("Save failed:", error)
      setSaveState('error')
      setErrorMessage(error instanceof Error ? error.message : "Failed to save logo")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (saveState !== 'saving') {
      setIsOpen(false)
      setName("")
      setDescription("")
      setSaveState('idle')
      setErrorMessage("")
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full bg-transparent"
        onClick={() => {
          console.log("Save trigger button clicked!")
          setIsOpen(true)
        }}
      >
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => {
        console.log("Dialog onOpenChange called with:", open)
        if (!open) {
          handleClose()
        }
      }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {saveState === 'success' ? 'Logo Saved!' : 'Save Logo'}
          </DialogTitle>
          <DialogDescription>
            {saveState === 'success' 
              ? 'Your logo has been saved to your library'
              : 'Give your logo a name and save it to your library'
            }
          </DialogDescription>
        </DialogHeader>

        {saveState === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">Success!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Redirecting to your studio...
            </p>
          </div>
        ) : (
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
                  disabled={saveState === 'saving'}
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
                  disabled={saveState === 'saving'}
                />
              </div>
            </div>

            {/* Error Message */}
            {saveState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1"
                disabled={saveState === 'saving'}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  console.log("Button clicked!", e)
                  e.preventDefault()
                  handleSave()
                }}
                disabled={!name.trim() || saveState === 'saving'}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {saveState === 'saving' ? (
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
        )}
      </DialogContent>
      </Dialog>
    </>
  )
}
