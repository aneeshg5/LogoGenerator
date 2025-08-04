"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Loader2, Sparkles, Edit, Wand2, Palette, MessageSquare } from "lucide-react"
import { ImprovedColorPicker } from "@/components/improved-color-picker"
import { ScrollableTextManager } from "@/components/scrollable-text-manager"
import { EnhancedIconPicker } from "@/components/enhanced-icon-picker"
import DownloadModal from "@/components/download-modal"
import SaveModal from "@/components/save-modal"
import AIChatInterface from "@/components/ai-chat-interface"

interface Color {
  id: string
  value: string
  name: string
}

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

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null)
  const [showAIChat, setShowAIChat] = useState(false)
  const [formData, setFormData] = useState({
    width: 512,
    height: 512,
    backgroundType: "solid",
    artStyle: "minimal",
    industry: "",
    is3D: false,
    description: "",
  })

  const [backgroundColors, setBackgroundColors] = useState<Color[]>([{ id: "1", value: "#ffffff", name: "Background" }])

  const [logoColors, setLogoColors] = useState<Color[]>([
    { id: "1", value: "#3b82f6", name: "Primary" },
    { id: "2", value: "#8b5cf6", name: "Secondary" },
  ])

  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: "1",
      text: "",
      color: "#000000",
      font: "inter",
      size: 16,
      position: "bottom",
      rotation: 0,
      order: 0,
    },
  ])

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate API call with more realistic timing
    setTimeout(() => {
      setGeneratedLogo("/placeholder.svg?height=400&width=400&text=AI+Generated+Logo")
      setIsGenerating(false)
    }, 4000)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveLogo = async (data: { name: string; description?: string }) => {
    // Simulate save API call
    console.log("Saving logo:", data)
    // You can integrate with your save API here
    // For now, just simulate a successful save
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleLogoUpdate = (logoSrc: string) => {
    setGeneratedLogo(logoSrc)
  }

  if (showAIChat && generatedLogo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Logo Enhancement</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Chat with AI to enhance and refine your logo</p>
            </div>
            <Button variant="outline" onClick={() => setShowAIChat(false)}>
              Back to Generator
            </Button>
          </div>

          <AIChatInterface initialLogo={generatedLogo} onLogoUpdate={handleLogoUpdate} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate Your Logo</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Customize every detail and let AI create the perfect logo for your brand
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">Logo Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={formData.width}
                          onChange={(e) => handleInputChange("width", Number.parseInt(e.target.value))}
                          min="100"
                          max="2048"
                          className="h-11 custom-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => handleInputChange("height", Number.parseInt(e.target.value))}
                          min="100"
                          max="2048"
                          className="h-11 custom-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Art Style</Label>
                      <Select value={formData.artStyle} onValueChange={(value) => handleInputChange("artStyle", value)}>
                        <SelectTrigger className="h-11 custom-select">
                          <SelectValue placeholder="Select art style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="flat">Flat Design</SelectItem>
                          <SelectItem value="geometric">Geometric</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="illustrative">Illustrative</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry/Theme</Label>
                      <Input
                        id="industry"
                        placeholder="e.g., Technology, Healthcare, Food & Beverage"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="h-11 custom-input"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is3d"
                        checked={formData.is3D}
                        onCheckedChange={(checked) => handleInputChange("is3D", checked)}
                      />
                      <Label htmlFor="is3d">3D Effect</Label>
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-6 mt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Background Type</Label>
                        <Select
                          value={formData.backgroundType}
                          onValueChange={(value) => handleInputChange("backgroundType", value)}
                        >
                          <SelectTrigger className="h-11 custom-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">Solid Color</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                            <SelectItem value="transparent">Transparent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.backgroundType !== "transparent" && (
                        <ImprovedColorPicker
                          label="Background Colors"
                          colors={backgroundColors}
                          onChange={setBackgroundColors}
                        />
                      )}

                      <ImprovedColorPicker label="Logo Colors" colors={logoColors} onChange={setLogoColors} />
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-6 mt-6">
                    <ScrollableTextManager layers={textLayers} onChange={setTextLayers} />
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <EnhancedIconPicker />

                      <div className="space-y-2">
                        <Label htmlFor="description">Additional Necessary Details</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide any additional details about your logo requirements, style preferences, or specific elements you want included..."
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    size="lg"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Your Logo...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Logo
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {generatedLogo ? (
                    <img
                      src={generatedLogo || "/placeholder.svg"}
                      alt="Generated Logo"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Sparkles className="mx-auto h-12 w-12 mb-4 text-indigo-400" />
                      <p className="font-medium">Your logo will appear here</p>
                      <p className="text-sm">Configure your settings and generate</p>
                    </div>
                  )}
                </div>

                {generatedLogo && (
                  <div className="mt-6 space-y-3">
                    <Button className="w-full bg-transparent" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit in Canvas
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline" onClick={() => setShowAIChat(true)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enhance with AI
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <DownloadModal logoSrc={generatedLogo} logoName="my-logo" />
                      <SaveModal logoSrc={generatedLogo} onSave={handleSaveLogo} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5 text-indigo-600" />
                  Quick Styles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Tech Startup",
                    "Creative Agency",
                    "Restaurant",
                    "Healthcare",
                    "Finance",
                    "Education",
                    "Fashion",
                    "Sports",
                  ].map((style) => (
                    <Badge
                      key={style}
                      variant="outline"
                      className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors p-2 text-center justify-center"
                      onClick={() => {
                        handleInputChange("industry", style.toLowerCase().replace(" ", "-"))
                        handleInputChange(
                          "artStyle",
                          style === "Tech Startup"
                            ? "minimal"
                            : style === "Creative Agency"
                              ? "abstract"
                              : style === "Restaurant"
                                ? "vintage"
                                : style === "Healthcare"
                                  ? "modern"
                                  : style === "Finance"
                                    ? "geometric"
                                    : style === "Education"
                                      ? "illustrative"
                                      : style === "Fashion"
                                        ? "elegant"
                                        : "dynamic",
                        )
                      }}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
