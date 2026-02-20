import axios from "axios";
import {
  WikiDataBasicFields,
  WikiDataExtendedFields,
  WikiDataFields,
} from "../types/api";

const WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql";

const buildBasicWikiDataQuery = (cca3: string) =>
  `
SELECT ?item ?itemLabel
			 (SAMPLE(?hdiVal) AS ?hdi)
			 (SAMPLE(?gdpVal) AS ?gdpPerCapita)
			 (SAMPLE(?lifeVal) AS ?lifeExpectancy)
			 (SAMPLE(?litVal) AS ?literacyRate)
			 (SAMPLE(?govLabel) AS ?governmentType)
			 (SAMPLE(?enTitle) AS ?enwikiTitle)
WHERE {
	?item wdt:P298 "${cca3}".
	OPTIONAL { ?item wdt:P122 ?gov . ?gov rdfs:label ?govLabel . FILTER(LANG(?govLabel)="en") }
  
	OPTIONAL { ?item p:P1081/ps:P1081 ?hdiVal }
	OPTIONAL { ?item p:P2132/ps:P2132 ?gdpVal }
	OPTIONAL { ?item p:P2250/ps:P2250 ?lifeVal }
	OPTIONAL { ?item p:P6897/ps:P6897 ?litVal }
	OPTIONAL {
		?enwiki schema:about ?item ;
						schema:isPartOf <https://en.wikipedia.org/> ;
						schema:name ?enTitle .
	}

	SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel
LIMIT 1
`.trim();

const buildExtraWikiDataQuery = (cca3: string) =>
  `
SELECT ?item
			 (GROUP_CONCAT(DISTINCT ?religionLabel; separator=", ") AS ?religions)
			 (GROUP_CONCAT(DISTINCT ?ethnicLabel; separator=", ") AS ?ethnicGroups)
WHERE {
	?item wdt:P298 "${cca3}".
	OPTIONAL { ?item wdt:P140 ?religion . ?religion rdfs:label ?religionLabel . FILTER(LANG(?religionLabel)="en") }
	OPTIONAL { ?item wdt:P172 ?ethnic . ?ethnic rdfs:label ?ethnicLabel . FILTER(LANG(?ethnicLabel)="en") }

	SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item
LIMIT 1
`.trim();

export class WikiDataAdapter {
  async fetchWikiDataByCCA3(cca3: string): Promise<WikiDataFields> {
    const headers = {
      Accept: "application/sparql-results+json",
      "User-Agent":
        "GaiaCountryApp/1.0 (https://github.com/yourapp; contact@yourapp.com)",
    };

    try {
      const [fastResult, slowResult] = await Promise.allSettled([
        axios.get(WIKIDATA_SPARQL_URL, {
          params: { query: buildBasicWikiDataQuery(cca3), format: "json" },
          headers,
          timeout: 8000,
        }),
        axios.get(WIKIDATA_SPARQL_URL, {
          params: { query: buildExtraWikiDataQuery(cca3), format: "json" },
          headers,
          timeout: 15000,
        }),
      ]);

      let fastData: WikiDataBasicFields = {};
      if (fastResult.status === "fulfilled") {
        const fastRow = fastResult.value.data?.results?.bindings?.[0];
        if (fastRow) {
          const get = (k: string) => fastRow[k]?.value as string | undefined;
          const parseNum = (k: string) => (get(k) ? Number(get(k)) : undefined);

          fastData = {
            governmentType: get("governmentType"),
            hdi: parseNum("hdi"),
            gdpPerCapita: parseNum("gdpPerCapita"),
            lifeExpectancy: parseNum("lifeExpectancy"),
            literacyRate: parseNum("literacyRate"),
            enwikiTitle: get("enwikiTitle"),
          };
        }
      } else {
        console.warn("Fast WikiData query failed:", fastResult.reason);
      }

      let slowData: WikiDataExtendedFields = {};
      if (slowResult.status === "fulfilled") {
        const slowRow = slowResult.value.data?.results?.bindings?.[0];
        if (slowRow) {
          const get = (k: string) => slowRow[k]?.value as string | undefined;

          slowData = {
            religions: get("religions")?.split(", ").filter(Boolean),
            ethnicGroups: get("ethnicGroups")?.split(", ").filter(Boolean),
          };
        }
      } else {
        console.warn("Slow WikiData query failed:", slowResult.reason);
      }

      return {
        ...fastData,
        ...slowData,
      };
    } catch (error) {
      console.error(
        "WikiData fetch failed completely:",
        (error as Error).message
      );
      return {} as WikiDataFields;
    }
  }
}
