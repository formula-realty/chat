"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  FIRST_STEP_ID,
  START_MESSAGES,
  getNextStepId,
  getStep
} from "@/lib/chat-flow";
import { captureSessionMetadata } from "@/lib/utm";
import type {
  ChatMessage,
  ChatStepId,
  CollectedAnswers,
  LeadAnswers,
  SessionMetadata
} from "@/lib/types";
import { leadAnswersSchema, phoneSchema } from "@/lib/validation";

const BOT_DELAY_MS = 520;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMessage(
  role: ChatMessage["role"],
  text: string,
  options?: Pick<ChatMessage, "quickReplies" | "inputType" | "step">
): ChatMessage {
  return {
    id: `${role}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    role,
    text,
    timestamp: new Date().toISOString(),
    ...options
  };
}

export function useChatController() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ChatStepId>(FIRST_STEP_ID);
  const [answers, setAnswers] = useState<CollectedAnswers>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<SessionMetadata | null>(null);
  const [website, setWebsite] = useState("");
  const mountedRef = useRef(false);
  const sequenceRef = useRef(0);
  const startedAtRef = useRef(Date.now());

  const activeStep = currentStep === "done" ? null : getStep(currentStep);
  const lastMessage = messages[messages.length - 1];
  const activeQuickReplies =
    activeStep &&
    lastMessage?.role === "bot" &&
    lastMessage.step === activeStep.id &&
    activeStep.quickReplies
      ? activeStep.quickReplies
      : [];

  const placeholder = useMemo(() => {
    if (!activeStep) {
      return "Заявка отправлена";
    }

    if (activeStep.inputType === "phone") {
      return "+7 (___) ___-__-__";
    }

    return "";
  }, [activeStep]);

  const pushBotMessage = useCallback(
    async (
      text: string,
      options: Pick<ChatMessage, "quickReplies" | "inputType" | "step"> = {},
      delay = BOT_DELAY_MS,
      sequence = sequenceRef.current
    ) => {
      setIsTyping(true);
      await sleep(delay);

      if (!mountedRef.current || sequence !== sequenceRef.current) {
        return;
      }

      setMessages((current) => [...current, createMessage("bot", text, options)]);
      setIsTyping(false);
    },
    []
  );

  const startConversation = useCallback(async () => {
    const sequence = sequenceRef.current + 1;
    sequenceRef.current = sequence;
    startedAtRef.current = Date.now();
    setMessages([]);
    setAnswers({});
    setInputValue("");
    setError(null);
    setSubmitted(false);
    setIsSubmitting(false);
    setCurrentStep(FIRST_STEP_ID);

    const firstStep = getStep(FIRST_STEP_ID);
    await pushBotMessage(START_MESSAGES[0], {}, 420, sequence);
    await pushBotMessage(START_MESSAGES[1], {}, 520, sequence);
    await pushBotMessage(
      START_MESSAGES[2],
      {
        step: firstStep.id,
        quickReplies: firstStep.quickReplies,
        inputType: firstStep.inputType
      },
      520,
      sequence
    );
  }, [pushBotMessage]);

  useEffect(() => {
    mountedRef.current = true;
    setMetadata(captureSessionMetadata());
    void startConversation();

    return () => {
      mountedRef.current = false;
      sequenceRef.current += 1;
    };
  }, [startConversation]);

  async function askStep(stepId: ChatStepId) {
    if (stepId === "done") {
      setCurrentStep("done");
      return;
    }

    const step = getStep(stepId);
    setCurrentStep(stepId);
    await pushBotMessage(step.question, {
      step: step.id,
      quickReplies: step.quickReplies,
      inputType: step.inputType
    });
  }

  async function submitLead(nextAnswers: CollectedAnswers) {
    const parsed = leadAnswersSchema.safeParse({
      name: "Не указано",
      ...nextAnswers
    });

    if (!parsed.success) {
      setError("Не хватает данных для заявки. Проверьте ответы.");
      return;
    }

    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: parsed.data,
          metadata: metadata ?? captureSessionMetadata(),
          website,
          startedAt: startedAtRef.current
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(data?.error || "Не удалось отправить заявку.");
      }

      setCurrentStep("done");
      setSubmitted(true);
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("bot", "Готово. Заявка отправлена.")
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не получилось отправить заявку. Попробуйте еще раз."
      );
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
    }
  }

  async function handleAnswer(rawValue: string) {
    if (!activeStep || isTyping || isSubmitting) {
      return;
    }

    const trimmed = rawValue.trim();

    if (!trimmed) {
      setError("Выберите вариант ответа.");
      return;
    }

    let valueForDisplay = trimmed;
    let valueForStorage = trimmed;

    if (activeStep.inputType === "phone") {
      const parsed = phoneSchema.safeParse(trimmed);

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Введите телефон.");
        return;
      }

      valueForStorage = parsed.data;
      valueForDisplay = trimmed;
    } else if (!activeStep.quickReplies?.includes(trimmed)) {
      setError("Выберите вариант ответа.");
      return;
    }

    const nextAnswers: CollectedAnswers = {
      ...answers,
      [activeStep.field]: valueForStorage
    };

    setError(null);
    setInputValue("");
    setAnswers(nextAnswers);
    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage("user", valueForDisplay)
    ]);

    if (activeStep.id === "phone") {
      await submitLead(nextAnswers);
      return;
    }

    const nextStep = getNextStepId(activeStep.id);

    await askStep(nextStep);
  }

  return {
    messages,
    inputValue,
    setInputValue,
    currentStep,
    activeStep,
    activeQuickReplies,
    isTyping,
    isSubmitting,
    submitted,
    error,
    website,
    setWebsite,
    placeholder,
    handleQuickReply: (reply: string) => void handleAnswer(reply),
    handleSubmit: () => void handleAnswer(inputValue),
    restart: () => void startConversation(),
    normalizedAnswers: answers as Partial<LeadAnswers>
  };
}
