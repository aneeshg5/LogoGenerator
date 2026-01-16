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
import { EnhancedIconPicker } from "@/components/enhanced-icon-picker"
import DownloadModal from "@/components/download-modal"
import SaveModal from "@/components/save-modal"
import AIChatInterface from "@/components/ai-chat-interface"
import { generateLogoModal } from "@/lib/modal-client"

interface Color {
  id: string
  value: string
  name: string
}


export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null)
  const [showAIChat, setShowAIChat] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{prompt: string; seed: number; time: number} | null>(null)
  const [formData, setFormData] = useState({
    width: 1024,
    height: 1024,
    backgroundType: "solid",
    artStyle: "minimal",
    industry: "",
    is3D: false,
    description: "",
  })

  const [backgroundColors, setBackgroundColors] = useState<Color[]>([{ id: "1", value: "#ffffff", name: "Background" }])

  const [logoColors, setLogoColors] = useState<Color[]>([])

  const handleGenerate = async () => {
    console.log('=== Generate Button Clicked ===')
    console.log('Logo colors:', logoColors)
    console.log('Form data:', formData)
    
    if (!formData.description || formData.description.trim().length < 3) {
      const errorMsg = "Please provide a description (minimum 3 characters)"
      console.error(errorMsg)
      setError(errorMsg)
      return
    }
    
    if (logoColors.length === 0) {
      const errorMsg = "Please add at least one logo color"
      console.error(errorMsg)
      setError(errorMsg)
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedLogo(null)
    setMetadata(null)

    try {
      const colorValues = logoColors.map(c => c.value)
      console.log('Calling generateLogoModal with color values:', colorValues)
      
      const result = await generateLogoModal({
        description: formData.description || "logo design",
        style: formData.artStyle,
        industry: formData.industry || undefined,
        colors: colorValues,
        width: formData.width,
        height: formData.height,
        additionalDetails: formData.is3D ? "3D effect, " + formData.description : formData.description,
      })

      console.log('Generation successful!', result)
      setGeneratedLogo(`data:image/png;base64,${result.image_base64}`)
      setMetadata({
        prompt: result.prompt_used,
        seed: result.seed,
        time: result.generation_time_seconds
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate logo. Please try again."
      console.error('Generation error:', err)
      console.error('Error message:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsGenerating(false)
      console.log('=== Generation Complete ===')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveLogo = async (data: { name: string; description?: string }) => {
    if (!generatedLogo) {
      throw new Error("No logo to save")
    }

    try {
      const saveData = {
        name: data.name,
        description: data.description,
        imageUrl: generatedLogo,
        prompt: metadata?.prompt || (data.description && data.description.trim()) || "Generated logo",
        style: formData.artStyle || "minimal",
        seed: metadata?.seed,
          settings: {
            width: formData.width,
            height: formData.height,
            backgroundType: formData.backgroundType,
            industry: formData.industry,
            is3D: formData.is3D,
            backgroundColors,
            logoColors,
            generationTime: metadata?.time,
          },
      }

      const response = await fetch("/api/logos/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.message || errorData.error || "Failed to save logo"
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error) {
      throw error
    }
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-semibold">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., coffee cup with steam, mountain peak, abstract wave, tech network"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className="resize-none"
                        required
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Describe what you want in your logo (minimum 3 characters)
                      </p>
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
                            <SelectItem value="solid">
                              <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="8" cy="8" r="7" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1"/>
                                </svg>
                                <span>Solid Color</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="gradient">
                              <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" style={{stopColor: '#E5E7EB', stopOpacity: 1}} />
                                      <stop offset="100%" style={{stopColor: '#374151', stopOpacity: 1}} />
                                    </linearGradient>
                                  </defs>
                                  <circle cx="8" cy="8" r="7" fill="url(#grad)" stroke="#6B7280" strokeWidth="1"/>
                                </svg>
                                <span>Gradient</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="transparent">
                              <div className="flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <defs>
                                    <pattern id="checkerboard" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                                      <rect x="0" y="0" width="4" height="4" fill="#D1D5DB"/>
                                      <rect x="4" y="0" width="4" height="4" fill="#F3F4F6"/>
                                      <rect x="0" y="4" width="4" height="4" fill="#F3F4F6"/>
                                      <rect x="4" y="4" width="4" height="4" fill="#D1D5DB"/>
                                    </pattern>
                                  </defs>
                                  <circle cx="8" cy="8" r="7" fill="url(#checkerboard)" stroke="#6B7280" strokeWidth="1"/>
                                </svg>
                                <span>Transparent</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.backgroundType !== "transparent" && (
                        <ImprovedColorPicker
                          label="Background Colors"
                          colors={backgroundColors}
                          onChange={setBackgroundColors}
                          hideAddButton={formData.backgroundType === "solid"}
                        />
                      )}

                      <ImprovedColorPicker label="Logo Colors" colors={logoColors} onChange={setLogoColors} />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is3d"
                          checked={formData.is3D}
                          onCheckedChange={(checked) => handleInputChange("is3D", checked)}
                        />
                        <Label htmlFor="is3d">3D Effect</Label>
                      </div>

                      <EnhancedIconPicker />

                      <div className="space-y-2">
                        <Label htmlFor="additional-details" className="text-sm font-semibold">Additional Details</Label>
                        <Textarea
                          id="additional-details"
                          placeholder="Add any specific details like text, slogans, symbols, or style preferences (e.g., 'include the word COFFEE in elegant script')"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={5}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Specify text you want in the logo, symbols, or any other detailed requirements
                        </p>
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
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}
                
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

                {metadata && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Generation Time:</span>
                      <span className="font-medium">{metadata.time.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Seed:</span>
                      <span className="font-medium font-mono">{metadata.seed}</span>
                    </div>
                  </div>
                )}

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
