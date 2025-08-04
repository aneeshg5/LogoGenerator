"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, ChevronUp, ChevronDown, Type } from "lucide-react"

interface TextLayer {
  id: string
  text: string
  color: string
  font: string
  size: number
  position: string
  rotation: number
  order: number
}

interface TextLayerManagerProps {
  layers: TextLayer[]
  onChange: (layers: TextLayer[]) => void
}

export function TextLayerManager({ layers, onChange }: TextLayerManagerProps) {
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: "",
      color: "#000000",
      font: "inter",
      size: 16,
      position: "center",
      rotation: 0,
      order: layers.length,
    }
    onChange([...layers, newLayer])
  }

  const removeLayer = (id: string) => {
    onChange(layers.filter((layer) => layer.id !== id))
  }

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    onChange(layers.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)))
  }

  const moveLayer = (id: string, direction: "up" | "down") => {
    const layerIndex = layers.findIndex((layer) => layer.id === id)
    if (layerIndex === -1) return

    const newLayers = [...layers]
    const targetIndex = direction === "up" ? layerIndex - 1 : layerIndex + 1

    if (targetIndex >= 0 && targetIndex < layers.length) {
      ;[newLayers[layerIndex], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[layerIndex]]

      // Update order values
      newLayers.forEach((layer, index) => {
        layer.order = index
      })

      onChange(newLayers)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center">
          <Type className="mr-2 h-4 w-4" />
          Text Layers
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addTextLayer} className="h-8 px-2 bg-transparent">
          <Plus className="h-3 w-3 mr-1" />
          Add Text
        </Button>
      </div>

      <div className="space-y-3">
        {layers.map((layer, index) => (
          <Card key={layer.id} className="border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Text Layer {index + 1}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveLayer(layer.id, "up")}
                    disabled={index === 0}
                    className="h-6 w-6"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveLayer(layer.id, "down")}
                    disabled={index === layers.length - 1}
                    className="h-6 w-6"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {layers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLayer(layer.id)}
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Input
                  placeholder="Enter your text"
                  value={layer.text}
                  onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={layer.font} onValueChange={(value) => updateLayer(layer.id, { font: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={layer.position} onValueChange={(value) => updateLayer(layer.id, { position: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-12 h-10 p-0 border-2 bg-transparent"
                    style={{ backgroundColor: layer.color }}
                  >
                    <span className="sr-only">Pick color</span>
                  </Button>
                  <Input
                    type="text"
                    value={layer.color}
                    onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Size: {layer.size}px</Label>
                <Slider
                  value={[layer.size]}
                  onValueChange={(value) => updateLayer(layer.id, { size: value[0] })}
                  max={72}
                  min={8}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Rotation: {layer.rotation}°</Label>
                <Slider
                  value={[layer.rotation]}
                  onValueChange={(value) => updateLayer(layer.id, { rotation: value[0] })}
                  max={360}
                  min={0}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
