"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

interface EducationItem {
  school: string;
  degree: string;
  field: string;
  years: string;
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const { userDetails, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading) {
      const dynamicEducation: EducationItem[] = [];

      // Add college education if available
      if (userDetails?.college) {
        const years = "2022 - 2026";

        dynamicEducation.push({
          school: userDetails.college,
          degree: "Bachelor of Technology",
          field: "Computer Science",
          years: years,
        });
      }

      // Add default high school entry
      dynamicEducation.push({
        school: "Delhi Public School",
        degree: "High School",
        field: "Science",
        years: "2020 - 2022",
      });

      setEducation(dynamicEducation);
    }
  }, [userDetails, userLoading]);

  if (userLoading) {
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
        {education.map((edu, index) => (
          <motion.div
            key={index}
            {...{
              className:
                "bg-slate-700/30 rounded-lg p-4 border border-slate-600/50",
            }}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-200 text-lg">
                {edu.school}
              </h3>
              <span className="text-sm text-slate-400 font-medium">
                {edu.years}
              </span>
            </div>
            <p className="text-blue-400 font-medium mb-1">{edu.degree}</p>
            <p className="text-slate-300 text-sm">{edu.field}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
