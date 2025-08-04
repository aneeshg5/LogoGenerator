"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import { User, Shield, Bell, CreditCard, Download, Trash2 } from "lucide-react"

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    marketingEmails: false,
    securityAlerts: true,
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update logic
    console.log("Profile updated:", profile)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your account preferences and settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and profile settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Avatar</Button>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-updates">Email Updates</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive updates about your logos and account activity
                      </p>
                    </div>
                    <Switch
                      id="email-updates"
                      checked={notifications.emailUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("emailUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Marketing Emails</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive tips, feature updates, and promotional content
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="security">Security Alerts</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Important security notifications about your account
                      </p>
                    </div>
                    <Switch
                      id="security"
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Current Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Free Plan</h3>
                      <p className="text-gray-600 dark:text-gray-300">5 logo generations per month</p>
                    </div>
                    <Badge variant="outline">Current Plan</Badge>
                  </div>
                  <div className="mt-4">
                    <Button>Upgrade to Pro</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Logo Generations</span>
                        <span>3 / 5</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-indigo-600" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>Manage your account security settings and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-11 justify-start bg-transparent">
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="h-11 justify-start bg-transparent">
                      <Shield className="mr-2 h-4 w-4" />
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Recent Security Activity</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Last login</span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Password changed</span>
                        <span>Never</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Trash2 className="mr-2 h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                  <CardDescription>Manage your personal data and account deletion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-11 justify-start bg-transparent">
                      <Download className="mr-2 h-4 w-4" />
                      Download My Data
                    </Button>
                    <Button variant="destructive" className="h-11 justify-start">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Account deletion is permanent and cannot be undone. All your logos and data will be permanently
                      removed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
