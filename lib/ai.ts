import OpenAI from "openai";

import { getNextStepId, getStepQuestion } from "@/lib/chat-flow";
import type { CollectedAnswers, FunnelStepId } from "@/lib/types";

type GenerateAssistantReplyInput = {
  currentStep: FunnelStepId;
  message: string;
  answers: CollectedAnswers;
};

const SYSTEM_PROMPT = [
  'Ты - короткий и вежливый ассистент агентства недвижимости "Формула" в Тюмени.',
  "Твоя задача - помочь пользователю подобрать квартиру и довести его до заявки.",
  "Отвечай кратко, по делу, на русском языке.",
  "Не выдумывай факты, цены, скидки, наличие квартир или условия банков.",
  "После короткого ответа всегда мягко возвращай пользователя к следующему нужному вопросу сценария.",
  "Не проси лишние данные и не перескакивай к телефону раньше сценария.",
  "Ответ должен быть максимум 1-3 коротких предложения."
].join(" ");

function createClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined
  });
}

function cleanReply(reply: string, nextQuestion: string): string {
  const normalized = reply.replace(/\s+/g, " ").trim();
  const withQuestion = normalized.includes(nextQuestion)
    ? normalized
    : `${normalized} ${nextQuestion}`;

  return withQuestion.length > 420
    ? `${withQuestion.slice(0, 417).trim()}...`
    : withQuestion;
}

function fallbackAssistantReply(message: string, nextQuestion: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("ипотек")) {
    return `Понял. Учтем ипотеку и подберем варианты под ваш формат покупки. ${nextQuestion}`;
  }

  if (lower.includes("центр") || lower.includes("район")) {
    return `Хорошо, учту локацию. ${nextQuestion}`;
  }

  if (lower.includes("смотр") || lower.includes("присматри")) {
    return `Без проблем. Подберем варианты без спешки. ${nextQuestion}`;
  }

  if (lower.includes("сем")) {
    return `Понял, будем смотреть более удобные варианты для семьи. ${nextQuestion}`;
  }

  return `Понял, учту это. ${nextQuestion}`;
}

export async function generateAssistantReply({
  currentStep,
  message,
  answers
}: GenerateAssistantReplyInput): Promise<string> {
  const nextStep = getNextStepId(currentStep);
  const nextQuestion = getStepQuestion(nextStep);
  const client = createClient();

  if (!client) {
    return fallbackAssistantReply(message, nextQuestion);
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.2,
    max_tokens: 140,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: JSON.stringify({
          city: "Тюмень",
          company: "Формула",
          currentStep,
          currentQuestion: getStepQuestion(currentStep),
          nextStep,
          nextQuestion,
          collectedAnswers: answers,
          userMessage: message,
          instruction:
            "Ответь на реплику пользователя и верни его к nextQuestion. Не добавляй списки, markdown и лишние вопросы."
        })
      }
    ]
  });

  const reply = completion.choices[0]?.message?.content;

  if (!reply) {
    return fallbackAssistantReply(message, nextQuestion);
  }

  return cleanReply(reply, nextQuestion);
}
