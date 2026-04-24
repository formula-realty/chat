import type { ChatStepConfig, ChatStepId, FunnelStepId } from "@/lib/types";

export const START_MESSAGES = [
  "Здравствуйте. Я помогу подобрать квартиру в Тюмени под ваш запрос.",
  "Это займет меньше минуты.",
  "Какую планировку рассматриваете?"
] as const;

export const FUNNEL_STEP_IDS: readonly FunnelStepId[] = [
  "need",
  "purchase",
  "budget",
  "contact",
  "phone"
] as const;

export const FIRST_STEP_ID: FunnelStepId = "need";

export const CHAT_STEPS: ChatStepConfig[] = [
  {
    id: "need",
    field: "need",
    question: "Какую планировку рассматриваете?",
    inputType: "text",
    quickReplies: [
      "Студия",
      "Однокомнатная",
      "Евродвушка",
      "Евротрешка",
      "Четырехкомнатная",
      "Другая планировка"
    ],
    acceptsFreeText: true
  },
  {
    id: "purchase",
    field: "purchaseMethod",
    question: "Какой способ покупки планируете?",
    inputType: "text",
    quickReplies: ["Ипотека", "Наличный расчет", "Рассрочка"]
  },
  {
    id: "budget",
    field: "budget",
    question: "Какой бюджет рассматриваете?",
    inputType: "text",
    quickReplies: ["до 4 млн ₽", "4-6 млн ₽", "6-8 млн ₽", "от 8 млн ₽"]
  },
  {
    id: "contact",
    field: "contactMethod",
    question: "Куда вам направить варианты?",
    inputType: "text",
    quickReplies: ["Telegram", "WhatsApp", "MAX"]
  },
  {
    id: "phone",
    field: "phone",
    question:
      "Оставьте номер телефона, и мы отправим подборку под ваш запрос.",
    inputType: "phone"
  }
];

export const FLOW_STEPS = CHAT_STEPS.reduce(
  (acc, step) => {
    acc[step.id] = step;
    return acc;
  },
  {} as Record<FunnelStepId, ChatStepConfig>
);

export function getStep(stepId: FunnelStepId): ChatStepConfig {
  return FLOW_STEPS[stepId];
}

export function isFunnelStepId(stepId: string): stepId is FunnelStepId {
  return FUNNEL_STEP_IDS.includes(stepId as FunnelStepId);
}

export function getNextStepId(stepId: FunnelStepId): ChatStepId {
  const index = FUNNEL_STEP_IDS.indexOf(stepId);
  return FUNNEL_STEP_IDS[index + 1] ?? "done";
}

export function getStepQuestion(stepId: ChatStepId): string {
  if (stepId === "done") {
    return "Заявка отправлена";
  }

  return getStep(stepId).question;
}
