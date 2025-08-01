"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  BarChart2,
  Award,
  Briefcase,
  Code,
  Users,
  Clock,
  Zap,
  Edit3,
  X,
  Save,
  Calendar,
  Building,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExperienceItem {
  level: number;
  company: string;
  position: string;
  year: string;
  description: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  id?: string; // Add database ID for updates
}

interface DatabaseExperience {
  id: string;
  company: string;
  position: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrentRole: boolean;
  contributions: string[];
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: "-100px",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempOrganization, setTempOrganization] = useState("");
  const [tempRole, setTempRole] = useState("");
  const [tempStartMonth, setTempStartMonth] = useState("");
  const [tempStartYear, setTempStartYear] = useState("");
  const [tempEndMonth, setTempEndMonth] = useState("");
  const [tempEndYear, setTempEndYear] = useState("");
  const [tempIsCurrentRole, setTempIsCurrentRole] = useState(false);
  const [tempContributions, setTempContributions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getUserExperience");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.experiences) {
          // Transform database data to component format
          const transformedExperiences = data.experiences.map(
            (exp: DatabaseExperience, index: number) => ({
              level: index + 1,
              company: exp.company,
              position: exp.position,
              year: exp.isCurrentRole
                ? `${exp.startMonth} ${exp.startYear} - Present`
                : `${exp.startMonth} ${exp.startYear} - ${exp.endMonth} ${exp.endYear}`,
              description: exp.contributions.map(
                (contribution: string, idx: number) => ({
                  icon: getIconForIndex(idx),
                  text: contribution,
                })
              ),
              id: exp.id, // Store database ID for updates
            })
          );
          setExperience(transformedExperiences);
        } else {
          // If no experiences found, set empty array
          setExperience([]);
        }
      } else {
        console.error("Failed to fetch experiences");
        setExperience([]);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperience([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchExperiences();
    return () => setMounted(false);
  }, [fetchExperiences]);

  const getIconForIndex = (index: number) => {
    const icons = [
      <Briefcase
        className="h-5 w-5 text-blue-400"
        key={`briefcase-${index}`}
      />,
      <Code className="h-5 w-5 text-blue-400" key={`code-${index}`} />,
      <Users className="h-5 w-5 text-blue-400" key={`users-${index}`} />,
      <BarChart2 className="h-5 w-5 text-blue-400" key={`chart-${index}`} />,
      <Award className="h-5 w-5 text-blue-400" key={`award-${index}`} />,
      <Clock className="h-5 w-5 text-blue-400" key={`clock-${index}`} />,
      <Zap className="h-5 w-5 text-blue-400" key={`zap-${index}`} />,
      <CheckCircle2 className="h-5 w-5 text-blue-400" key={`check-${index}`} />,
    ];
    return icons[index % icons.length];
  };

  const [experience, setExperience] = useState<ExperienceItem[]>([]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const resetForm = () => {
    setTempOrganization("");
    setTempRole("");
    setTempStartMonth("");
    setTempStartYear("");
    setTempEndMonth("");
    setTempEndYear("");
    setTempIsCurrentRole(false);
    setTempContributions("");
  };

  const handleOpenModal = (index?: number) => {
    if (index !== undefined) {
      // Edit existing experience
      const exp = experience[index];
      setEditingIndex(index);
      setTempOrganization(exp.company);
      setTempRole(exp.position);

      // Parse year range
      const yearParts = exp.year.split(" - ");
      if (yearParts.length === 2) {
        const startParts = yearParts[0].trim().split(" ");
        if (startParts.length === 2) {
          setTempStartMonth(startParts[0]);
          setTempStartYear(startParts[1]);
        }

        if (yearParts[1].trim() === "Present") {
          setTempIsCurrentRole(true);
        } else {
          const endParts = yearParts[1].trim().split(" ");
          if (endParts.length === 2) {
            setTempEndMonth(endParts[0]);
            setTempEndYear(endParts[1]);
          }
        }
      }

      // Convert description array to string
      setTempContributions(exp.description.map((item) => item.text).join("\n"));
    } else {
      // Add new experience
      setEditingIndex(null);
      resetForm();
    }
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    resetForm();
    setEditingIndex(null);
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!tempOrganization || !tempRole || !tempStartMonth || !tempStartYear) {
      return;
    }

    try {
      setSaving(true);

      // Prepare the data for the API
      const contributionsArray = tempContributions
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim());

      const experienceData = {
        company: tempOrganization,
        position: tempRole,
        startMonth: tempStartMonth,
        startYear: tempStartYear,
        endMonth: tempIsCurrentRole ? null : tempEndMonth,
        endYear: tempIsCurrentRole ? null : tempEndYear,
        isCurrentRole: tempIsCurrentRole,
        contributions: contributionsArray,
      };

      if (editingIndex !== null) {
        // Update existing experience
        const existingExp = experience[editingIndex];
        const response = await fetch("/api/updateUserExperience", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: existingExp.id,
            ...experienceData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update experience");
        }
      } else {
        // Add new experience
        const response = await fetch("/api/updateUserExperience", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(experienceData),
        });

        if (!response.ok) {
          throw new Error("Failed to add experience");
        }
      }

      // Refresh the experiences from the database
      await fetchExperiences();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving experience:", error);
      // You could add a toast notification here to show the error to the user
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (index: number) => {
    const exp = experience[index];
    if (!exp.id) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/updateUserExperience?id=${exp.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete experience");
      }

      // Refresh the experiences from the database
      await fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        ref={ref}
        {...{ className: "w-full" }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          {...{
            className:
              "bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md backdrop-blur-sm relative group",
          }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        >
          {/* Edit Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
            onClick={() => handleOpenModal()}
            type="button"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2 flex items-center gap-3">
            <span className="inline-flex p-2 rounded-lg bg-blue-900/20 text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-800/30">
              <Briefcase className="h-5 w-5" />
            </span>
            Experience
          </h2>

          <div className="space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-400">
                  Loading experiences...
                </span>
              </div>
            ) : experience.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No experiences added yet</p>
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              experience.map((level, index) => (
                <motion.div
                  key={level.level}
                  {...{ className: "relative" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Timeline dot and line */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-600 z-10"></div>
                      {index < experience.length - 1 && (
                        <div className="w-0.5 bg-slate-600 h-full absolute top-4 left-[7px] -z-10"></div>
                      )}
                    </div>

                    {/* Experience card */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4 group">
                      <div className="bg-slate-700/50 rounded-lg p-4 md:w-64 flex-shrink-0 relative">
                        {/* Individual edit button for each experience */}
                        <button
                          className="absolute top-2 right-2 p-1 rounded bg-slate-600/80 hover:bg-slate-500 text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                          onClick={() => handleOpenModal(index)}
                          type="button"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>

                        <h3 className="text-xl font-bold text-slate-100">
                          {level.company}
                        </h3>
                        <p className="text-blue-400 font-medium">
                          {level.position}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          {level.year}
                        </p>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {level.description.map((item, idx) => (
                            <motion.div
                              key={idx}
                              {...{
                                className:
                                  "flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors",
                              }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={
                                isInView
                                  ? { opacity: 1, y: 0 }
                                  : { opacity: 0, y: 10 }
                              }
                              transition={{
                                duration: 0.3,
                                delay: 0.1 + idx * 0.1 + index * 0.2,
                              }}
                              whileHover={{
                                y: -2,
                                backgroundColor: "rgba(30, 41, 59, 0.7)",
                              }}
                            >
                              <div className="flex-shrink-0 bg-slate-700 p-1.5 rounded-md">
                                {item.icon}
                              </div>
                              <span className="text-slate-300">
                                {item.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {experience.length > 2 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors flex items-center gap-2 hover:shadow-lg"
              >
                <span>View More</span>
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </motion.div>
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
                  <span className="bg-blue-900/20 p-1.5 rounded text-blue-400">
                    <Edit3 className="h-5 w-5" />
                  </span>
                  {editingIndex !== null ? "Edit Experience" : "Add Experience"}
                </h2>

                <div className="space-y-6">
                  {/* Organization */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="organization"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      Organization <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="organization"
                      value={tempOrganization}
                      onChange={(e) => setTempOrganization(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="e.g., Google, Microsoft, Startup Inc."
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="role"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <Briefcase className="h-4 w-4" />
                      Role <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="role"
                      value={tempRole}
                      onChange={(e) => setTempRole(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="e.g., Software Engineer, Product Manager"
                    />
                  </div>

                  {/* Time Period */}
                  <div className="space-y-4">
                    <Label className="text-slate-300 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Time Period <span className="text-red-400">*</span>
                    </Label>

                    {/* Start Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400 text-sm">
                          Start Month
                        </Label>
                        <select
                          value={tempStartMonth}
                          onChange={(e) => setTempStartMonth(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                        >
                          <option value="">Select month</option>
                          {months.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-slate-400 text-sm">
                          Start Year
                        </Label>
                        <select
                          value={tempStartYear}
                          onChange={(e) => setTempStartYear(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                        >
                          <option value="">Select year</option>
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Current Role Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="currentRole"
                        checked={tempIsCurrentRole}
                        onChange={(e) => setTempIsCurrentRole(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                      />
                      <Label
                        htmlFor="currentRole"
                        className="text-slate-300 text-sm"
                      >
                        This is my current role
                      </Label>
                    </div>

                    {/* End Date */}
                    {!tempIsCurrentRole && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-400 text-sm">
                            End Month
                          </Label>
                          <select
                            value={tempEndMonth}
                            onChange={(e) => setTempEndMonth(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                          >
                            <option value="">Select month</option>
                            {months.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-slate-400 text-sm">
                            End Year
                          </Label>
                          <select
                            value={tempEndYear}
                            onChange={(e) => setTempEndYear(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                          >
                            <option value="">Select year</option>
                            {years.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contributions */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="contributions"
                      className="text-slate-300 font-medium"
                    >
                      Key Contributions & Achievements
                    </Label>
                    <Textarea
                      id="contributions"
                      value={tempContributions}
                      onChange={(e) => setTempContributions(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 resize-none min-h-[120px]"
                      placeholder="Enter each contribution on a new line, e.g.:&#10;Led development of core authentication system&#10;Optimized database queries reducing response time by 40%&#10;Mentored 5 junior developers"
                    />
                    <p className="text-xs text-slate-500">
                      Enter each contribution on a new line. These will be
                      displayed as individual achievement cards.
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between mt-8">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                    >
                      Cancel
                    </Button>
                    {editingIndex !== null && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (editingIndex !== null) {
                            handleDeleteExperience(editingIndex);
                            handleCloseModal();
                          }
                        }}
                        className="bg-red-800 hover:bg-red-700 border-red-700 text-red-300 hover:text-red-200"
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    disabled={
                      saving ||
                      !tempOrganization ||
                      !tempRole ||
                      !tempStartMonth ||
                      !tempStartYear ||
                      (!tempIsCurrentRole && (!tempEndMonth || !tempEndYear))
                    }
                  >
                    <Save className="h-4 w-4" />
                    {saving
                      ? "Saving..."
                      : editingIndex !== null
                      ? "Save Changes"
                      : "Add Experience"}
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
