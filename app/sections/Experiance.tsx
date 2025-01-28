export default function Experiance() {
  const experiance = [
    {
      level: 1,
      company: "Google",
      position: "Software Engineer",
      year: "2026 - Present",
    },
    {
      level: 2,
      company: "Microsoft",
      position: "Software Engineer Intern",
      year: "2025 - 2026",
    },
  ];

  return (
    <div className="bg-green-500 rounded-3xl space-y-4 p-4 w-full">
      <span className="flex flex-col items-center justify-center bg-red-200 rounded-xl p-3">
        <h1 className="text-pretty text-3xl font-bold">Experiance</h1>
      </span>
      {experiance.map((level) => (
        <div key={level.level}>
          <div className={`flex gap-x-3 ${level.level !== 1 && "-mt-4"}`}>
            <div
              className={`${
                level.level !== experiance.length &&
                "relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-1 after:-translate-x-[1.8px] after:bg-gray-300 dark:after:bg-neutral-700"
              }`}
            >
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-3 rounded-full bg-gray-100 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-8">
              <h3 className="flex gap-x-1.5 font-bold text-grey-850 dark:text-grey-850 text-xl">
                {level.company}
              </h3>
              <p className="mt-1 text-base text-gray-800 dark:text-neutral-800">
                {level.position}
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-neutral-700">
                {level.year}
              </p>
            </div>
          </div>
        </div>
      ))}

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
