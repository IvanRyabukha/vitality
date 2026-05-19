"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

import { clientEnv } from "@/shared/config/client-env";

const stripePromise = loadStripe(
  clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

interface StripePaymentFormProps {
  paymentLinkId: string;
  amount: number;
}

export function StripePaymentForm({ paymentLinkId, amount }: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  async function createPaymentIntent() {
    const response = await fetch("/api/payment-intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentLinkId,
        amount
      }),
    });

    const data = await response.json();

    setClientSecret(data.clientSecret);
  }

  return (
    <div>
      {!clientSecret ? (
        <button
          onClick={createPaymentIntent}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Pay now
        </button>
      ) : (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <PaymentElementForm />
        </Elements>
      )}
    </div>
  );
}

function PaymentElementForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isPending, setIsPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsPending(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    setIsPending(false);

    if (result.error) {
      alert(result.error.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isPending}
        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isPending ? "Processing..." : "Submit payment"}
      </button>
    </form>
  );
}
