"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface AddProjectCardProps {
  index: number;
  onAddProject: () => void;
}

export default function AddProjectCard({ onAddProject }: AddProjectCardProps) {
  return (
    <motion.div
      {...{className: "bg-white/[0.025] rounded-2xl border-2 border-dashed border-white/15 hover:border-white/30 shadow-md cursor-pointer transition-colors duration-300 flex items-center justify-center min-h-[280px]",
      onClick: onAddProject}}
      whileHover={{ y: -5, borderColor: "#a1a1aa" }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        {...{className:"flex flex-col items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors"}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="p-4 bg-slate-700/30 rounded-full">
          <Plus className="h-8 w-8" />
        </div>
        <span className="text-sm font-medium">Add New Project</span>
      </motion.div>
    </motion.div>
  );
}
