"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppInstalledPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = window.setTimeout(() => router.replace("/details"), 1200);
    return () => window.clearTimeout(timer);
  }, [router]);

  return <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-center text-zinc-100"><p className="animate-pulse text-sm tracking-wide text-zinc-400">GitHub App installed. Preparing your profile…</p></main>;
}
