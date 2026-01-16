import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[[...nextauth]]/route"
import prisma from "@/db"
import { z } from "zod"

// Schema for creating a new logo
const createLogoSchema = z.object({
  name: z.string().min(1).max(100),
  prompt: z.string().min(1).max(500),
  style: z.string().optional(),
  settings: z.object({}).passthrough().optional(),
})

// GET /api/logos - Get all logos for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logos = await prisma.logo.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        prompt: true,
        style: true,
        isPublic: true,
        downloads: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ logos })
  } catch (error) {
    console.error("Error fetching logos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/logos - Create a new logo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createLogoSchema.parse(body)

    // For now, use a placeholder image URL
    // TODO: Replace with actual Firebase Storage URL when image generation is implemented
    const placeholderImageUrl = "/placeholder-logo.png"

    const logo = await prisma.logo.create({
      data: {
        name: validatedData.name,
        url: placeholderImageUrl,
        userId: (session.user as any).id,
        prompt: validatedData.prompt,
        style: validatedData.style,
        settings: validatedData.settings,
      },
      select: {
        id: true,
        name: true,
        url: true,
        prompt: true,
        style: true,
        isPublic: true,
        downloads: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ logo }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error creating logo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
