"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../context/UserContext";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: "-100px",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [tempAboutText, setTempAboutText] = useState(aboutText);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { userDetails, loading: userLoading, updateUserDetails } = useUser();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (userDetails?.about) {
      setAboutText(userDetails.about);
    }
  }, [userDetails]);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/updateUserDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ about: tempAboutText }),
      });

      const data = await response.json();

      if (data.success) {
        setAboutText(tempAboutText);
        updateUserDetails({ about: tempAboutText });
        setIsEditModalOpen(false);
      } else {
        console.error("Failed to update about text:", data.error);
      }
    } catch (error) {
      console.error("Error updating about text:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setTempAboutText(aboutText);
    setIsEditModalOpen(false);
  };

  const handleOpenModal = () => {
    setTempAboutText(aboutText);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div ref={ref} className="w-full">
        <motion.div
          {...{
            className:
              "bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md backdrop-blur-sm overflow-hidden relative group",
            initial: { y: 50, opacity: 0 },
            animate: isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 },
            transition: { duration: 0.8, ease: "easeOut" },
            whileHover: { y: -5 },
          }}
        >
          {/* Edit Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
            onClick={handleOpenModal}
            type="button"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <h2 className="text-2xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2 flex items-center gap-3">
            <span className="inline-flex p-2 rounded-lg bg-emerald-900/20 text-emerald-400 shadow-lg shadow-emerald-500/20 border border-emerald-800/30">
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
                className="lucide lucide-user"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            About Me
          </h2>

          {userLoading ? (
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {aboutText ||
                "Click the edit button to add information about yourself..."}
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {mounted &&
        isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                onClick={handleCloseModal}
                aria-label="Close modal"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <span className="bg-emerald-900/20 p-1.5 rounded text-emerald-400">
                    <Edit3 className="h-5 w-5" />
                  </span>
                  Edit About Section
                </h2>

                {/* Text Area */}
                <div className="mb-6">
                  <label
                    htmlFor="about-text"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    About Me ({tempAboutText.length}/1000 characters)
                  </label>
                  <textarea
                    id="about-text"
                    value={tempAboutText}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) {
                        setTempAboutText(e.target.value);
                      }
                    }}
                    placeholder="Write something about yourself..."
                    className="w-full h-40 p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Tip: Use line breaks to create paragraphs. Your formatting
                    will be preserved.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
