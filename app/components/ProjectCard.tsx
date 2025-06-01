"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Github, Eye, X } from "lucide-react";
import { useRandomImage } from "@/utils/randomImageSelect";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  techStack: string[];
  github: string;
  githubUrl: string;
  liveUrl: string;
  videoUrl?: string;
  longDescription?: string;
}

interface ProjectProps {
  project: Project;
  index: number;
  onOpenProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onOpenProject,
  onDeleteProject,
}: ProjectProps) {
  const handleClick = () => {
    if (onOpenProject) {
      onOpenProject(project);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteProject) {
      onDeleteProject(project);
    }
  };

  const randomBg = useRandomImage();

  return (
    <motion.div
      {...{className:"relative group bg-slate-700/30 rounded-lg overflow-hidden border border-slate-600 shadow-md"}}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Delete button - appears on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 bg-red-600/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 z-10"
        title="Delete project"
      >
        <X className="h-3 w-3" />
      </button>

      <div
        className="relative h-48 w-full group cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
          alt={project.title}
          fill
          className="object-cover"
          style={{ backgroundColor: "#0f172a", backgroundImage: randomBg }}
        />
        <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            {...{className:"text-slate-200/90 hover:text-white transition-colors"}}
          >
            <Eye size={28} />
          </motion.div>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="text-lg font-bold text-slate-100 cursor-pointer hover:text-blue-400 transition-colors"
          onClick={handleClick}
        >
          {project.title}
        </h3>
        <p className="text-slate-300 text-sm mt-2 line-clamp-2">
          {project.description}
        </p>

        <div className="flex gap-2 mt-3 flex-wrap">
          {project.tags.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs bg-slate-700/70 text-slate-300 px-2 py-1 rounded">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-end mt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-blue-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
