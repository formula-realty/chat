import type { LeadPayload } from "@/lib/types";

function line(label: string, value?: string): string {
  return `${label}: ${value?.trim() || "-"}`;
}

export function formatLeadForBitrixComments({
  answers
}: LeadPayload): string {
  return [
    'Новая заявка с чат-лендинга "Формула"',
    "",
    line("Планировка", answers.need),
    line("Способ покупки", answers.purchaseMethod),
    line("Бюджет", answers.budget),
    line("Куда направить", answers.contactMethod)
  ].join("\n");
}

export function formatPhoneForDisplay(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
  const rest = normalized.startsWith("7") ? normalized.slice(1) : normalized;

  if (!rest) {
    return "";
  }

  const parts = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10)
  ].filter(Boolean);

  if (parts.length === 1) {
    return `+7 (${parts[0]}`;
  }

  if (parts.length === 2) {
    return `+7 (${parts[0]}) ${parts[1]}`;
  }

  if (parts.length === 3) {
    return `+7 (${parts[0]}) ${parts[1]}-${parts[2]}`;
  }

  return `+7 (${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`;
}
