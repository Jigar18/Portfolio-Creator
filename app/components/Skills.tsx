import Skill from "./Skill";

export default function Skills() {
  const arr: string[] = [
    "React.js",
    "Node.js",
    "EXPRESS.JS",
    "Typescript",
    "Tailwind CSS",
    "SCIKIT-LEARN",
    "TYPESCRIPT",
    "JAVASCRIPT",
    "TAILWIND CSS",
  ];
  return (
    <div className="bg-sky-500 rounded-3xl space-y-4 p-4">
      <h1 className="text-pretty text-2xl font-bold">Skills</h1>
      <div className="flex gap-3 flex-wrap justify-start">
        {arr.map((skill: string, index: number) => (
          <Skill key={index} skill={skill} />
        ))}
      </div>
    </div>
  );
}
