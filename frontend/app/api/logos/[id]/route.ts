import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[[...nextauth]]/route"
import prisma from "@/db"
import { z } from "zod"

// Schema for updating a logo
const updateLogoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isPublic: z.boolean().optional(),
})

// GET /api/logos/[id] - Get a specific logo
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const logo = await prisma.logo.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
      select: {
        id: true,
        name: true,
        url: true,
        prompt: true,
        style: true,
        settings: true,
        isPublic: true,
        downloads: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!logo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 })
    }

    return NextResponse.json({ logo })
  } catch (error) {
    console.error("Error fetching logo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/logos/[id] - Update a specific logo
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateLogoSchema.parse(body)

    // Verify logo belongs to user
    const existingLogo = await prisma.logo.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    })

    if (!existingLogo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 })
    }

    const updatedLogo = await prisma.logo.update({
      where: { id: params.id },
      data: validatedData,
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

    return NextResponse.json({ logo: updatedLogo })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    console.error("Error updating logo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/logos/[id] - Delete a specific logo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify logo belongs to user
    const existingLogo = await prisma.logo.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    })

    if (!existingLogo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 })
    }

    await prisma.logo.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Logo deleted successfully" })
  } catch (error) {
    console.error("Error deleting logo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
