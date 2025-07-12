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

export interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface PdfUploadRResponse {
  success: boolean,
  pdfUrl ?: string,
  error ?: string
}
