"use client"
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

interface ImprovedColorPickerProps {
  label: string
  colors: Color[]
  onChange: (colors: Color[]) => void
}

export function ImprovedColorPicker({ label, colors, onChange }: ImprovedColorPickerProps) {
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
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColor}
          className="h-8 px-3 text-xs bg-transparent"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {colors.map((color, index) => (
          <div key={color.id} className="flex items-center space-x-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-12 h-12 p-0 border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-transparent"
                  style={{ backgroundColor: color.value }}
                >
                  <span className="sr-only">Pick color</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Color Value</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={color.value}
                        onChange={(e) => updateColor(color.id, e.target.value)}
                        className="w-16 h-12 p-1 border-2 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={color.value}
                        onChange={(e) => updateColor(color.id, e.target.value)}
                        className="flex-1 custom-input"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Input
              type="text"
              value={color.value}
              onChange={(e) => updateColor(color.id, e.target.value)}
              placeholder="#000000"
              className="flex-1 custom-input"
            />

            {colors.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeColor(color.id)}
                className="h-12 w-12 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
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
