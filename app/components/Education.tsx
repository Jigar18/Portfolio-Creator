"use client"

import { motion } from "framer-motion"

export default function Education() {
  const education = [
    {
      school: "Sharda University",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      years: "2022 - 2026",
    },
    {
      school: "Delhi Public School",
      degree: "High School",
      field: "Science",
      years: "2020 - 2022",
    },
  ]

  return (
    <motion.div
      {...{className:"bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md"}}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
        <span className="inline-flex p-2 rounded-lg bg-indigo-900/20 text-indigo-400 shadow-lg shadow-indigo-500/20 border border-indigo-800/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-graduation-cap"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </span>
        Education
      </h2>

      <div className="space-y-4">
        {education.map((item, index) => (
          <motion.div
            key={index}
            {...{className: "border-l-2 border-blue-500 pl-4 py-1"}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h3 className="text-lg font-medium text-slate-100">{item.school}</h3>
            <p className="text-blue-400">
              {item.degree} in {item.field}
            </p>
            <p className="text-slate-400 text-sm">{item.years}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
