"use client"

import { motion } from "framer-motion"
import CurrentOrganization from "../components/CurrentOrganization"
import NameBlock from "../components/NameBlock"
import ProfileImage from "../components/ProfileImage"

function InfoCard() {
  return (
    <motion.div
      {...{className:"w-full rounded-xl bg-slate-800/50 border border-slate-700 shadow-lg p-6 sm:p-8 backdrop-blur-sm"}}
      whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ProfileImage />
          <NameBlock />
        </div>
        <CurrentOrganization />
      </div>
    </motion.div>
  )
}

export default InfoCard
