"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface DeleteProjectVideoModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProjectVideoModal({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteProjectVideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...{
            className: "fixed inset-0 z-[180] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
            onClick: isDeleting ? undefined : onClose,
            role: "presentation",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...{
              className: "w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl",
              onClick: (event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation(),
              role: "alertdialog",
              "aria-modal": true,
              "aria-labelledby": "delete-project-video-title",
              "aria-describedby": "delete-project-video-description",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-red-500/10 p-2"><AlertTriangle className="h-5 w-5 text-red-400" /></span>
                <h3 id="delete-project-video-title" className="text-lg font-semibold text-slate-100">Delete Demo Video</h3>
              </div>
              <button type="button" onClick={onClose} disabled={isDeleting} aria-label="Close delete confirmation" className="rounded p-1 text-slate-400 transition hover:text-slate-200 disabled:opacity-50"><X className="h-5 w-5" /></button>
            </div>

            <div id="delete-project-video-description" className="mb-6">
              <p className="mb-2 text-slate-300">Are you sure you want to remove this project demo video?</p>
              <p className="text-sm text-slate-400">The video will be permanently removed when the project changes are saved.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={isDeleting} className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition hover:border-slate-500 hover:text-slate-100 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={onConfirm} disabled={isDeleting} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">{isDeleting ? "Removing..." : "Delete Video"}</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
