import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";
import prisma from "@/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature")!;
  const rawBody = await buffer(request);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.CheckoutSession;

      // Update your database based on the session data
      const userId = session.metadata?.userId;
      const paymentIntentId = session.payment_intent as string;
      const amountTotal = session.amount_total;
      const currency = session.currency;

      if (userId && paymentIntentId && amountTotal !== null && currency) {
        await prisma.payment.create({
          data: {
            userId: userId,
            stripeId: paymentIntentId,
            amount: amountTotal,
            currency: currency,
            status: "completed",
          },
        });

        // TODO: Update user's plan status in your database
      }

      break;
    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}