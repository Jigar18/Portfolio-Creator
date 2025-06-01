"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Edit3, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Skills() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [tempSkills, setTempSkills] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState([
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Docker",
    "AWS",
    "Redux",
    "Express",
    "Python",
    "Java",
    "C++",
    "HTML/CSS",
    "REST API",
    "CI/CD",
  ]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      if (skillInput.length >= 2) {
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
      } else {
        setSuggestions([]);
      }
    };

    if (isEditModalOpen) {
      fetchSkills();
    }
  }, [skillInput, isEditModalOpen]);

  const handleOpenModal = () => {
    setTempSkills([...skills]);
    setSkillInput("");
    setSuggestions([]);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempSkills([]);
    setSkillInput("");
    setSuggestions([]);
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = () => {
    setSkills([...tempSkills]);
    handleCloseModal();
  };

  const handleSkillSelect = (skill: string) => {
    if (!tempSkills.includes(skill)) {
      setTempSkills([...tempSkills, skill]);
      setSkillInput("");
      setSuggestions([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempSkills(tempSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddCustomSkill = () => {
    if (skillInput.trim() && !tempSkills.includes(skillInput.trim())) {
      setTempSkills([...tempSkills, skillInput.trim()]);
      setSkillInput("");
      setSuggestions([]);
    }
  };

  return (
    <>
      <motion.div
        {...{
          className:
            "bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md backdrop-blur-sm relative group",
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Edit Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          onClick={handleOpenModal}
          type="button"
        >
          <Edit3 className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2 flex items-center gap-3">
          <span className="inline-flex p-2 rounded-lg bg-slate-700/30 text-slate-300 shadow-lg shadow-slate-500/10 border border-slate-600/50">
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
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m7 12 2 2 4-4" />
            </svg>
          </span>
          Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.span
              key={skill}
              {...{
                className:
                  "bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(37, 99, 235, 0.2)",
                borderColor: "rgba(37, 99, 235, 0.5)",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>

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
                  <span className="bg-slate-700/50 p-1.5 rounded text-slate-300">
                    <Edit3 className="h-5 w-5" />
                  </span>
                  Edit Skills
                </h2>

                {/* Skills input */}
                <div className="relative mb-6">
                  <Label
                    htmlFor="skills"
                    className="text-slate-300 font-medium text-base mb-3 block"
                  >
                    Add your skills
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="h-4 w-4" />
                    </div>
                    <Input
                      ref={inputRef}
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-800 text-slate-200"
                      placeholder="Type to search skills (e.g. React, TypeScript)"
                      autoComplete="off"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isSearching ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
                      ) : (
                        skillInput && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-full transition-colors"
                            onClick={() => setSkillInput("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Suggestions dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        {...{
                          initial: { opacity: 0, y: -5 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: -5 },
                          transition: { duration: 0.2 },
                          className:
                            "absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50",
                        }}
                      >
                        {suggestions.map((skill) => (
                          <button
                            key={skill}
                            className="w-full px-4 py-3 text-left text-slate-200 hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                            onClick={() => handleSkillSelect(skill)}
                          >
                            {skill}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add custom skill button */}
                  {skillInput && !suggestions.length && !isSearching && (
                    <motion.div
                      {...{
                        initial: { opacity: 0, y: -5 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -5 },
                        className: "mt-3",
                      }}
                    >
                      <Button
                        variant="outline"
                        onClick={handleAddCustomSkill}
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {`Add "${skillInput}" as custom skill`}
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Selected skills */}
                <div className="mb-6">
                  <Label className="text-slate-300 font-medium text-base mb-3 block">
                    Your skills ({tempSkills.length})
                  </Label>
                  <div className="flex flex-wrap gap-2.5 mt-3 min-h-[50px] p-3 bg-slate-800 rounded-lg border border-slate-700">
                    {tempSkills.length === 0 && (
                      <div className="text-slate-500 italic">
                        No skills added yet. Search and add skills above.
                      </div>
                    )}
                    <AnimatePresence>
                      {tempSkills.map((skill) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          key={skill}
                          {...{className:"relative group"}}
                        >
                          
                          <span className="inline-flex items-center gap-1 bg-slate-600 text-white px-3 py-1 rounded-full text-sm">
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 p-0.5 rounded-full hover:bg-red-500 transition-colors"
                              aria-label={`Remove ${skill}`}
                              >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
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
                    className="bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
                      />
                    </svg>
                    Save Changes
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
