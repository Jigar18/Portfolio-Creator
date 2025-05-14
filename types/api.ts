export interface Country {
  country: string;
  cities: string[];
}

export interface University {
  name: string;
  country: string;
}

export interface CountriesResponse {
  error: boolean;
  msg: string;
  data: Country[];
}

export interface Details {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  jobTitle: string;
  school: string;
  startYear: string;
  endYear: string;
}

export interface Skill {
  name: string;
  userId: string;
}