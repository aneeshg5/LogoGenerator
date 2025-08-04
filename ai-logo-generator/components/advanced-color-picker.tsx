"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, X } from "lucide-react"

interface Color {
  id: string
  value: string
  name: string
}

interface AdvancedColorPickerProps {
  label: string
  colors: Color[]
  onChange: (colors: Color[]) => void
}

export function AdvancedColorPicker({ label, colors, onChange }: AdvancedColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const addColor = () => {
    const newColor: Color = {
      id: Date.now().toString(),
      value: "#3b82f6",
      name: `Color ${colors.length + 1}`,
    }
    onChange([...colors, newColor])
  }

  const removeColor = (id: string) => {
    onChange(colors.filter((color) => color.id !== id))
  }

  const updateColor = (id: string, value: string) => {
    onChange(colors.map((color) => (color.id === id ? { ...color, value } : color)))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addColor} className="h-8 px-2 bg-transparent">
          <Plus className="h-3 w-3 mr-1" />
          Add Color
        </Button>
      </div>

      <div className="space-y-2">
        {colors.map((color, index) => (
          <div key={color.id} className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-12 h-10 p-0 border-2 bg-transparent"
                  style={{ backgroundColor: color.value }}
                >
                  <span className="sr-only">Pick color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <div className="relative">
                    <div
                      className="w-full h-32 rounded-lg border-2 border-gray-200 cursor-crosshair relative overflow-hidden"
                      style={{
                        background: `linear-gradient(to right, white, ${color.value}), linear-gradient(to bottom, transparent, black)`,
                      }}
                    >
                      {/* Color wheel simulation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 opacity-80"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-50"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-50"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Hex Color</Label>
                    <Input
                      type="text"
                      value={color.value}
                      onChange={(e) => updateColor(color.id, e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Input
              type="text"
              value={color.value}
              onChange={(e) => updateColor(color.id, e.target.value)}
              placeholder="#000000"
              className="flex-1 h-10"
            />

            {colors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeColor(color.id)}
                className="h-10 w-10 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
