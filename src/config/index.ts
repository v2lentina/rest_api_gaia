import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 8000,

  llm: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: process.env.LLM_MODEL ?? "openai/gpt-4",
  },

  cache: {
    ttlSeconds: Number(process.env.CACHE_TTL_SECONDS) || 3600,
    dbPath: path.join(__dirname, "../../data/app.db"),
  },
};
