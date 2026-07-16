import { FileQuestion, UserRoundX } from "lucide-react";
import Link from "next/link";

type NotFoundStateProps = {
  kind: "portfolio" | "page";
};

export default function NotFoundState({ kind }: NotFoundStateProps) {
  const isPortfolio = kind === "portfolio";
  const Icon = isPortfolio ? UserRoundX : FileQuestion;
  const title = isPortfolio
    ? "No portfolio lives at this address."
    : "This page doesn’t exist in the portfolio.";
  const description = isPortfolio
    ? "Check the username in the link, or return to the homepage."
    : "The address may be incorrect, or the page may have moved.";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-zinc-950 px-6 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(56,189,248,0.10),transparent_24rem),radial-gradient(circle_at_72%_72%,rgba(139,92,246,0.08),transparent_22rem)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
      <section className="relative w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/40 duration-500 backdrop-blur-xl sm:p-12">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-400/15 to-violet-500/15 text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.10)]">
          <Icon className="h-6 w-6" />
        </span>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
          {isPortfolio ? "Portfolio unavailable" : "404 · Page unavailable"}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
          {description}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-sky-100"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
