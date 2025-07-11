"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Edit3, Search } from "lucide-react";

interface UserSkills {
  skills: string[];
}

export default function Skills() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchUserSkills = useCallback(async () => {
    try {
      const response = await fetch("/api/getUserSkills");
      if (response.ok) {
        const data: UserSkills = await response.json();
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchUserSkills();
  }, [fetchUserSkills]);

  useEffect(() => {
    if (skillInput.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const result = await fetch(`/api/skills?skill=${skillInput}`);
        const data = await result.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [skillInput]);

  const handleEditClick = () => {
    setTempSkills([...skills]);
    setIsEditModalOpen(true);
  };

  const addSkill = (skill: string) => {
    if (!tempSkills.includes(skill)) {
      setTempSkills([...tempSkills, skill]);
      setSkillInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setTempSkills(tempSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleSaveSkills = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/skillsToDB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: tempSkills }),
      });

      if (response.ok) {
        setSkills([...tempSkills]);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    } finally {
      setSaving(false);
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  if (loading) {
    return (
      <motion.div
        {...{
          className:
            "rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Skills</h3>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 bg-slate-700 rounded-full w-16"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        {...{
          className:
            "rounded-lg border border-slate-700 bg-slate-800/50 backdrop-blur-sm p-6 group hover:border-slate-600 transition-all duration-300",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Skills</h3>
          <button
            onClick={handleEditClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          <motion.div {...{ className: "flex flex-wrap gap-2" }}>
            {skills.map((skill) => (
              <motion.span
                key={skill}
                variants={skillVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                {...{
                  className:
                    "px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-600/30 hover:bg-blue-600/30 transition-colors",
                }}
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>

        {skills.length === 0 && (
          <p className="text-slate-400 text-sm">No skills added yet.</p>
        )}
      </motion.div>

      {mounted &&
        isEditModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                    <span className="p-2 bg-blue-600/20 rounded-lg">
                      <Edit3 className="h-5 w-5" />
                    </span>
                    Edit Skills
                  </h2>
                  <button
                    className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Add Skills
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Search for skills..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    {showSuggestions &&
                      (suggestions.length > 0 || isSearching) && (
                        <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {isSearching && (
                            <div className="px-4 py-2 text-slate-400 text-sm flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                              Searching...
                            </div>
                          )}
                          {suggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => addSkill(suggestion)}
                              className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700 transition-colors text-sm"
                              disabled={tempSkills.includes(suggestion)}
                            >
                              {suggestion}
                              {tempSkills.includes(suggestion) && (
                                <span className="ml-2 text-xs text-slate-400">
                                  (already added)
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Current Skills ({tempSkills.length})
                  </label>
                  <AnimatePresence>
                    <div className="flex flex-wrap gap-2 min-h-[3rem] p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                      {tempSkills.length === 0 ? (
                        <p className="text-slate-400 text-sm py-2">
                          No skills selected yet.
                        </p>
                      ) : (
                        tempSkills.map((skill) => (
                          <motion.span
                            key={skill}
                            variants={skillVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            {...{
                              className:
                                "inline-flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-600/30",
                            }}
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))
                      )}
                    </div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSkills}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
