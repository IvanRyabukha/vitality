import "server-only";

import { prisma} from "@/shared/server/prisma";

interface CreatePaymentLinkParams {
  token: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
}

export const paymentLinkRepository = {
  findMany() {
    return prisma.paymentLink.findMany({
      orderBy: {
        createdAt: "desc",
      }
    });
  },

  create(params: CreatePaymentLinkParams) {
    return prisma.paymentLink.create({
      data: params,
    });
  },

  findByToken(token: string) {
    return prisma.paymentLink.findUnique({
      where: {
        token,
      }
    });
  },

  markAsPaid(id: string, paymentIntentId: string) {
    return prisma.paymentLink.update({
      where: { id },
      data: {
        status: "PAID",
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date(),
      }
    });
  }
}
