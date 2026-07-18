type PortfolioSetup = {
  details: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    jobTitle: string;
    college: string;
    startYear: number;
    endYear: number;
    imageUrl: string | null;
  } | null;
  skills: Array<{ skills: string[] }>;
};

export function hasCompletedPortfolioSetup(user: PortfolioSetup) {
  const details = user.details;
  if (!details) return false;

  const requiredDetails = [
    details.firstName,
    details.lastName,
    details.email,
    details.location,
    details.jobTitle,
    details.college,
    details.imageUrl,
  ];

  return requiredDetails.every((value) => value?.trim())
    && Number.isInteger(details.startYear)
    && Number.isInteger(details.endYear)
    && user.skills.some(({ skills }) => skills.some((skill) => skill.trim()));
}
