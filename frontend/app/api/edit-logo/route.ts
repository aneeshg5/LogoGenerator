import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { uploadLogo } from "@/firebase/storage";
import prisma from "@/db";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { logoId, prompt, mask, settings } = await request.json();

    // Fetch the original logo from the database
    const originalLogo = await prisma.logo.findUnique({
      where: { id: logoId, userId: token.id as string },
    });

    if (!originalLogo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }

    // TODO: Call HuggingFace API for inpainting/editing
    // This will depend on the specific HuggingFace model you use
    // You'll likely need to send the original image, the mask, and the prompt
    const huggingFaceResponse = await fetch("YOUR_HUGGINGFACE_EDIT_API_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        image_url: originalLogo.url, // Send the original image URL
        mask: mask, // Send the mask data
        prompt: prompt, // Send the edit prompt
        parameters: { ...originalLogo.settings as object, ...settings }, // Merge original and new settings
      }),
    });

    if (!huggingFaceResponse.ok) {
      const error = await huggingFaceResponse.json();
      console.error("HuggingFace edit API error:", error);
      return NextResponse.json({ error: "Failed to edit logo" }, { status: huggingFaceResponse.status });
    }

    const editedLogoImageBlob = await huggingFaceResponse.blob();
    const editedLogoImageFile = new File([editedLogoImageBlob], `edited-logo-${Date.now()}.png`, { type: "image/png" });

    // Upload the edited logo to Firebase Storage
    const editedLogoUrl = await uploadLogo(token.id as string, editedLogoImageFile);

    // Create a new logo entry for the edited version or update the existing one
    const updatedLogo = await prisma.logo.create({
      data: {
        userId: token.id as string,
        name: originalLogo.name + " (edited)", // Indicate it's an edit
        url: editedLogoUrl,
        settings: { ...originalLogo.settings as object, ...settings }, // Store updated settings
      },
    });

    return NextResponse.json({
      success: true,
      logo: updatedLogo,
    });
  } catch (error) {
    console.error("Edit logo error:", error);
    return NextResponse.json({ success: false, error: "Failed to edit logo" }, { status: 500 });
  }
}