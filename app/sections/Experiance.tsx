export default function Experiance() {
  const experiance = [
    {
      level: 1,
      company: "Reliance Industries and Future Group",
      position: "Software Engineer",
      year: "2026 - Present",
      description: [
        "Led development of core authentication system serving 1M+ users Led development of core authentication system serving 1M+ users",
        "Optimized database queries reducing response time by 40%",
        "Mentored 5 junior developers and conducted code reviews",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Mentored 5 junior developers and conducted code reviews",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
      ],
    },
    {
      level: 2,
      company: "Microsoft",
      position: "Software Engineer Intern",
      year: "2025 - 2026",
      description: [
        "Developed new features for Azure Cloud Platform",
        "Built automated testing framework with 90% coverage",
        "Collaborated with cross-functional teams on microservices architecture",
        "Reduced system latency by 25% through code optimization",
      ],
    },
  ];

  return (
    <div className="bg-green-500 rounded-3xl space-y-6 p-6 w-full">
      <span className="flex flex-col items-center justify-center bg-red-200 rounded-xl p-3">
        <h1 className="text-pretty text-3xl font-bold">Experience</h1>
      </span>
      <div className="px-8">
        {experiance.map((level) => (
          <div key={level.level} className="flex items-stretch gap-x-8 mb-8 last:mb-0">
            <div className="p-4 rounded-xl w-64 flex-shrink-0 flex items-center gap-x-4">
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900">
                  {level.company}
                </h3>
                <p className="text-lg font-medium text-gray-800 mt-1">
                  {level.position}
                </p>
                <p className="text-base text-gray-700 mt-1">
                  {level.year}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center relative">
              <div className="w-1 bg-gray-800 h-full rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full"></div>
            </div>

            <div className="bg-stone-200 p-4 rounded-xl flex-grow">
              <ul className="space-y-3 list-none text-base text-gray-700">
                {level.description.map((point, index) => (
                  <li key={index} className="flex">
                    <span className="mr-2 text-base">•</span>
                    <span className="text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {experiance.length > 2 && (
        <div className="ps-[7px] flex gap-x-3">
          <button
            type="button"
            className="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-blue-600 font-medium decoration-2 hover:underline focus:outline-none focus:underline dark:text-blue-500"
            id="hs-timeline-collapse-content"
            aria-expanded="false"
          >
            <svg
              className="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>View More</span>
          </button>
        </div>
      )}
    </div>
  );
}
