"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface UserDetails {
  firstName: string;
  lastName: string;
  jobTitle: string;
  location: string;
}

export default function NameBlock() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const token = getCookie("id&Uname");

      if (!token) {
        console.error("Authentication token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/getUserDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `id&Uname=${token}`,
          },
        });

        if (!response.ok) {
          console.error("Error fetching user details:", response.statusText);
          setLoading(false);
          return;
        }

        const result = await response.json();
        if (result.success && result.details) {
          setUserDetails({
            firstName: result.details.firstName,
            lastName: result.details.lastName,
            jobTitle: result.details.jobTitle,
            location: result.details.location,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center sm:items-start">
        <div className="h-10 w-48 bg-slate-700 rounded animate-pulse mb-2"></div>
        <div className="h-6 w-32 bg-slate-700 rounded animate-pulse"></div>
      </div>
    );
  }

  const displayName = userDetails
    ? `${capitalizeWords(userDetails.firstName)} ${capitalizeWords(
        userDetails.lastName
      )}`
    : "Jigar Rajput";

  const displayJobTitle = userDetails
    ? capitalizeWords(userDetails.jobTitle)
    : "Software Engineer";

  const displayLocation =
    userDetails && userDetails.location
      ? userDetails.location
      : "Ahmedabad, India";

  return (
    <div className="flex flex-col items-center sm:items-start">
      <motion.h1
        {...{ className: "text-3xl sm:text-4xl font-bold text-slate-100" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {displayName}
      </motion.h1>
      <motion.p
        {...{ className: "text-lg text-blue-400 mt-1" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {displayJobTitle}
      </motion.p>
      <motion.p
        {...{
          className: "text-sm text-slate-400 mt-1 flex items-center gap-1",
        }}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {displayLocation}
      </motion.p>
    </div>
  );
}
