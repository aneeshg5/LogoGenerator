import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/db";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userLogos = await prisma.logo.findMany({
      where: { userId: token.id as string },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      logos: userLogos,
    });
  } catch (error) {
    console.error("Fetch user logos error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user logos" }, { status: 500 });
  }
}