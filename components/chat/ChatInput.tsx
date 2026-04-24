import { FormEvent } from "react";

import { formatPhoneForDisplay } from "@/lib/format";
import type { InputType } from "@/lib/types";

type ChatInputProps = {
  value: string;
  inputType: InputType;
  disabled?: boolean;
  isSubmitting?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({
  value,
  inputType,
  disabled,
  isSubmitting,
  placeholder,
  onChange,
  onSubmit
}: ChatInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        value={value}
        type={inputType === "phone" ? "tel" : "text"}
        inputMode={inputType === "phone" ? "tel" : "text"}
        autoComplete={inputType === "phone" ? "tel" : "off"}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => {
          const nextValue =
            inputType === "phone"
              ? formatPhoneForDisplay(event.target.value)
              : event.target.value;
          onChange(nextValue);
        }}
        className="min-w-0 flex-1 rounded-full border border-formula-line bg-white px-4 py-3 text-[16px] text-formula-ink outline-none transition placeholder:text-formula-muted/70 focus:border-formula-accent focus:ring-4 focus:ring-formula-accent/10 disabled:cursor-not-allowed disabled:bg-formula-soft"
      />
      <button
        type="submit"
        disabled={disabled || isSubmitting || !value.trim()}
        aria-label="Отправить сообщение"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-formula-ink text-lg font-semibold text-white shadow-sm transition hover:bg-white hover:text-formula-ink hover:ring-1 hover:ring-formula-ink disabled:cursor-not-allowed disabled:bg-formula-muted disabled:hover:text-white disabled:hover:ring-0"
      >
        {isSubmitting ? "..." : "→"}
      </button>
    </form>
  );
}
