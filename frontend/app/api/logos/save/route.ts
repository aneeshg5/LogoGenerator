import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[[...nextauth]]/route"
import prisma from "@/db"
import { uploadBase64ToFirebase } from "@/lib/firebase-base64"
import { z } from "zod"

interface SessionUser {
  id: string
  email?: string
  name?: string
  username?: string
}

const saveLogoSchema = z.object({
  name: z.string().min(1, "Logo name is required").max(100, "Logo name too long"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  prompt: z.string().min(1, "Prompt is required").max(500, "Prompt too long"),
  style: z.string().optional(),
  seed: z.number().optional(),
  settings: z.object({}).passthrough().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as { user?: SessionUser } | null
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = saveLogoSchema.parse(body)
    const userId = session.user.id

    let firebaseUrl: string
    
    if (validatedData.imageUrl.startsWith('data:image')) {
      firebaseUrl = await uploadBase64ToFirebase(validatedData.imageUrl, userId, validatedData.name)
      } else {
      return NextResponse.json({ 
        error: "Invalid image format",
        message: "Expected base64 data URL"
      }, { status: 400 })
    }

    const logo = await prisma.logo.create({
      data: {
        name: validatedData.name,
        url: firebaseUrl,
        userId: userId,
        prompt: validatedData.description || validatedData.prompt,
        style: validatedData.style,
        settings: validatedData.settings,
        versions: {
          create: {
            versionNumber: 1,
            imageUrl: firebaseUrl,
            prompt: validatedData.prompt,
            seed: validatedData.seed,
            metadata: {
              generationTime: validatedData.settings?.generationTime,
              style: validatedData.style,
              settings: validatedData.settings,
            },
          },
        },
      },
      include: {
        versions: true,
      },
    })

    return NextResponse.json({ 
      success: true,
      logo,
      message: "Logo saved successfully!" 
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ 
        error: "Invalid input", 
        message: errorMessages,
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
