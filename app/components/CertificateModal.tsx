"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Card {
  id: string
  title: string
  pdfUrl: string
  description: string
}

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  certificate: Card | null
  certificates: Card[]
}

export default function CertificateModal({ isOpen, onClose, certificate, certificates }: CertificateModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  // Set the current index when the certificate changes
  useEffect(() => {
    if (certificate) {
      const index = certificates.findIndex((cert) => cert.id === certificate.id)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [certificate, certificates])

  const handleNext = useCallback(() => {
    if (currentIndex < certificates.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, certificates.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, certificates.length, onClose, handleNext, handlePrevious])

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, []);

  if (!certificates.length || currentIndex >= certificates.length) {
    return null
  }

  const currentCertificate = certificates[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && currentCertificate && (
        <motion.div
          {...{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
          onClick:onClose}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Modal Content */}
          <motion.div
            {...{className:"relative w-[90%] max-w-5xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700",
            onClick:(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <Button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              onClick={onClose}
              aria-label="Close modal"
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Certificate viewer - Vertical layout */}
            <div className="flex flex-col h-[80vh] max-h-[80vh]">
              {/* PDF viewer on top */}
              <div className="flex-1 bg-slate-800 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <iframe
                    src={`/api/view-pdf?file=${currentCertificate.pdfUrl}`}
                    className="w-full h-full"
                    title={currentCertificate.title}
                  />
                  {/* Fallback for when iframe doesn't work */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 pointer-events-none">
                    <p className="text-slate-400 text-center p-4">
                      PDF preview not available. Please download to view.
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate info below */}
              <div className="w-full p-6 bg-slate-800/50 border-t border-slate-700">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-100 mb-2 flex items-center gap-3">
                      <span className="inline-flex p-2 rounded-lg bg-orange-900/20 text-orange-400 shadow-lg shadow-orange-500/20 border border-orange-800/30">
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
                          className="lucide lucide-award"
                        >
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </span>
                      {currentCertificate.title}
                    </h2>
                  </div>
                  <p className="text-slate-300 text-sm mb-6">{currentCertificate.description}</p>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="outline"
                        className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === certificates.length - 1}
                        variant="outline"
                        className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 disabled:opacity-50"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-center text-sm text-slate-400">
                      {currentIndex + 1} of {certificates.length}
                    </div>

                    <a
                      href={`/api/download?file=${currentCertificate.pdfUrl}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                      download
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Certificate</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
