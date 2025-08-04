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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Download, ImageIcon, FileType, FileImage } from "lucide-react"

interface DownloadModalProps {
  logoSrc: string
  logoName?: string
}

export default function DownloadModal({ logoSrc, logoName = "logo" }: DownloadModalProps) {
  const [format, setFormat] = useState("png")
  const [size, setSize] = useState("512")
  const [isDownloading, setIsDownloading] = useState(false)

  const formatOptions = [
    { value: "png", label: "PNG", icon: ImageIcon, description: "Best for web and digital use" },
    { value: "svg", label: "SVG", icon: FileType, description: "Vector format, infinitely scalable" },
    { value: "jpg", label: "JPG", icon: FileImage, description: "Compressed format, smaller file size" },
  ]

  const sizeOptions = [
    { value: "256", label: "256x256 (Small)" },
    { value: "512", label: "512x512 (Medium)" },
    { value: "1024", label: "1024x1024 (Large)" },
    { value: "2048", label: "2048x2048 (Extra Large)" },
  ]

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create download link
      const link = document.createElement("a")
      link.href = logoSrc
      link.download = `${logoName}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Logo</DialogTitle>
          <DialogDescription>Choose your preferred format and size for downloading</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Format</Label>
            <div className="grid grid-cols-1 gap-2">
              {formatOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    format === option.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setFormat(option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File Name</Label>
            <Input defaultValue={logoName} placeholder="Enter file name" />
          </div>

          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isDownloading ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
