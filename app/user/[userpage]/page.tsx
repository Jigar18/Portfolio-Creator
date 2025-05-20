"use client"

import { motion } from "framer-motion"
import About from "../../sections/AboutSection"
import Credentials from "../../sections/Credentials"
import Experience from "../../sections/Experiance"
import InfoCard from "../../sections/InfoCard"
import Projects from "../../sections/Projects"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <main className="mx-auto w-full max-w-6xl space-y-10 text-slate-200 py-8 px-4 sm:px-6 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <InfoCard />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            {...{className:"lg:col-span-8 space-y-10"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <About />
            <Projects />
          </motion.div>

          <motion.div
            {...{className:"lg:col-span-4"}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Credentials />
          </motion.div>
        </div>

        <Experience />

        <footer className="py-6 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Jigar Karangiya. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
