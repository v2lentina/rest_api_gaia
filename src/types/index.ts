// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ============================================
// Public API Types (anpassen an deine APIs)
// ============================================

export interface PublicApi1Response {
  // TODO: Struktur von Public API 1
  // Beispiel:
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface PublicApi2Response {
  // TODO: Struktur von Public API 2
  // Beispiel:
  content: string;
  author?: string;
  tags?: string[];
}

// ============================================
// Combined Data Type
// ============================================

export interface CombinedApiData {
  api1Data: PublicApi1Response;
  api2Data: PublicApi2Response;
  combinedAt: string;
}

// ============================================
// LLM Types
// ============================================

export interface LLMRequest {
  prompt: string;
  data: CombinedApiData;
}

export interface LLMResponse {
  summary: string;
  model?: string;
  tokensUsed?: number;
}

// ============================================
// Cache Types
// ============================================

export interface CacheEntry {
  id?: number;
  queryKey: string;
  summary: string;
  createdAt: number;
  expiresAt: number;
}

// ============================================
// Summary Response (Final API Response)
// ============================================

export interface SummaryResponse {
  query: string;
  summary: string;
  fromCache: boolean;
  timestamp: string;
}

// ============================================
// Error Types
// ============================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}
