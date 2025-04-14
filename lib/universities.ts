import { University } from "@/types/api";

export async function getUniversities(query: string): Promise<string[]> {
    try {
        const response = await fetch(`http://universities.hipolabs.com/search?name=${query}`);
        const data = await response.json();
        if (data.error) {
            throw new Error(data.msg);
        }

        const results : string[] = [];
        // const lowerQuery = query.toLowerCase().trim();

        const matchingUniversities = data.map((university: University) => `${university.name}, ${university.country}`);
        
        results.push(...matchingUniversities);

        return results.sort((a, b) => {
            const aStartsWith = a.toLowerCase().startsWith(query.toLowerCase());
            const bStartsWith = b.toLowerCase().startsWith(query.toLowerCase());
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.localeCompare(b);
        }).slice(0, 6);
    }
    catch (error) {
        console.error("Error fetching universities:", error);
        return [];
    }
}