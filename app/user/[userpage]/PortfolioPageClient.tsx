"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState } from "react";
import About from "../../sections/AboutSection";
import Credentials from "../../sections/Credentials";
import Experience from "../../sections/Experience";
import InfoCard from "../../sections/InfoCard";
import Projects from "../../sections/Projects";
import ProjectModal from "../../components/ProjectModal";
import CertificateModal from "../../components/CertificateModal";
import { UserProvider, useUser } from "../../context/UserContext";
import PortfolioViewCount from "../../components/PortfolioViewCount";
import GitHubHeatmap from "../../components/GitHubHeatmap";
import NotFoundState from "../../components/NotFoundState";

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

function PortfolioRouteGate({ children }: { children: React.ReactNode }) {
  const { loading, userDetails } = useUser();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-300" />
      </main>
    );
  }
  if (!userDetails) return <NotFoundState kind="portfolio" />;
  return children;
}

export default function Home() {
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
      <PortfolioRouteGate>
      <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-200">
        <PortfolioViewCount />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_76%_8%,rgba(255,255,255,0.08),transparent_28rem),radial-gradient(circle_at_5%_55%,rgba(255,255,255,0.04),transparent_24rem)]" />
        <div className="pointer-events-none fixed inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
        <main className="relative mx-auto w-full max-w-7xl px-5 pb-6 pt-16 sm:px-8 sm:pb-9 sm:pt-20 lg:px-10 lg:pb-12 lg:pt-20">
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
              {...{ className: "w-full" }}
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

            <GitHubHeatmap />
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
      </PortfolioRouteGate>
    </UserProvider>
  );
}
