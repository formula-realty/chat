import { ChatShell } from "@/components/chat/ChatShell";

export default function HomePage() {
  return (
    <main className="h-svh overflow-hidden bg-formula-soft text-formula-ink">
      <section className="mx-auto flex h-full w-full max-w-7xl flex-col p-0 lg:px-7 lg:py-3">
        <header className="hidden shrink-0 items-center justify-between gap-3 rounded-full border border-formula-line bg-white px-3 py-2 shadow-sm sm:px-4 lg:flex">
          <a href="#chat" className="flex items-center gap-3" aria-label="Формула">
            <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
              <img
                src="/formula-mark.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto sm:h-9"
              />
            </span>
            <span>
              <span className="block text-base font-semibold leading-tight sm:text-lg">
                Формула
              </span>
              <span className="block text-[11px] leading-tight text-formula-muted sm:text-xs">
                недвижимость в Тюмени
              </span>
            </span>
          </a>
          <a
            href="tel:+73452698401"
            className="hidden rounded-full bg-formula-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-formula-ink hover:ring-1 hover:ring-formula-ink sm:inline-flex"
          >
            +7 (3452) 69-84-01
          </a>
          <span className="rounded-full bg-formula-ink px-3 py-2 text-xs font-semibold text-white sm:hidden">
            онлайн
          </span>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] lg:grid-cols-[0.86fr_1.14fr] lg:grid-rows-none lg:gap-5 lg:pt-3">
          <section className="relative hidden overflow-hidden rounded-[28px] border border-formula-line bg-white p-4 shadow-soft sm:p-5 lg:flex lg:min-h-0 lg:flex-col lg:justify-between lg:p-7">
            <div>
              <div className="inline-flex rounded-full bg-formula-soft px-3 py-1.5 text-xs font-semibold text-formula-ink sm:text-sm">
                Подбор недвижимости быстро и для всех
              </div>
              <h1 className="mt-3 text-[32px] font-semibold leading-[0.98] sm:text-5xl lg:text-6xl">
                Подберем квартиру в Тюмени под ваш запрос
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-5 text-formula-muted sm:text-base sm:leading-6 lg:text-lg">
                Ответьте на 4 коротких вопроса и оставьте телефон. Специалист
                отправит подборку удобным для вас способом.
              </p>
            </div>

            <div className="pointer-events-none absolute -bottom-16 -right-12 hidden h-44 w-44 rounded-full border-[28px] border-formula-ink/5 lg:block" />
          </section>

          <ChatShell />
        </div>
      </section>
    </main>
  );
}
