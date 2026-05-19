"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreatePaymentLinkForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  async function onSubmit(formData: FormData) {
    setIsPending(true);

    const payload = {
      amount: Number(formData.get("amount")) * 100,
      currency: "eur",
      customerName: String(formData.get("customerName") || ""),
      customerEmail: String(formData.get("customerEmail") || ""),
      description: String(formData.get("description")) || "",
    }

    const response = await fetch("/api/payment-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsPending(false);

    if (!response.ok) {
      alert("Failed to create payment link");
      return;
    }

    router.refresh();
  }

  return (
    <form
      action={onSubmit}
      className="mb-8 grid gap-4 rounded-xl border border-gray-200 p-4"
    >
      <input
        name="customerName"
        placeholder="Customer name"
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <input
        name="customerEmail"
        placeholder="Customer email"
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount, e.g. 150"
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <input
        name="description"
        placeholder="Description"
        className="rounded-lg border border-gray-300 px-3 py-2"
      />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {isPending ? "Creating..." : "Create payment link"}
      </button>
    </form>
  );
}
