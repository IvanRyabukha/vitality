import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { paymentLinkRepository } from "@/entities/payment-link/server/payment-link.repository";
import { serverEnv } from "@/shared/server/env";
import { stripe } from "@/shared/server/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { message: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const paymentLinkId = paymentIntent.metadata.paymentLinkId;

    if (paymentLinkId) {
      await paymentLinkRepository.markAsPaid(paymentLinkId, paymentIntent.id);
    }
  }

  return NextResponse.json({ received: true });
}
