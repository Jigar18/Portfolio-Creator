"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  projects: Project[];
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
  projects,
}: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleNext = useCallback(() => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, projects.length]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (project) {
      const index = projects.findIndex((p) => p.id === project.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [project, projects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, projects.length, onClose, handleNext, handlePrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!projects || !projects.length || currentIndex >= projects.length) {
    return null;
  }

  const currentProject = projects[currentIndex];

  const demoTechStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
    "Redux",
    "Framer Motion",
    "Jest",
    "Cypress",
    "Docker",
    "AWS",
    "Firebase",
    "Vercel",
  ];

  const additionalTechStack = demoTechStack
    .filter((tech) => !currentProject.techStack?.includes(tech))
    .slice(0, 5); //
  return (
    <AnimatePresence>
      {isOpen && currentProject && (
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
            {...{className:"relative w-[85%] max-w-5xl bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-700",
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

            <div className="flex flex-col h-[85vh] max-h-[85vh] overflow-y-auto">
              {/* Header section with title and navigation */}
              <div className="p-8 border-b border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-slate-400 flex items-center">
                    <span className="mr-2">
                      Project {currentIndex + 1} of {projects.length}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-slate-300 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === projects.length - 1}
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-slate-300 disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="relative mb-2">
                  <h3 className="text-3xl font-bold text-slate-100">
                    {currentProject.title}
                  </h3>
                  <motion.div
                    {...{className:"absolute -bottom-1 left-0 h-[3px] bg-blue-500 rounded-full"}}
                    initial={{ width: 0 }}
                    animate={{ width: "60px" }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="p-8 flex flex-col">
                {/* 1. Description */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-slate-100 mb-3 flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-md bg-blue-900/20 text-blue-400 shadow-md shadow-blue-500/20 border border-blue-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-file-text"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" x2="8" y1="13" y2="13" />
                        <line x1="16" x2="8" y1="17" y2="17" />
                        <line x1="10" x2="8" y1="9" y2="9" />
                      </svg>
                    </span>
                    About this project
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {currentProject.longDescription ||
                      currentProject.description}
                  </p>
                </div>

                {/* 2. Tech stack */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-slate-100 mb-3 flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-md bg-purple-900/20 text-purple-400 shadow-md shadow-purple-500/20 border border-purple-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-code-2"
                      >
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                    </span>
                    Tech Stack Used
                  </h4>

                  {/* Project's actual tech stack */}
                  {currentProject.techStack &&
                    currentProject.techStack.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {currentProject.techStack.map((tech, index) => (
                            <motion.span
                              key={tech}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              {...{className:"bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-300 px-3 py-1.5 rounded-md text-sm border border-blue-500/30 shadow-sm"}}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Additional tech stack examples */}
                  {additionalTechStack.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-3">
                        Other technologies you might like:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {additionalTechStack.map((tech, index) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05 + 0.3,
                            }}
                            {...{className:"bg-slate-800/50 text-slate-400 px-3 py-1.5 rounded-md text-sm border border-slate-700/30 hover:border-slate-600/50 transition-colors"}}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Demo video/image with appropriate height */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-slate-100 mb-3 flex items-center gap-2">
                    <span className="inline-flex p-1.5 rounded-md bg-green-900/20 text-green-400 shadow-md shadow-green-500/20 border border-green-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-play"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                    Project Demo
                  </h4>
                  <div className="w-full overflow-hidden rounded-lg border border-slate-700/50 shadow-lg">
                    {currentProject.videoUrl ? (
                      <div
                        className="relative w-full"
                        style={{ height: "350px" }}
                      >
                        <iframe
                          src={currentProject.videoUrl}
                          className="w-full h-full"
                          title={currentProject.title}
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="w-full" style={{ height: "350px" }}>
                        <Image
                          src={currentProject.image || "/placeholder.svg"}
                          alt={currentProject.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. GitHub button centered at bottom */}
                <div className="flex justify-center mt-4">
                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-6 rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="h-4 w-4" />
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700/50 bg-slate-800/20 flex justify-between items-center">
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  variant="outline"
                  className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={currentIndex === projects.length - 1}
                  variant="outline"
                  className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
