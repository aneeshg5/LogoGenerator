// ai-logo-generator/app/api/payments/create-checkout-session/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // Use your desired API version
});

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { priceId } = await request.json(); // Assuming you pass a Stripe price ID

    const session = await stripe.checkout.sessions.create({
      customer_email: token.email as string, // Pre-fill customer email
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment", // Or "subscription" for recurring plans
      success_url: `${request.headers.get("origin")}/library?success=true`, // Redirect after success
      cancel_url: `${request.headers.get("origin")}/account?canceled=true`, // Redirect after cancel
      metadata: {
        userId: token.id as string, // Pass user ID as metadata
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return NextResponse.json({ success: false, error: "Failed to create checkout session" }, { status: 500 });
  }
}