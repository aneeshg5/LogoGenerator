"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    "#3b82f6",
    "#8b5cf6",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#8b5cf6",
    "#ec4899",
    "#000000",
    "#ffffff",
    "#6b7280",
    "#374151",
  ]

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-12 h-10 p-0 border-2 bg-transparent"
              style={{ backgroundColor: color }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      onChange(presetColor)
                      setIsOpen(false)
                    }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label>Custom Color</Label>
                <Input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="h-10" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
}
