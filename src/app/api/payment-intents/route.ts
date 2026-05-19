import { NextResponse } from "next/server";

import { stripe } from "@/shared/server/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          message: "Invalid amount",
        },
        {
          status: 400,
        },
      );
    }

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          paymentLinkId: body.paymentLinkId,
        },
      });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create payment intent",
      },
      {
        status: 500,
      },
    );
  }
}
