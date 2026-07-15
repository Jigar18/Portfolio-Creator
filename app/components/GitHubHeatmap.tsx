"use client";

import { motion } from "framer-motion";
import { Github, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

type ContributionDay = {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
};

type ContributionCalendar = {
  totalContributions: number;
  weeks: Array<{ contributionDays: ContributionDay[] }>;
};

type ContributionResponse = {
  success: boolean;
  visible?: boolean;
  available?: boolean;
  calendar?: ContributionCalendar;
};

const LEGEND_COLORS = [
  "rgba(255,255,255,0.045)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

export default function GitHubHeatmap() {
  const { isOwner, portfolioApiUrl } = useUser();
  const [visible, setVisible] = useState(true);
  const [available, setAvailable] = useState(true);
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadContributions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(portfolioApiUrl("/api/github/contributions"), {
        credentials: "include",
      });
      if (!response.ok) {
        setAvailable(false);
        return;
      }
      const data = (await response.json()) as ContributionResponse;
      setVisible(Boolean(data.visible));
      setAvailable(data.available !== false);
      setCalendar(data.calendar ?? null);
    } catch (error) {
      console.error("Unable to load GitHub activity", error);
      setAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [portfolioApiUrl]);

  useEffect(() => {
    void loadContributions();
  }, [loadContributions]);

  const updateVisibility = async () => {
    if (!isOwner || saving) return;
    const nextVisible = !visible;
    setSaving(true);
    try {
      const response = await fetch("/api/github/contributions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: nextVisible }),
      });
      if (!response.ok) return;
      setVisible(nextVisible);
    } finally {
      setSaving(false);
    }
  };

  if (!isOwner && !loading && !visible) return null;

  return (
    <section className="w-full border-t border-white/10 pt-8">
      <motion.div
        {...{
          className:
            "w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-7",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
            <span className="inline-flex rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-2 text-emerald-300">
              <Github className="h-4 w-4" />
            </span>
            GitHub activity
          </p>

          {isOwner && (
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              disabled={saving}
              onClick={updateVisibility}
              className="inline-flex items-center gap-2.5 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200 disabled:cursor-wait disabled:opacity-60"
            >
              <span>{visible ? "Shown publicly" : "Hidden publicly"}</span>
              <span className={`relative h-5 w-9 rounded-full border transition-colors ${visible ? "border-emerald-400/40 bg-emerald-500" : "border-white/10 bg-zinc-700"}`}>
                <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${visible ? "translate-x-4" : "translate-x-0"}`} />
              </span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-7 flex h-36 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-zinc-500">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Loading activity
          </div>
        ) : !visible ? (
          <div className="mt-7 rounded-2xl border border-dashed border-white/10 bg-black/15 px-5 py-10 text-center text-sm text-zinc-500">
            This heatmap is hidden from public visitors.
          </div>
        ) : !available || !calendar ? (
          <div className="mt-7 rounded-2xl border border-dashed border-white/10 bg-black/15 px-5 py-10 text-center text-sm text-zinc-500">
            GitHub contribution activity is currently unavailable.
          </div>
        ) : (
          <>
            <div className="mt-8 overflow-x-auto pb-2">
              <div className="flex w-full min-w-[760px] gap-2">
                <div className="grid grid-rows-7 gap-1 pr-1 text-[9px] text-zinc-600">
                  {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => (
                    <span key={`${label}-${index}`} className="flex w-5 items-center justify-end">
                      {label}
                    </span>
                  ))}
                </div>
                <div
                  className="grid min-w-0 flex-1 gap-1"
                  style={{ gridTemplateColumns: `repeat(${calendar.weeks.length}, minmax(10px, 1fr))` }}
                >
                  {calendar.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-rows-7 gap-1">
                      {week.contributionDays.map((day) => (
                        <span
                          key={day.date}
                          className="aspect-square w-full rounded-[3px] border border-white/[0.05] transition-transform duration-150 hover:scale-125"
                          style={{
                            backgroundColor: day.contributionCount === 0
                              ? LEGEND_COLORS[0]
                              : day.color,
                          }}
                          title={`${day.contributionCount} contributions on ${day.date}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.08] pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span>{calendar.totalContributions.toLocaleString()} contributions in the last year</span>
              <div className="flex items-center gap-2" aria-label="Contribution intensity from less to more">
                <span>Less</span>
                <span className="flex gap-1">
                  {LEGEND_COLORS.map((color) => (
                    <span
                      key={color}
                      className="h-3 w-3 rounded-[3px] border border-white/[0.06]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span>More</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
