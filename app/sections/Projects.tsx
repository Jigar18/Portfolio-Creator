"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Code2, FolderPlus } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import AddProjectCard from "../components/AddProjectCard";
import DeleteProjectModal from "../components/DeleteProjectModal";
import AddProjectModal, { PortfolioProject } from "../components/AddProjectModal";
import { useUser } from "../context/UserContext";

type ModalProject = Omit<PortfolioProject, "githubUrl" | "liveUrl"> & {
  githubUrl: string;
  liveUrl: string;
  image: string;
  tags: string[];
  github: string;
  videoUrl?: string;
  longDescription?: string;
};

interface ProjectsProps {
  onOpenProject?: (project: ModalProject, projects: ModalProject[]) => void;
}

const toModalProject = (project: PortfolioProject): ModalProject => ({ ...project, githubUrl: project.githubUrl || "", liveUrl: project.liveUrl || "", image: "", tags: project.techStack, github: project.githubUrl || "", longDescription: project.description });

export default function Projects({ onOpenProject }: ProjectsProps) {
  const { isOwner, portfolioApiUrl } = useUser();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<PortfolioProject | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      const [projectResponse, skillResponse] = await Promise.all([
        fetch(portfolioApiUrl("/api/projects"), { credentials: "include" }),
        fetch(portfolioApiUrl("/api/getUserSkills"), { credentials: "include" }),
      ]);
      if (projectResponse.ok) {
        const data = await projectResponse.json();
        setProjects(data.projects || []);
      }
      if (skillResponse.ok) {
        const data = await skillResponse.json();
        setSkills(data.skills || []);
      }
    } finally { setLoading(false); }
  }, [portfolioApiUrl]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const saveProject = async (draft: Omit<PortfolioProject, "id">) => {
    const response = await fetch("/api/projects", { method: editingProject ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(editingProject ? { ...draft, id: editingProject.id } : draft) });
    if (!response.ok) throw new Error("Unable to save project");
    const data = await response.json();
    setProjects((current) => editingProject ? current.map((project) => project.id === editingProject.id ? data.project : project) : [data.project, ...current]);
  };

  const deleteProject = async () => {
    if (!projectToDelete) return;
    const response = await fetch(`/api/projects?id=${projectToDelete.id}`, { method: "DELETE", credentials: "include" });
    if (response.ok) setProjects((current) => current.filter((project) => project.id !== projectToDelete.id));
    setProjectToDelete(null);
  };

  const openEditor = (project: PortfolioProject | null = null) => { setEditingProject(project); setEditorOpen(true); };
  const modalProjects = projects.map(toModalProject);

  return <motion.div ref={ref} {...{ className: "w-full border-t border-white/10 pt-7" }} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.55 }}>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400"><span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] p-2"><Code2 className="h-4 w-4" /></span>Projects</p>{isOwner && projects.length > 0 && <button onClick={() => openEditor()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.06]"><FolderPlus className="h-4 w-4" />Add project</button>}</div>
    {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.035]" />)}</div> : projects.length === 0 ? <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} {...{ className: "grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center" }}><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.06]"><FolderPlus className="h-5 w-5 text-zinc-300" /></span><h3 className="mt-5 text-lg font-medium text-white">No projects added yet.</h3>{isOwner && <><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">Start with the project that best represents your craft.</p><button onClick={() => openEditor()} className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-200">Add your first project</button></>}</div></motion.div> : <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.id} project={toModalProject(project)} index={index} onOpenProject={(selected) => onOpenProject?.(selected, modalProjects)} onEditProject={isOwner ? () => openEditor(project) : undefined} onDeleteProject={isOwner ? () => setProjectToDelete(project) : undefined} />)}</div>}
    {isOwner && <DeleteProjectModal isOpen={Boolean(projectToDelete)} onClose={() => setProjectToDelete(null)} onConfirm={deleteProject} project={projectToDelete ? toModalProject(projectToDelete) : null} />}
    {isOwner && <AddProjectModal isOpen={editorOpen} onClose={() => { setEditorOpen(false); setEditingProject(null); }} onSave={saveProject} userSkills={skills} project={editingProject} />}
  </motion.div>;
}
