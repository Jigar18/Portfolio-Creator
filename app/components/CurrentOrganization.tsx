"use client";

import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";

export default function CurrentOrganization() {
  const { userDetails, loading } = useUser();

  const formatCollegeName = (name: string) => {
    return name.toUpperCase();
  };

  if (loading) {
    return (
      <motion.div
        {...{
          className:
            "bg-blue-600/20 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2",
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-400/30 rounded animate-pulse" />
        </div>
        <div className="h-5 w-32 bg-blue-300/30 rounded animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      {...{
        className:
          "bg-blue-600/20 border border-blue-500/30 rounded-lg px-4 py-2 flex items-center gap-2",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-blue-400"
        >
          <path d="M2 22h20"></path>
          <path d="M18 2H6l-4 4v10h20V6l-4-4Z"></path>
          <path d="M14 2v4h-4V2"></path>
          <path d="M18 16h2"></path>
          <path d="M4 16h2"></path>
          <path d="M10 16h4"></path>
        </svg>
      </div>
      <h2 className="font-medium text-blue-300">
        {userDetails?.college
          ? formatCollegeName(userDetails.college)
          : "UNIVERSITY"}
      </h2>
    </motion.div>
  );
}
