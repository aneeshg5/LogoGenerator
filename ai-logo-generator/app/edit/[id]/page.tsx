"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { ImprovedColorPicker } from "@/components/improved-color-picker"
import { ScrollableTextManager } from "@/components/scrollable-text-manager"
import { EnhancedIconPicker } from "@/components/enhanced-icon-picker"
import { Loader2, Wand2, ArrowLeft } from "lucide-react"
import Link from "next/link"
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

export default function AIEditPage() {
  const params = useParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [editPrompt, setEditPrompt] = useState("")
  const [logoSrc] = useState("/placeholder.svg?height=400&width=400&text=Original+Logo")
  const [editedLogoSrc, setEditedLogoSrc] = useState<string | null>(null)
  const [showAIChat, setShowAIChat] = useState(false)

  const [logoColors, setLogoColors] = useState<Color[]>([
    { id: "1", value: "#3b82f6", name: "Primary" },
    { id: "2", value: "#8b5cf6", name: "Secondary" },
  ])

  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: "1",
      text: "Company Name",
      color: "#000000",
      font: "inter",
      size: 24,
      position: "bottom",
      rotation: 0,
      order: 0,
    },
  ])

  const handleAIEdit = async () => {
    if (!editPrompt.trim()) return

    setIsProcessing(true)
    // Simulate AI editing process
    setTimeout(() => {
      setEditedLogoSrc("/placeholder.svg?height=400&width=400&text=AI+Edited+Logo")
      setIsProcessing(false)
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/library" className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Studio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Logo Editor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Describe the changes you want to make and let AI transform your logo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Edit Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Wand2 className="mr-2 h-5 w-5 text-indigo-600" />
                  AI Logo Enhancement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showAIChat ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-prompt" className="text-sm font-medium">
                        Describe Your Changes
                      </Label>
                      <Textarea
                        id="edit-prompt"
                        placeholder="Describe what you want to change about your logo. For example: 'Make the text blue and add a star icon above it' or 'Change the style to be more modern and minimalist'"
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        rows={4}
                        className="custom-input resize-none"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={handleAIEdit}
                        disabled={isProcessing || !editPrompt.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            AI is Working...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Quick Enhancement
                          </>
                        )}
                      </Button>
                      <Button onClick={() => setShowAIChat(true)} variant="outline" className="px-6 bg-transparent">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Chat with AI
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">AI Chat Enhancement</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAIChat(false)}
                        className="bg-transparent"
                      >
                        Back to Quick Mode
                      </Button>
                    </div>
                    <AIChatInterface
                      initialLogo={logoSrc}
                      onLogoUpdate={(newLogoSrc) => setEditedLogoSrc(newLogoSrc)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Adjustments */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Manual Adjustments</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="colors" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="colors">Colors</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="elements">Elements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="colors" className="space-y-6 mt-6">
                    <ImprovedColorPicker label="Logo Colors" colors={logoColors} onChange={setLogoColors} />
                  </TabsContent>

                  <TabsContent value="text" className="space-y-6 mt-6">
                    <ScrollableTextManager layers={textLayers} onChange={setTextLayers} />
                  </TabsContent>

                  <TabsContent value="elements" className="space-y-6 mt-6">
                    <EnhancedIconPicker />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Before & After</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Original</Label>
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mt-2">
                    <img
                      src={logoSrc || "/placeholder.svg"}
                      alt="Original Logo"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Edited</Label>
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center border-2 border-dashed border-indigo-300 dark:border-indigo-600 mt-2">
                    {editedLogoSrc ? (
                      <img
                        src={editedLogoSrc || "/placeholder.svg"}
                        alt="Edited Logo"
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <Wand2 className="mx-auto h-12 w-12 mb-4 text-indigo-400" />
                        <p className="font-medium">Edited version will appear here</p>
                        <p className="text-sm">Describe your changes above</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Edit Suggestions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Make it more modern and clean",
                    "Add a subtle shadow effect",
                    "Change colors to match my brand",
                    "Make the text bolder",
                    "Add an icon or symbol",
                    "Simplify the design",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 bg-transparent"
                      onClick={() => setEditPrompt(suggestion)}
                    >
                      {suggestion}
                    </Button>
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
