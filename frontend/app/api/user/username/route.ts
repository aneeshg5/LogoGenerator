import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[[...nextauth]]/route"
import prisma from "@/db"
import { z } from "zod"

const schema = z
  .object({ username: z.string().min(3).max(30).regex(/^[a-z0-9_.-]+$/) })
  .transform(({ username }) => ({ username: username.toLowerCase().trim() }))

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: "Invalid username" }, { status: 400 })
  const { username } = parsed.data

  const taken = await prisma.user.findUnique({ where: { username } })
  if (taken && taken.id !== (session.user as any).id) {
    return NextResponse.json({ message: "Username already taken" }, { status: 400 })
  }

  await prisma.user.update({ where: { id: (session.user as any).id }, data: { username } })
  return NextResponse.json({ ok: true, username })
}

