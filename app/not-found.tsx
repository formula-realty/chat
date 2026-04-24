export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-formula-accent">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-formula-ink">
          Страница не найдена
        </h1>
        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-formula-ink px-5 py-3 text-sm font-semibold text-white"
        >
          Вернуться к подбору
        </a>
      </div>
    </main>
  );
}
