import { formatLeadForBitrixComments } from "@/lib/format";
import type { LeadPayload } from "@/lib/types";

type BitrixLeadFields = Record<
  string,
  string | number | Array<{ VALUE: string; VALUE_TYPE: string }> | undefined
>;

type BitrixDeliveryResult = {
  bitrix: "sent";
  leadId: number | string;
};

function getBitrixEndpoint(): string {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error("BITRIX_WEBHOOK_URL is not configured");
  }

  if (webhookUrl.includes("crm.lead.add")) {
    return webhookUrl;
  }

  return `${webhookUrl.replace(/\/+$/, "")}/crm.lead.add.json`;
}

function buildLeadFields(payload: LeadPayload): BitrixLeadFields {
  const { answers } = payload;
  const assignedById = process.env.BITRIX_ASSIGNED_BY_ID?.trim();
  const fields: BitrixLeadFields = {
    TITLE: "Заявка с чат-лендинга Формула",
    STATUS_ID: "NEW",
    NAME: "Клиент",
    PHONE: [
      {
        VALUE: answers.phone,
        VALUE_TYPE: "WORK"
      }
    ],
    SOURCE_ID: process.env.BITRIX_SOURCE_ID || "WEB",
    SOURCE_DESCRIPTION: "Чат-лендинг Формула",
    COMMENTS: formatLeadForBitrixComments(payload),
    UTM_SOURCE: "avito",
    UTM_MEDIUM: "chat",
    UTM_CAMPAIGN: "frml"
  };

  if (assignedById) {
    fields.ASSIGNED_BY_ID = Number(assignedById);
  }

  return fields;
}

export async function deliverLeadToBitrix(
  payload: LeadPayload
): Promise<BitrixDeliveryResult> {
  const response = await fetch(getBitrixEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: buildLeadFields(payload),
      params: {
        REGISTER_SONET_EVENT: "Y"
      }
    }),
    signal: AbortSignal.timeout(10000)
  });

  const data = (await response.json().catch(() => null)) as
    | { result?: number | string; error?: string; error_description?: string }
    | null;

  if (!response.ok || data?.error || !data?.result) {
    throw new Error(
      `Bitrix lead delivery failed: ${response.status} ${
        data?.error_description || data?.error || ""
      }`
    );
  }

  return {
    bitrix: "sent",
    leadId: data.result
  };
}
