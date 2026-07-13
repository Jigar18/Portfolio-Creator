import type { ReactNode } from "react";

export const credentialEditButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/80 text-slate-300 opacity-100 transition-all duration-200 hover:scale-105 hover:bg-slate-600 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:opacity-0 sm:group-hover:opacity-100";

interface CredentialCardHeaderProps {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
}

export default function CredentialCardHeader({
  title,
  icon,
  action,
}: CredentialCardHeaderProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-700">
      <h2 className="flex min-w-0 items-center gap-3 text-xl font-bold text-slate-100">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800/30 bg-zinc-900/20 text-zinc-400 shadow-lg shadow-zinc-500/10">
          {icon}
        </span>
        <span className="truncate">{title}</span>
      </h2>
      {action}
    </div>
  );
}
