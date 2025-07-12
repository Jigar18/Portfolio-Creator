"use client"

import type React from "react"

import { useState, useRef, useId, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"

// Implement the useOutsideClick hook directly in this file
function useOutsideClick(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains(event.target as Node)) {
        return
      }
      handler()
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

interface Card {
  title: string
  pdfUrl: string
  description: string
}

interface CertificateProps {
  cards?: Card[]
}

export default function Certificate({ cards = [] }: CertificateProps) {
  const [active, setActive] = useState<Card | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setActive(null))

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...{className:"fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-sm",
            onClick:() => setActive(null)}}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
                {...{className:"absolute top-10 w-[90%] max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-2xl flex flex-col border-2 border-white dark:border-slate-700",
                onClick:(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}}
            >
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{active.title}</h2>
                  </div>

                  {/* PDF Viewer */}
                  <div className="mb-8 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden h-[60vh]">
                    <embed
                      src={`${active.pdfUrl}#toolbar=0`}
                      height="100%"
                      width="100%"
                      className="object-contain"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-600 dark:text-slate-300">{active.description}</p>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700/50"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="space-y-3">
        {cards && cards.length > 0 ? (
          cards.map((card) => (
            <motion.li
              key={`card-${card.title}-${id}`}
              {...{className:"flex items-center gap-3 p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg cursor-pointer border border-slate-600 transition-colors",
              onClick:() => setActive(card)}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-shrink-0">
                <Image
                  width={40}
                  height={40}
                  src="/icons8-certificate-64.png"
                  alt={card.title}
                  className="rounded object-cover"
                />
              </div>

              <h3 className="font-medium text-slate-200">{card.title}</h3>
            </motion.li>
          ))
        ) : (
          <li className="p-4 text-center text-slate-400">No certificates available</li>
        )}
      </ul>
      {typeof window !== "undefined" &&
        (() => {
          const modalRoot = document.body
          if (modalRoot && active) {
            // The modal will be rendered here
          }
        })()}
    </>
  )
}
