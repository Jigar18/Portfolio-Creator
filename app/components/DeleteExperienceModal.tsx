"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

interface ExperienceSummary {
  company: string;
  position: string;
}

interface DeleteExperienceModalProps {
  experience: ExperienceSummary | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteExperienceModal({
  experience,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteExperienceModalProps) {
  if (!experience || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...{
          className:
            "fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
          onClick: isDeleting ? undefined : onClose,
          role: "presentation",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          {...{
            className:
              "w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl",
            onClick: (event: React.MouseEvent<HTMLDivElement>) =>
              event.stopPropagation(),
            role: "alertdialog",
            "aria-modal": true,
            "aria-labelledby": "delete-experience-title",
            "aria-describedby": "delete-experience-description",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h3
                id="delete-experience-title"
                className="text-lg font-semibold text-slate-100"
              >
                Delete Experience
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded p-1 text-slate-400 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close delete confirmation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div id="delete-experience-description" className="mb-6">
            <p className="mb-2 text-slate-300">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-100">
                {`"${experience.position} at ${experience.company}"`}
              </span>
              ?
            </p>
            <p className="text-sm text-slate-400">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Experience"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
