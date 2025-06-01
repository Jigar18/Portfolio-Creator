"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Search, Github, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  tags: string[];
  github: string;
  githubUrl: string;
  liveUrl: string;
  videoUrl?: string;
  longDescription?: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Omit<Project, "id">) => void;
  userSkills: string[];
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onAddProject,
  userSkills,
}: AddProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Filter user skills based on search query
  const filteredSkills = userSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setVideoFile(null);
    setSelectedSkills([]);
    setSkillSearchQuery("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Project description is required";
    }

    if (!githubUrl.trim()) {
      newErrors.githubUrl = "GitHub URL is required";
    } else if (!isValidUrl(githubUrl)) {
      newErrors.githubUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate video upload if file exists
      let videoUrl = "";
      if (videoFile) {
        // In a real app, you would upload the video to a service like AWS S3 or similar
        videoUrl = URL.createObjectURL(videoFile);
      }

      const newProject: Omit<Project, "id"> = {
        title: title.trim(),
        description: description.trim(),
        techStack: selectedSkills,
        image: "/placeholder.svg?height=400&width=600", // Default placeholder
        tags: selectedSkills,
        github: githubUrl.trim(),
        githubUrl: githubUrl.trim(),
        liveUrl: githubUrl.trim(), // Using GitHub URL as default live URL
        videoUrl: videoUrl || undefined,
        longDescription: description.trim(),
      };

      onAddProject(newProject);
      handleClose();
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearchQuery("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        alert("Please select a valid video file");
      }
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            {...{className:"fixed inset-0 bg-black/50 backdrop-blur-sm",
            onClick:handleClose}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            {...{className:"relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-700/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"}}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border-b border-slate-700/50 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-900/20 rounded-lg shadow-lg shadow-blue-500/20 border border-blue-800/30">
                    <Plus className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    Add New Project
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-300 transition-colors border border-slate-700/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Project Title */}
                <div className="space-y-3">
                  <Label
                    htmlFor="title"
                    className="text-slate-200 font-medium flex items-center gap-2"
                  >
                    <span className="inline-flex p-1 rounded bg-emerald-900/20 text-emerald-400 border border-emerald-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </span>
                    Project Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your project title"
                    className="bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Project Description */}
                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-slate-200 font-medium flex items-center gap-2"
                  >
                    <span className="inline-flex p-1 rounded bg-purple-900/20 text-purple-400 border border-purple-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                    </span>
                    Project Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project, its features, and what makes it special..."
                    rows={4}
                    className="bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="space-y-4">
                  <Label className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="inline-flex p-1 rounded bg-cyan-900/20 text-cyan-400 border border-cyan-800/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m18 16 4-4-4-4" />
                        <path d="m6 8-4 4 4 4" />
                        <path d="m14.5 4-5 16" />
                      </svg>
                    </span>
                    Tech Stack
                  </Label>

                  {userSkills.length > 0 ? (
                    <div className="space-y-4">
                      {/* Selected Skills */}
                      {selectedSkills.length > 0 && (
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                          <p className="text-slate-300 text-sm mb-3 font-medium">
                            Selected Technologies:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill) => (
                              <motion.span
                                key={skill}
                                {...{className:"inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 shadow-sm"}}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleSkillRemove(skill)}
                                  className="ml-1 p-0.5 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search Input */}
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <input
                            ref={inputRef}
                            type="text"
                            value={skillSearchQuery}
                            onChange={(e) =>
                              setSkillSearchQuery(e.target.value)
                            }
                            placeholder="Search your skills..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          />
                        </div>
                      </div>

                      {/* Available Skills */}
                      <div className="space-y-3">
                        <p className="text-slate-300 text-sm font-medium">
                          Available Skills:
                        </p>
                        <div className="max-h-40 overflow-y-auto p-3 bg-slate-800/20 rounded-lg border border-slate-700/30">
                          {skillSearchQuery === "" ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {userSkills
                                .filter(
                                  (skill) => !selectedSkills.includes(skill)
                                )
                                .map((skill) => (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleSkillSelect(skill)}
                                    className="text-left px-3 py-2 text-slate-300 hover:text-slate-100 bg-slate-700/30 hover:bg-slate-600/50 rounded-md transition-all text-sm border border-slate-600/30 hover:border-slate-500/50"
                                  >
                                    {skill}
                                  </button>
                                ))}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredSkills.length > 0 ? (
                                filteredSkills.map((skill) => (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleSkillSelect(skill)}
                                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-slate-100 hover:bg-slate-600/50 rounded-md transition-colors"
                                  >
                                    {skill}
                                  </button>
                                ))
                              ) : (
                                <p className="text-slate-400 text-sm italic px-3 py-2">
                                  {`No skills found matching "${skillSearchQuery}"`}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-lg text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-amber-900/20 rounded-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-amber-400"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="m12 17 .01 0" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-300 font-medium mb-1">
                            No Skills Available
                          </p>
                          <p className="text-slate-400 text-sm">
                            Add skills to your profile first to select tech
                            stack for projects.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Upload (Optional) */}
                <div className="space-y-3">
                  <Label className="text-slate-200 font-medium flex items-center gap-2">
                    <span className="inline-flex p-1 rounded bg-green-900/20 text-green-400 border border-green-800/30">
                      <Upload className="h-3 w-3" />
                    </span>
                    Project Demo Video (Optional)
                  </Label>
                  <div className="space-y-3">
                    {!videoFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500/50 transition-colors bg-slate-800/20"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-green-900/20 rounded-full">
                            <Upload className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-slate-300 font-medium">
                              Upload Demo Video
                            </p>
                            <p className="text-slate-400 text-sm mt-1">
                              Click to browse or drag and drop
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              Supports MP4, WebM, AVI formats
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-800/30 border border-slate-600/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-900/20 rounded-lg">
                              <Upload className="h-4 w-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-slate-100 text-sm font-medium">
                                {videoFile.name}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="p-1 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* GitHub URL */}
                <div className="space-y-3">
                  <Label
                    htmlFor="githubUrl"
                    className="text-slate-200 font-medium flex items-center gap-2"
                  >
                    <span className="inline-flex p-1 rounded bg-slate-700/50 text-slate-300 border border-slate-600/30">
                      <Github className="h-3 w-3" />
                    </span>
                    GitHub Repository URL{" "}
                    <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="githubUrl"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className="pl-10 bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {errors.githubUrl && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.githubUrl}
                    </p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-700/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-all"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding Project...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Project
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
