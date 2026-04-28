export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-formula-line bg-white">
        <img
          src="/arseniy-popov.svg"
          alt="Арсений Попов"
          className="h-full w-full object-cover"
        />
      </span>
      <div className="inline-flex rounded-[18px] rounded-bl-[6px] border border-formula-line bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-formula-muted">
            Арсений Попов
          </p>
          <div className="inline-flex items-center gap-1">
            <span className="text-sm text-formula-muted">печатает</span>
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-formula-muted [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-formula-muted [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-formula-muted" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
