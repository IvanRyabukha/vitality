import { notFound } from "next/navigation";
import { paymentLinkRepository } from "@/entities/payment-link/server/payment-link.repository";
import { StripePaymentForm } from "@/features/pay-invoice/ui/stripe-payment-form";

interface CheckoutPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { token } = await params;

  const paymentLink = await paymentLinkRepository.findByToken(token);

  if (!paymentLink) {
    notFound();
  }

  if (paymentLink.status === "PAID") {
    return (
      <main>
        <h1>Already paid</h1>
      </main>
    )
  }

  return (
    <main>
      <h1>Checkout page</h1>

      <StripePaymentForm
        paymentLinkId={paymentLink.id}
        amount={paymentLink.amount}
      />
    </main>
  );
};
