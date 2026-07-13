"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import EducationModal from "./EducationModal";
import { BookOpen, Pencil } from "lucide-react";
import CredentialCardHeader, { credentialEditButtonClass } from "./CredentialCardHeader";

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
  const [educationAtTop, setEducationAtTop] = useState(true);
  const { userDetails } = useUser();

  const fetchEducation = async () => {
    try {
      const response = await fetch("/api/getEducation");
      const data = await response.json();
      
      if (data.success) {
        setEducation(data.education || []);
      } else {
        // Public visitors do not have an auth cookie; the empty state is intentional.
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
      
      const existingEducation = education.filter(edu => edu.id);
      const existingIds = new Set(existingEducation.map(edu => edu.id));
      const updatedIds = new Set(updatedEducation.filter(edu => edu.id).map(edu => edu.id));

      // Delete education entries that were removed
      for (const edu of existingEducation) {
        if (!updatedIds.has(edu.id)) {
          await fetch(`/api/deleteEducation?id=${edu.id}`, {
            method: "DELETE"
          });
        }
      }

      // Process each education entry
      for (const edu of updatedEducation) {
        if (edu.school && edu.degree && edu.field) {
          if (edu.id && existingIds.has(edu.id)) {
            // Update existing education
            await fetch("/api/education", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                field: edu.field,
                startYear: edu.startYear,
                endYear: edu.endYear,
                isCurrently: edu.isCurrently
              })
            });
          } else {
            // Create new education
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
            "h-[278px] bg-slate-800/50 rounded-xl border border-slate-700 p-5 shadow-md",
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <CredentialCardHeader title="Education" icon={<BookOpen className="h-5 w-5" />} />
        <div className="space-y-4 pt-4">
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
          className: "group flex h-[278px] flex-col bg-slate-800/50 rounded-xl border border-slate-700 p-5 shadow-md relative"
        }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <CredentialCardHeader
          title="Education"
          icon={<BookOpen className="h-5 w-5" />}
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className={credentialEditButtonClass}
              aria-label="Edit education"
              title="Edit education"
            >
              <Pencil className="h-4 w-4" />
            </button>
          }
        />
        
        <div className="relative min-h-0 flex-1 pt-4">
        <div
          className="credential-scrollbar h-full space-y-4 overflow-x-hidden overflow-y-auto pr-1"
          onScroll={(event) => setEducationAtTop(event.currentTarget.scrollTop <= 2)}
        >
          {education.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No education information added yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Add Education
              </button>
            </div>
          ) : (
            education.map((edu, index) => (
              <motion.div
                key={edu.id || index}
                {...{
                  className: "min-h-[162px] bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 relative transition-colors hover:border-slate-500/70 hover:bg-slate-700/40"
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-200 text-lg">
                    {edu.school}
                  </h3>
                  <span className="text-sm text-slate-400 font-medium">
                    {formatYears(edu.startYear, edu.endYear, edu.isCurrently)}
                  </span>
                </div>
                <p className="text-zinc-400 font-medium mb-1">{edu.degree}</p>
                <p className="text-slate-300 text-sm">{edu.field}</p>
              </motion.div>
            ))
          )}
        </div>
        {educationAtTop && education.length > 1 && (
          <span className="pointer-events-none absolute bottom-2 right-3 rounded-full border border-white/10 bg-zinc-950/90 px-2.5 py-1 text-xs font-semibold text-zinc-300 shadow-lg">
            +{education.length - 1}
          </span>
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
