"use client";

import { useEffect, useRef } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { ThankYouPanel } from "@/components/chat/ThankYouPanel";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useChatController } from "@/components/chat/useChatController";

export function ChatShell() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {
    messages,
    inputValue,
    setInputValue,
    activeStep,
    activeQuickReplies,
    isTyping,
    isSubmitting,
    submitted,
    error,
    website,
    setWebsite,
    placeholder,
    handleQuickReply,
    handleSubmit,
    restart
  } = useChatController();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages, isTyping, submitted]);

  return (
    <section
      id="chat"
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-none border-0 bg-white shadow-none lg:rounded-[28px] lg:border lg:border-formula-line lg:shadow-chat"
      aria-label="Чат подбора квартиры"
    >
      <div className="flex shrink-0 items-center justify-between bg-formula-ink px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white sm:h-11 sm:w-11">
            <img
              src="/arseniy-popov.svg"
              alt="Арсений Попов"
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <p className="text-sm font-semibold">Арсений Попов</p>
            <p className="text-xs text-white/65">
              эксперт по подбору квартир в Тюмени
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-medium text-white">
          отвечает сразу
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-formula-soft px-3 py-3 sm:px-5 sm:py-4">
        <div className="space-y-2.5 sm:space-y-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping ? <TypingIndicator /> : null}
          {submitted ? <ThankYouPanel onRestart={restart} /> : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-formula-line bg-white p-3 sm:p-4">
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className="hidden"
          aria-hidden="true"
        />

        {!submitted ? (
          <div className="space-y-3">
            <QuickReplies
              replies={activeQuickReplies}
              disabled={isTyping || isSubmitting}
              onSelect={handleQuickReply}
            />
            {error ? (
              <p className="px-1 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            {activeStep?.inputType === "phone" ? (
              <ChatInput
                value={inputValue}
                inputType={activeStep.inputType}
                disabled={isTyping || isSubmitting}
                isSubmitting={isSubmitting}
                placeholder={placeholder}
                onChange={setInputValue}
                onSubmit={handleSubmit}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
