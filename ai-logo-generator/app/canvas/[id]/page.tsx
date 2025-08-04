"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { ImprovedColorPicker } from "@/components/improved-color-picker"
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Square,
  Circle,
  Download,
  Save,
  Layers,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface Color {
  id: string
  value: string
  name: string
}

export default function CanvasEditorPage() {
  const params = useParams()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [selectedTool, setSelectedTool] = useState("move")
  const [logoSrc] = useState("/placeholder.svg?height=400&width=400&text=Canvas+Logo")

  const [logoColors, setLogoColors] = useState<Color[]>([
    { id: "1", value: "#3b82f6", name: "Primary" },
    { id: "2", value: "#8b5cf6", name: "Secondary" },
  ])

  const tools = [
    { id: "move", icon: Move, label: "Move" },
    { id: "text", icon: Type, label: "Text" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
  ]

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Tools */}
        <div className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <div className="mb-4">
            <Link href="/library" className="inline-flex items-center text-indigo-600 hover:text-indigo-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Studio
            </Link>
          </div>

          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start h-10 rounded-lg"
                  onClick={() => setSelectedTool(tool.id)}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  {tool.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-4 mt-4">
                  <ImprovedColorPicker label="Colors" colors={logoColors} onChange={setLogoColors} />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Stroke Width</Label>
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
                      <Label className="text-xs font-medium">X</Label>
                      <Input type="number" defaultValue="0" className="custom-input" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Y</Label>
                      <Input type="number" defaultValue="0" className="custom-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Width</Label>
                      <Input type="number" defaultValue="100" className="custom-input" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Height</Label>
                      <Input type="number" defaultValue="100" className="custom-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rotation</Label>
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
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="rounded-lg bg-transparent">
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-lg bg-transparent">
                  <Redo2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                <Button variant="outline" size="icon" onClick={handleZoomOut} className="rounded-lg bg-transparent">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} className="rounded-lg bg-transparent">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" className="rounded-lg bg-transparent">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg">
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
                className="bg-white dark:bg-gray-800 shadow-2xl border-2 border-gray-200 dark:border-gray-700 relative rounded-xl overflow-hidden"
                style={{
                  width: `${512 * (zoom / 100)}px`,
                  height: `${512 * (zoom / 100)}px`,
                }}
              >
                {/* Canvas content */}
                <div className="w-full h-full flex items-center justify-center relative">
                  <img
                    src={logoSrc || "/placeholder.svg"}
                    alt="Logo being edited"
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                  {/* Selection handles would go here */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Grid overlay for precision */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #000 1px, transparent 1px),
                          linear-gradient(to bottom, #000 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Layers */}
        <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
          <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium">
                Logo Element
              </div>
              <div className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                Background
              </div>
              <div className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                Text Layer
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
