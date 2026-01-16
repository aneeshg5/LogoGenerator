import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, Star } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center animate-fade-in">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Logo Generation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
              AI Logo Generator
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-tight">
                Design Custom Logos Instantly
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              Create professional, unique logos in seconds with our advanced AI technology. No design experience
              required - just describe your vision and watch it come to life.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/generate">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Perfect Logos
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need to create stunning logos that represent your brand
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate professional logos in seconds, not hours. Our AI works at the speed of thought.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fully Customizable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Fine-tune every aspect of your logo with our advanced customization tools and editor.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">High-Quality Downloads</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Download your logos in multiple formats including SVG, PNG, and PDF for any use case.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">1M+</div>
              <div className="text-gray-600 dark:text-gray-300">Logos Generated</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</div>
              <div className="text-gray-600 dark:text-gray-300">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Create your perfect logo in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">1</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
                <img
                  src="/placeholder.svg?height=200&width=400&text=Describe+Your+Vision"
                  alt="Describe your vision"
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Describe Your Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tell us about your brand, choose colors, and select your preferred style
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">2</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
                <img
                  src="/placeholder.svg?height=200&width=400&text=AI+Creates+Magic"
                  alt="AI creates magic"
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Creates Magic</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI generates multiple unique logo concepts tailored to your needs
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mx-auto w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">3</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6">
                <img
                  src="/placeholder.svg?height=200&width=400&text=Customize+and+Download"
                  alt="Customize and download"
                  className="w-full h-48 object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Customize & Download</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fine-tune your logo with our editor and download in any format you need
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Ready to Create Your Perfect Logo?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of businesses who trust our AI to create their brand identity
          </p>
          <div className="mt-8">
            <Link href="/generate">
              <Button size="lg" className="px-12 py-4 text-lg">
                Start Creating Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
