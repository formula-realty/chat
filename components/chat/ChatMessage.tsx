import clsx from "clsx";

import { assistantAvatar } from "@/lib/assistant-avatar";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const time = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(message.timestamp));

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-formula-soft px-3 py-1 text-xs text-formula-muted">
          {message.text}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <article className="max-w-[88%] rounded-[18px] rounded-br-[6px] bg-formula-ink px-3.5 py-2.5 text-white shadow-sm sm:max-w-[78%] sm:px-4 sm:py-3">
          <p className="whitespace-pre-wrap text-[14px] leading-5 sm:text-[15px] sm:leading-6">
            {message.text}
          </p>
          <time className="mt-1 block text-right text-[11px] text-white/72">
            {time}
          </time>
        </article>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-formula-line bg-white">
        <img
          src={assistantAvatar}
          alt="Арсений Попов"
          className="h-full w-full object-cover"
        />
      </span>
      <article className="max-w-[88%] rounded-[18px] rounded-bl-[6px] border border-formula-line bg-white px-3.5 py-2.5 text-formula-ink shadow-sm sm:max-w-[78%] sm:px-4 sm:py-3">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-formula-muted">
          Арсений Попов
        </p>
        <p className="whitespace-pre-wrap text-[14px] leading-5 sm:text-[15px] sm:leading-6">
          {message.text}
        </p>
        <time
          className={clsx(
            "mt-1 block text-right text-[11px]",
            "text-formula-muted"
          )}
        >
          {time}
        </time>
      </article>
    </div>
  );
}
