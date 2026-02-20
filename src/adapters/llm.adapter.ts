import { SummaryResponse, HuggingFaceResponse } from "../types/api";
import { CountryDetails } from "../types/api";
import { config } from "../config";

export class LLMAdapter {
  private readonly apiUrl = "https://router.huggingface.co/v1/chat/completions";

  // Increment this version when prompt changes to invalidate old cache
  private readonly PROMPT_VERSION = "v2";

  getPromptVersion(): string {
    return this.PROMPT_VERSION;
  }

  async generateSummary(data: CountryDetails): Promise<SummaryResponse> {
    const prompt = `Generate a comprehensive, well-structured summary about ${data.name.common}. Organize the information into the following sections:

**Summary:**
- Elevator pitch: What makes the country special? What is it known for?
- Image and identity: Cultural importance (music, sports, innovation, etc.)
- 2-3 fun facts

**Demography & Society:**
- Ethnic composition
- Lifestyle, values, and social norms
- Cultural diversity
- Education system
- Migration patterns
- Age demographics

**Geography and Nature:**
- Major landscapes (mountains, lakes, deserts, forests)
- Climate and weather patterns
- Notable animals and plants
- Top 5 must-see places

**Brief History:**
- Big picture timeline with key turning points
- Most important historical figures
- Colonial history, revolutions, or independence movements
- Historic trauma and its impacts today

**Politics and International Role:**
- Current political climate
- Major political parties
- International relationships and alliances
- Current issues and geopolitical role

Keep the tone engaging and informative. Use clear section headers and bullet points where appropriate.`;

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
          `Hugging Face API error: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      const resp = (await response.json()) as HuggingFaceResponse;

      console.log("Hugging Face Response:", JSON.stringify(resp, null, 2));

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
