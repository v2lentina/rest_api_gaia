import axios from "axios";
import { Country, RestCountriesData } from "../types/api";

const REST_COUNTRIES_BASE = "https://restcountries.com/v3.1";

export class RestCountriesAdapter {
  async fetchBasicCountryByName(searchTerm: string): Promise<Country[]> {
    if (!searchTerm.trim()) return [];

    const q = searchTerm.trim();
    const response = await axios.get<Country[]>(
      `${REST_COUNTRIES_BASE}/name/${encodeURIComponent(
        q
      )}?fields=name,flags,cca3`
    );

    const term = q.toLowerCase();
    const filtered = (response.data || []).filter((country) => {
      const englishName = (country.name?.common || "").toLowerCase();
      return englishName.startsWith(term);
    });

    return filtered;
  }

  async fetchRestDataByCCA3(cca3: string): Promise<RestCountriesData> {
    if (!cca3.trim()) throw new Error("Invalid country code");

    const url = `${REST_COUNTRIES_BASE}/alpha/${cca3.toUpperCase()}`;
    const response = await axios.get<RestCountriesData[]>(url, {
      timeout: 8000,
    });

    if (!response.data || !response.data.length) {
      throw new Error(`Country with code '${cca3.toUpperCase()}' not found`);
    }

    return response.data[0];
  }
}
