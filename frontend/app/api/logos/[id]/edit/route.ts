import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[[...nextauth]]/route"
import prisma from "@/db"
import { uploadBase64ToFirebase, uploadMaskToFirebase } from "@/lib/firebase-base64"
import { z } from "zod"

interface SessionUser {
  id: string
  email?: string
  name?: string
  username?: string
}

const editLogoSchema = z.object({
  imageBase64: z.string().min(1, "Image is required"),
  maskBase64: z.string().optional(),
  editInstruction: z.string().min(1, "Edit instruction is required"),
  seed: z.number().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as { user?: SessionUser } | null
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = editLogoSchema.parse(body)
    const userId = session.user.id
    const logoId = params.id

    const logo = await prisma.logo.findUnique({
      where: { id: logoId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    })

    if (!logo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 })
    }

    if (logo.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const latestVersionNumber = logo.versions[0]?.versionNumber || 0
    const newVersionNumber = latestVersionNumber + 1

    const imageDataUrl = `data:image/png;base64,${validatedData.imageBase64}`
    const imageUrl = await uploadBase64ToFirebase(imageDataUrl, userId, `${logo.name}_v${newVersionNumber}`)

    let maskUrl: string | undefined
    if (validatedData.maskBase64) {
      const maskDataUrl = `data:image/png;base64,${validatedData.maskBase64}`
      maskUrl = await uploadMaskToFirebase(maskDataUrl, userId)
    }

    const updatedLogo = await prisma.logo.update({
      where: { id: logoId },
      data: {
        url: imageUrl,
        versions: {
          create: {
            versionNumber: newVersionNumber,
            imageUrl: imageUrl,
            prompt: validatedData.editInstruction,
            editInstruction: validatedData.editInstruction,
            maskUrl: maskUrl,
            seed: validatedData.seed,
            metadata: {
              timestamp: new Date().toISOString(),
            },
          },
        },
      },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
    })

    return NextResponse.json({ 
      success: true,
      logo: updatedLogo,
      message: "Logo edited successfully!" 
    }, { status: 200 })

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
