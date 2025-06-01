"use client"

import { motion } from "framer-motion"

export default function NameBlock() {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <motion.h1
        {...{className:"text-3xl sm:text-4xl font-bold text-slate-100"}}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Jigar Rajput
      </motion.h1>
      <motion.p
        {...{className:"text-lg text-blue-400 mt-1"}}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Software Engineer
      </motion.p>
    </div>
  )
}
