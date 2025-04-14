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
