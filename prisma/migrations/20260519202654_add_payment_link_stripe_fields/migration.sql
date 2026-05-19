-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT;
