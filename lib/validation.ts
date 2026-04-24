import { z } from "zod";

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `7${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith("7")) {
    return digits;
  }

  return digits;
}

export function isValidRussianPhone(value: string): boolean {
  return /^7\d{10}$/.test(normalizePhone(value));
}

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Введите имя")
  .max(80, "Имя слишком длинное")
  .refine(
    (value) => /^[А-Яа-яЁёA-Za-z\s-]+$/.test(value),
    "Введите имя без цифр и спецсимволов"
  );

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Введите телефон")
  .refine(isValidRussianPhone, "Введите корректный номер телефона")
  .transform(normalizePhone);

const requiredTextSchema = z.string().trim().min(1).max(500);

export const leadAnswersSchema = z.object({
  need: requiredTextSchema,
  purchaseMethod: requiredTextSchema,
  budget: requiredTextSchema,
  contactMethod: requiredTextSchema,
  name: nameSchema,
  phone: phoneSchema
});

export const sessionMetadataSchema = z.object({
  utm_source: z.string().max(300).optional(),
  utm_medium: z.string().max(300).optional(),
  utm_campaign: z.string().max(300).optional(),
  utm_content: z.string().max(300).optional(),
  utm_term: z.string().max(300).optional(),
  gclid: z.string().max(500).optional(),
  yclid: z.string().max(500).optional(),
  referrer: z.string().max(1000),
  path: z.string().max(1000),
  timestamp: z.string().max(80),
  userAgent: z.string().max(1000)
});

export const leadRequestSchema = z.object({
  answers: leadAnswersSchema,
  metadata: sessionMetadataSchema,
  website: z.string().max(300).optional(),
  startedAt: z.number().finite()
});

export const chatRequestSchema = z.object({
  currentStep: z.enum([
    "need",
    "purchase",
    "budget",
    "contact",
    "phone"
  ]),
  message: z.string().trim().min(1).max(700),
  answers: z.record(z.string()).optional()
});
