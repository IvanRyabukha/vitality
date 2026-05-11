import { NextResponse } from "next/server";

import { paymentLinkRepository } from "@/entities/payment-link/server/payment-link.repository";

interface RouteParams {
  params: Promise<{
    token: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteParams,
) {
  const { token } = await params;

  const paymentLink = await paymentLinkRepository.findByToken(token);

  if (!paymentLink) {
    return NextResponse.json(
      {
        message: `Payment link not found`,
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(paymentLink);
}
