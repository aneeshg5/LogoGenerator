"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export function IconPicker() {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("shapes")

  return (
    <div className="space-y-4">
      <Label>Decorative Elements</Label>

      <div className="space-y-4">
        <div className="flex space-x-2">
          {Object.keys(iconCategories).map((category) => (
            <Badge
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-6 gap-2">
              {iconCategories[activeCategory as keyof typeof iconCategories].map(({ icon: Icon, name }) => (
                <Button
                  key={name}
                  variant={selectedIcon === name ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12"
                  onClick={() => setSelectedIcon(selectedIcon === name ? null : name)}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedIcon && (
          <div className="space-y-2">
            <Label>Icon Position</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm">
                Top
              </Button>
              <Button variant="outline" size="sm">
                Center
              </Button>
              <Button variant="outline" size="sm">
                Bottom
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
