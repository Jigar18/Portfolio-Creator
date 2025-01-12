"use client";

export default function About() {
  return (
    <div className="flex flex-col w-full items-center justify-center mt-10">
      <div className="w-full">
        <span className="bg-neutral-300 w-52 h-12 rounded-t-3xl flex items-center justify-center pt-2 border-b-[1px] border-neutral-900">
          <h1 className="text-4xl font-bold">About Me</h1>
        </span>
        <div className="bg-neutral-300 rounded-3xl rounded-tl-none mb-6 flex justify-center">
          <p className="text-lg text-justify p-5">
            I am a software engineer with a passion for building web applications.
            I specialize in front-end development and have experience working with
            React, Next.js, and Tailwind CSS. I am currently learning TypeScript
            and GraphQL to improve my skills. I am a software engineer with a
            passion for building web applications. I specialize in front-end
            development and have experience working with React, Next.js, and
            Tailwind CSS. I am currently learning TypeScript and GraphQL to
            improve my skills.
          </p>
        </div>
      </div>
    </div>
  );
}
