import clsx from "clsx";

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

  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <article
        className={clsx(
          "max-w-[88%] rounded-[18px] px-3.5 py-2.5 shadow-sm sm:max-w-[78%] sm:px-4 sm:py-3",
          isUser
            ? "rounded-br-[6px] bg-formula-ink text-white"
            : "rounded-bl-[6px] border border-formula-line bg-white text-formula-ink"
        )}
      >
        <p className="whitespace-pre-wrap text-[14px] leading-5 sm:text-[15px] sm:leading-6">{message.text}</p>
        <time
          className={clsx(
            "mt-1 block text-right text-[11px]",
            isUser ? "text-white/72" : "text-formula-muted"
          )}
        >
          {time}
        </time>
      </article>
    </div>
  );
}
