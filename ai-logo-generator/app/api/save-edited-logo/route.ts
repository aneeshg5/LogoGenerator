import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { uploadLogo } from "@/ai-logo-generator/firebase/storage"; // Corrected import path
import prisma from "@/ai-logo-generator/db"; // Corrected import path

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { logoId, imageDataUrl, settings } = await request.json(); // Assuming you send data URL and settings

    // Convert data URL to Blob or File
    const byteCharacters = atob(imageDataUrl.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const editedLogoBlob = new Blob([byteArray], { type: 'image/png' }); // Adjust type if needed
    const editedLogoFile = new File([editedLogoBlob], `edited-logo-${Date.now()}.png`, { type: 'image/png' });

    // Upload the edited logo to Firebase Storage
    const editedLogoUrl = await uploadLogo(token.id as string, editedLogoFile);

    if (logoId) {
      // Update existing logo entry
      const updatedLogo = await prisma.logo.update({
        where: { id: logoId, userId: token.id as string },
        data: {
          url: editedLogoUrl,
          settings: settings, // Update settings
        },
      });
      return NextResponse.json({ success: true, logo: updatedLogo });
    } else {
      // Create a new logo entry for a new edit
      const newLogo = await prisma.logo.create({
        data: {
          userId: token.id as string,
          name: "Edited Logo", // Or a generated name
          url: editedLogoUrl,
          settings: settings,
        },
      });
      return NextResponse.json({ success: true, logo: newLogo });
    }

  } catch (error) {
    console.error("Save edited logo error:", error);
    return NextResponse.json({ success: false, error: "Failed to save edited logo" }, { status: 500 });
  }
}