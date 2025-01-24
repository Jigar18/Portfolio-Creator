export default function Education() {
  const education = [
    {
      level: 1,
      institution: "Sharda University",
      degree: "Bachelor of Technology | Computer Science Engineering",
      year: "2022 - 2026",
    },
    {
      level: 2,
      institution: "Rawal Convent School",
      degree: "Seconday School",
      year: "2019 - 2021",
    },
  ];

  return (
    <div className="bg-sky-500 rounded-3xl space-y-4 p-4">
      <h1 className="text-pretty text-2xl font-bold">Education</h1>
      {education.map((level) => (
        <div key={level.level}>
          <div className={`flex gap-x-3 ${level.level !== 1 && "-mt-4"}`}>
            <div className={`${level.level !== education.length && "relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-1 after:-translate-x-[1.8px] after:bg-gray-300 dark:after:bg-neutral-700"}`}>
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-3 rounded-full bg-gray-100 dark:bg-neutral-600"></div>
              </div>
            </div>

            <div className="grow pt-0.5 pb-8">
              <h3 className="flex gap-x-1.5 font-bold text-grey-850 dark:text-grey-850 text-xl">
                {level.institution}
              </h3>
              <p className="mt-1 text-base text-gray-800 dark:text-neutral-800">
                {level.degree}
              </p>
              <p className="mt-1 text-sm text-gray-700 dark:text-neutral-700">
                {level.year}
              </p>
            </div>
          </div>
        </div>
      ))}

      {education.length > 2 && (
        <div className="ps-[7px] flex gap-x-3">
          <button
            type="button"
            className="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-blue-600 font-medium decoration-2 hover:underline focus:outline-none focus:underline dark:text-blue-500"
            id="hs-timeline-collapse-content"
            aria-expanded="false"
            aria-controls="hs-timeline-collapse"
            data-hs-collapse="#hs-timeline-collapse"
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
              <path d="m6 9 6 6 6-6"></path>
            </svg>
            Show older
          </button>
        </div>
      )}
    </div>
  );
}
