"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Star,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Zap,
  Flame,
  Leaf,
  Crown,
  Diamond,
  Shield,
  Home,
  Building,
  Car,
  Plane,
  Ship,
  Rocket,
} from "lucide-react"

const iconCategories = {
  shapes: [
    { icon: Circle, name: "Circle" },
    { icon: Square, name: "Square" },
    { icon: Triangle, name: "Triangle" },
    { icon: Hexagon, name: "Hexagon" },
    { icon: Diamond, name: "Diamond" },
    { icon: Shield, name: "Shield" },
  ],
  symbols: [
    { icon: Heart, name: "Heart" },
    { icon: Star, name: "Star" },
    { icon: Zap, name: "Lightning" },
    { icon: Flame, name: "Flame" },
    { icon: Leaf, name: "Leaf" },
    { icon: Crown, name: "Crown" },
  ],
  objects: [
    { icon: Home, name: "Home" },
    { icon: Building, name: "Building" },
    { icon: Car, name: "Car" },
    { icon: Plane, name: "Plane" },
    { icon: Ship, name: "Ship" },
    { icon: Rocket, name: "Rocket" },
  ],
}

export function EnhancedIconPicker() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("shapes")
  const [iconColor, setIconColor] = useState("#000000")
  const [iconThickness, setIconThickness] = useState([2])
  const [iconPosition, setIconPosition] = useState("center")

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Decorative Elements</Label>

      <div className="space-y-4">
        <div className="flex space-x-2">
          {Object.keys(iconCategories).map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize px-3 py-1 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <Card className="border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-6 gap-2">
              {iconCategories[activeCategory as keyof typeof iconCategories].map(({ icon: Icon, name }) => (
                <Button
                  key={name}
                  variant={selectedIcon === name ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={() => setSelectedIcon(selectedIcon === name ? null : name)}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedIcon && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Icon Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="w-16 h-12 p-1 border-2 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                  className="flex-1 custom-input"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Thickness: {iconThickness[0]}px</Label>
              <Slider
                value={iconThickness}
                onValueChange={setIconThickness}
                max={8}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Position</Label>
              <Select value={iconPosition} onValueChange={setIconPosition}>
                <SelectTrigger className="custom-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
