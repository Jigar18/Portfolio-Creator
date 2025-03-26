export interface Country {
  country: string;
  cities: string[];
}

export interface CountriesResponse {
  error: boolean;
  msg: string;
  data: Country[];
}
