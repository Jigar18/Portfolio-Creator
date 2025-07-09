"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface UserDetails {
  college?: string;
  startYear?: string;
  endYear?: string;
}

interface EducationItem {
  school: string;
  degree: string;
  field: string;
  years: string;
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch("/api/getUserDetails", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.details) {
            const userDetails = data.details;

            const dynamicEducation: EducationItem[] = [];

            // Add college education if available
            if (userDetails.college) {
              const years =
                userDetails.startYear && userDetails.endYear
                  ? `${userDetails.startYear} - ${userDetails.endYear}`
                  : userDetails.startYear
                  ? `${userDetails.startYear} - Present`
                  : "Present";

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
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Fallback to default data
        setEducation([
          {
            school: "Sharda University",
            degree: "Bachelor of Technology",
            field: "Computer Science",
            years: "2022 - 2026",
          },
          {
            school: "Delhi Public School",
            degree: "High School",
            field: "Science",
            years: "2020 - 2022",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

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
          <span className="inline-flex p-2 rounded-lg bg-indigo-900/20 text-indigo-400 shadow-lg shadow-indigo-500/20 border border-indigo-800/30">
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
              className="lucide lucide-graduation-cap"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </span>
          Education
        </h2>

        <div className="space-y-4">
          {[1, 2].map((_, index) => (
            <div key={index} className="border-l-2 border-blue-500 pl-4 py-1">
              <div className="h-5 w-48 bg-slate-600/30 rounded animate-pulse mb-2" />
              <div className="h-4 w-36 bg-slate-600/30 rounded animate-pulse mb-1" />
              <div className="h-4 w-24 bg-slate-600/30 rounded animate-pulse" />
            </div>
          ))}
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
        <span className="inline-flex p-2 rounded-lg bg-indigo-900/20 text-indigo-400 shadow-lg shadow-indigo-500/20 border border-indigo-800/30">
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
            className="lucide lucide-graduation-cap"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </span>
        Education
      </h2>

      <div className="space-y-4">
        {education.map((item, index) => (
          <motion.div
            key={index}
            {...{ className: "border-l-2 border-blue-500 pl-4 py-1" }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h3 className="text-lg font-medium text-slate-100">
              {item.school}
            </h3>
            <p className="text-blue-400">
              {item.degree} in {item.field}
            </p>
            <p className="text-slate-400 text-sm">{item.years}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
