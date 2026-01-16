import { NextResponse } from "next/server"
import prisma from "@/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const usernameSchema = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-z0-9_.-]+$/)
  .refine((v) => !["admin", "support", "help", "owner", "root"].includes(v), "Reserved username")

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: usernameSchema,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse({
      email: body.email?.toLowerCase(),
      password: body.password,
      username: body.username?.toLowerCase().trim(),
    })
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }
    const { email, password, username } = parsed.data

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: { id: true, email: true, username: true },
    })
    if (existing?.email === email) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 })
    }
    if (existing?.username === username) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
      select: { id: true, email: true, username: true },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

