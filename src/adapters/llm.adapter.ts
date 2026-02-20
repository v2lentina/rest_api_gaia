import { SummaryResponse, OpenRouterResponse } from "../types/api";
import { CountryDetails } from "../types/api";
import { config } from "../config";

export class LLMAdapter {
  private readonly apiUrl = "https://openrouter.ai/api/v1/chat/completions";

  async generateSummary(data: CountryDetails): Promise<SummaryResponse> {
    const prompt = `Generate a brief, informative summary about ${data.name.common}. Include key facts about its geography, population, culture, and notable characteristics. Keep it concise and engaging.`;

    const headers = {
      Authorization: `Bearer ${config.llm.apiKey}`,
      "Content-Type": "application/json",
    };

    const payload = {
      model: config.llm.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      const resp = (await response.json()) as OpenRouterResponse;

      console.log("OpenRouter Response:", JSON.stringify(resp, null, 2));

      const summary =
        resp?.choices?.[0]?.message?.content || "No summary generated";

      return {
        query: data.name.common.toLowerCase(),
        summary: summary.trim(),
        fromCache: false,
      };
    } catch (error) {
      console.error("LLM API Error:", error);
      throw new Error(
        `Failed to generate summary: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
