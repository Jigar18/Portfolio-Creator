"use client";

import type React from "react";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";
import About from "../../sections/AboutSection";
import Credentials from "../../sections/Credentials";
import Experience from "../../sections/Experience";
import InfoCard from "../../sections/InfoCard";
import Projects from "../../sections/Projects";
import ProjectModal from "../../components/ProjectModal";
import CertificateModal from "../../components/CertificateModal";
import { UserProvider } from "../../context/UserContext";
import { ArrowUp } from "lucide-react";

interface Card {
  id: string;
  title: string;
  pdfUrl: string;
  description: string;
}

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

export default function Home() {
  const topRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerInView = useInView(footerRef as React.RefObject<HTMLElement>, {
    once: false,
  });

  // Certificate modal state
  const [selectedCertificate, setSelectedCertificate] = useState<Card | null>(
    null
  );
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [allCertificates, setAllCertificates] = useState<Card[]>([]);

  // Project modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Certificate handlers
  const handleOpenCertificate = (certificate: Card, certificates: Card[]) => {
    setSelectedCertificate(certificate);
    setAllCertificates(certificates);
    setIsCertificateModalOpen(true);
  };

  const handleCloseCertificateModal = () => {
    setIsCertificateModalOpen(false);
  };

  // Project handlers
  const handleOpenProject = (project: Project, projects: Project[]) => {
    setSelectedProject(project);
    setAllProjects(projects);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <UserProvider>
      <div
        ref={topRef}
        className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <main className="mx-auto w-full max-w-6xl space-y-10 text-slate-200 py-12 px-4 sm:px-6 sm:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <InfoCard />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <motion.div
              {...{ className: "lg:col-span-8 space-y-8" }}
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <About />
              <Projects onOpenProject={handleOpenProject} />
            </motion.div>

            <motion.div
              {...{
                className:
                  "lg:col-span-4 lg:sticky lg:top-8 self-start space-y-8",
              }}
              custom={2}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Credentials onOpenCertificate={handleOpenCertificate} />
            </motion.div>
          </div>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <Experience />
          </motion.div>

          <motion.footer
            ref={footerRef}
            {...{ className: "py-8 border-t border-slate-800 mt-10" }}
            custom={5}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="container mx-auto flex md:flex-row justify-center items-center gap-4">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} Jigar Kumar. All rights reserved.
              </p>
            </div>
          </motion.footer>
        </main>

        <AnimatePresence>
          {!footerInView && (
            <motion.button
              {...{
                onClick: scrollToTop,
                className:
                  "fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors z-40",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Project Modal */}
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
          project={selectedProject}
          projects={allProjects}
        />

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={isCertificateModalOpen}
          onClose={handleCloseCertificateModal}
          certificate={selectedCertificate}
          certificates={allCertificates}
        />
      </div>
    </UserProvider>
  );
}
