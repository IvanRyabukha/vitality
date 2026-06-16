import { paymentLinkRepository } from "@/entities/payment-link/server/payment-link.repository";
import { CreatePaymentLinkForm } from "@/features/create-payment-link/ui/create-payment-link-form";

export default async function AdminPaymentLinksPage() {
  const paymentLinks = await paymentLinkRepository.findMany();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">
        Payment links
      </h1>

      <CreatePaymentLinkForm/>

      {paymentLinks.length === 0 ? (
        <p className="text-gray-500">No payment links yet!.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Link</th>
            </tr>
            </thead>

            <tbody>
            {paymentLinks.map((link) => (
              <tr key={link.id} className="border-t border-gray-200">
                <td className="px-4 py-3">
                  {link.customerName || "—"}
                </td>

                <td className="px-4 py-3">
                  {link.customerEmail || "—"}
                </td>

                <td className="px-4 py-3">
                  {(link.amount / 100).toFixed(2)} {link.currency.toUpperCase()}
                </td>

                <td className="px-4 py-3">
                  {link.status}
                </td>

                <td className="px-4 py-3">
                  {link.createdAt.toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <a
                    href={`/checkout/${link.token}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
