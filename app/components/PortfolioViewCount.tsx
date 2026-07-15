"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";

const VISITOR_STORAGE_KEY = "portfolio_anonymous_visitor_id";

function getAnonymousVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (existing) return existing;
  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  return visitorId;
}

export default function PortfolioViewCount() {
  const { portfolioUsername } = useUser();
  const [count, setCount] = useState<number | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (!portfolioUsername || requested.current) return;
    requested.current = true;

    const recordView = async () => {
      try {
        const response = await fetch(
          `/api/portfolio-views?username=${encodeURIComponent(portfolioUsername)}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "x-portfolio-visitor-id": getAnonymousVisitorId() },
          }
        );
        if (!response.ok) return;
        const data = (await response.json()) as { count?: number };
        if (typeof data.count === "number") setCount(data.count);
      } catch (error) {
        console.error("Unable to load portfolio views", error);
      }
    };

    void recordView();
  }, [portfolioUsername]);

  return (
    <motion.div
      {...{
        className:
          "mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-gradient-to-r from-cyan-400/10 via-sky-400/10 to-violet-400/10 px-3 py-1.5 shadow-[0_0_24px_rgba(34,211,238,0.08)] backdrop-blur-sm",
        "aria-label": count === null
          ? "Loading unique portfolio views"
          : `${count} unique portfolio views`,
      }}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.28)]">
        <Eye className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="min-w-4 text-sm font-semibold tabular-nums text-cyan-100">
        {count ?? "—"}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-sky-200/65">
        unique views
      </span>
    </motion.div>
  );
}
