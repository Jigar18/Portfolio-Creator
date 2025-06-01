"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const globalStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
    -webkit-text-fill-color: #e2e8f0 !important;
    transition: background-color 5000s ease-in-out 0s;
    caret-color: #e2e8f0;
  }
`;

const inputClassName =
  "w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200";

export default function SkillsPage() {
  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

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

    fetchSkills();
  }, [skillInput, selectedSkills]);

  const handleSkillSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillInput("");
      setSuggestions([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleAddCustomSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput("");
      setSuggestions([]);
    }
  };

  return (
    <>
      <style jsx global>
        {globalStyles}
      </style>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
          <div className="p-8">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold text-slate-100 mb-3">
                {"What skills do you have?"}
              </h1>
              <p className="text-slate-400 max-w-md mx-auto">
                {
                  "Add your technical skills, programming languages, frameworks, and tools you're proficient with."
                }
              </p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              {/* Skills input */}
              <div className="relative">
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
                    className={`${inputClassName} pl-10 pr-10`}
                    placeholder="Type to search skills (e.g. React, TypeScript)"
                    autoComplete="off"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                    ) : (
                      skillInput && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 rounded-full transition-colors"
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
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      {...{
                        className:
                          "absolute left-0 right-0 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-[220px] overflow-y-auto z-10 mt-3",
                      }}
                    >
                      <ul className="py-1 divide-y divide-slate-700/50">
                        {suggestions.map((skill, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            {...{
                              className:
                                "px-4 py-3 hover:bg-slate-700 cursor-pointer text-slate-200 text-sm transition-colors flex items-center",
                              onClick: () => handleSkillSelect(skill),
                            }}
                          >
                            <span className="flex-1">{skill}</span>
                            <span className="bg-slate-700/50 hover:bg-blue-600/30 p-1 rounded-full text-blue-400 transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Add custom skill button */}
                {skillInput && !suggestions.length && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    {...{ className: "mt-3" }}
                  >
                    <Button
                      onClick={handleAddCustomSkill}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 w-full justify-start rounded-md transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2 text-blue-400" />
                      {`Add "${skillInput}" as a new skill`}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Selected skills */}
              <div className="mt-8">
                <Label className="text-slate-300 font-medium text-base mb-3 block">
                  Your skills
                </Label>
                <div className="flex flex-wrap gap-2.5 mt-3 min-h-[50px]">
                  {selectedSkills.length === 0 && (
                    <div className="flex items-center w-full">
                      <p className="text-slate-500 text-sm italic">
                        No skills added yet
                      </p>
                    </div>
                  )}
                  <AnimatePresence>
                    {selectedSkills.map((skill) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: 5 }}
                        transition={{ duration: 0.2 }}
                        {...{
                          className:
                            "bg-slate-800 border border-slate-700 rounded-full px-3.5 py-1.5 flex items-center gap-2 group hover:border-blue-500/50 transition-colors",
                        }}
                      >
                        <span className="text-slate-200 text-sm">{skill}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 text-slate-500 hover:text-blue-400 hover:bg-slate-700/50 rounded-full opacity-80 group-hover:opacity-100 transition-all"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Continue button */}
              <div className="mt-12 flex justify-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md transition-colors"
                  disabled={selectedSkills.length === 0}
                  onClick={() => {
                    fetch("/api/skillsToDB", {
                      method: "POST",
                      headers: {
                        "Content-type": "application/json",
                      },
                      body: JSON.stringify(selectedSkills),
                    });
                    router.push("/profile-picture");
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
