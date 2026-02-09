import { RestCountriesAdapter } from "../adapters/restcountries.adapter";
import { WikiDataAdapter } from "../adapters/wikidata.adapter";
import {
  Country,
  RestCountriesData,
  WikiDataFields,
  CountryDetails,
} from "../types/api";

const restCountriesAdapter = new RestCountriesAdapter();
const wikiDataAdapter = new WikiDataAdapter();

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

  const wikiData =
    wikiResult.status === "fulfilled" ? wikiResult.value : undefined;

  const combined: CountryDetails = {
    ...(restResult.value as RestCountriesData),
    wikiData,
  };

  return combined;
};
