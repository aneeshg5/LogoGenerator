"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Palette, Type, Shapes } from "lucide-react"
import { ImprovedColorPicker } from "@/components/improved-color-picker"
import { ScrollableTextManager } from "@/components/scrollable-text-manager"
import { EnhancedIconPicker } from "@/components/enhanced-icon-picker"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  logoPreview?: string
}

interface AIChatInterfaceProps {
  initialLogo: string
  onLogoUpdate: (logoSrc: string) => void
}

export default function AIChatInterface({ initialLogo, onLogoUpdate }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm here to help you enhance your logo. What would you like to change?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentLogo, setCurrentLogo] = useState(initialLogo)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickPrompts = [
    "Make it more modern",
    "Change the color scheme",
    "Add a gradient effect",
    "Make it more minimalist",
    "Add some texture",
    "Make it more professional",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I've enhanced your logo based on your request: "${message}". Here's the updated version!`,
        timestamp: new Date(),
        logoPreview: `/placeholder.svg?height=200&width=200&text=Enhanced+Logo&${Date.now()}`,
      }

      setMessages((prev) => [...prev, aiResponse])
      setCurrentLogo(aiResponse.logoPreview!)
      onLogoUpdate(aiResponse.logoPreview!)
      setIsProcessing(false)
    }, 2000)
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Interface */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              AI Logo Enhancement
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "ai" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-100 text-indigo-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.logoPreview && (
                        <div className="mt-3 p-2 bg-white dark:bg-gray-700 rounded border">
                          <img
                            src={message.logoPreview || "/placeholder.svg"}
                            alt="Logo preview"
                            className="w-full max-w-[200px] h-auto object-contain mx-auto"
                          />
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    {message.type === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          AI is working on your request...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Quick Prompts */}
            <div className="border-t p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickPrompts.map((prompt) => (
                  <Badge
                    key={prompt}
                    variant="secondary"
                    className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Badge>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Describe how you'd like to enhance your logo..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(inputValue)
                    }
                  }}
                  disabled={isProcessing}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isProcessing}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls */}
      <div className="space-y-4">
        {/* Current Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
              <img
                src={currentLogo || "/placeholder.svg"}
                alt="Current logo"
                className="w-full h-auto object-contain max-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Manual Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Manual Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="colors" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs">
                  <Type className="h-3 w-3 mr-1" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="elements" className="text-xs">
                  <Shapes className="h-3 w-3 mr-1" />
                  Elements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="mt-4">
                <ImprovedColorPicker
                  label="Logo Colors"
                  colors={[{ id: "1", value: "#3b82f6", name: "Primary" }]}
                  onChange={() => {}}
                />
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <ScrollableTextManager
                  layers={[
                    {
                      id: "1",
                      text: "Logo Text",
                      color: "#000000",
                      font: "inter",
                      size: 16,
                      position: "center",
                      rotation: 0,
                      order: 0,
                    },
                  ]}
                  onChange={() => {}}
                />
              </TabsContent>

              <TabsContent value="elements" className="mt-4">
                <EnhancedIconPicker />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
