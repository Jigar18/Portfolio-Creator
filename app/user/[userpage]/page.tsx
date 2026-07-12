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
import { ArrowUp, Asterisk } from "lucide-react";

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
      <div ref={topRef} className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-200">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_76%_8%,rgba(255,255,255,0.08),transparent_28rem),radial-gradient(circle_at_5%_55%,rgba(255,255,255,0.04),transparent_24rem)]" />
        <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
        <main className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            {...{ className: "mb-14 flex items-center justify-between gap-5 border-b border-white/10 pb-5" }}
          >
            <div className="flex items-center gap-3 text-sm font-medium tracking-wide text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/[0.06]"><Asterisk className="h-4 w-4" /></span>
              Portfolio
            </div>
            <span className="text-right text-[10px] uppercase tracking-[0.16em] text-zinc-500 sm:text-xs sm:tracking-[0.2em]">Selected work &amp; profile</span>
          </motion.header>

          <div className="space-y-16 lg:space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <InfoCard />
          </motion.div>

          <div className="space-y-16 lg:space-y-24">
            <motion.div
              {...{ className: "max-w-3xl" }}
              custom={1}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <About />
            </motion.div>

            <motion.div
              {...{ className: "w-full" }}
              custom={2}
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
            >
              <Projects onOpenProject={handleOpenProject} />
            </motion.div>
          </div>

          <motion.div custom={3} initial="hidden" animate="visible" variants={sectionVariants}>
            <Credentials onOpenCertificate={handleOpenCertificate} />
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <Experience />
          </motion.div>

          <motion.footer
            ref={footerRef}
            {...{ className: "py-8 border-t border-slate-800 mt-10" }}
            custom={6}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <div className="container mx-auto flex md:flex-row justify-center items-center gap-4">
              <p className="text-zinc-500 text-xs uppercase tracking-[0.16em]">
                © {new Date().getFullYear()} · Built with care
              </p>
            </div>
          </motion.footer>
          </div>
        </main>

        <AnimatePresence>
          {!footerInView && (
            <motion.button
              {...{
                onClick: scrollToTop,
                className:
                  "fixed bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-zinc-100 text-zinc-950 shadow-2xl transition-colors hover:bg-white z-40",
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
