import { NextResponse } from "next/server";

import { deliverLeadToBitrix } from "@/lib/bitrix";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { LeadPayload } from "@/lib/types";
import { leadRequestSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  if (!checkRateLimit(`lead:${ip}`, 4, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Слишком много заявок. Попробуйте позже." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте телефон и ответы." },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ error: "Spam rejected." }, { status: 400 });
  }

  if (Date.now() - parsed.data.startedAt < 2500) {
    return NextResponse.json(
      { error: "Слишком быстрая отправка." },
      { status: 400 }
    );
  }

  const payload: LeadPayload = {
    answers: parsed.data.answers,
    metadata: parsed.data.metadata
  };

  try {
    const delivery = await deliverLeadToBitrix(payload);
    return NextResponse.json({ ok: true, delivery });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку." },
      { status: 500 }
    );
  }
}
