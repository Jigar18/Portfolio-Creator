"use client";

import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <div className="flex flex-col w-full items-center justify-center mt-10">
      <div className="w-full">
        <span className="bg-neutral-300 w-52 h-12 rounded-t-3xl flex items-center justify-center pt-2 border-b-[1px] border-neutral-900">
          <h1 className="text-4xl font-bold">Projects</h1>
        </span>

        <div className="bg-neutral-300 rounded-3xl rounded-tl-none mb-6 flex flex-col items-center justify-center py-4">
        <div className=" grid grid-cols-2 gap-8 gap-y-10 py-5 h-auto w-[90%]">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
        </div>
      </div>
    </div>
  );
}
