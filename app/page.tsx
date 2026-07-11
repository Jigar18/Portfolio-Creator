"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Github, Layers3, Sparkles, Terminal } from "lucide-react";

const steps = [
  ["01", "Connect", "Sign in securely with GitHub and install the app only where you want it."],
  ["02", "Shape", "Add the work, proof, experience, and details that tell your story."],
  ["03", "Publish", "Share a portfolio that feels deliberate on every screen."],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-white selection:text-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_20%,rgba(255,255,255,0.13),transparent_25rem),radial-gradient(circle_at_10%_90%,rgba(255,255,255,0.07),transparent_30rem)]" />
      <nav className="relative mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/10"><Layers3 className="h-4 w-4" /></span> Portfolio</Link>
        <Link href="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/35 hover:bg-white/10 hover:text-white">Sign in</Link>
      </nav>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} {...{ className: "min-w-0" }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium tracking-wide text-zinc-300"><Sparkles className="h-3.5 w-3.5" /> A quieter way to show your work</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl">Your work deserves more than a template.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400">Turn a GitHub profile, career story, and proof of craft into a modern portfolio that feels unmistakably yours.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-200"><Github className="h-4 w-4" /> Start with GitHub <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link>
            <a href="#how-it-works" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:bg-white/[0.06]">See how it works</a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">{["Secure GitHub connection", "No tokens in URLs", "Designed for real projects"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-zinc-200" />{item}</span>)}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} {...{ className: "relative min-w-0" }}>
          <div className="absolute inset-10 rounded-full bg-white/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 p-3 shadow-2xl">
            <div className="min-h-[27rem] rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#27272a_0%,#18181b_52%,#09090b_100%)] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.08]"><Terminal className="h-4 w-4 text-zinc-200" /></span><div><p className="text-sm font-medium text-white">Your portfolio</p><p className="mt-0.5 text-xs text-zinc-500">Focused. Personal. Live.</p></div></div><span className="h-2.5 w-2.5 rounded-full bg-zinc-200 shadow-[0_0_18px_rgba(255,255,255,0.7)]" /></div>
              <div className="mt-8 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]"><div className="rounded-2xl border border-white/10 bg-zinc-950/45 p-5"><div className="h-2 w-20 rounded-full bg-zinc-700" /><div className="mt-4 h-8 w-4/5 rounded-lg bg-zinc-100/90" /><div className="mt-2 h-3 w-3/5 rounded-full bg-zinc-700" /><div className="mt-8 flex flex-wrap gap-2">{["React", "Systems", "Design"].map((label) => <span key={label} className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] text-zinc-300">{label}</span>)}</div></div><div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Selected work</p><div className="mt-5 space-y-3">{["Interface systems", "Product builds", "Open source"].map((label, index) => <div key={label} className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-800 text-xs text-zinc-400">0{index + 1}</span><span className="text-sm text-zinc-200">{label}</span></div>)}</div></div></div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4"><p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Portfolio, made personal</p><p className="mt-2 text-sm font-medium text-zinc-100">A live identity for your best work.</p></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="relative border-y border-white/10 bg-white/[0.025] py-24">
        <div className="mx-auto max-w-6xl px-6"><p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">A clear path</p><div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">A focused builder from first sign-in to final share.</h2><p className="max-w-sm text-sm leading-6 text-zinc-400">Every part is designed to make your work easier to scan, trust, and remember.</p></div><div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">{steps.map(([number, title, description], index) => <motion.article key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08 }} {...{ className: "bg-zinc-950 p-7 transition hover:bg-zinc-900" }}><span className="text-xs font-medium tracking-[0.2em] text-zinc-500">{number}</span><h3 className="mt-10 text-xl font-medium">{title}</h3><p className="mt-3 leading-7 text-zinc-400">{description}</p></motion.article>)}</div></div>
      </section>
    </main>
  );
}
