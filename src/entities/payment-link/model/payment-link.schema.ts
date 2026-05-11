import { z } from 'zod';

export const createPaymentLinkSchema = z.object({
  amount: z
    .number()
    .int()
    .positive(),

  currency: z
    .string()
    .min(3)
    .max(3)
    .default("eur"),

  customerName: z
    .string()
    .trim()
    .optional(),

  customerEmail: z
    .string()
    .trim()
    .pipe(z.email())
    .optional(),

  description: z
    .string()
    .trim()
    .optional(),
});

export type TCreatePaymentLinkDto = z.infer<typeof createPaymentLinkSchema>;
