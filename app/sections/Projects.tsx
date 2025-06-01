"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import AddProjectCard from "../components/AddProjectCard";
import DeleteProjectModal from "../components/DeleteProjectModal";
import AddProjectModal from "../components/AddProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  tags: string[];
  github: string;
  githubUrl: string;
  liveUrl: string;
  videoUrl?: string;
  longDescription?: string;
}

interface ProjectsProps {
  onOpenProject?: (project: Project, projects: Project[]) => void;
}

export default function Projects({ onOpenProject }: ProjectsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, {
    once: true,
    margin: "-100px",
  });

  const [projectList, setProjectList] = useState([
    {
      id: "project1",
      title: "Portfolio Builder",
      description:
        "A web application that allows users to create and customize their portfolio websites with ease.",
      image: "",
      tags: ["React", "Next.js", "Tailwind CSS"],
      github: "https://github.com/username/portfolio-builder",
      githubUrl: "https://github.com/username/portfolio-builder",
      liveUrl: "https://portfolio-builder.example.com",
      videoUrl: "https://www.example.com/videos/portfolio-builder.mp4",
      longDescription:
        "This project is a comprehensive portfolio builder that allows users to create professional portfolios without any coding knowledge. It features a drag-and-drop interface, customizable templates, and integration with various platforms to showcase projects and skills. The application is built with React and Next.js for the frontend, with a Node.js backend and MongoDB database.",
    },
    {
      id: "project2",
      title: "Task Manager",
      description:
        "A task management application with features like task categorization, due dates, and notifications.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Vue.js", "Express", "MongoDB"],
      github: "https://github.com/username/task-manager",
      githubUrl: "https://github.com/username/task-manager",
      liveUrl: "https://task-manager.example.com",
      videoUrl: "https://www.example.com/videos/task-manager.mp4",
      longDescription:
        "The Task Manager is a comprehensive productivity tool designed to help users organize their work efficiently. It includes features such as task categorization, priority levels, due date reminders, and real-time notifications. The application uses Vue.js for the frontend, Express for the backend API, and MongoDB for data storage. It also implements user authentication and data synchronization across devices.",
    },
    {
      id: "project3",
      title: "E-commerce Platform",
      description:
        "A full-featured e-commerce platform with product listings, cart functionality, and payment processing.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
      github: "https://github.com/username/ecommerce-platform",
      githubUrl: "https://github.com/username/ecommerce-platform",
      liveUrl: "https://ecommerce.example.com",
      videoUrl: "https://www.example.com/videos/ecommerce.mp4",
      longDescription:
        "This e-commerce platform provides a complete solution for online stores. It includes product catalog management, user accounts, shopping cart functionality, secure checkout with Stripe integration, and order tracking. The platform is built with React for the frontend, Node.js for the backend, and PostgreSQL for the database. It also features an admin dashboard for store owners to manage products, orders, and customer data.",
    },
    {
      id: "project4",
      title: "Weather App",
      description:
        "A weather application that provides current conditions and forecasts for locations worldwide.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["JavaScript", "OpenWeather API", "CSS"],
      github: "https://github.com/username/weather-app",
      githubUrl: "https://github.com/username/weather-app",
      liveUrl: "https://weather.example.com",
      videoUrl: "https://www.example.com/videos/weather-app.mp4",
      longDescription:
        "The Weather App provides users with accurate weather information for any location around the world. It displays current conditions, hourly forecasts, and 7-day predictions. The application uses the OpenWeather API for data retrieval and features a responsive design that works well on both desktop and mobile devices. Users can save favorite locations and receive weather alerts for severe conditions.",
    },
  ] as Project[]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Mock user skills - in a real app, this would come from user's profile
  const userSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "GraphQL",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Docker",
    "AWS",
    "Redux",
    "Express",
    "Python",
    "Java",
    "C++",
    "HTML/CSS",
    "REST API",
    "CI/CD",
  ];

  const handleOpenProject = (project: Project) => {
    if (onOpenProject) {
      onOpenProject(project, projectList);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjectList((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  const addProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: `project${Date.now()}`, // Generate unique ID
    };
    setProjectList((prev) => [...prev, newProject]);
  };

  const canAddMore = projectList.length < 4;

  return (
    <motion.div
      ref={ref}
      {...{className:"w-full"}}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        {...{className:"bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-md backdrop-blur-sm"}}
        whileHover={{ y: -5 }}
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2 flex items-center gap-3">
          <span className="inline-flex p-2 rounded-lg bg-purple-900/20 text-purple-400 shadow-lg shadow-purple-500/20 border border-purple-800/30">
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
              className="lucide lucide-code-2"
            >
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </span>
          Projects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectList.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenProject={handleOpenProject}
              onDeleteProject={handleDeleteProject}
            />
          ))}
          {canAddMore && (
            <AddProjectCard
              index={projectList.length}
              onAddProject={handleAddProject}
            />
          )}
        </div>

        {!canAddMore && (
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm italic">
              Maximum 4 projects allowed in your portfolio.
            </p>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        project={projectToDelete}
      />

      {/* Add project modal */}
      <AddProjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddProject={addProject}
        userSkills={userSkills}
      />
    </motion.div>
  );
}
