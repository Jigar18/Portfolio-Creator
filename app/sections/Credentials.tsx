"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Certifications from "./Certifications";
import Education from "../components/Education";
import Skills from "../components/Skills";
import Connect from "../components/Connect";

interface Card {
  title: string;
  pdf: string;
  description: string;
}

interface CredentialsProps {
  onOpenCertificate?: (certificate: Card, certificates: Card[]) => void;
}

export default function Credentials({ onOpenCertificate }: CredentialsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" });

  return (
    <motion.div
      {...({
        ref,
        className: "space-y-6",
        initial: { opacity: 0 },
        animate: isInView ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.5 },
      } )}
    >
      <Skills />
      <Connect />
      <Certifications onOpenCertificate={onOpenCertificate} />
      <Education />
    </motion.div>
  );
}
