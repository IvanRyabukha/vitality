import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { paymentLinkRepository } from "@/entities/payment-link/server/payment-link.repository";
import { createPaymentLinkSchema } from "@/entities/payment-link/model/payment-link.schema";

export async function GET() {
  const paymentLinks = await paymentLinkRepository.findMany();

  return NextResponse.json(paymentLinks);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsedData = createPaymentLinkSchema.parse(body);

    const paymentLink = await paymentLinkRepository.create({
      ...parsedData,
      token: randomUUID(),
    });

    return NextResponse.json(paymentLink, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create payment link",
      },
      {
        status: 400,
      },
    )
  }
}
