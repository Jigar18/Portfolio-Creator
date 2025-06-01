"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" });
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

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [experience, setExperience] = useState<ExperienceItem[]>([
    {
      level: 1,
      company: "Reliance Industries and Future Group",
      position: "Software Engineer",
      year: "2026 - Present",
      description: [
        {
          icon: <Briefcase className="h-5 w-5 text-blue-400" />,
          text: "Led development of core authentication system serving 1M+ users",
        },
        {
          icon: <BarChart2 className="h-5 w-5 text-blue-400" />,
          text: "Optimized database queries reducing response time by 40%",
        },
        {
          icon: <Users className="h-5 w-5 text-blue-400" />,
          text: "Mentored 5 junior developers and conducted code reviews",
        },
        {
          icon: <Code className="h-5 w-5 text-blue-400" />,
          text: "Implemented CI/CD pipeline reducing deployment time by 60%",
        },
        {
          icon: <Award className="h-5 w-5 text-blue-400" />,
          text: "Received Employee of the Month award for exceptional performance",
        },
        {
          icon: <Clock className="h-5 w-5 text-blue-400" />,
          text: "Improved system uptime to 99.9% through infrastructure optimizations",
        },
      ],
    },
    {
      level: 2,
      company: "Microsoft",
      position: "Software Engineer Intern",
      year: "2025 - 2026",
      description: [
        {
          icon: <Code className="h-5 w-5 text-blue-400" />,
          text: "Developed new features for Azure Cloud Platform",
        },
        {
          icon: <CheckCircle2 className="h-5 w-5 text-blue-400" />,
          text: "Built automated testing framework with 90% coverage",
        },
        {
          icon: <Users className="h-5 w-5 text-blue-400" />,
          text: "Collaborated with cross-functional teams on microservices architecture",
        },
        {
          icon: <Zap className="h-5 w-5 text-blue-400" />,
          text: "Reduced system latency by 25% through code optimization",
        },
      ],
    },
  ]);

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

  const parseContributions = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const icons = [
      <Briefcase className="h-5 w-5 text-blue-400" key={"0"}/>,
      <Code className="h-5 w-5 text-blue-400" key={"1"}/>,
      <Users className="h-5 w-5 text-blue-400" key={"2"}/>,
      <BarChart2 className="h-5 w-5 text-blue-400" key={"3"}/>,
      <Award className="h-5 w-5 text-blue-400" key={"4"}/>,
      <Clock className="h-5 w-5 text-blue-400" key={"5"}/>,
      <Zap className="h-5 w-5 text-blue-400" key={"6"} />,
      <CheckCircle2 className="h-5 w-5 text-blue-400" key={"7"}/>,
    ];

    return lines.map((line, index) => ({
      icon: icons[index % icons.length],
      text: line.trim(),
    }));
  };

  const handleSaveChanges = () => {
    if (!tempOrganization || !tempRole || !tempStartMonth || !tempStartYear) {
      return;
    }

    const yearRange = tempIsCurrentRole
      ? `${tempStartMonth} ${tempStartYear} - Present`
      : `${tempStartMonth} ${tempStartYear} - ${tempEndMonth} ${tempEndYear}`;

    const newExperience: ExperienceItem = {
      level:
        editingIndex !== null
          ? experience[editingIndex].level
          : experience.length + 1,
      company: tempOrganization,
      position: tempRole,
      year: yearRange,
      description: parseContributions(tempContributions),
    };

    if (editingIndex !== null) {
      // Update existing experience
      const updatedExperience = [...experience];
      updatedExperience[editingIndex] = newExperience;
      setExperience(updatedExperience);
    } else {
      // Add new experience (sort by most recent first)
      setExperience([newExperience, ...experience]);
    }

    handleCloseModal();
  };

  return (
    <>
      <motion.div
        ref={ref}
        {...{className:"w-full"}}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          {...{className:"bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md backdrop-blur-sm relative group"}}
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
            {experience.map((level, index) => (
              <motion.div
                key={level.level}
                {...{className:"relative"}}
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
                            {...{className:"flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors"}}
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
                            <span className="text-slate-300">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    disabled={
                      !tempOrganization ||
                      !tempRole ||
                      !tempStartMonth ||
                      !tempStartYear ||
                      (!tempIsCurrentRole && (!tempEndMonth || !tempEndYear))
                    }
                  >
                    <Save className="h-4 w-4" />
                    {editingIndex !== null ? "Save Changes" : "Add Experience"}
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
