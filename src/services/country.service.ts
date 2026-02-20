import { RestCountriesAdapter } from "../adapters/restcountries.adapter";
import { WikiDataAdapter } from "../adapters/wikidata.adapter";
import { WikiMediaAdapter } from "../adapters/wikimedia.adapter";
import {
  Country,
  RestCountriesData,
  WikiDataFields,
  CountryDetails,
} from "../types/api";

const restCountriesAdapter = new RestCountriesAdapter();
const wikiDataAdapter = new WikiDataAdapter();
const wikiMediaAdapter = new WikiMediaAdapter();

export const searchCountriesByName = async (
  searchTerm: string
): Promise<Country[]> => {
  return restCountriesAdapter.fetchBasicCountryByName(searchTerm);
};

export const getRestCountriesData = async (
  code: string
): Promise<RestCountriesData> => {
  return restCountriesAdapter.fetchRestDataByCCA3(code);
};

export const getWikiData = async (code: string): Promise<WikiDataFields> => {
  return wikiDataAdapter.fetchWikiDataByCCA3(code.toUpperCase());
};

export const getCountryByCode = async (
  code: string
): Promise<CountryDetails> => {
  if (!code.trim()) throw new Error("Invalid country code");

  const cca3 = code.toUpperCase();

  const [restResult, wikiResult] = await Promise.allSettled([
    restCountriesAdapter.fetchRestDataByCCA3(cca3),
    wikiDataAdapter.fetchWikiDataByCCA3(cca3),
  ]);

  if (restResult.status === "rejected") {
    throw restResult.reason;
  }

  let wikiData =
    wikiResult.status === "fulfilled" ? wikiResult.value : undefined;

  // Fetch Wikipedia images if we have an enwikiTitle
  if (wikiData?.enwikiTitle) {
    try {
      const images = await wikiMediaAdapter.fetchImagesByTitle(
        wikiData.enwikiTitle
      );
      wikiData = { ...wikiData, images };
    } catch (error) {
      console.warn("Failed to fetch Wikipedia images:", error);
    }
  }

  const combined: CountryDetails = {
    ...(restResult.value as RestCountriesData),
    wikiData,
  };

  return combined;
};
