import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { uploadLogo } from "@/ai-logo-generator/firebase/storage"; // Reuse the upload function

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Upload to a temporary location in Firebase Storage
    const tempLogoUrl = await uploadLogo(token.id as string, imageFile); // You might want a different folder for temporary files

    return NextResponse.json({ success: true, tempUrl: tempLogoUrl });
  } catch (error) {
    console.error("Upload for edit error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload image for editing" }, { status: 500 });
  }
}