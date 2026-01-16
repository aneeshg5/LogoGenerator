"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { ColorPicker } from "@/components/color-picker"
import { Undo2, Redo2, ZoomIn, ZoomOut, Move, Type, Square, Circle, Download, Save, Wand2, Layers } from "lucide-react"

export default function CanvasPage() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState("move")
  const [aiPrompt, setAiPrompt] = useState("")

  const tools = [
    { id: "move", icon: Move, label: "Move" },
    { id: "text", icon: Type, label: "Text" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
  ]

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))

  const handleAiEnhance = () => {
    // Handle AI enhancement logic
    console.log("AI Enhancement:", aiPrompt)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  {tool.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <ColorPicker
                    label="Fill Color"
                    color="#3b82f6"
                    onChange={(color) => console.log("Fill color:", color)}
                  />
                  <ColorPicker
                    label="Stroke Color"
                    color="#000000"
                    onChange={(color) => console.log("Stroke color:", color)}
                  />
                  <div className="space-y-2">
                    <Label>Stroke Width</Label>
                    <Slider
                      value={[2]}
                      onValueChange={(value) => console.log("Stroke width:", value[0])}
                      max={10}
                      min={0}
                      step={1}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="transform" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>X</Label>
                      <Input type="number" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Y</Label>
                      <Input type="number" defaultValue="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Rotation</Label>
                    <Slider
                      value={[0]}
                      onValueChange={(value) => console.log("Rotation:", value[0])}
                      max={360}
                      min={0}
                      step={1}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Wand2 className="mr-2 h-4 w-4" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Describe the changes you want to make..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAiEnhance} size="sm" className="w-full">
                Apply AI Enhancement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Redo2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div
                ref={canvasRef}
                className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 relative"
                style={{
                  width: `${512 * (zoom / 100)}px`,
                  height: `${512 * (zoom / 100)}px`,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center",
                }}
              >
                {/* Canvas content would go here */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Layers className="mx-auto h-12 w-12 mb-4" />
                    <p>Canvas Area</p>
                    <p className="text-sm">512 × 512 px</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Layers */}
        <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm">
                Background
              </div>
              <div className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm">Logo Shape</div>
              <div className="p-2 border border-gray-200 dark:border-gray-700 rounded text-sm">Text Layer</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
