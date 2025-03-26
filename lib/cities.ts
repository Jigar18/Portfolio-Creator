import type { Country } from "@/types/api";

export async function searchCities(query: string): Promise<string[]> {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries");
    const data = await response.json();

    if (data.error) {
      throw new Error(data.msg);
    }

    const results: string[] = [];
    const lowerQuery = query.toLowerCase().trim();
    
    data.data.forEach((country: Country) => {
      const matchingCities = country.cities
        .filter(city => 
          city.toLowerCase().includes(lowerQuery) ||
          country.country.toLowerCase().includes(lowerQuery)
        )
        .map(city => `${city}, ${country.country}`);
      results.push(...matchingCities);
    });

    return results
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(lowerQuery);
        const bStartsWith = b.toLowerCase().startsWith(lowerQuery);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.localeCompare(b);
      })
      .slice(0, 6);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}
