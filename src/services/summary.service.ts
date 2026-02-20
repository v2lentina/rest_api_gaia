import { RestCountriesAdapter } from "../adapters/restcountries.adapter";
import { WikiDataAdapter } from "../adapters/wikidata.adapter";
import { LLMAdapter } from "../adapters/llm.adapter";
import { CacheService } from "./cache.service";
import { SummaryResponse } from "../types/api";
import { CountryDetails } from "../types/api";

export class SummaryService {
  private restCountriesAdapter = new RestCountriesAdapter();
  private wikiDataAdapter = new WikiDataAdapter();
  private llmAdapter = new LLMAdapter();
  private cacheService = new CacheService();

  generateKey(query: string): string {
    const promptVersion = this.llmAdapter.getPromptVersion();
    return this.cacheService.generateKey(query, promptVersion);
  }

  async getSummary(query: string): Promise<SummaryResponse> {
    const cacheKey = this.generateKey(query);

    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return {
        query,
        summary: cached,
        fromCache: true,
      };
    }

    const country = await this.restCountriesAdapter.fetchBasicCountryByName(
      query
    );
    if (!country || country.length === 0) {
      throw new Error("No country found for query");
    }

    const cca3 = country[0].cca3;
    if (!cca3) throw new Error("Country record missing cca3");

    const [restData, wikiData] = await Promise.all([
      this.restCountriesAdapter.fetchRestDataByCCA3(cca3),
      this.wikiDataAdapter.fetchWikiDataByCCA3(cca3),
    ]);

    const combined: CountryDetails = {
      ...restData,
      wikiData,
    };

    // Try to generate summary - don't cache if it fails
    try {
      const llmResp = await this.llmAdapter.generateSummary(combined);

      // Only cache successful responses with actual content
      if (llmResp.summary && llmResp.summary.trim().length > 0) {
        this.cacheService.set(cacheKey, llmResp.summary);
      }

      return {
        query,
        summary: llmResp.summary,
        fromCache: false,
      };
    } catch (error) {
      // Don't cache errors - let the error propagate
      throw error;
    }
  }

  invalidateCache(query: string): boolean {
    const k = this.generateKey(query);
    return this.cacheService.delete(k);
  }

  cleanupCache(): number {
    return this.cacheService.cleanup();
  }
}
