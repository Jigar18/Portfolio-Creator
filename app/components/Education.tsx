"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import EducationModal from "./EducationModal";
import { Edit2 } from "lucide-react";

interface EducationItem {
  id?: string;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isCurrently: boolean;
  description?: string;
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { userDetails } = useUser();

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/getEducation");
      const data = await response.json();
      
      if (data.success) {
        setEducation(data.education || []);
      } else {
        console.error("Failed to fetch education:", data.error);
        setEducation([]);
      }
    } catch (error) {
      console.error("Error fetching education:", error);
      setEducation([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleSaveEducation = async (updatedEducation: EducationItem[]) => {
    try {
      setLoading(true);
      
      // First, delete all existing education entries
      const existingEducation = education.filter(edu => edu.id);
      for (const edu of existingEducation) {
        await fetch("/api/deleteEducation", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: edu.id })
        });
      }

      // Then add all the new education entries
      for (const edu of updatedEducation) {
        if (edu.school && edu.degree && edu.field) {
          await fetch("/api/education", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              school: edu.school,
              degree: edu.degree,
              field: edu.field,
              startYear: edu.startYear,
              endYear: edu.endYear,
              isCurrently: edu.isCurrently
            })
          });
        }
      }

      // Refresh the education list
      await fetchEducation();
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatYears = (startYear: number, endYear?: number, isCurrently?: boolean) => {
    if (isCurrently) {
      return `${startYear} - Present`;
    }
    return endYear ? `${startYear} - ${endYear}` : `${startYear}`;
  };

  if (loading) {
    return (
      <motion.div
        {...{
          className:
            "bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md",
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
          <span className="bg-blue-900/20 p-2 rounded text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </span>
          Education
        </h2>
        <div className="space-y-4">
          <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-16 bg-slate-700 rounded animate-pulse"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        {...{
          className: "bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md relative group"
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Edit Button */}
        <motion.button
          {...{
            onClick: () => setIsModalOpen(true),
            className: "absolute top-4 right-4 p-2 bg-slate-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-600/50"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit2 className="h-4 w-4 text-slate-300" />
        </motion.button>

        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
          <span className="bg-blue-900/20 p-2 rounded text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </span>
          Education
        </h2>
        
        <div className="space-y-4">
          {education.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No education information added yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Education
              </button>
            </div>
          ) : (
            education.map((edu, index) => (
              <motion.div
                key={edu.id || index}
                {...{
                  className: "bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 relative",
                  onMouseEnter: () => setHoveredIndex(index),
                  onMouseLeave: () => setHoveredIndex(null)
                }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-200 text-lg">
                    {edu.school}
                  </h3>
                  <span className="text-sm text-slate-400 font-medium">
                    {formatYears(edu.startYear, edu.endYear, edu.isCurrently)}
                  </span>
                </div>
                <p className="text-blue-400 font-medium mb-1">{edu.degree}</p>
                <p className="text-slate-300 text-sm">{edu.field}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Education Modal */}
      <EducationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        education={education}
        onSave={handleSaveEducation}
      />
    </>
  );
}
